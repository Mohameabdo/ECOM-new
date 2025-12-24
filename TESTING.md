# Testing Guide for ECOM-new

This document provides comprehensive information about the testing infrastructure and how to run tests across all three components of the ECOM-new project.

## 📋 Table of Contents
- [Overview](#overview)
- [Backend Testing](#backend-testing)
- [Admin Testing](#admin-testing)
- [Mobile Testing](#mobile-testing)
- [Running All Tests](#running-all-tests)
- [Continuous Integration](#continuous-integration)

## Overview

The project uses modern testing frameworks tailored to each component:
- **Backend**: Jest with ES Modules support
- **Admin**: Vitest with React Testing Library
- **Mobile**: Jest with React Native Testing Library (jest-expo preset)

### Test Statistics
| Component | Test Files | Test Suites | Test Cases | Lines of Code |
|-----------|------------|-------------|------------|---------------|
| Backend   | 2          | 12+         | 25+        | 212           |
| Admin     | 1          | 3           | 10+        | 76            |
| Mobile    | 4          | 15+         | 50+        | 352           |
| **Total** | **7**      | **30+**     | **85+**    | **640**       |

## Backend Testing

### Setup
```bash
cd backend
npm install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Files
- `src/__tests__/server.test.js` - Express server and API endpoint tests
- `src/config/__tests__/env.test.js` - Environment configuration tests

### Test Coverage
- ✅ Health endpoint (`/api/health`)
- ✅ Environment variable loading
- ✅ Production vs Development configurations
- ✅ HTTP method validation
- ✅ 404 error handling
- ✅ Concurrent request handling
- ✅ Edge cases (special characters, empty values)

### Configuration
The backend uses Jest with ES Modules support:
- **Config file**: `jest.config.js`
- **Test environment**: Node.js
- **Module system**: ES Modules (import/export)

## Admin Testing

### Setup
```bash
cd admin
npm install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Files
- `src/__tests__/App.test.jsx` - Main App component tests
- `src/test/setup.js` - Test configuration and global setup

### Test Coverage
- ✅ Component rendering
- ✅ Logo and asset loading
- ✅ Counter state management
- ✅ Event handling (clicks)
- ✅ Accessibility (ARIA attributes, alt text)
- ✅ User interactions

### Configuration
The admin panel uses Vitest, which integrates seamlessly with Vite:
- **Config file**: `vite.config.js` (includes test configuration)
- **Test environment**: jsdom (browser simulation)
- **Testing library**: React Testing Library

## Mobile Testing

### Setup
```bash
cd mobile
npm install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Files
- `hooks/__tests__/use-color-scheme.test.ts` - Native color scheme hook tests
- `hooks/__tests__/use-color-scheme.web.test.ts` - Web color scheme hook tests
- `hooks/__tests__/use-theme-color.test.ts` - Theme color hook tests
- `constants/__tests__/theme.test.ts` - Theme constants validation tests

### Test Coverage
- ✅ Custom React hooks
- ✅ Theme switching (light/dark mode)
- ✅ Color constant validation
- ✅ Platform-specific implementations
- ✅ Hydration behavior (web)
- ✅ Props override functionality
- ✅ Edge cases (null/undefined values)

### Configuration
The mobile app uses Jest with the Expo preset:
- **Config**: Inline in `package.json` under `"jest"` key
- **Preset**: jest-expo
- **Testing library**: React Native Testing Library

## Running All Tests

### From Project Root
```bash
# Install all dependencies
npm run build  # This installs backend and admin dependencies

# Or install individually
cd backend && npm install && cd ..
cd admin && npm install && cd ..
cd mobile && npm install && cd ..

# Run all tests (you'll need to run these separately)
cd backend && npm test && cd ..
cd admin && npm test && cd ..
cd mobile && npm test && cd ..
```

### Using a Script (Optional)
Create a `test-all.sh` script in the project root:
```bash
#!/bin/bash
echo "Testing Backend..."
cd backend && npm test
echo ""
echo "Testing Admin..."
cd ../admin && npm test
echo ""
echo "Testing Mobile..."
cd ../mobile && npm test
cd ..
```

Then run:
```bash
chmod +x test-all.sh
./test-all.sh
```

## Continuous Integration

### GitHub Actions Example
Create `.github/workflows/test.yml`:
```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd backend && npm install
      - name: Run tests
        run: cd backend && npm test

  test-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd admin && npm install
      - name: Run tests
        run: cd admin && npm test

  test-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd mobile && npm install
      - name: Run tests
        run: cd mobile && npm test
```

## Best Practices

### Writing New Tests

#### Backend (Jest)
```javascript
import { describe, it, expect } from '@jest/globals';

describe('Feature Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = someFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

#### Admin (Vitest + React Testing Library)
```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

#### Mobile (Jest + React Native Testing Library)
```typescript
import { renderHook } from '@testing-library/react-native';
import { useMyHook } from './useMyHook';

describe('useMyHook', () => {
  it('should return expected value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current).toBe('expected');
  });
});
```

## Troubleshooting

### Backend
**Issue**: `Cannot use import statement outside a module`
**Solution**: Ensure `"type": "module"` is in `package.json` and use `.js` extensions in imports.

### Admin
**Issue**: `ReferenceError: expect is not defined`
**Solution**: Ensure `globals: true` is set in `vite.config.js` test configuration.

### Mobile
**Issue**: `Invariant Violation: Module AppRegistry is not a registered callable module`
**Solution**: Ensure `jest-expo` preset is properly configured in `package.json`.

## Coverage Reports

All test suites generate coverage reports:
- **Backend**: `backend/coverage/`
- **Admin**: `admin/coverage/`
- **Mobile**: `mobile/coverage/`

Open `coverage/index.html` in your browser to view detailed coverage reports.

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure all existing tests pass
3. Maintain minimum 80% code coverage
4. Update this documentation if adding new test patterns

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)