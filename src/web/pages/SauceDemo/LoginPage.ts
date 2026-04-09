import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class LoginPage extends BasePage {
  readonly page: Page;

  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly acceptedUsernamesHeader: Locator;
  private readonly passwordHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    
    // Inicializar locators
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.acceptedUsernamesHeader = page.locator('h4:has-text("Accepted usernames are:")');
    this.passwordHeader = page.locator('h4:has-text("Password for all users:")');
  }

  // Métodos específicos de la página
  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo('https://www.saucedemo.com/');
    await this.waitForPageLoad();
  }

  async login(username: string, password: string): Promise<void> {
    await this.waitForElementToBeVisible(this.usernameInput);
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForElementToBeVisible(this.errorMessage);
    return await this.getElementText(this.errorMessage);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  async areCredentialsInfoVisible(): Promise<boolean> {
    const usernamesVisible = await this.isElementVisible(this.acceptedUsernamesHeader);
    const passwordVisible = await this.isElementVisible(this.passwordHeader);
    return usernamesVisible && passwordVisible;
  }

  async waitForLoginSuccess(): Promise<void> {
    await this.waitForURLContains('inventory.html');
  }

  async waitForLoginFailure(): Promise<void> {
    await this.waitForElementToBeVisible(this.errorMessage);
  }
}
