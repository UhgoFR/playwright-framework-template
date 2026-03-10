import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CheckoutPage extends BasePage {
  readonly page: Page;

  // Selectores
  private readonly checkoutTitle = '.title';
  private readonly firstNameInput = '[data-test="firstName"]';
  private readonly lastNameInput = '[data-test="lastName"]';
  private readonly postalCodeInput = '[data-test="postalCode"]';
  private readonly continueButton = '[data-test="continue"]';
  private readonly cancelButton = '[data-test="cancel"]';
  private readonly errorMessage = '[data-test="error"]';
  private readonly finishButton = '[data-test="finish"]';
  private readonly overviewTitle = '.title:has-text("Checkout: Overview")';
  private readonly completeTitle = '.title:has-text("Checkout: Complete!")';
  private readonly completeHeader = '.complete-header';
  private readonly completeText = '.complete-text';
  private readonly backHomeButton = '[data-test="back-to-products"]';

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  // Métodos específicos de la página - Step One (Information)
  async waitForCheckoutStepOne(): Promise<void> {
    await this.waitForElementToBeVisible(this.checkoutTitle);
    await this.waitForElementToBeVisible(this.firstNameInput);
    await this.waitForURLContains('checkout-step-one.html');
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillInput(this.firstNameInput, firstName);
    await this.fillInput(this.lastNameInput, lastName);
    await this.fillInput(this.postalCodeInput, postalCode);
  }

  async continueToStepTwo(): Promise<void> {
    await this.clickElement(this.continueButton);
  }

  async cancelCheckout(): Promise<void> {
    await this.clickElement(this.cancelButton);
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getElementText(this.errorMessage);
    }
    return '';
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  // Métodos específicos de la página - Step Two (Overview)
  async waitForCheckoutStepTwo(): Promise<void> {
    await this.waitForElementToBeVisible(this.overviewTitle);
    await this.waitForURLContains('checkout-step-two.html');
  }

  async finishCheckout(): Promise<void> {
    await this.clickElement(this.finishButton);
  }

  async cancelFromStepTwo(): Promise<void> {
    await this.clickElement(this.cancelButton);
  }

  // Métodos específicos de la página - Complete
  async waitForCheckoutComplete(): Promise<void> {
    await this.waitForElementToBeVisible(this.completeTitle);
    await this.waitForURLContains('checkout-complete.html');
  }

  async getCompleteMessage(): Promise<string> {
    return await this.getElementText(this.completeHeader);
  }

  async getCompleteText(): Promise<string> {
    return await this.getElementText(this.completeText);
  }

  async backToHome(): Promise<void> {
    await this.clickElement(this.backHomeButton);
  }

  // Métodos utilitarios
  async isCheckoutStepOne(): Promise<boolean> {
    return await this.isElementVisible(this.firstNameInput);
  }

  async isCheckoutStepTwo(): Promise<boolean> {
    return await this.isElementVisible(this.finishButton);
  }

  async isCheckoutComplete(): Promise<boolean> {
    return await this.isElementVisible(this.completeHeader);
  }
}
