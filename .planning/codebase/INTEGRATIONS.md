# External Integrations

**Analysis Date:** 2026-02-07

## APIs & External Services

**Analytics:**
- Umami Analytics - Website analytics tracking
  - Script: Loaded in `frontend/rsbuild.config.ts`
  - URL: `https://umami.torrtle.co/umami.js`
  - Website ID: `1d97a601-d42e-4262-b48e-a8f00ed4fb7b`

## Data Storage

**Databases:**
- SQLite3 (local, embedded)
  - Location: `data/salaries.db`
  - Connection: Native Python sqlite3 module in `main.py`
  - Usage: Stores salary data with tables for each year (Year2011-Year2024)
  - Tables: Year[year], Department[year], Group[year], years
  - Backup: `data/salaries.db.bak` for historical reference

**File Storage:**
- Local filesystem only
  - Excel files: `excel/` directory (source data for imports)
  - Frontend build: `frontend/dist/` (static site serving)
  - Static assets: `frontend/dist/static/` and `static/` directories

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- Not implemented
- No authentication/authorization system in place
- Application is fully public with no user accounts or restricted access

## Monitoring & Observability

**Error Tracking:**
- Console logging only
  - Frontend: `console.error()` in `frontend/src/services/api.ts`
  - Backend: Print statements in `main.py` and helper scripts

**Logs:**
- Standard output/stderr from Flask application
- CLI output from Python helper scripts (auto_import.py, excel2sqlite.py)
- No structured logging or centralized log aggregation

## CI/CD & Deployment

**Hosting:**
- Google Cloud (implied by `.gcloudignore` file)
- Docker containerized deployment

**CI Pipeline:**
- GitHub Actions workflow: `.github/workflows/update-database.yml`
- Trigger: Push to master branch with changes to `excel/*.xlsx`
- Steps:
  1. Set up Python 3.11
  2. Install openpyxl dependency
  3. Run `helper_scripts/auto_import.py`
  4. Auto-commit updated `data/salaries.db` to repository
  5. Push changes back to master

## Environment Configuration

**Required env vars:**
- `PORT` (for Docker deployment via Gunicorn binding)
- No other environment variables currently used

**Secrets location:**
- No secrets management detected
- No `.env` files
- Database is committed to repository

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Data Flow

**Excel Import Pipeline:**
- Source: Excel files in `excel/` directory (named by year, e.g., `2024.xlsx`)
- Parser: `helper_scripts/auto_import.py` with openpyxl
- Process:
  - Auto-detects column headers using pattern matching (last_name, first_name, department, etc.)
  - Parses department strings as "Campus - Department" format
  - Validates required fields and skips malformed rows
  - Inserts into SQLite `Year[year]` table
  - Creates auxiliary Department[year] and Group[year] lookup tables
  - Updates years table with all available years
- Destination: `data/salaries.db`
- Triggered: GitHub Actions on Excel file changes to master

**API Response Flow:**
- Frontend (React): Makes requests via `axios` to Flask `/data/*` endpoints
- Backend (Flask): Queries SQLite with parameterized queries
- Response: JSON with salary data, statistics, and metadata

---

*Integration audit: 2026-02-07*
