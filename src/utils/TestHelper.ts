import { test, expect, Page } from '@playwright/test';

/**
 * Utility class providing common helper methods for web testing.
 * This class contains static methods for common test operations,
 * retry logic, element validation, and test data generation.
 */
export class TestHelper {
  
  /**
   * Waits for an element to be available with retry logic.
   * @param page - The Playwright Page object
   * @param selector - CSS selector of the element to wait for
   * @param timeout - Maximum time to wait for each attempt
   * @param retries - Number of retry attempts
   */
  public static async waitForElementWithRetry(
    page: Page,
    selector: string,
    timeout: number = 10000,
    retries: number = 3
  ): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await page.waitForSelector(selector, { timeout });
        return;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        await page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Clicks an element with retry logic.
   * @param page - The Playwright Page object
   * @param selector - CSS selector of the element to click
   * @param timeout - Maximum time to wait for each attempt
   * @param retries - Number of retry attempts
   */
  public static async clickElementWithRetry(
    page: Page,
    selector: string,
    timeout: number = 10000,
    retries: number = 3
  ): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await page.waitForSelector(selector, { timeout, state: 'visible' });
        await page.click(selector);
        return;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        await page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Fills an input field with retry logic.
   * @param page - The Playwright Page object
   * @param selector - CSS selector of the input element
   * @param value - The value to fill in the input
   * @param timeout - Maximum time to wait for each attempt
   * @param retries - Number of retry attempts
   */
  public static async fillInputWithRetry(
    page: Page,
    selector: string,
    value: string,
    timeout: number = 10000,
    retries: number = 3
  ): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await page.waitForSelector(selector, { timeout, state: 'visible' });
        await page.fill(selector, value);
        return;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        await page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Selects a dropdown option with retry logic.
   * @param page - The Playwright Page object
   * @param selector - CSS selector of the select element
   * @param value - The value of the option to select
   * @param timeout - Maximum time to wait for each attempt
   * @param retries - Number of retry attempts
   */
  public static async selectDropdownWithRetry(
    page: Page,
    selector: string,
    value: string,
    timeout: number = 10000,
    retries: number = 3
  ): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await page.waitForSelector(selector, { timeout, state: 'visible' });
        await page.selectOption(selector, value);
        return;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        await page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Waits for the page to completely load including network requests.
   * @param page - The Playwright Page object
   * @param timeout - Maximum time to wait
   */
  public static async waitForPageLoadComplete(page: Page, timeout: number = 30000): Promise<void> {
    await Promise.all([
      page.waitForLoadState('networkidle', { timeout }),
      page.waitForLoadState('domcontentloaded', { timeout })
    ]);
  }

  /**
   * Waits for an API response that matches the specified criteria.
   * @param page - The Playwright Page object
   * @param urlMatcher - URL pattern or matcher function
   * @param timeout - Maximum time to wait
   * @returns Promise resolving to the response JSON data
   */
  public static async waitForApiResponse(
    page: Page,
    urlMatcher: string | RegExp | ((response: any) => boolean | Promise<boolean>),
    timeout: number = 30000
  ): Promise<any> {
    const response = await page.waitForResponse(urlMatcher, { timeout });
    return await response.json();
  }

  /**
   * Waits for an API request that matches the specified criteria.
   * @param page - The Playwright Page object
   * @param urlMatcher - URL pattern or matcher function
   * @param timeout - Maximum time to wait
   * @returns Promise resolving to the request object
   */
  public static async waitForApiRequest(
    page: Page,
    urlMatcher: string | RegExp | ((request: any) => boolean | Promise<boolean>),
    timeout: number = 30000
  ): Promise<any> {
    const request = await page.waitForRequest(urlMatcher, { timeout });
    return request;
  }

  /**
   * Generates test data by replacing placeholders with random values.
   * @param template - Object with placeholder values
   * @returns Generated test data object
   */
  public static generateTestData<T>(template: Partial<T>): T {
    const testData: any = { ...template };
    
    for (const [key, value] of Object.entries(testData)) {
      if (value === '{{RANDOM_STRING}}') {
        testData[key] = this.generateRandomString();
      } else if (value === '{{RANDOM_NUMBER}}') {
        testData[key] = this.generateRandomNumber();
      } else if (value === '{{RANDOM_EMAIL}}') {
        testData[key] = this.generateRandomEmail();
      } else if (value === '{{RANDOM_PHONE}}') {
        testData[key] = this.generateRandomPhone();
      } else if (value === '{{TIMESTAMP}}') {
        testData[key] = Date.now();
      } else if (value === '{{CURRENT_DATE}}') {
        testData[key] = new Date().toISOString().split('T')[0];
      }
    }
    
    return testData as T;
  }

  /**
   * Generates a random string of specified length.
   * @param length - Length of the random string
   * @returns Random string
   */
  public static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a random number within the specified range.
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @returns Random number
   */
  public static generateRandomNumber(min: number = 1, max: number = 1000000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generates a random email address.
   * @returns Random email address
   */
  public static generateRandomEmail(): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'test.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const username = this.generateRandomString(8).toLowerCase();
    return `${username}@${domain}`;
  }

  /**
   * Generates a random US phone number.
   * @returns Random phone number in (XXX) XXX-XXXX format
   */
  public static generateRandomPhone(): string {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const lineNumber = Math.floor(Math.random() * 9000) + 1000;
    return `(${areaCode}) ${prefix}-${lineNumber}`;
  }

  /**
   * Takes a screenshot on test error for debugging.
   * @param page - The Playwright Page object
   * @param testName - Name of the test for file naming
   */
  public static async takeScreenshotOnError(page: Page, testName: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = `test-results/screenshots/${testName}-error-${timestamp}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Screenshot saved: ${screenshotPath}`);
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  }

  /**
   * Logs test information with timestamp.
   * @param testName - Name of the test
   * @param message - Message to log
   */
  public static async logTestInfo(testName: string, message: string): Promise<void> {
    console.log(`[${testName}] ${message}`);
  }

  /**
   * Logs a test step with numbering.
   * @param stepNumber - The step number
   * @param description - Description of the step
   */
  public static async logTestStep(stepNumber: number, description: string): Promise<void> {
    console.log(`Step ${stepNumber}: ${description}`);
  }

  /**
   * Logs test result with status.
   * @param testName - Name of the test
   * @param passed - Whether the test passed
   * @param message - Optional result message
   */
  public static async logTestResult(testName: string, passed: boolean, message?: string): Promise<void> {
    const status = passed ? 'PASSED' : 'FAILED';
    const logMessage = `[${testName}] ${status}`;
    console.log(message ? `${logMessage} - ${message}` : logMessage);
  }

  /**
   * Retries a test function with specified number of attempts.
   * @param testFn - The test function to retry
   * @param maxRetries - Maximum number of retry attempts
   * @param delay - Delay between retries in milliseconds
   */
  public static async retryTest(
    testFn: () => Promise<void>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<void> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await testFn();
        return;
      } catch (error) {
        lastError = error as Error;
        console.log(`Test attempt ${attempt} failed: ${(error as Error).message}`);
        
        if (attempt < maxRetries) {
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError || new Error('Test failed after retries');
  }

  /**
   * Validates that an element's text matches the expected value.
   * @param page - The Playwright Page object
   * @param selector - CSS selector of the element
   * @param expectedText - Expected text content
   * @param options - Validation options
   */
  public static async validateElementText(
    page: Page,
    selector: string,
    expectedText: string,
    options?: { timeout?: number; ignoreCase?: boolean }
  ): Promise<void> {
    const timeout = options?.timeout || 10000;
    await page.waitForSelector(selector, { timeout, state: 'visible' });
    
    const actualText = await page.textContent(selector);
    const textToCompare = options?.ignoreCase ? 
      actualText?.toLowerCase() : actualText;
    const expectedToCompare = options?.ignoreCase ? 
      expectedText.toLowerCase() : expectedText;
    
    expect(textToCompare?.trim()).toBe(expectedToCompare.trim());
  }

  /**
   * Validates that an element's text contains the expected value.
   * @param page - The Playwright Page object
   * @param selector - CSS selector of the element
   * @param expectedText - Expected text content to contain
   * @param options - Validation options
   */
  public static async validateElementContainsText(
    page: Page,
    selector: string,
    expectedText: string,
    options?: { timeout?: number; ignoreCase?: boolean }
  ): Promise<void> {
    const timeout = options?.timeout || 10000;
    await page.waitForSelector(selector, { timeout, state: 'visible' });
    
    const actualText = await page.textContent(selector);
    const textToCompare = options?.ignoreCase ? 
      actualText?.toLowerCase() : actualText;
    const expectedToCompare = options?.ignoreCase ? 
      expectedText.toLowerCase() : expectedText;
    
    expect(textToCompare).toContain(expectedToCompare);
  }

  /**
   * Validates that an element is visible on the page.
   * @param page - The Playwright Page object
   * @param selector - CSS selector of the element
   * @param timeout - Maximum time to wait
   */
  public static async validateElementVisible(
    page: Page,
    selector: string,
    timeout: number = 10000
  ): Promise<void> {
    await page.waitForSelector(selector, { timeout, state: 'visible' });
    expect(await page.isVisible(selector)).toBe(true);
  }

  /**
   * Validates that an element is hidden on the page.
   * @param page - The Playwright Page object
   * @param selector - CSS selector of the element
   * @param timeout - Maximum time to wait
   */
  public static async validateElementHidden(
    page: Page,
    selector: string,
    timeout: number = 10000
  ): Promise<void> {
    await page.waitForSelector(selector, { timeout, state: 'hidden' });
    expect(await page.isVisible(selector)).toBe(false);
  }

  /**
   * Validates that an element is enabled.
   * @param page - The Playwright Page object
   * @param selector - CSS selector of the element
   * @param timeout - Maximum time to wait
   */
  public static async validateElementEnabled(
    page: Page,
    selector: string,
    timeout: number = 10000
  ): Promise<void> {
    await page.waitForSelector(selector, { timeout, state: 'visible' });
    expect(await page.isEnabled(selector)).toBe(true);
  }

  /**
   * Validates that an element is disabled.
   * @param page - The Playwright Page object
   * @param selector - CSS selector of the element
   * @param timeout - Maximum time to wait
   */
  public static async validateElementDisabled(
    page: Page,
    selector: string,
    timeout: number = 10000
  ): Promise<void> {
    await page.waitForSelector(selector, { timeout, state: 'visible' });
    expect(await page.isEnabled(selector)).toBe(false);
  }

  /**
   * Gets an environment variable value with fallback.
   * @param name - Name of the environment variable
   * @param defaultValue - Default value if variable is not set
   * @returns Environment variable value or default
   */
  public static getEnvironmentVariable(name: string, defaultValue?: string): string {
    return process.env[name] || defaultValue || '';
  }

  /**
   * Checks if the current environment matches the specified value.
   * @param env - Environment name to check
   * @returns True if environment matches
   */
  public static isEnvironment(env: string): boolean {
    return process.env.NODE_ENV === env;
  }

  /**
   * Pauses execution for the specified amount of time.
   * @param ms - Time to sleep in milliseconds
   */
  public static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
