# Playwright Framework Template

A comprehensive, generic Playwright framework template for both web and API automation testing. This template provides a solid foundation for implementing test automation in new web applications and APIs.

## 🚀 Features

- **Dual Testing Support**: Complete support for both Web UI and API testing
- **TypeScript**: Full TypeScript support with type safety
- **Page Object Model**: Structured approach for web testing
- **API Service Layer**: Clean architecture for API testing
- **Configuration Management**: Flexible configuration system
- **Multiple Browsers**: Support for Chromium, Firefox, WebKit, and mobile testing
- **Reporting**: Comprehensive reporting with HTML, JSON, and JUnit formats
- **Retry Mechanism**: Built-in retry logic for flaky tests
- **Screenshots & Videos**: Automatic capture on test failures
- **Environment Support**: Easy configuration for different environments
- **Utility Helpers**: Rich set of utility functions for common testing tasks

## 📁 Project Structure

```
playwright-framework-template/
├── src/
│   ├── api/
│   │   ├── factory/
│   │   │   └── ApiFactory.ts           # API request context factory
│   │   ├── models/
│   │   │   ├── ApiResponse.ts          # API response models
│   │   │   └── index.ts                # Model exports
│   │   └── services/
│   │       └── BaseApiService.ts       # Base API service class
│   ├── config/
│   │   └── api-config.ts               # API configuration
│   ├── utils/
│   │   ├── ApiHelper.ts                # API utility functions
│   │   └── TestHelper.ts               # Test utility functions
│   └── web/
│       └── pages/
│           ├── BasePage.ts             # Base page class
│           └── LoginPage.ts            # Example login page
├── tests/
│   ├── api/
│   │   └── examples/
│   │       └── sample-api.spec.ts      # Sample API tests
│   ├── web/
│   │   └── examples/
│   │       └── sample-web.spec.ts      # Sample web tests
│   ├── global-setup.ts                 # Global test setup
│   └── global-teardown.ts              # Global test teardown
├── .env.example                         # Environment variables template
├── .eslintrc.json                      # ESLint configuration
├── .gitignore                          # Git ignore file
├── package.json                        # Dependencies and scripts
├── playwright.config.ts                # Playwright configuration
├── tsconfig.json                       # TypeScript configuration
└── README.md                           # This file
```

## 🛠️ Installation

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Setup Steps

1. **Clone or copy the template:**
   ```bash
   # If using as a template
   git clone <repository-url> your-project-name
   cd your-project-name
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npm run test:install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your specific configuration
   ```

5. **Run tests to verify setup:**
   ```bash
   npm run test
   ```

## 📝 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```bash
# Web Testing
BASE_URL=https://your-app.com
HEADLESS=false

# API Testing
API_BASE_URL=https://api.your-app.com
API_KEY=your-api-key

# Test Configuration
TEST_TIMEOUT=60000
RETRY_COUNT=3
```

### Playwright Configuration

The `playwright.config.ts` file contains comprehensive configuration for:

- Test directories and patterns
- Browser configurations (Chrome, Firefox, Safari, Mobile)
- Timeout settings
- Reporting options
- Parallel execution
- Screenshot and video capture

## 🧪 Running Tests

### Available Scripts

```bash
# Run all tests
npm run test

# Run only web tests
npm run test:web

# Run only API tests
npm run test:api

# Run tests in headed mode (visible browser)
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run test:report

# Install Playwright browsers
npm run test:install

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Running Specific Tests

```bash
# Run specific test file
npx playwright test tests/web/examples/sample-web.spec.ts

# Run tests with specific pattern
npx playwright test --grep "login"

# Run tests in specific browser
npx playwright test --project=web-chromium

# Run tests with tags (if implemented)
npx playwright test --grep "@smoke"
```

## 📊 Test Organization

### Web Testing Structure

1. **Page Object Model (POM)**: Each page has its own class extending `BasePage`
2. **Test Files**: Organized by feature/module in `tests/web/`
3. **Selectors**: Centralized in page classes for maintainability
4. **Test Data**: Use utility functions or external data files

### API Testing Structure

1. **Service Classes**: Each API endpoint has a service class extending `BaseApiService`
2. **Models**: TypeScript interfaces for request/response objects
3. **Configuration**: Centralized API configuration
4. **Test Data**: JSON files or generated data using utility functions

## 🔧 Usage Examples

### Web Testing Example

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '@/web/pages/LoginPage';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should login with valid credentials', async () => {
    await loginPage.login('username', 'password');
    // Add assertions
  });
});
```

### API Testing Example

```typescript
import { test, expect } from '@playwright/test';
import { ApiFactory } from '@/api/factory/ApiFactory';
import { ApiHelper } from '@/utils/ApiHelper';

test.describe('API Tests', () => {
  let requestContext: any;

  test.beforeAll(async () => {
    const apiFactory = ApiFactory.getInstance();
    requestContext = await apiFactory.createRequestContext();
  });

  test('should get user data', async () => {
    const response = await requestContext.get('/users/1');
    await ApiHelper.validateResponse(response, 200);
    const userData = await ApiHelper.parseJsonResponse(response);
    expect(userData).toHaveProperty('id');
  });
});
```

## 🏗️ Extending the Framework

### Adding New Page Objects

1. Create a new page class in `src/web/pages/`
2. Extend `BasePage` for inherited functionality
3. Define selectors and methods specific to that page

### Adding New API Services

1. Create a new service class in `src/api/services/`
2. Extend `BaseApiService` for common functionality
3. Define endpoint-specific methods

### Adding Custom Utilities

1. Add utility functions to `src/utils/`
2. Export and use across your tests
3. Follow the existing patterns for consistency

## 📱 Mobile Testing

The framework supports mobile testing out of the box:

```bash
# Run tests on mobile viewport
npx playwright test --project=mobile-chrome

# Run tests on specific device
npx playwright test --project=mobile-safari
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run test:install
      - run: npm run test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: test-results/
```

## 🐛 Debugging

### Debug Mode

```bash
# Run tests in debug mode
npm run test:debug

# Debug specific test
npx playwright test --debug tests/web/examples/sample-web.spec.ts
```

### VS Code Integration

Install the Playwright extension for VS Code for enhanced debugging experience:

1. Install "Playwright Test for VSCode" extension
2. Use the Test Explorer to run/debug tests
3. Set breakpoints directly in test files

## 📈 Best Practices

1. **Test Organization**: Group related tests using `test.describe()`
2. **Data Management**: Use environment variables for sensitive data
3. **Page Objects**: Keep selectors and actions in page classes
4. **Error Handling**: Use proper assertions and error messages
5. **Test Data**: Generate test data dynamically when possible
6. **Cleanup**: Use `afterEach` and `afterAll` for cleanup
7. **Retry Logic**: Configure retries for flaky tests
8. **Documentation**: Add comments for complex test scenarios

## 🔍 Reporting

After running tests, view the HTML report:

```bash
npm run test:report
```

Reports include:
- Test execution details
- Screenshots on failure
- Videos of test execution
- Trace files for debugging
- Performance metrics

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add tests for new functionality
3. Update documentation for new features
4. Use meaningful commit messages
5. Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Browser not installed**: Run `npm run test:install`
2. **Tests timing out**: Increase timeout in `playwright.config.ts`
3. **Environment variables not loading**: Ensure `.env` file exists
4. **TypeScript errors**: Run `npm run lint:fix`

### Getting Help

- Check the [Playwright documentation](https://playwright.dev/)
- Review test logs in `test-results/`
- Use debug mode to step through tests
- Check console output for detailed error messages

## 🚀 Next Steps

1. **Customize for your application**: Update selectors and endpoints
2. **Add your own tests**: Create test files for your specific features
3. **Set up CI/CD**: Configure automated testing in your pipeline
4. **Add reporting**: Integrate with your test management tools
5. **Expand utilities**: Add helper functions specific to your needs
