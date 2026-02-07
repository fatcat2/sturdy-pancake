# Architecture

**Analysis Date:** 2026-02-07

## Pattern Overview

**Overall:** Monolithic web application with client-server separation and data pipeline

**Key Characteristics:**
- Full-stack single codebase with separate frontend (React/TypeScript) and backend (Python Flask)
- Stateless HTTP API backend serving pre-built frontend static assets
- ETL pipeline for importing Excel salary data into SQLite database
- Server-side rendered routing through Flask (catches all routes and returns React app)
- Data-driven UI with client-side filtering and state management

## Layers

**Presentation Layer:**
- Purpose: React single-page application with responsive UI for browsing and comparing salary data
- Location: `frontend/src/`
- Contains: React components (App.tsx, SalaryComparison.tsx, About.tsx), type definitions, constants, API service layer
- Depends on: HTTP API endpoints from backend
- Used by: Web browser clients

**API Layer:**
- Purpose: REST endpoints for querying salary data and serving UI metadata (departments, groups, years)
- Location: Routes defined in `main.py` (lines 70-510)
- Contains: Flask route handlers, SQL query construction, response serialization
- Depends on: SQLite database connection, query builders
- Used by: Frontend React components via axios HTTP calls

**Data Access Layer:**
- Purpose: Direct SQLite database queries, connection management
- Location: Inline in `main.py` (uses `sqlite3.connect` and cursor execution)
- Contains: Raw SQL queries, connection pooling via `closing()`, transaction handling
- Depends on: SQLite database file
- Used by: API layer route handlers

**ETL / Data Processing Layer:**
- Purpose: Import Excel files containing salary data into SQLite with validation and transformation
- Location: `helper_scripts/` - `auto_import.py` (primary, automated), `excel2sqlite.py` (manual)
- Contains: Excel parsing via openpyxl, column detection, data validation, database schema creation
- Depends on: Excel files in `excel/` directory, SQLite database
- Used by: Manual import scripts or CI/CD pipelines

**Frontend Build Layer:**
- Purpose: Compile React TypeScript to production-optimized static assets
- Location: `frontend/` with rsbuild configuration
- Contains: Rsbuild bundler config, package.json, tsconfig.json
- Depends on: Node.js/npm ecosystem, React plugin
- Used by: Flask static serving and Docker build process

## Data Flow

**User Data Query Flow:**

1. User navigates to app or changes year/filters in React UI (`App.tsx` lines 60-93)
2. Frontend calls `GET /data/{year}` with optional query parameters (department, group, year, min_comp, max_comp)
3. Flask `/data/query` endpoint (line 144) constructs parameterized SQL via `queryBuilder()` function
4. Query executes against SQLite `Year{year}` table with WHERE clauses for filters
5. Results transformed via `Salary` class (lines 38-67) into JSON array of objects
6. Statistics calculated (min/max/mean/median) over compensation values
7. Response returns metadata, stats, and data array to frontend
8. React renders table with sorting/filtering via Ant Design Table component

**Salary Comparison Flow:**

1. User searches employee names via `SalaryComparison.tsx` search input (line 68-84)
2. Frontend calls `GET /data/compare/search?query={query}&year={year}` with minimum 2 characters
3. Flask `/data/compare/search` endpoint (line 421) searches all `Year{year}` tables for matching names
4. Returns up to 20 distinct results with department and campus info
5. User selects employees to compare (line 86-100)
6. Frontend calls `GET /data/compare?first_name={}&last_name={}` for each selected employee
7. Flask `/data/compare` endpoint (line 456) queries all available Year* tables for salary history
8. Returns complete salary history across all years and calculates year-over-year changes
9. React builds dynamic comparison table with one column per available year
10. Results can be exported to PDF via jsPDF

**Data Import Flow (auto_import.py):**

1. Script finds all `.xlsx` files in `excel/` directory
2. For each Excel file, auto-detects column headers using pattern matching (lines 34-40)
3. Validates required columns exist (last_name, first_name, department, compensation)
4. Drops existing `Year{year}` table and creates fresh schema with 8 fields
5. Iterates through data rows, skipping students and invalid records
6. Parses department field to extract campus (first part before " - ") and department name
7. Inserts cleaned records into database with calculated long_text field
8. Creates auxiliary `Department{year}` and `Group{year}` tables for filter dropdowns
9. Updates global `years` lookup table with all available years
10. Commits transaction and closes connection

**State Management:**

- Frontend: React hooks (useState, useCallback) within component scope - no global state manager
- Employee data, filters, and UI state (year, expanded rows, search results) held in component state
- API responses cached in local React state; refetching required for fresh data
- No persistence layer between sessions

## Key Abstractions

**Salary Class:**
- Purpose: Represent a single employee salary record with transformation methods
- Examples: `main.py` lines 38-67
- Pattern: Simple class with constructor, single transformation method (get_map) returning dict for JSON serialization
- Used by: API handlers to serialize database rows into API response objects

**Query Builder Functions:**
- Purpose: Dynamically construct SQL WHERE clauses from request parameters
- Examples: `queryBuilder()` (lines 97-140), `yearQueryBuilder()` (lines 26-27), `parse_department()` (lines 43-55 in auto_import.py)
- Pattern: Accept request args, validate inputs, construct tuple of (SQL string, parameter list) for safe parameterized queries
- Prevents SQL injection through use of ? placeholders and separate parameter list

**Column Detection System:**
- Purpose: Auto-map Excel file columns to expected fields without manual configuration
- Examples: `auto_import.py` lines 13-40
- Pattern: HEADER_PATTERNS dict with field -> list of acceptable column names, find_column_index searches for matches, detect_columns returns mapping
- Handles variation in Excel file formatting across years

**Department Parsing:**
- Purpose: Extract campus and department from combined field like "FW - Engineering"
- Examples: `auto_import.py` lines 43-55
- Pattern: Split on " - " delimiter, return tuple of (campus, department) with fallback handling

**Comparison Row Assembly:**
- Purpose: Transform multiple salary records across years into single comparison row
- Examples: `SalaryComparison.tsx` lines 107-174
- Pattern: Build dynamic object with name, dept, group, then add year-specific columns dynamically, calculate change metrics
- Handles missing years for employees with incomplete history

## Entry Points

**Web UI Entry Point:**
- Location: `frontend/src/index.tsx`
- Triggers: Browser loads app URL, webpack/rsbuild resolves entry
- Responsibilities: Mounts React app to DOM root element

**Frontend App Root:**
- Location: `frontend/src/App.tsx`
- Triggers: React rendering pipeline
- Responsibilities: Set up BrowserRouter, define main routes (home, /about, /compare), fetch initial data, manage year selection and search state

**Backend Server:**
- Location: `main.py` lines 512-513
- Triggers: Docker container startup or local `python main.py` execution
- Responsibilities: Initialize Flask app, register all routes, bind to port 5100 in development (Gunicorn in production)

**Data Import Entry Point:**
- Location: `helper_scripts/auto_import.py` lines 238-239
- Triggers: Manual execution via `python auto_import.py [years]` or CI/CD pipeline
- Responsibilities: Find Excel files, detect columns, validate, import to SQLite, create indexes

**Flask Route Handlers:**
- `GET /` (line 500): Renders index.html, serves React app
- `GET /<page>` (line 506): Catch-all route for React router paths, returns same index.html
- `GET /favicon.ico` (line 70): Serves favicon from static directory
- `GET /data/<year>` (line 290): Returns all employee data for year with departments/groups
- `GET /data/query` (line 143): Filters data by department, group, compensation range
- `GET /data/treemap` (line 175): Returns department totals for visualization
- `GET /data/years` (line 207): Returns list of available years
- `GET /data/picker/<year>` (line 243): Returns employee list, departments, groups for picker UI
- `GET /data/<year>/departments` (line 337): Returns department-level compensation totals
- `GET /data/ranges/<year>` (line 357): Returns min/avg/max by department and group
- `GET /data/compare/search` (line 421): Searches employees by name across current year
- `GET /data/compare` (line 456): Returns salary history across all years for named employee

## Error Handling

**Strategy:** Limited error handling with fail-open patterns where possible

**Patterns:**
- Try/except in query execution catches database errors but doesn't log details (line 493 in main.py)
- API endpoints abort(500) on validation failures (queryBuilder line 105)
- Missing database rows return empty arrays silently (fetchall returns [] on no matches)
- Frontend catches axios errors and logs to console only (App.tsx line 68, SalaryComparison.tsx line 79)
- Excel import skips bad rows (compensation conversion fails gracefully, students filtered)
- No user-facing error messages or status codes returned from most endpoints

## Cross-Cutting Concerns

**Logging:**
- Backend: Print statements to stdout (lines 114, 136, 138 in main.py, auto_import.py) - suitable for containerized environment
- Frontend: Browser console.error() for network failures only
- No structured logging, request IDs, or tracing

**Validation:**
- Backend: Type coercion (int(), float()) with broad except clauses
- Database-level validation: SQL column constraints only
- Frontend: Minimum length checks (search query >= 2 characters), Ant Design form components handle UI validation
- No schema validation library (no Pydantic, Zod, etc)

**Authentication:**
- None. Data is public information (Purdue salary records)
- CORS headers configured (line 18) but application is same-origin only

**Compensation Filtering:**
- Range queries implemented with > and < operators
- Frontend enforces min_comp >= 0, maxComp comparison logic in queryBuilder
- Edge case: maxComp of -1 disables max filter (line 124 check)

**Year Validation:**
- Years 2011-2020 enforced by queryBuilder (line 91)
- Mismatch: CURRENT_YEAR in frontend is 2024, but backend only validates up to 2020
- Auto_import creates tables for any detected year without restriction
