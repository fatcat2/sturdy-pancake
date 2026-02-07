# Coding Conventions

**Analysis Date:** 2026-02-07

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `Header.tsx`, `DataTable.tsx`, `SalaryComparison.tsx`)
- Non-component TypeScript files: camelCase (e.g., `api.ts`, `constants.ts`)
- Python files: snake_case (e.g., `main.py`)

**Functions:**
- React components and exported functions: PascalCase (e.g., `fetchSalaryData`, `handleYearChange`, `Header`)
- Helper functions: camelCase (e.g., `handleSearch`, `addEmployee`, `createPickerData`)
- Python functions: snake_case (e.g., `validateYear`, `queryBuilder`, `years_route`, `picker_data`)

**Variables:**
- Frontend/TypeScript: camelCase (e.g., `selectedEmployees`, `searchResults`, `expandedRowKeys`)
- Python: snake_case (e.g., `tableName`, `departmentFilters`, `groupFilters`)
- Database field names: snake_case (e.g., `first_name`, `last_name`, `long_text`, `dept`, `comp`)

**Types/Interfaces:**
- PascalCase for all TypeScript interfaces (e.g., `EmployeeData`, `FilterOption`, `ApiResponse`, `HeaderProps`)
- Fields within interfaces use camelCase (e.g., `first_name`, `last_name`)
- Type imports use explicit `type` keyword (e.g., `import type { Key } from "react"`)

**Constants:**
- UPPERCASE_SNAKE_CASE (e.g., `CURRENT_YEAR`, `START_YEAR`, `YEAR_OPTIONS`)
- Defined in `constants.ts`

## Code Style

**Formatting:**
- No explicit formatter configured (no .prettierrc or eslint rules)
- Inconsistent quote usage: single quotes in some files (`index.tsx`), double quotes in others
- Component indentation: 2 spaces (consistent with React defaults)
- Import statements use double quotes

**Linting:**
- TypeScript strict mode enabled in `tsconfig.json`
- Compiler options include:
  - `strict: true` - All strict type checking enabled
  - `noUnusedLocals: true` - Error on unused local variables
  - `noUnusedParameters: true` - Error on unused parameters
- No ESLint configuration found

**Indentation/Spacing:**
- 2-space indentation used throughout React code
- No semicolon enforcement visible in inline code
- Inline styles use object notation with camelCase properties

## Import Organization

**Order:**
1. React and third-party libraries (e.g., `import React from 'react'`)
2. UI/component libraries (e.g., `import { Row, Col } from "antd"`)
3. Internal utilities and types (e.g., `import { fetchSalaryData } from "../services"`)
4. Local components (e.g., `import Header from "./Header"`)
5. Type imports (using `type` keyword)
6. CSS/static assets (e.g., `import "./App.css"`)

Example from `App.tsx`:
```typescript
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import { BrowserView, MobileView } from "react-device-detect";
import { Dropdown } from "semantic-ui-react";
import { Row, Col, Menu, Table, Typography, Input, Tooltip, Layout } from "antd";
import type { TableColumnType } from "antd";
import type { Key } from "react";
import "./App.css";
import About from "./About";
import SalaryComparison from "./SalaryComparison";
import { CURRENT_YEAR, YEAR_OPTIONS } from "./constants";
```

**Path Aliases:**
- No path aliases configured (uses relative imports like `../types`, `../constants`)

## Error Handling

**Frontend Patterns:**
- Try-catch with console.error logging (e.g., in `api.ts`, `App.tsx`)
- Errors logged but not always handled gracefully to user
- Async operations use try-catch-finally pattern for state management

Example from `api.ts`:
```typescript
export const fetchSalaryData = async (year: number): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`/data/${year}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching salary data:", error);
    throw error;
  }
};
```

**Backend Patterns:**
- Python bare except used in `validateYear()`: `except:` without specific exception type
- Error handling is minimal; relies on HTTP status codes (e.g., `abort(500)`)
- No try-catch blocks in route handlers; errors propagate to Flask default handler
- Graceful database closure using `closing()` context manager

Example from `main.py`:
```python
def validateYear(year):
    try:
        y = int(year)
    except:
        return False
```

## Logging

**Framework:**
- Frontend: `console.error()` and `console.log()`
- Backend: Python print statements (e.g., `print(departmentIndex[year])`)

**Patterns:**
- Errors logged with message prefix identifying context (e.g., "Error fetching salary data:", "Search error:")
- Debug logging: Print statements in `queryBuilder()` for SQL debugging
- No structured logging or log levels

## Comments

**When to Comment:**
- Inline comments rare in codebase
- Functional comments: One in `App.tsx` at line 209: `// Always leave this empty because it's fucking ugly`
- No JSDoc/documentation comments observed

**JSDoc/TSDoc:**
- Not used in the codebase
- No parameter or return type documentation beyond TypeScript type annotations

## Function Design

**Size:**
- Frontend functions generally small (under 50 lines)
- React component handlers are typically 5-20 lines
- Backend route handlers 10-30 lines

**Parameters:**
- Frontend: Destructure props from single object (e.g., `{ onYearChange, onSearch }`)
- Backend: Use request.args and query parameters rather than function parameters
- Type annotations used on all TypeScript function parameters

**Return Values:**
- Frontend async functions return typed Promises (e.g., `Promise<ApiResponse>`)
- Backend routes return Flask JSON responses via `jsonify()`
- Components use implicit returns in arrow functions

Example of function design from `SalaryComparison.tsx`:
```typescript
const handleSearch = useCallback(async (value: string) => {
  if (!value || value.length < 2) {
    setSearchResults([]);
    return;
  }
  setSearching(true);
  try {
    const response = await axios.get("/data/compare/search", {
      params: { query: value, year: CURRENT_YEAR },
    });
    setSearchResults(response.data.results);
  } catch (error) {
    console.error("Search error:", error);
  } finally {
    setSearching(false);
  }
}, []);
```

## Module Design

**Exports:**
- Frontend: Named exports for utilities and components (e.g., `export const fetchSalaryData`, `export const Header`)
- Default exports for main components (e.g., `export default About`)
- Backend: Functions decorated with `@app.route()` decorator for route registration

**Barrel Files:**
- Not used; imports are direct from source files
- Types centralized in `src/types.ts`
- Constants centralized in `src/constants.ts`

**React Component Patterns:**
- Functional components with hooks (React.FC with TypeScript)
- Props passed as typed interfaces (e.g., `HeaderProps`, `DataTableProps`)
- State management via `useState` and `useCallback`

Example from `Header.tsx`:
```typescript
interface HeaderProps {
  onYearChange: (e: any, v: YearChangeEvent) => void;
  onSearch: (e: SearchEvent) => void;
}

export const Header: React.FC<HeaderProps> = ({ onYearChange, onSearch }) => {
  // Component implementation
};
```

---

*Convention analysis: 2026-02-07*
