# Codebase Concerns

**Analysis Date:** 2026-02-07

## Tech Debt

**Bare Exception Handling:**
- Issue: Bare `except:` clause that silently swallows all exceptions without logging or distinguishing error types
- Files: `main.py` (line 88), `main.py` (line 493)
- Impact: Failures are masked. In `validateYear()`, any exception returns False without indicating why validation failed. In `compare_salaries()`, database errors for a year are silently skipped, potentially leaving users thinking they have no salary history when the table is missing or corrupted
- Fix approach: Replace bare `except:` with specific exception types (ValueError, TypeError, sqlite3.Error). Log caught exceptions and return meaningful error responses to frontend

**Incomplete Variable Assignment:**
- Issue: Line 59 in `helper_scripts/excel2sqlite.py` uses comparison operator `==` instead of assignment operator `=`
- Files: `helper_scripts/excel2sqlite.py` (line 59)
- Impact: `middle_name` is never actually set to None when cell is empty; comparison result is discarded. This is likely a bug introduced during manual testing
- Fix approach: Change `if a[middleNameCol] == None:` conditional to `if a[middleNameCol] is None:` for proper null checking, or remove if redundant since line 110 already handles None values

**Unused/Dead Code:**
- Issue: `groupIndex` and `departmentIndex` dictionaries initialized globally but never populated or used
- Files: `main.py` (lines 22-23)
- Impact: Lines 114 and 116 reference `departmentIndex[year]` expecting runtime data, but it's never initialized, causing KeyError on first request. Code was likely scaffolding for a feature that was never completed
- Fix approach: Remove unused dictionaries and initialization, or implement proper index population from database on startup

**Debug Print Statements Left in Production:**
- Issue: Three debug print statements left in request handlers
- Files: `main.py` (lines 114, 136, 138)
- Impact: Query details and department indices are logged to stdout in production, cluttering logs and potentially exposing query structure
- Fix approach: Remove or convert to proper logging using Python's logging module with appropriate log levels

**Hard-coded Database Path:**
- Issue: Database connection strings hard-coded throughout application
- Files: `main.py` (lines 148, 180, 209, 251, 293, 340, 364, 431, 465)
- Impact: Cannot easily change database location between environments, makes testing difficult, path is brittle if run from different working directory
- Fix approach: Move to environment variable or configuration file loaded at startup (e.g., `DB_PATH = os.getenv('DATABASE_PATH', 'data/salaries.db')`)

**Hard-coded Year Range:**
- Issue: Valid year range hard-coded as 2011-2020 in `validateYear()`, but application data spans 2011-2024
- Files: `main.py` (line 91)
- Impact: Requests for years 2021-2024 are rejected as invalid even though data exists. The validation range doesn't match actual data availability
- Fix approach: Query database at startup to detect available year tables, or make range configurable via environment variable

## Security Concerns

**SQL Injection via Table Name Injection:**
- Risk: Table names are constructed from user input (year parameter) without proper validation before SQL queries. While year is converted to int, other endpoints use string concatenation for table names
- Files: `main.py` (lines 27, 31, 35, 110, 245-247, 253, 268, 277, 295, 314, 324, 430, 435)
- Current mitigation: Year parameter is converted to int in `validateYear()`, but this is only called in `queryBuilder()`. Other endpoints construct table names without this check (e.g., `picker_data()`, `react_data()`)
- Recommendations:
  1. Create a single function to validate and construct safe table names
  2. Always validate year input is an integer before string interpolation
  3. Use parameterized queries where possible (not for table names, but for column filters)
  4. Consider using an allowlist of valid table names from database metadata

**Bare Exception Swallowing Errors in Loop:**
- Risk: In `compare_salaries()`, exceptions in the table query loop are silently caught, continuing to next year. If all years fail, user sees empty results with no indication of error
- Files: `main.py` (lines 493-494)
- Current mitigation: None; errors are completely hidden
- Recommendations: Log exceptions, return partial results with error indicator, or fail with clear error message to frontend

**No Input Validation on Query Parameters:**
- Risk: `min_comp` and `max_comp` are converted to int/float without validation. Non-numeric input would cause crashes
- Files: `main.py` (lines 101-102)
- Current mitigation: None explicit, relies on implicit exception handling
- Recommendations: Add explicit validation with try-catch and user-friendly error responses. Cap maximum query values to prevent memory exhaustion

**Database File Permissions:**
- Risk: Database file is at `data/salaries.db` with broad read permissions (644). Salary data is sensitive PII
- Files: Database location `data/salaries.db`
- Current mitigation: Filesystem permissions only
- Recommendations:
  1. Restrict file permissions to 600 (owner read/write only)
  2. Run application with least-privileged user
  3. Consider encryption at rest for sensitive employee data
  4. Implement access logging for data exports

**No CORS Configuration:**
- Risk: App has `CORS_HEADERS` config set but doesn't import/enable Flask-CORS. Any frontend can make requests to the API
- Files: `main.py` (line 18)
- Current mitigation: None; configuration has no effect
- Recommendations: Install flask-cors and properly configure allowed origins, or remove if not needed

**Name-based Employee Matching Ambiguity:**
- Risk: Salary comparison feature matches employees by first_name + last_name only. Multiple employees with same name cannot be distinguished
- Files: `frontend/src/SalaryComparison.tsx` (lines 134-136), `main.py` (lines 479-480)
- Current mitigation: Disclaimer added in UI stating "Results may be inaccurate if multiple employees share the same name"
- Recommendations:
  1. Add middle name to matching logic (already has middle_name in data)
  2. Show all matching records and let user select which one
  3. Consider adding hire date or department as tiebreaker

## Known Issues

**Year Validation Doesn't Match Available Data:**
- Symptoms: Requests for years 2021, 2022, 2023, 2024 return HTTP 500 even though salary data exists for these years
- Files: `main.py` (line 91)
- Trigger: Send request like `/data/2024` or filter by year 2024 in UI
- Workaround: Frontend uses hardcoded year range in `constants.ts` (CURRENT_YEAR: 2024), so UI dropdown doesn't expose invalid years, but direct API calls fail
- Root cause: Hard-coded range 2011-2020 is out of sync with actual data availability

**Department Index Never Populated:**
- Symptoms: Any `/data/query` request causes KeyError and crashes
- Files: `main.py` (line 114)
- Trigger: Access any query endpoint with filters
- Workaround: Department filtering doesn't work, so queries without filters succeed
- Root cause: `departmentIndex` and `groupIndex` are declared but never initialized with year data

**Print Statements in Request Handlers:**
- Symptoms: Query parameters and conditionals logged to stdout for every request
- Files: `main.py` (lines 114, 136, 138)
- Impact: Produces verbose logs, makes application harder to debug due to noise, queries are readable in logs
- Workaround: Redirect stdout, use log level filters
- Fix: Remove or convert to proper logging

## Performance Bottlenecks

**Full Table Scans with `select *`:**
- Problem: Multiple endpoints fetch entire tables with `select *` then filter in application code
- Files: `main.py` (lines 27, 31, 35, 110, 211, 253, 268, 277, 295)
- Cause: No WHERE clauses in queries; all rows loaded into memory before filtering
- Impact: For `react_data()` and `treemap()`, all employee records for a year are fetched then processed in Python. With 34MB database file, this is slow and memory-intensive. Becomes critical bottleneck as data grows
- Improvement path:
  1. Move filtering to SQL with WHERE clauses
  2. Add database indexes on frequently filtered columns (department, empGroup, compensation)
  3. Implement pagination/limiting at query level
  4. Consider caching frequently requested years in memory

**No Database Indexes:**
- Problem: Database has no indexes on frequently queried columns
- Impact: Queries like `compare_salaries()` that search by firstName + lastName across multiple year tables do full table scans
- Improvement path: Add indexes on `firstName`, `lastName`, `compensation`, `department`, `empGroup` in each Year table

**Redundant Queries in Comparison Feature:**
- Problem: `compare_salaries()` makes a separate query to each Year* table in a loop, re-executing the years table query
- Files: `main.py` (lines 469-494)
- Impact: For 13 years of data, this means 14 database roundtrips to get comparison for one employee. Could be optimized with UNION query
- Improvement path: Replace loop with single UNION query that joins all Year tables

**PDF Export Calculations in Memory:**
- Problem: `SalaryComparison.tsx` calculates all year-over-year changes, percentages, and formatting in JavaScript on every export
- Impact: For many employees or many years, this happens client-side causing UI freeze
- Improvement path: Move calculation to backend endpoint that returns pre-formatted data

## Fragile Areas

**Dynamic Table Name Construction:**
- Files: `main.py` (all year-based endpoints)
- Why fragile: Every endpoint that needs year-specific data constructs table name as string. If table naming convention changes, all 15+ locations must be updated. Adding new years requires manual database operations
- Safe modification: Create database migration system or table registration at startup
- Test coverage: Minimal; no tests for invalid year handling

**Data Import Script Assumptions:**
- Files: `helper_scripts/excel2sqlite.py`, `helper_scripts/auto_import.py`
- Why fragile: Both scripts assume specific column header patterns and exact format "Campus - Department". If Excel file headers change even slightly, import fails
- Safe modification: Add validation that headers match expected patterns and display clear errors. Implement data preview step before import
- Test coverage: None; scripts are untested and manual-only

**Excel Import Hardcoded Column Patterns:**
- Files: `helper_scripts/auto_import.py` (lines 13-21)
- Why fragile: Column header patterns are case-sensitive and exact. If header is "Last Name" instead of "last name", column detection fails silently
- Safe modification: Make pattern matching case-insensitive (already done), expand patterns to include common variations, add logging of detected columns
- Test coverage: Logic exists but no test cases

**Schema Mismatch Between Year Tables:**
- Files: Database schema created in helper scripts
- Why fragile: Each Year* table is created independently by import scripts. If schema changes, old tables have different structure than new ones. Queries that work on 2024 data fail on 2011
- Safe modification: Document schema, implement schema versioning, run migrations on import
- Test coverage: None

**React Router Hard Routes:**
- Files: `frontend/src/App.tsx` (lines 228-298)
- Why fragile: Routes assume specific page structure. Adding new major views requires changing Router structure
- Safe modification: Use configuration-driven routing or lazy-load route definitions
- Test coverage: No route tests

## Scaling Limits

**Single SQLite Database:**
- Current capacity: 34MB, supports 13 years of salary data (~65K-70K records per year)
- Limit: SQLite has practical limits around 1TB per file and concurrent write contention. Once you reach millions of employee records or need multi-process writes, SQLite bottlenecks
- Scaling path: Migrate to PostgreSQL or similar for production at scale. Would require changing only database connection layer

**Memory Usage for Large Exports:**
- Current capacity: Full dataset fits in memory (~100MB with overhead)
- Limit: Exporting all data for all years would require loading everything into frontend memory. PDF generation in browser becomes slow above ~500 employees
- Scaling path: Implement server-side PDF generation, add pagination to exports, use streaming responses

**Frontend File Size:**
- Current capacity: React build is reasonable size
- Limit: Adding more visualization types without code-splitting will increase bundle size
- Scaling path: Implement dynamic imports for heavy components (charts, tables), code split by route

**Connection Pool:**
- Current capacity: Flask dev server with no connection pooling
- Limit: Each request opens new database connection. Under high concurrency, this could exhaust SQLite locks or file handles
- Scaling path: Implement connection pooling (even SQLite with WAL mode helps), use production WSGI server with proper pooling configuration (gunicorn is already in use)

## Test Coverage Gaps

**No Unit Tests:**
- What's not tested: All Python backend logic (query building, data parsing, validation)
- Files: `main.py` (entire file), `helper_scripts/*.py`
- Risk: Bugs in query builders, validation, and error handling are not caught before deployment
- Priority: High - query building and validation are critical paths

**No Integration Tests:**
- What's not tested: End-to-end flows like "import Excel → query data → export PDF"
- Files: Full application pipeline
- Risk: Schema changes or broken database operations silently fail in production
- Priority: High

**No Frontend Component Tests:**
- What's not tested: React components, table filtering, search, comparison logic
- Files: `frontend/src/App.tsx`, `frontend/src/SalaryComparison.tsx`
- Risk: UI bugs like broken filters or incorrect calculations affect all users
- Priority: Medium

**No Data Validation Tests:**
- What's not tested: Excel import data validation, malformed input handling
- Files: `helper_scripts/auto_import.py`, `helper_scripts/excel2sqlite.py`
- Risk: Garbage data imported silently, validation rules not enforced
- Priority: Medium

**No Error Scenario Tests:**
- What's not tested: Missing database files, corrupted tables, network errors, concurrent access
- Risk: Application crashes or returns confusing errors in edge cases
- Priority: Medium

**No Database Tests:**
- What's not tested: Query correctness, schema integrity, data consistency
- Files: Database operations throughout codebase
- Risk: Silent data corruption or incorrect results go undetected
- Priority: High

**No API Contract Tests:**
- What's not tested: Response format compliance, status codes, error messages match frontend expectations
- Risk: Frontend breaks when API response structure changes slightly
- Priority: Medium

---

*Concerns audit: 2026-02-07*
