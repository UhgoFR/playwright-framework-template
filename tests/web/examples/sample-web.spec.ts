import { test, expect } from '@playwright/test';
import { BasePage } from '@/web/pages/BasePage';
import { TestHelper } from '@/utils/TestHelper';

test.describe('Sample Web Tests', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    await TestHelper.logTestInfo('SampleWebTests', 'Starting test setup');
  });

  test('TC001_givenValidUrl_whenNavigatingToPage_thenPageLoadsSuccessfully', async ({ page }) => {
    // Given: Valid URL
    const url = 'https://example.com/';

    // When: Navigating to the page
    await basePage.navigateTo(url);
    await basePage.waitForPageLoad();

    // Then: Page should load successfully
    await TestHelper.logTestStep(1, 'Verify page title');
    const title = await basePage.getPageTitle();
    expect(title).toContain('Example Domain');

    await TestHelper.logTestStep(2, 'Verify URL is correct');
    const currentUrl = await basePage.getCurrentURL();
    expect(currentUrl).toBe(url);

    await TestHelper.logTestStep(3, 'Verify main heading is visible');
    await basePage.waitForElementToBeVisible('h1');
    const headingText = await basePage.getElementText('h1');
    expect(headingText).toContain('Example Domain');
  });

  test('TC002_givenPageLoaded_whenTakingScreenshot_thenScreenshotCaptured', async ({ page }) => {
    // Given: Page is loaded
    await basePage.navigateTo('https://example.com');
    await basePage.waitForPageLoad();

    // When: Taking screenshot
    const screenshot = await basePage.takeScreenshot('test-results/screenshots/example-page.png', { fullPage: true });

    // Then: Screenshot should be captured
    expect(screenshot).toBeDefined();
    expect(screenshot.length).toBeGreaterThan(0);
    await TestHelper.logTestResult('TC002_Screenshot', true, 'Screenshot captured successfully');
  });

  test('TC003_givenFormElements_whenInteracting_thenElementsWorkCorrectly', async ({ page }) => {
    // Given: Page with form elements
    await basePage.navigateTo('https://www.w3schools.com/html/html_forms.asp');
    await basePage.waitForPageLoad();

    // When: Interacting with form elements
    await TestHelper.logTestStep(1, 'Scroll to form section');
    await basePage.scrollToBottom();
    await basePage.waitForTimeout(1000);

    await TestHelper.logTestStep(2, 'Find and interact with input field');
    const inputSelectors = [
      'input[type="text"]',
      'input[name="fname"]',
      'input[placeholder*="First name"]'
    ];

    let inputFound = false;
    for (const selector of inputSelectors) {
      if (await basePage.isElementVisible(selector)) {
        await basePage.fillInput(selector, `TestName_${TestHelper.generateRandomString(5)}`);
        inputFound = true;
        break;
      }
    }

    if (inputFound) {
      await TestHelper.logTestResult('TC003_FormInteraction', true, 'Form interaction completed');
    } else {
      await TestHelper.logTestResult('TC003_FormInteraction', false, 'No suitable input field found');
    }
  });

  test('TC004_givenNavigationLinks_whenClicking_thenNavigationWorks', async ({ page }) => {
    // Given: Page with navigation links
    await basePage.navigateTo('https://example.com');
    await basePage.waitForPageLoad();

    // When: Looking for navigation links
    await TestHelper.logTestStep(1, 'Find clickable links');
    const links = await page.locator('a[href]').count();
    
    if (links > 0) {
      await TestHelper.logTestStep(2, 'Click first available link');
      const firstLink = page.locator('a[href]').first();
      const linkText = await firstLink.textContent();
      
      await firstLink.click();
      await basePage.waitForTimeout(2000);

      await TestHelper.logTestStep(3, 'Verify navigation occurred');
      const newUrl = await basePage.getCurrentURL();
      expect(newUrl).not.toBe('https://example.com');
      
      await TestHelper.logTestResult('TC004_Navigation', true, `Navigated to ${newUrl} via "${linkText}"`);
    } else {
      await TestHelper.logTestResult('TC004_Navigation', false, 'No navigation links found');
    }
  });

  test('TC005_givenPageContent_whenValidatingPageStructure_thenStructureCorrect', async ({ page }) => {
    // Given: Page is loaded
    await basePage.navigateTo('https://example.com');
    await basePage.waitForPageLoad();

    // When: Validating page structure
    await TestHelper.logTestStep(1, 'Check for essential HTML elements');
    
    // Check for doctype
    const doctype = await page.evaluate(() => document.doctype?.name);
    expect(doctype).toBe('html');

    // Check for head elements
    await basePage.waitForElement('head');
    await basePage.waitForElement('title');
    await basePage.waitForElement('meta[charset]');

    // Check for body
    await basePage.waitForElement('body');
    const bodyExists = await basePage.isElementVisible('body');
    expect(bodyExists).toBe(true);

    await TestHelper.logTestStep(2, 'Check for accessibility attributes');
    const lang = await basePage.getElementAttribute('html', 'lang');
    expect(lang).toBeTruthy();

    await TestHelper.logTestResult('TC005_PageStructure', true, 'Page structure validation completed');
  });

  test('TC006_givenResponsiveDesign_whenTestingViewports_thenPageAdapts', async ({ page }) => {
    // Given: Page is loaded
    await basePage.navigateTo('https://example.com');
    await basePage.waitForPageLoad();

    // When: Testing different viewports
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];

    for (const viewport of viewports) {
      await TestHelper.logTestStep(1, `Testing ${viewport.name} viewport: ${viewport.width}x${viewport.height}`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await basePage.waitForTimeout(500);

      // Verify main content is still visible
      const headingVisible = await basePage.isElementVisible('h1');
      expect(headingVisible).toBe(true);

      // Take viewport-specific screenshot
      const screenshotName = `test-results/screenshots/example-${viewport.name.toLowerCase()}-${viewport.width}x${viewport.height}.png`;
      await basePage.takeScreenshot(screenshotName);
      
      await TestHelper.logTestInfo('ViewportTest', `${viewport.name} screenshot captured`);
    }

    await TestHelper.logTestResult('TC006_ResponsiveDesign', true, 'Responsive design testing completed');
  });

  test('TC007_givenPagePerformance_whenMeasuringLoadTime_thenPerformanceAcceptable', async ({ page }) => {
    // Given: Performance monitoring setup
    const startTime = Date.now();

    // When: Loading the page
    await basePage.navigateTo('https://example.com');
    await basePage.waitForPageLoad();

    const loadTime = Date.now() - startTime;

    // Then: Performance should be acceptable
    await TestHelper.logTestInfo('PerformanceTest', `Page load time: ${loadTime}ms`);
    
    // Assert page loads within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000);

    // Check for performance metrics (if available)
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
      };
    });

    await TestHelper.logTestInfo('PerformanceMetrics', JSON.stringify(performanceMetrics, null, 2));
    await TestHelper.logTestResult('TC007_Performance', true, 'Performance testing completed');
  });
});
