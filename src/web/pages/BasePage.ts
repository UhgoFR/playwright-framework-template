import { Page, Locator } from '@playwright/test';

/**
 * Base page class that provides common functionality for all page objects.
 * This class encapsulates common page interactions and utilities
 * to promote code reuse and maintainability in web testing.
 * 
 * Extend this class to create specific page objects for your application.
 */
export class BasePage {
  readonly page: Page;

  /**
   * Creates an instance of BasePage.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Waits for the page to finish loading (network idle state).
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Waits for an element to be present in the DOM.
   * @param selector - CSS selector of the element to wait for
   * @param timeout - Maximum time to wait in milliseconds (default: 10000)
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Waits for an element to become visible on the page.
   * @param selector - CSS selector of the element to wait for
   * @param timeout - Maximum time to wait in milliseconds (default: 10000)
   */
  async waitForElementToBeVisible(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Waits for an element to become hidden on the page.
   * @param selector - CSS selector of the element to wait for
   * @param timeout - Maximum time to wait in milliseconds (default: 10000)
   */
  async waitForElementToBeHidden(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  /**
   * Gets the text content of an element.
   * @param selector - CSS selector of the element
   * @returns Promise resolving to the element's text content
   */
  async getElementText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  /**
   * Gets the inner text of an element (includes text from child elements).
   * @param selector - CSS selector of the element
   * @returns Promise resolving to the element's inner text
   */
  async getElementInnerText(selector: string): Promise<string> {
    return await this.page.innerText(selector);
  }

  /**
   * Gets the value of an element's attribute.
   * @param selector - CSS selector of the element
   * @param attribute - Name of the attribute to get
   * @returns Promise resolving to the attribute value or null if not found
   */
  async getElementAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.getAttribute(selector, attribute);
  }

  /**
   * Checks if an element is visible on the page.
   * @param selector - CSS selector of the element
   * @returns Promise resolving to true if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  /**
   * Checks if an element is enabled (not disabled).
   * @param selector - CSS selector of the element
   * @returns Promise resolving to true if element is enabled
   */
  async isElementEnabled(selector: string): Promise<boolean> {
    return await this.page.isEnabled(selector);
  }

  /**
   * Checks if a checkbox or radio button is checked.
   * @param selector - CSS selector of the element
   * @returns Promise resolving to true if element is checked
   */
  async isElementChecked(selector: string): Promise<boolean> {
    return await this.page.isChecked(selector);
  }

  /**
   * Clicks on an element.
   * @param selector - CSS selector of the element to click
   * @param options - Optional click options (force, timeout)
   */
  async clickElement(selector: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    await this.page.click(selector, options);
  }

  /**
   * Double-clicks on an element.
   * @param selector - CSS selector of the element to double-click
   */
  async doubleClickElement(selector: string): Promise<void> {
    await this.page.dblclick(selector);
  }

  /**
   * Right-clicks on an element (context menu click).
   * @param selector - CSS selector of the element to right-click
   */
  async rightClickElement(selector: string): Promise<void> {
    await this.page.click(selector, { button: 'right' });
  }

  /**
   * Hovers the mouse over an element.
   * @param selector - CSS selector of the element to hover
   */
  async hoverElement(selector: string): Promise<void> {
    await this.page.hover(selector);
  }

  /**
   * Fills an input field with the specified value.
   * @param selector - CSS selector of the input element
   * @param value - The value to fill in the input
   */
  async fillInput(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  /**
   * Types text character by character into an element.
   * @param selector - CSS selector of the element
   * @param text - The text to type
   * @param delay - Optional delay between keystrokes in milliseconds
   */
  async typeText(selector: string, text: string, delay?: number): Promise<void> {
    await this.page.type(selector, text, { delay });
  }

  /**
   * Clears the content of an input field.
   * @param selector - CSS selector of the input element
   */
  async clearInput(selector: string): Promise<void> {
    await this.page.fill(selector, '');
  }

  /**
   * Selects an option from a dropdown/select element.
   * @param selector - CSS selector of the select element
   * @param value - The value of the option to select
   */
  async selectDropdownOption(selector: string, value: string): Promise<void> {
    await this.page.selectOption(selector, value);
  }

  /**
   * Checks a checkbox element.
   * @param selector - CSS selector of the checkbox element
   */
  async checkCheckbox(selector: string): Promise<void> {
    await this.page.check(selector);
  }

  /**
   * Unchecks a checkbox element.
   * @param selector - CSS selector of the checkbox element
   */
  async uncheckCheckbox(selector: string): Promise<void> {
    await this.page.uncheck(selector);
  }

  /**
   * Uploads a file to an input element.
   * @param selector - CSS selector of the file input element
   * @param filePath - Path to the file to upload
   */
  async uploadFile(selector: string, filePath: string): Promise<void> {
    await this.page.setInputFiles(selector, filePath);
  }

  /**
   * Waits for the URL to match the specified value.
   * @param url - The URL to wait for
   * @param timeout - Maximum time to wait in milliseconds (default: 30000)
   */
  async waitForURL(url: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }

  /**
   * Waits for the URL to contain the specified fragment.
   * @param urlFragment - The URL fragment to wait for
   * @param timeout - Maximum time to wait in milliseconds (default: 30000)
   */
  async waitForURLContains(urlFragment: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForURL(`**${urlFragment}**`, { timeout });
  }

  /**
   * Gets the current URL of the page.
   * @returns Promise resolving to the current URL
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Gets the title of the current page.
   * @returns Promise resolving to the page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Navigates to the specified URL.
   * @param url - The URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Reloads the current page.
   */
  async reloadPage(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Navigates to the previous page in browser history.
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Navigates to the next page in browser history.
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   * Takes a screenshot of the page or element.
   * @param fileName - Path where the screenshot will be saved
   * @param options - Screenshot options (fullPage)
   * @returns Promise resolving to the screenshot buffer
   */
  async takeScreenshot(fileName: string, options?: { fullPage?: boolean }): Promise<Buffer> {
    return await this.page.screenshot({ 
      path: fileName, 
      fullPage: options?.fullPage || false 
    });
  }

  /**
   * Pauses execution for the specified amount of time.
   * @param ms - Time to wait in milliseconds
   */
  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Presses a keyboard key.
   * @param key - The key to press (e.g., 'Enter', 'Escape', 'ArrowDown')
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Scrolls an element into view if it's not visible.
   * @param selector - CSS selector of the element to scroll
   */
  async scrollElementIntoView(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Scrolls the page to the top.
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scrolls the page to the bottom.
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Gets a Playwright Locator object for the specified selector.
   * @param selector - CSS selector
   * @returns Promise resolving to a Locator object
   */
  async getLocator(selector: string): Promise<Locator> {
    return this.page.locator(selector);
  }

  /**
   * Counts the number of elements matching the selector.
   * @param selector - CSS selector to count
   * @returns Promise resolving to the element count
   */
  async countElements(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  /**
   * Gets the text content of all elements matching the selector.
   * @param selector - CSS selector to match
   * @returns Promise resolving to an array of text contents
   */
  async getAllElementTexts(selector: string): Promise<string[]> {
    return await this.page.locator(selector).allTextContents();
  }

  /**
   * Executes JavaScript code in the page context.
   * @param script - The JavaScript function to execute
   * @returns Promise resolving to the script's return value
   */
  async executeScript<T>(script: () => T): Promise<T> {
    return await this.page.evaluate(script);
  }

  /**
   * Accepts any alert/dialog that appears on the page.
   * Note: This should be called before the action that triggers the alert.
   */
  async acceptAlert(): Promise<void> {
    await this.page.on('dialog', async dialog => {
      await dialog.accept();
    });
  }

  /**
   * Dismisses any alert/dialog that appears on the page.
   * Note: This should be called before the action that triggers the alert.
   */
  async dismissAlert(): Promise<void> {
    await this.page.on('dialog', async dialog => {
      await dialog.dismiss();
    });
  }

  /**
   * Switches to a specific browser tab by index.
   * @param tabIndex - Zero-based index of the tab to switch to
   */
  async switchToTab(tabIndex: number): Promise<void> {
    const pages = await this.page.context().pages();
    if (pages[tabIndex]) {
      await pages[tabIndex].bringToFront();
    }
  }

  /**
   * Opens a new browser tab.
   * @returns Promise resolving to the new Page object
   */
  async openNewTab(): Promise<Page> {
    return await this.page.context().newPage();
  }

  /**
   * Closes the current browser tab.
   */
  async closeCurrentTab(): Promise<void> {
    await this.page.close();
  }
}
