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
   * @param selector - CSS selector or Locator of the element to wait for
   * @param timeout - Maximum time to wait in milliseconds (default: 10000)
   */
  async waitForElement(selector: string | Locator, timeout: number = 10000): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.waitForSelector(selector, { timeout });
    } else {
      await selector.waitFor({ state: 'attached', timeout });
    }
  }

  /**
   * Waits for an element to become visible on the page.
   * @param selector - CSS selector or Locator of the element to wait for
   * @param timeout - Maximum time to wait in milliseconds (default: 10000)
   */
  async waitForElementToBeVisible(selector: string | Locator, timeout: number = 10000): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.waitForSelector(selector, { state: 'visible', timeout });
    } else {
      await selector.waitFor({ state: 'visible', timeout });
    }
  }

  /**
   * Waits for an element to become hidden on the page.
   * @param selector - CSS selector or Locator of the element to wait for
   * @param timeout - Maximum time to wait in milliseconds (default: 10000)
   */
  async waitForElementToBeHidden(selector: string | Locator, timeout: number = 10000): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.waitForSelector(selector, { state: 'hidden', timeout });
    } else {
      await selector.waitFor({ state: 'hidden', timeout });
    }
  }

  /**
   * Gets the text content of an element.
   * @param selector - CSS selector or Locator of the element
   * @returns Promise resolving to the element's text content
   */
  async getElementText(selector: string | Locator): Promise<string> {
    if (typeof selector === 'string') {
      return await this.page.textContent(selector) || '';
    } else {
      return await selector.textContent() || '';
    }
  }

  /**
   * Gets the inner text of an element (includes text from child elements).
   * @param selector - CSS selector or Locator of the element
   * @returns Promise resolving to the element's inner text
   */
  async getElementInnerText(selector: string | Locator): Promise<string> {
    if (typeof selector === 'string') {
      return await this.page.innerText(selector);
    } else {
      return await selector.innerText();
    }
  }

  /**
   * Gets the value of an element's attribute.
   * @param selector - CSS selector or Locator of the element
   * @param attribute - Name of the attribute to get
   * @returns Promise resolving to the attribute value or null if not found
   */
  async getElementAttribute(selector: string | Locator, attribute: string): Promise<string | null> {
    if (typeof selector === 'string') {
      return await this.page.getAttribute(selector, attribute);
    } else {
      return await selector.getAttribute(attribute);
    }
  }

  /**
   * Checks if an element is visible on the page.
   * @param selector - CSS selector or Locator of the element
   * @returns Promise resolving to true if element is visible
   */
  async isElementVisible(selector: string | Locator): Promise<boolean> {
    if (typeof selector === 'string') {
      return await this.page.isVisible(selector);
    } else {
      return await selector.isVisible();
    }
  }

  /**
   * Checks if an element is enabled (not disabled).
   * @param selector - CSS selector or Locator of the element
   * @returns Promise resolving to true if element is enabled
   */
  async isElementEnabled(selector: string | Locator): Promise<boolean> {
    if (typeof selector === 'string') {
      return await this.page.isEnabled(selector);
    } else {
      return await selector.isEnabled();
    }
  }

  /**
   * Checks if a checkbox or radio button is checked.
   * @param selector - CSS selector or Locator of the element
   * @returns Promise resolving to true if element is checked
   */
  async isElementChecked(selector: string | Locator): Promise<boolean> {
    if (typeof selector === 'string') {
      return await this.page.isChecked(selector);
    } else {
      return await selector.isChecked();
    }
  }

  /**
   * Clicks on an element.
   * @param selector - CSS selector or Locator of the element to click
   * @param options - Optional click options (force, timeout)
   */
  async clickElement(selector: string | Locator, options?: { force?: boolean; timeout?: number }): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.click(selector, options);
    } else {
      await selector.click(options);
    }
  }

  /**
   * Double-clicks on an element.
   * @param selector - CSS selector or Locator of the element to double-click
   */
  async doubleClickElement(selector: string | Locator): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.dblclick(selector);
    } else {
      await selector.dblclick();
    }
  }

  /**
   * Right-clicks on an element (context menu click).
   * @param selector - CSS selector or Locator of the element to right-click
   */
  async rightClickElement(selector: string | Locator): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.click(selector, { button: 'right' });
    } else {
      await selector.click({ button: 'right' });
    }
  }

  /**
   * Hovers the mouse over an element.
   * @param selector - CSS selector or Locator of the element to hover
   */
  async hoverElement(selector: string | Locator): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.hover(selector);
    } else {
      await selector.hover();
    }
  }

  /**
   * Fills an input field with the specified value.
   * @param selector - CSS selector or Locator of the input element
   * @param value - The value to fill in the input
   */
  async fillInput(selector: string | Locator, value: string): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.fill(selector, value);
    } else {
      await selector.fill(value);
    }
  }

  /**
   * Types text character by character into an element.
   * @param selector - CSS selector or Locator of the element
   * @param text - The text to type
   * @param delay - Optional delay between keystrokes in milliseconds
   */
  async typeText(selector: string | Locator, text: string, delay?: number): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.type(selector, text, { delay });
    } else {
      await selector.type(text, { delay });
    }
  }

  /**
   * Clears the content of an input field.
   * @param selector - CSS selector or Locator of the input element
   */
  async clearInput(selector: string | Locator): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.fill(selector, '');
    } else {
      await selector.fill('');
    }
  }

  /**
   * Selects an option from a dropdown/select element.
   * @param selector - CSS selector or Locator of the select element
   * @param value - The value of the option to select
   */
  async selectDropdownOption(selector: string | Locator, value: string): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.selectOption(selector, value);
    } else {
      await selector.selectOption(value);
    }
  }

  /**
   * Checks a checkbox element.
   * @param selector - CSS selector or Locator of the checkbox element
   */
  async checkCheckbox(selector: string | Locator): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.check(selector);
    } else {
      await selector.check();
    }
  }

  /**
   * Unchecks a checkbox element.
   * @param selector - CSS selector or Locator of the checkbox element
   */
  async uncheckCheckbox(selector: string | Locator): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.uncheck(selector);
    } else {
      await selector.uncheck();
    }
  }

  /**
   * Uploads a file to an input element.
   * @param selector - CSS selector or Locator of the file input element
   * @param filePath - Path to the file to upload
   */
  async uploadFile(selector: string | Locator, filePath: string): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.setInputFiles(selector, filePath);
    } else {
      await selector.setInputFiles(filePath);
    }
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
   * @param selector - CSS selector or Locator of the element to scroll
   */
  async scrollElementIntoView(selector: string | Locator): Promise<void> {
    if (typeof selector === 'string') {
      await this.page.locator(selector).scrollIntoViewIfNeeded();
    } else {
      await selector.scrollIntoViewIfNeeded();
    }
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
   * @param selector - CSS selector or Locator to count
   * @returns Promise resolving to the element count
   */
  async countElements(selector: string | Locator): Promise<number> {
    if (typeof selector === 'string') {
      return await this.page.locator(selector).count();
    } else {
      return await selector.count();
    }
  }

  /**
   * Gets the text content of all elements matching the selector.
   * @param selector - CSS selector or Locator to match
   * @returns Promise resolving to an array of text contents
   */
  async getAllElementTexts(selector: string | Locator): Promise<string[]> {
    if (typeof selector === 'string') {
      return await this.page.locator(selector).allTextContents();
    } else {
      return await selector.allTextContents();
    }
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
