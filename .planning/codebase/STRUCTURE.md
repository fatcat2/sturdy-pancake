# Codebase Structure

**Analysis Date:** 2026-02-07

## Directory Layout

```
sturdy-pancake/
├── frontend/                    # React TypeScript web application
│   ├── src/
│   │   ├── index.tsx           # React DOM mount point
│   │   ├── App.tsx             # Main app router and home view
│   │   ├── SalaryComparison.tsx # Comparison tool page
│   │   ├── About.tsx           # About page component
│   │   ├── types.ts            # TypeScript interfaces
│   │   ├── constants.ts        # Year ranges and dropdown options
│   │   ├── components/         # Reusable UI components
│   │   └── services/
│   │       └── api.ts          # Axios HTTP client wrapper
│   ├── dist/                   # Compiled production build (generated)
│   ├── static/                 # Static assets directory
│   ├── package.json            # Node dependencies
│   ├── rsbuild.config.ts       # Build tool configuration
│   └── tsconfig.json           # TypeScript compiler options
│
├── helper_scripts/              # Python ETL and utility scripts
│   ├── auto_import.py          # Automated Excel → SQLite importer
│   ├── excel2sqlite.py         # Legacy interactive Excel importer
│   ├── aggregator.py           # (Utility - purpose unclear)
│   └── long_text.py            # (Utility - purpose unclear)
│
├── excel/                       # Excel source files for data import
│   ├── 2011.xlsx
│   ├── 2012.xlsx
│   └── ... (one per year through 2024)
│
├── data/                        # Runtime data directory
│   ├── salaries.db             # SQLite database (main)
│   └── salaries.db.bak         # Database backup
│
├── static/                      # (Legacy/unused - see frontend/static/)
│
├── main.py                      # Flask application server
├── requirements.txt             # Python dependencies
├── Dockerfile                   # Container build configuration
├── .github/                     # GitHub Actions workflows
│   └── workflows/
│       └── update-database.yml  # CI/CD for data import
│
└── .planning/                   # GSD planning documents
    └── codebase/               # This directory
```

## Directory Purposes

**frontend/src/:**
- Purpose: TypeScript/React source code for single-page application
- Contains: Components (`.tsx`), type definitions (`.ts`), API service layer, UI routing
- Key files: `App.tsx` (main router), `SalaryComparison.tsx` (comparison feature), `types.ts` (shared interfaces), `constants.ts` (year ranges)

**frontend/dist/:**
- Purpose: Production-ready compiled assets (output of rsbuild)
- Contains: `index.html`, minified JavaScript bundles in `static/js/`, CSS in `static/css/`, images, fonts
- Generated: Yes (build artifact)
- Committed: No (gitignored, built at runtime in Docker)

**helper_scripts/:**
- Purpose: Utility scripts for database operations and data import automation
- Contains: Excel importers, aggregators, text processors
- Key files: `auto_import.py` (primary import tool), `excel2sqlite.py` (legacy interactive importer)

**excel/:**
- Purpose: Source Excel files containing raw salary data by year
- Contains: Year-named .xlsx files (2011.xlsx, 2012.xlsx, ..., 2024.xlsx)
- Generated: No (user/admin provided)
- Committed: Yes (data source)

**data/:**
- Purpose: Runtime SQLite database and backups
- Contains: `salaries.db` (main database), `salaries.db.bak` (backup)
- Generated: Yes (created by import scripts)
- Committed: Yes (`salaries.db` is committed; consider gitignoring for production)

**frontend/static/:**
- Purpose: Static assets for frontend build process (referenced in rsbuild)
- Contains: Images, fonts, CSS files used during React development
- Generated: No (source)
- Committed: Yes

## Key File Locations

**Entry Points:**
- `main.py`: Python Flask backend application entry point
- `frontend/src/index.tsx`: React DOM rendering entry point
- `frontend/src/App.tsx`: React routing and main component tree
- `Dockerfile`: Container image definition (builds frontend, runs backend)
- `helper_scripts/auto_import.py`: Data import entry point for ETL pipeline

**Configuration:**
- `requirements.txt`: Python package dependencies (Flask, openpyxl, etc)
- `frontend/package.json`: Node dependencies (React, Ant Design, axios)
- `frontend/rsbuild.config.ts`: Build tool settings (React plugin, Umami analytics script)
- `frontend/tsconfig.json`: TypeScript compiler settings (target ES2020, strict mode)
- `Dockerfile`: Container runtime configuration (Python 3.9, Node.js 20, Gunicorn)

**Core Logic:**
- `main.py`: All backend API endpoints and database queries (470 lines)
- `frontend/src/App.tsx`: Main data table view, year/search filtering, routing (330 lines)
- `frontend/src/SalaryComparison.tsx`: Employee search and comparison feature, PDF export (433 lines)
- `helper_scripts/auto_import.py`: Excel parsing, column detection, database schema creation (240 lines)

**Type Definitions:**
- `frontend/src/types.ts`: `EmployeeData`, `FilterOption`, `ApiResponse` interfaces
- `frontend/src/SalaryComparison.tsx`: Component-local interfaces (`SearchResult`, `SalaryRecord`, `ComparisonRow`)

**Data/Constants:**
- `frontend/src/constants.ts`: `CURRENT_YEAR` (2024), `START_YEAR` (2011), `YEAR_OPTIONS` array

**Services:**
- `frontend/src/services/api.ts`: `fetchSalaryData()` wrapper around axios for `/data/{year}` calls
- API calls scattered throughout components (App.tsx, SalaryComparison.tsx use axios directly)

**Testing:**
- Not detected - no test files found

## Naming Conventions

**Files:**
- Frontend React components: PascalCase `.tsx` (e.g., `App.tsx`, `SalaryComparison.tsx`)
- Frontend utilities/services: camelCase `.ts` (e.g., `api.ts`, `types.ts`, `constants.ts`)
- Python scripts: snake_case `.py` (e.g., `auto_import.py`, `excel2sqlite.py`)
- Configuration: camelCase or lowercase `.json`, `.ts` (e.g., `tsconfig.json`, `rsbuild.config.ts`)

**Directories:**
- Frontend source: `src/` convention
- Components subdirectory: lowercase `components/`
- Services subdirectory: lowercase `services/`
- Build output: `dist/` (standard convention)
- Utilities: `helper_scripts/` (descriptive)

**Variables/Functions:**
- Frontend: camelCase for functions and variables (e.g., `handleYearChange`, `fetchData`, `departmentFilters`)
- Python: snake_case for functions and variables (e.g., `parse_department`, `detect_columns`, `process_excel_file`)
- React components: PascalCase (e.g., `SalaryComparison`, `App`)
- TypeScript interfaces: PascalCase (e.g., `EmployeeData`, `FilterOption`, `ApiResponse`)

**Database Tables:**
- Year tables: `Year{yyyy}` format (e.g., `Year2024`, `Year2011`) - PascalCase with year number
- Lookup tables: `Department{yyyy}`, `Group{yyyy}`, `years` (lowercase for years table)
- Column names: snake_case or camelCase inconsistently (e.g., `lastName`, `firstName`, `empGroup`, `long_text`)

**API Routes:**
- Pattern: Kebab-case segments `/data/query`, `/data/treemap`, `/data/compare/search`
- Path parameters: `/<param>` for dynamic values (e.g., `/data/<year>`)
- Query params: snake_case (e.g., `?min_comp=`, `?max_comp=`, `?department=`)

## Where to Add New Code

**New Feature:**
- Primary code: Add route handler in `main.py` for backend logic or component in `frontend/src/` for UI
- Tests: Not applicable (no test infrastructure present)

**New Component/Module:**
- Frontend components: Place in `frontend/src/components/` as `ComponentName.tsx`
- Shared utilities: Add to `frontend/src/services/` for API-related, or create new `.ts` file in `frontend/src/`
- Backend routes: Add to `main.py` as `@app.route('/path')` decorator with handler function
- Python utilities: Add to `helper_scripts/` directory

**Utilities:**
- Shared frontend helpers: `frontend/src/services/` (API calls) or new file in `frontend/src/`
- Backend helpers: Define as functions in `main.py` or extract to separate Python file if large
- Shared constants: Add to `frontend/src/constants.ts` (frontend) or define in `main.py` (backend)

**Database Migrations:**
- Schema changes: Modify `process_excel_file()` in `helper_scripts/auto_import.py` (lines 82-95)
- Table creation: Edit SQL CREATE TABLE statement within import script
- No migration tool used; changes require re-importing data

**Styling:**
- Ant Design theme: Configured at build time (no custom theme visible)
- Component styles: Inline styles via `style={{}}` props (no CSS modules or separate files)
- Global styles: Unknown if present (check `frontend/src/App.css` mentioned but not provided)

## Special Directories

**frontend/dist/:**
- Purpose: Compiled production assets from rsbuild
- Generated: Yes (created by `npm run build`)
- Committed: No (build artifact)
- How used: Flask serves `dist/` as static folder for SPA

**excel/:**
- Purpose: Source data for import pipeline
- Generated: No (user/admin uploads)
- Committed: Yes (data source tracked)
- Caution: Contains sensitive salary information - access control needed

**data/:**
- Purpose: SQLite database runtime location
- Generated: Yes (created by auto_import.py)
- Committed: Yes (currently in git, should consider .gitignore for production)
- Size: ~34 MB (salaries.db), ~29 MB (salaries.db.bak)

**.planning/codebase/:**
- Purpose: GSD mapping documents for architecture/structure/conventions analysis
- Generated: Yes (by `/gsd:map-codebase` command)
- Committed: Yes (documenting codebase patterns)

**.github/workflows/:**
- Purpose: GitHub Actions CI/CD configuration
- Generated: No (user written)
- Committed: Yes
- Usage: Automated database updates (see `update-database.yml`)

## Dependency Tree Overview

**Frontend:**
- `React 18` + `react-dom` - UI framework
- `react-router-dom ^7.5.2` - Client-side routing
- `axios ^1.9.0` - HTTP client for API calls
- `antd ^5.24.8` - UI component library (Table, Form, Card, etc)
- `react-currency-format ^1.1.0` - Currency display formatting
- `jspdf ^4.1.0` + `jspdf-autotable ^5.0.7` - PDF export functionality
- `semantic-ui-react ^2.1.5` - Additional UI components (Dropdown)
- `react-device-detect ^2.2.3` - Responsive design helpers

**Backend:**
- `Flask` - Web framework
- `Gunicorn` - Production WSGI server
- `openpyxl ^3.1.2` - Excel file reading/parsing
- `pymongo 4.5.0` - Listed in requirements but **not used** in codebase
- `dnspython` - Listed in requirements but **not used** in codebase
- Python stdlib: `sqlite3`, `json`, `statistics`, `contextlib`, `os`

**Build/Dev:**
- `@rsbuild/core ^1.3.1` - Module bundler
- `@rsbuild/plugin-react ^1.1.1` - React integration
- `TypeScript ^5.8.2` - Static type checking
- `Node.js 20.x` (from Dockerfile) - Runtime

## Git Ignore Patterns (Inferred)

- `frontend/dist/` - Build artifacts
- `frontend/node_modules/` - Dependencies
- `env/` or `.venv/` - Python virtual environment
- `.env` - Environment variables (if present)
- Potentially should ignore: `data/salaries.db` (large SQLite file)

## Build Process

**Frontend Build:**
```bash
cd frontend
npm install      # Install Node dependencies
npm run build    # Compile React → rsbuild output to dist/
```

**Docker Build:**
```
1. Start from python:3.9-slim
2. Install Node.js 20.x and yarn
3. COPY frontend code
4. Run yarn install && yarn build
5. COPY requirements.txt
6. pip install Flask, gunicorn, requirements
7. CMD: gunicorn main:app
```

**Data Import:**
```bash
python helper_scripts/auto_import.py [optional year args]
```

Populates `data/salaries.db` with Year* tables and lookup tables.
