import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class LoginPage extends BasePage {
  readonly page: Page;

  // Selectores
  private readonly usernameInput = '[data-test="username"]';
  private readonly passwordInput = '[data-test="password"]';
  private readonly loginButton = '[data-test="login-button"]';
  private readonly errorMessage = '[data-test="error"]';
  private readonly acceptedUsernamesHeader = 'h4:has-text("Accepted usernames are:")';
  private readonly passwordHeader = 'h4:has-text("Password for all users:")';

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  // Métodos específicos de la página
  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo('https://www.saucedemo.com/');
    await this.waitForPageLoad();
  }

  async login(username: string, password: string): Promise<void> {
    await this.waitForElement(this.usernameInput);
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
