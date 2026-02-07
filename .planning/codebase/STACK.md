# Technology Stack

**Analysis Date:** 2026-02-07

## Languages

**Primary:**
- Python 3.9 - Backend API and data processing scripts
- TypeScript 5.8.2 - Frontend application (React)
- JavaScript - Frontend runtime via Node.js

**Secondary:**
- SQL - SQLite database queries

## Runtime

**Environment:**
- Python 3.9 - Flask application runtime
- Node.js 20.x - Frontend build and runtime
- Docker - Container orchestration (Python 3.9-slim base image)

**Package Manager:**
- pip (Python)
- npm/yarn (Node.js)
- Lockfiles: `package-lock.json` (frontend), `requirements.txt` (Python)

## Frameworks

**Core:**
- Flask 1.x - Backend web framework for REST API endpoints
- React 18 - Frontend UI framework
- React Router 7.5.2 - Client-side routing for navigation

**Build/Dev:**
- RSBuild 1.3.1 - Frontend build tool (Rust-based bundler)
- @rsbuild/plugin-react 1.1.1 - React integration for RSBuild
- Yarn - Package manager for frontend dependencies (frozen lockfile in Docker)

**UI Components:**
- Ant Design (antd) 5.24.8 - Component library for React
- Semantic UI React 2.1.5 - Alternative UI component library
- Semantic UI CSS 2.5.0 - CSS framework for semantic HTML

**Data/Utilities:**
- Axios 1.9.0 - HTTP client for API calls
- jsPDF 4.1.0 - PDF generation from JavaScript
- jsPDF-AutoTable 5.0.7 - PDF table generation
- react-currency-format 1.1.0 - Currency formatting component
- react-device-detect 2.2.3 - Device detection for responsive design

**Data Processing:**
- openpyxl - Excel file reading/writing for automated imports

## Key Dependencies

**Critical:**
- Flask - Core backend framework serving API endpoints and rendering SPA
- SQLite3 - Primary data store (embedded in Python stdlib)
- openpyxl - Excel parsing for automated salary data imports
- React - Core frontend UI rendering
- Axios - API communication between frontend and backend

**Infrastructure:**
- Gunicorn - WSGI server for production Flask deployment
- sqlite3 (Python stdlib) - Database connectivity

## Configuration

**Environment:**
- Development: Flask debug mode (`debug=True`) on port 5100
- Production: Gunicorn with 1 worker process, 8 threads, via Docker
- Frontend served from `frontend/dist/` directory (static files)
- Database location: `data/salaries.db`
- Excel import directory: `excel/` (scanned for `.xlsx` files)
- No environment variables currently in use

**Build:**
- `frontend/rsbuild.config.ts` - RSBuild configuration with React plugin
- `frontend/tsconfig.json` - TypeScript compilation settings (ES2020, strict mode)
- `Dockerfile` - Multi-stage build: Node.js frontend build → Python Flask app
- Docker entrypoint: `gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app`

## Platform Requirements

**Development:**
- Python 3.9+
- Node.js 20.x
- SQLite3
- Yarn (for frontend)

**Production:**
- Docker runtime
- PORT environment variable (for dynamic port binding)
- Linux host (Ubuntu latest in CI)

---

*Stack analysis: 2026-02-07*
