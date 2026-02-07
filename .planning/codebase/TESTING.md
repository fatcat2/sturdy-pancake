# Testing Patterns

**Analysis Date:** 2026-02-07

## Test Framework

**Runner:**
- Not detected - No test framework configured
- No `jest.config.js`, `vitest.config.ts`, or pytest configuration found

**Assertion Library:**
- Not detected - No testing dependencies in `package.json`

**Run Commands:**
- No test scripts defined in `package.json`
- Frontend scripts available:
  ```bash
  npm run build              # Build the project with rsbuild
  npm run dev                # Start dev server with rsbuild
  npm run preview            # Preview production build
  ```
- Backend: No test execution defined in requirements

## Test File Organization

**Location:**
- No test files found in codebase
- No `.test.ts`, `.test.tsx`, `.spec.ts`, or `test_*.py` files exist

**Naming:**
- Not applicable - no tests present

**Structure:**
- Not applicable - no tests present

## Test Structure

**Suite Organization:**
- Not applicable - no tests present

**Patterns:**
- Not applicable - no tests present

## Mocking

**Framework:**
- Not detected - no mocking library configured

**Patterns:**
- Not applicable - no tests present

**What to Mock:**
- For future tests, these candidates should be mocked:
  - `axios` HTTP calls in `src/services/api.ts` and `src/App.tsx`
  - Flask database connections in `main.py`
  - External API calls (e.g., `/data/` endpoints)

**What NOT to Mock:**
- Core component logic and state management
- TypeScript type definitions
- Data transformation functions

## Fixtures and Factories

**Test Data:**
- Not detected - No fixture definitions exist
- Mock data should be created for:
  - `EmployeeData` objects (see `src/types.ts`)
  - `ApiResponse` structure with employee arrays
  - Filter options (departments, groups)

**Location:**
- Recommended: Create `frontend/src/__fixtures__/` or `frontend/src/__mocks__/` directory
- Alternative: Co-locate with test files as `*.fixtures.ts`

**Example data structure to mock** (from `src/types.ts`):
```typescript
export interface EmployeeData {
  key: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  dept: string;
  group: string;
  comp: number;
  long_text: string;
}

export interface ApiResponse {
  data: EmployeeData[];
  departments: FilterOption[];
  groups: FilterOption[];
}
```

## Coverage

**Requirements:**
- Not enforced - no coverage configuration found

**View Coverage:**
- Not applicable - no test runner configured

## Test Types

**Unit Tests:**
- Should test:
  - `src/services/api.ts` - `fetchSalaryData()` function
  - `src/constants.ts` - Constant generation (YEAR_OPTIONS)
  - Component logic in isolation (handlers, data transformations)
  - Python utility functions: `validateYear()`, `queryBuilder()`, `createPickerData()`

**Integration Tests:**
- Should test:
  - React component integration with axios API calls
  - Flask route handlers with database queries
  - End-to-end salary data flow from `/data/<year>` endpoint through UI rendering
  - Search and comparison workflows in `SalaryComparison.tsx`

**E2E Tests:**
- Not detected - no E2E framework configured
- Recommended future tools: Playwright, Cypress
- Should test:
  - Full application flows: data fetching, searching, filtering
  - Salary comparison workflow
  - Year selection and data updates
  - Mobile/responsive rendering

## Critical Areas Lacking Test Coverage

**Frontend - High Priority:**

1. **API Service Layer** (`src/services/api.ts`):
   - No error scenario testing
   - No response validation
   - No timeout handling

2. **Data Table Component** (`src/components/DataTable.tsx`):
   - Column sorting logic
   - Filter application
   - Responsive view switching (BrowserView/MobileView)
   - Currency formatting rendering

3. **Search and Filter Logic** (`src/App.tsx`):
   - `handleSearchOnChange()` - search text processing and filtering
   - Multi-field search logic (name + department/group)
   - Case-insensitive search behavior
   - Search result ordering

4. **Salary Comparison** (`src/SalaryComparison.tsx`):
   - Employee selection and deduplication logic
   - Year comparison data aggregation
   - PDF export functionality
   - Error handling in comparison calculation

**Backend - High Priority:**

1. **Input Validation** (`main.py`):
   - `validateYear()` - bare except clause needs specific testing
   - Year range validation (2011-2020)
   - SQL injection prevention in query building (uses parameterized queries but should verify)

2. **Database Queries:**
   - All route handlers accessing `data/salaries.db`
   - Missing error handling for non-existent tables
   - No validation that year tables exist before querying

3. **Data Transformation** (`main.py`):
   - `createPickerData()` - handles None values, string concatenation
   - Department/group filter generation
   - Salary statistics calculation (max, min, mean, median)

## Common Patterns for Implementation

**Async Testing (Frontend):**
```typescript
// Recommended pattern for testing async API calls:
describe('fetchSalaryData', () => {
  it('should fetch and return salary data', async () => {
    // Mock axios.get
    // Call fetchSalaryData(2024)
    // Assert response structure matches ApiResponse
  });

  it('should throw on network error', async () => {
    // Mock axios.get to reject
    // Expect fetchSalaryData to throw
  });
});
```

**Error Testing:**
```typescript
// Pattern for error handling in components:
describe('App component', () => {
  it('should handle fetch errors gracefully', async () => {
    // Mock axios to reject
    // Render App
    // Verify error state or user feedback
  });
});
```

**Database Testing (Backend):**
```python
# Recommended pattern for testing database-dependent functions:
def test_validate_year_valid():
    assert validateYear("2015") == True

def test_validate_year_invalid():
    assert validateYear("2025") == False
    assert validateYear("abc") == False
```

## Testing Gaps and Recommendations

**Frontend:**
- Add Jest or Vitest to `package.json` devDependencies
- Create test files co-located with source: `Component.tsx` + `Component.test.tsx`
- Mock axios at module level for API service tests
- Test React hooks with `@testing-library/react-hooks`
- Add snapshot testing for component rendering

**Backend:**
- Add pytest to `requirements.txt`
- Create `tests/` directory at project root
- Use pytest fixtures for database setup/teardown
- Mock sqlite3 connections for unit tests
- Test route handlers with Flask test client

**E2E Testing:**
- Add Playwright or Cypress for user journey testing
- Test data flow: year selection → API call → table rendering → search → export
- Test responsive design switching
- Test PDF export generation

---

*Testing analysis: 2026-02-07*
