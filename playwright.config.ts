import { defineConfig, devices } from '@playwright/test';

/**
 * Generic Playwright Framework Configuration
 * Supports both Web and API testing
 */
export default defineConfig({
  testDir: './tests',
  testMatch: [
    '**/*.spec.{js,ts}',
    '**/*.test.{js,ts}'
  ],
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { 
      outputFolder: 'test-results/reports/html',
      open: process.env.CI !== 'true'
    }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),
  
  /* Global timeout for each test */
  timeout: 60000,
  
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Test output folder */
    // Note: outputDir is not a valid property in use options, removing it
    
    /* Run tests in headed mode to see the browser UI */
    headless: process.env.HEADLESS !== 'false',
    
    /* Slow down operations for better visibility */
    launchOptions: {
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
    },
    
    /* Timeout settings */
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },

  /* Configure projects for different testing types */
  projects: [
    /* Web Testing Projects */
    {
      name: 'web-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
      testMatch: '**/web/**/*.spec.{js,ts}',
    },
    
    {
      name: 'web-firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
      testMatch: '**/web/**/*.spec.{js,ts}',
    },
    
    {
      name: 'web-webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
      testMatch: '**/web/**/*.spec.{js,ts}',
    },

    /* Mobile Web Testing */
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: '**/web/**/*.spec.{js,ts}',
    },
    
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
      testMatch: '**/web/**/*.spec.{js,ts}',
    },

    /* API Testing Project */
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.{js,ts}',
      use: {
        // API tests don't need browser context
      },
    },
  ],

  /* Test output folder */
  outputDir: 'test-results/artifacts/',
  expect: {
    timeout: 10000,
  },
});
