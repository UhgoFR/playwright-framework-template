import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CheckoutPage extends BasePage {
  readonly page: Page;

  // Locators
  private readonly checkoutTitle: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;
  private readonly finishButton: Locator;
  private readonly overviewTitle: Locator;
  private readonly completeTitle: Locator;
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    
    // Inicializar locators
    this.checkoutTitle = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.overviewTitle = page.locator('.title', { hasText: 'Checkout: Overview' });
    this.completeTitle = page.locator('.title', { hasText: 'Checkout: Complete!' });
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  // Métodos específicos de la página - Step One (Information)
  async waitForCheckoutStepOne(): Promise<void> {
    await this.checkoutTitle.waitFor({ state: 'visible' });
    await this.firstNameInput.waitFor({ state: 'visible' });
    await this.waitForURLContains('checkout-step-one.html');
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToStepTwo(): Promise<void> {
    await this.continueButton.click();
  }

  async cancelCheckout(): Promise<void> {
    await this.cancelButton.click();
  }

  async getErrorMessage(): Promise<string> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent() || '';
    }
    return '';
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  // Métodos específicos de la página - Step Two (Overview)
  async waitForCheckoutStepTwo(): Promise<void> {
    await this.overviewTitle.waitFor({ state: 'visible' });
    await this.waitForURLContains('checkout-step-two.html');
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }

  async cancelFromStepTwo(): Promise<void> {
    await this.cancelButton.click();
  }

  // Métodos específicos de la página - Complete
  async waitForCheckoutComplete(): Promise<void> {
    await this.completeTitle.waitFor({ state: 'visible' });
    await this.waitForURLContains('checkout-complete.html');
  }

  async getCompleteMessage(): Promise<string> {
    return await this.completeHeader.textContent() || '';
  }

  async getCompleteText(): Promise<string> {
    return await this.completeText.textContent() || '';
  }

  async backToHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  // Métodos utilitarios
  async isCheckoutStepOne(): Promise<boolean> {
    return await this.firstNameInput.isVisible();
  }

  async isCheckoutStepTwo(): Promise<boolean> {
    return await this.finishButton.isVisible();
  }

  async isCheckoutComplete(): Promise<boolean> {
    return await this.completeHeader.isVisible();
  }
}
