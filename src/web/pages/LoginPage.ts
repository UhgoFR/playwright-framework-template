import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for login page functionality.
 * This class encapsulates all interactions with the login page,
 * including form filling, validation, and navigation.
 * 
 * Extend this class or modify selectors to match your application's login page.
 */
export class LoginPage extends BasePage {
  // Selectors - Update these to match your application's selectors
  private readonly usernameInput = '#username';
  private readonly passwordInput = '#password';
  private readonly loginButton = '#login-button';
  private readonly errorMessage = '.error-message';
  private readonly successMessage = '.success-message';
  private readonly rememberMeCheckbox = '#remember-me';
  private readonly forgotPasswordLink = '#forgot-password';
  private readonly createAccountLink = '#create-account';

  /**
   * Creates an instance of LoginPage.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigates to the login page.
   */
  async navigateToLogin(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
  }

  /**
   * Performs login with the provided credentials.
   * @param username - The username to enter
   * @param password - The password to enter
   * @param rememberMe - Whether to check the remember me checkbox (default: false)
   */
  async login(username: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.waitForElementToBeVisible(this.usernameInput);
    await this.fillInput(this.usernameInput, username);
    
    await this.waitForElementToBeVisible(this.passwordInput);
    await this.fillInput(this.passwordInput, password);

    if (rememberMe) {
      await this.checkCheckbox(this.rememberMeCheckbox);
    }

    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Gets the current value of the username input field.
   * @returns Promise resolving to the username value
   */
  async getUsername(): Promise<string> {
    return await this.getElementAttribute(this.usernameInput, 'value') || '';
  }

  /**
   * Gets the current value of the password input field.
   * @returns Promise resolving to the password value
   */
  async getPassword(): Promise<string> {
    return await this.getElementAttribute(this.passwordInput, 'value') || '';
  }

  /**
   * Checks if the remember me checkbox is checked.
   * @returns Promise resolving to true if checked
   */
  async isRememberMeChecked(): Promise<boolean> {
    return await this.isElementChecked(this.rememberMeCheckbox);
  }

  /**
   * Clicks the forgot password link.
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
    await this.waitForPageLoad();
  }

  /**
   * Clicks the create account link.
   */
  async clickCreateAccount(): Promise<void> {
    await this.clickElement(this.createAccountLink);
    await this.waitForPageLoad();
  }

  /**
   * Gets the error message text if visible.
   * @returns Promise resolving to the error message or empty string
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getElementText(this.errorMessage);
    }
    return '';
  }

  /**
   * Gets the success message text if visible.
   * @returns Promise resolving to the success message or empty string
   */
  async getSuccessMessage(): Promise<string> {
    if (await this.isElementVisible(this.successMessage)) {
      return await this.getElementText(this.successMessage);
    }
    return '';
  }

  /**
   * Checks if the login button is enabled.
   * @returns Promise resolving to true if enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.loginButton);
  }

  /**
   * Waits for the login button to become enabled.
   */
  async waitForLoginButtonToBeEnabled(): Promise<void> {
    await this.page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector) as HTMLButtonElement;
        return element && element.disabled === false;
      },
      this.loginButton
    );
  }

  /**
   * Clears all form fields in the login form.
   */
  async clearLoginForm(): Promise<void> {
    await this.clearInput(this.usernameInput);
    await this.clearInput(this.passwordInput);
    if (await this.isElementChecked(this.rememberMeCheckbox)) {
      await this.uncheckCheckbox(this.rememberMeCheckbox);
    }
  }

  /**
   * Presses Enter key on the password field to submit the form.
   */
  async pressEnterOnPassword(): Promise<void> {
    await this.page.press(this.passwordInput, 'Enter');
    await this.waitForPageLoad();
  }

  /**
   * Presses Tab key on the username field to move to the next field.
   */
  async pressTabOnUsername(): Promise<void> {
    await this.page.press(this.usernameInput, 'Tab');
  }

  /**
   * Checks if the login form is visible and interactive.
   * @returns Promise resolving to true if form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.usernameInput) &&
           await this.isElementVisible(this.passwordInput) &&
           await this.isElementVisible(this.loginButton);
  }

  /**
   * Waits for all login form elements to be visible.
   */
  async waitForLoginForm(): Promise<void> {
    await this.waitForElementToBeVisible(this.usernameInput);
    await this.waitForElementToBeVisible(this.passwordInput);
    await this.waitForElementToBeVisible(this.loginButton);
  }

  /**
   * Gets the text content of the login button.
   * @returns Promise resolving to the button text
   */
  async getLoginButtonText(): Promise<string> {
    return await this.getElementText(this.loginButton);
  }

  /**
   * Gets the placeholder text of the username input field.
   * @returns Promise resolving to the placeholder text
   */
  async getUsernamePlaceholder(): Promise<string> {
    return await this.getElementAttribute(this.usernameInput, 'placeholder') || '';
  }

  /**
   * Gets the placeholder text of the password input field.
   * @returns Promise resolving to the placeholder text
   */
  async getPasswordPlaceholder(): Promise<string> {
    return await this.getElementAttribute(this.passwordInput, 'placeholder') || '';
  }

  /**
   * Checks if the password field is masked (input type="password").
   * @returns Promise resolving to true if password is masked
   */
  async isPasswordMasked(): Promise<boolean> {
    const inputType = await this.getElementAttribute(this.passwordInput, 'type');
    return inputType === 'password';
  }

  /**
   * Validates that the login form is in a proper state.
   * @returns Promise resolving to true if form is valid
   */
  async validateLoginForm(): Promise<boolean> {
    return await this.isLoginFormVisible() &&
           await this.isLoginButtonEnabled() &&
           await this.isPasswordMasked();
  }

  /**
   * Performs a complete login operation with optional navigation and validation.
   * @param credentials - Login credentials and options
   */
  async performLogin(credentials: {
    username: string;
    password: string;
    rememberMe?: boolean;
    waitForNavigation?: boolean;
    expectedUrl?: string;
  }): Promise<void> {
    await this.login(credentials.username, credentials.password, credentials.rememberMe);
    
    if (credentials.waitForNavigation) {
      await this.waitForPageLoad();
    }
    
    if (credentials.expectedUrl) {
      await this.waitForURLContains(credentials.expectedUrl);
    }
  }
}
