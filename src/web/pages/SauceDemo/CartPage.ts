import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CartPage extends BasePage {
  readonly page: Page;

  // Locators
  private readonly cartTitle: Locator;
  private readonly cartItems: Locator;
  private readonly itemName: Locator;
  private readonly itemPrice: Locator;
  private readonly itemQuantity: Locator;
  private readonly removeButton: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    
    // Inicializar locators
    this.cartTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.itemName = page.locator('.inventory_item_name');
    this.itemPrice = page.locator('.inventory_item_price');
    this.itemQuantity = page.locator('.cart_quantity');
    this.removeButton = page.locator('[data-test^="remove-"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  // Métodos específicos de la página
  async waitForPageToLoad(): Promise<void> {
    await this.cartTitle.waitFor({ state: 'visible' });
    await this.waitForURLContains('cart.html');
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getAllCartItems(): Promise<string[]> {
    return await this.itemName.allTextContents();
  }

  async isItemInCart(itemName: string): Promise<boolean> {
    const cartItem = this.cartItems.filter({ hasText: itemName });
    return await cartItem.isVisible();
  }

  async getItemPrice(itemName: string): Promise<string> {
    const cartItem = this.cartItems.filter({ hasText: itemName });
    return await cartItem.locator('.inventory_item_price').textContent() || '';
  }

  async getItemQuantity(itemName: string): Promise<string> {
    const cartItem = this.cartItems.filter({ hasText: itemName });
    return await cartItem.locator('.cart_quantity').textContent() || '';
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    const cartItem = this.cartItems.filter({ hasText: itemName });
    await cartItem.locator('[data-test^="remove-"]').click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async isCartEmpty(): Promise<boolean> {
    return (await this.getCartItemCount()) === 0;
  }

  async isCheckoutButtonVisible(): Promise<boolean> {
    return await this.checkoutButton.isVisible();
  }

  async isContinueShoppingButtonVisible(): Promise<boolean> {
    return await this.continueShoppingButton.isVisible();
  }
}
