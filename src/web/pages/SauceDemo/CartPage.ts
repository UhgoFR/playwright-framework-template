import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CartPage extends BasePage {
  readonly page: Page;

  // Selectores
  private readonly cartTitle = '.title';
  private readonly cartItems = '.cart_item';
  private readonly itemName = '.inventory_item_name';
  private readonly itemPrice = '.inventory_item_price';
  private readonly itemQuantity = '.cart_quantity';
  private readonly removeButton = '[data-test^="remove-"]';
  private readonly continueShoppingButton = '[data-test="continue-shopping"]';
  private readonly checkoutButton = '[data-test="checkout"]';

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  // Métodos específicos de la página
  async waitForPageToLoad(): Promise<void> {
    await this.waitForElementToBeVisible(this.cartTitle);
    await this.waitForURLContains('cart.html');
  }

  async getCartItemCount(): Promise<number> {
    return await this.countElements(this.cartItems);
  }

  async getAllCartItems(): Promise<string[]> {
    return await this.getAllElementTexts(this.itemName);
  }

  async isItemInCart(itemName: string): Promise<boolean> {
    const itemSelector = `${this.cartItems}:has-text("${itemName}")`;
    return await this.isElementVisible(itemSelector);
  }

  async getItemPrice(itemName: string): Promise<string> {
    const itemSelector = `${this.cartItems}:has-text("${itemName}")`;
    const priceSelector = `${itemSelector} ${this.itemPrice}`;
    return await this.getElementText(priceSelector);
  }

  async getItemQuantity(itemName: string): Promise<string> {
    const itemSelector = `${this.cartItems}:has-text("${itemName}")`;
    const quantitySelector = `${itemSelector} ${this.itemQuantity}`;
    return await this.getElementText(quantitySelector);
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    const itemSelector = `${this.cartItems}:has-text("${itemName}")`;
    const removeSelector = `${itemSelector} ${this.removeButton}`;
    await this.clickElement(removeSelector);
  }

  async continueShopping(): Promise<void> {
    await this.clickElement(this.continueShoppingButton);
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickElement(this.checkoutButton);
  }

  async isCartEmpty(): Promise<boolean> {
    return (await this.getCartItemCount()) === 0;
  }

  async isCheckoutButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.checkoutButton);
  }

  async isContinueShoppingButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.continueShoppingButton);
  }
}
