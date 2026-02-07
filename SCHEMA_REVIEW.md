# Database Schema Review

## Current Architecture

The application uses SQLite with a year-partitioned table design. For each year (2011-2024), there are four tables:

- `Year{YEAR}` - Main employee salary records (8 columns, all untyped/unconstrained)
- `Department{YEAR}` - Distinct department values
- `Group{YEAR}` - Distinct employee group values
- `Campu{YEAR}` - Distinct campus values

**Total: ~56 tables** with no primary keys, no foreign keys, no indexes, and no constraints.

---

## Critical Issues

### 1. SQL Injection Vulnerability

Several routes in `main.py` construct SQL queries via string concatenation with user-supplied `year` from the URL path, without consistent validation:

- `main.py:248` - `picker_data`: `"select * from " + tableName`
- `main.py:290` - `react_data`: `"select * from " + tableName`
- `main.py:338` - `dataPie`: f-string with user-supplied `year`
- `main.py:362-393` - `dataRanges`: f-strings with user-supplied `year`

The `validateYear()` function exists but is only called inside `queryBuilder()`, not in all routes. An attacker could supply a crafted `year` value to these unprotected endpoints.

**Recommendation:** Apply `validateYear()` to every route that accepts a year parameter, or better yet, use a whitelist lookup against an explicit set of valid year values before constructing any query.

### 2. No Primary Keys

No table has a primary key. This means:
- Duplicate rows can be silently inserted
- There is no efficient way to identify, update, or delete a specific record
- ORM integration would be difficult if the project ever migrates

**Recommendation:** Add a synthetic `id INTEGER PRIMARY KEY AUTOINCREMENT` to each main data table, or define a composite unique key on `(lastName, firstName, middleName, department, year)`.

### 3. No Indexes

Every query hits a full table scan. Given the database is ~32 MB with 14 years of data, performance will degrade as data grows.

**Recommendation:** Add indexes on the most-queried columns:
```sql
CREATE INDEX idx_year{YEAR}_department ON Year{YEAR}(department);
CREATE INDEX idx_year{YEAR}_empGroup ON Year{YEAR}(empGroup);
CREATE INDEX idx_year{YEAR}_campus ON Year{YEAR}(campus);
CREATE INDEX idx_year{YEAR}_compensation ON Year{YEAR}(compensation);
CREATE INDEX idx_year{YEAR}_name ON Year{YEAR}(lastName, firstName, middleName);
```

### 4. No Employee Identifier

Employees are matched across years by `(firstName, lastName, middleName)` as seen in `2020.sql`. This is fragile:
- Name collisions between different people will produce wrong results
- Name changes (e.g., marriage) break tracking
- Misspellings across years create phantom hires/departures

**Recommendation:** Introduce a stable `employee_id` (ideally from the source data, such as a university ID) that persists across years. If unavailable from source data, generate a deterministic hash-based ID.

---

## Design Issues

### 5. Year-Partitioned Tables Instead of Normalized Design

Having separate `Year{YEAR}` tables for each year creates significant problems:
- Cross-year analytics require explicit joins by name (fragile, slow)
- Adding a new year requires code changes in `aggregator.py` and awareness across the codebase
- The hardcoded `years = range(2011, 2023)` in `main.py:20` is already out of sync with the data (goes up to 2024)

**Recommendation:** Consolidate into a single table with a `year` column:
```sql
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year INTEGER NOT NULL,
    lastName TEXT NOT NULL,
    firstName TEXT NOT NULL,
    middleName TEXT,
    department TEXT NOT NULL,
    empGroup TEXT NOT NULL,
    compensation REAL NOT NULL CHECK(compensation >= 0),
    campus TEXT NOT NULL
);
CREATE INDEX idx_employees_year ON employees(year);
CREATE INDEX idx_employees_dept ON employees(department);
CREATE INDEX idx_employees_name ON employees(lastName, firstName);
```

This makes cross-year queries trivial:
```sql
-- Salary movement between years
SELECT e1.firstName, e1.lastName, e1.compensation - e0.compensation AS movement
FROM employees e1
JOIN employees e0 ON e1.lastName = e0.lastName
    AND e1.firstName = e0.firstName
    AND e1.middleName IS e0.middleName
WHERE e1.year = 2020 AND e0.year = 2019
ORDER BY movement DESC LIMIT 10;
```

### 6. Redundant Lookup Tables

`Department{YEAR}`, `Group{YEAR}`, and `Campu{YEAR}` only store `SELECT DISTINCT` results from the main table. They add no information and inflate the table count.

**Recommendation:** Replace with views or simply use `SELECT DISTINCT` in queries (which is already done in some routes like `react_data` at `main.py:319`). If performance matters, create a materialized view or a single reference table:
```sql
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
CREATE TABLE campuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
```

### 7. Typo in Table Name

The campus lookup tables are named `Campu{YEAR}` instead of `Campus{YEAR}` (`aggregator.py:14`). This is a latent source of bugs.

**Recommendation:** Rename to `Campus{YEAR}` (or eliminate per recommendation #6).

### 8. Redundant `long_text` Column

The `long_text` column stores a pre-formatted string like `"John Doe in Engineering in group Faculty made $95000"`. This is a pure derivation of other columns and:
- Wastes storage (~20-30% of row size)
- Can become inconsistent if other columns are ever updated
- Is only used in the picker UI

**Recommendation:** Remove the column and compute the display string in the application layer (it's already just a formatted string built in `excel2sqlite.py:14`).

---

## Data Quality Issues

### 9. No NOT NULL Constraints

All columns accept NULL, even `lastName`, `firstName`, and `compensation` where NULLs are nonsensical. The import script has manual NULL checks (`excel2sqlite.py:54-58`) but the database itself allows anything.

**Recommendation:** Add `NOT NULL` constraints to all columns except `middleName`.

### 10. No CHECK Constraints

`compensation` is typed as `double` but has no bounds. Negative or zero compensation values can be inserted.

**Recommendation:** Add `CHECK(compensation >= 0)`.

### 11. Bug in Import Script

In `excel2sqlite.py:59`:
```python
a[middleNameCol] == None  # comparison, not assignment!
```
This should be `a[middleNameCol] = None` (or better, `a[middleNameCol] = ""`). The current code is a no-op due to `==` vs `=`.

### 12. `validateYear` is Outdated

`main.py:86` hardcodes `range(2011, 2021)` but data exists through 2024. Any query for 2021-2024 will return a 500 error from `queryBuilder`.

**Recommendation:** Derive valid years dynamically from the database (e.g., query the `years` table that already exists, or introspect table names).

---

## Operational Issues

### 13. Inconsistent Connection Handling

Some routes use the `with closing()` context manager pattern (`main.py:143-145`), while others use manual `conn.close()` (`main.py:209`, `main.py:281`). If an exception occurs in the manual pattern, the connection leaks.

**Recommendation:** Use `with closing()` everywhere, or better yet, use Flask's `g` object for per-request database connections with `teardown_appcontext`.

### 14. Multiple Database File Copies

The database exists in at least 4 locations:
- `data/salaries.db` (primary)
- `data/salaries.db.bak` (backup)
- `salaries.db` (root copy)
- `static/salaries.db` (static copy)
- `helper_scripts/salaries-test.db` (test)

**Recommendation:** Consolidate to a single authoritative location. Add other paths to `.gitignore`. Use environment variables or config for the DB path.

---

## Summary of Recommended Changes (Priority Order)

| Priority | Issue | Effort |
|----------|-------|--------|
| P0 | Fix SQL injection in unvalidated routes | Low |
| P0 | Fix `==` vs `=` bug in import script | Trivial |
| P1 | Add indexes on frequently queried columns | Low |
| P1 | Add NOT NULL and CHECK constraints | Low |
| P1 | Fix `validateYear` hardcoded range | Low |
| P1 | Standardize connection handling | Low |
| P2 | Consolidate to single normalized table with `year` column | Medium |
| P2 | Add primary keys / employee identifiers | Medium |
| P2 | Remove redundant lookup tables | Low |
| P2 | Remove `long_text` column | Low |
| P3 | Fix `Campu` typo | Trivial |
| P3 | Consolidate database file copies | Low |
