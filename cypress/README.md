# Cypress End-to-End Tests

This directory contains comprehensive automated tests for the Bug Tracker frontend application using Cypress.

## Test Structure

### Test Suites

1. **`auth.cy.ts`** - Authentication functionality
   - Login/logout flows
   - Session management
   - Error handling
   - User registration

2. **`projects.cy.ts`** - Project management
   - Project creation and validation
   - Project selection and navigation
   - Data loading states
   - Error scenarios

3. **`issues.cy.ts`** - Issue management
   - Issue creation, updates, and deletion
   - Drag-and-drop functionality
   - Status management
   - Data loading and error handling

4. **`dashboard.cy.ts`** - Dashboard component testing
   - Loading states and data display
   - Metrics panel functionality
   - Issue filtering (All/Open/Closed)
   - Tooltip interactions
   - Navigation and responsiveness
   - Error handling and edge cases

## Test Coverage

### Positive Scenarios
- ✅ Successful authentication flows
- ✅ Valid project and issue creation
- ✅ Proper data loading and display
- ✅ Correct filtering and sorting
- ✅ Tooltip visibility and content
- ✅ Navigation between views
- ✅ Responsive design across viewports

### Negative Scenarios
- ✅ Invalid credentials handling
- ✅ API error responses
- ✅ Network failures and timeouts
- ✅ Empty data states
- ✅ Missing or invalid data
- ✅ Form validation errors

### Edge Cases
- ✅ Loading state management
- ✅ Memory leaks prevention
- ✅ Race condition handling
- ✅ Browser compatibility
- ✅ Mobile responsiveness

## Running Tests

### Prerequisites
- Node.js and npm installed
- Development server running on `http://localhost:5173`

### Commands

```bash
# Open Cypress Test Runner (interactive)
npm run cypress:open

# Run all tests headlessly
npm run test:e2e

# Run tests in headed mode (visible browser)
npm run test:e2e:headed
```

### Test Configuration

- **Base URL**: `http://localhost:5173`
- **Viewport**: 1280x720 (configurable per test)
- **Timeouts**: 10s command, 15s request, 15s response
- **Video Recording**: Disabled
- **Screenshots**: On failure only

## Test Data

Mock data is stored in the `fixtures/` directory:

- `login-success.json` - Successful login response
- `user-projects.json` - User's project list
- `assigned-bugs.json` - Issues assigned to user
- `all-users.json` - Complete user list
- Additional fixtures for various test scenarios

## Best Practices

### Test Organization
- Tests are grouped by feature/component
- Each test file focuses on a specific domain
- Descriptive test names and comments
- Data-cy attributes used for element selection

### Assertions
- UI element visibility and content
- State changes and data updates
- API request/response validation
- Error message display
- Navigation and routing

### Mocking Strategy
- API responses mocked using `cy.intercept()`
- Realistic test data in fixtures
- Error scenarios covered
- Loading states simulated with delays

## Regression Testing

These tests ensure that recent changes to:
- `Dashboard.tsx` component
- `index.css` Tailwind configuration
- Authentication flows
- Project and issue management

Do not break existing functionality. Run the full test suite after any code changes to verify stability.

## Continuous Integration

Tests are designed to run in CI/CD pipelines:
- Headless execution for speed
- JUnit XML output support
- Parallel test execution capability
- Screenshot/video capture on failures

## Debugging

### Common Issues
1. **Tests timing out**: Increase timeout values or check for async operations
2. **Element not found**: Verify data-cy attributes are correctly applied
3. **API mocks not working**: Check intercept patterns and fixture data
4. **Flaky tests**: Add proper waiting strategies and retry logic

### Debugging Tools
- `cy.debug()` for pausing execution
- `cy.log()` for console output
- Browser dev tools integration
- Screenshot and video capture

## Maintenance

### Adding New Tests
1. Identify the feature/component to test
2. Create or update fixtures as needed
3. Write descriptive test cases
4. Add appropriate data-cy attributes to components
5. Run tests to ensure they pass

### Updating Tests
- Keep test data in sync with API changes
- Update selectors when UI changes
- Maintain test coverage for new features
- Remove obsolete tests regularly