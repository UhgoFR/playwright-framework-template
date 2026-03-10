import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class InventoryPage extends BasePage {
  readonly page: Page;

  // Selectores
  private readonly productTitle = '.title';
  private readonly productItems = '.inventory_item';
  private readonly productName = '.inventory_item_name';
  private readonly productPrice = '.inventory_item_price';
  private readonly productDescription = '.inventory_item_desc';
  private readonly addToCartButton = '[data-test^="add-to-cart-"]';
  private readonly removeButton = '[data-test^="remove-"]';
  private readonly shoppingCartBadge = '[data-test="shopping-cart-badge"]';
  private readonly shoppingCartLink = '[data-test="shopping-cart-link"]';
  private readonly sortDropdown = '[data-test="product-sort-container"]';
  private readonly menuButton = 'button:has-text("Open Menu")'; // #getByRole('button', { name: 'Open Menu' })
  private readonly logoutLink = '[data-test="logout-sidebar-link"]';

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  // Métodos específicos de la página
  async waitForPageToLoad(): Promise<void> {
    await this.waitForElementToBeVisible(this.productTitle);
    await this.waitForURLContains('inventory.html');
  }

  async getProductCount(): Promise<number> {
    return await this.countElements(this.productItems);
  }

  async getAllProductNames(): Promise<string[]> {
    return await this.getAllElementTexts(this.productName);
  }

  async getAllProductPrices(): Promise<string[]> {
    return await this.getAllElementTexts(this.productPrice);
  }

  async addProductToCart(productName: string): Promise<void> {
    const productSelector = `${this.productItems}:has-text("${productName}")`;
    await this.waitForElement(productSelector);
    const addToCartSelector = `${productSelector} ${this.addToCartButton}`;
    await this.clickElement(addToCartSelector);
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const productSelector = `${this.productItems}:has-text("${productName}")`;
    const removeSelector = `${productSelector} ${this.removeButton}`;
    await this.clickElement(removeSelector);
  }

  async getCartBadgeCount(): Promise<string> {
    if (await this.isElementVisible(this.shoppingCartBadge)) {
      return await this.getElementText(this.shoppingCartBadge);
    }
    return '0';
  }

  async navigateToCart(): Promise<void> {
    await this.clickElement(this.shoppingCartLink);
  }

  async sortProducts(sortOption: string): Promise<void> {
    await this.selectDropdownOption(this.sortDropdown, sortOption);
  }

  async isProductDisplayed(productName: string): Promise<boolean> {
    const productSelector = `${this.productItems}:has-text("${productName}")`;
    return await this.isElementVisible(productSelector);
  }

  async getProductPrice(productName: string): Promise<string> {
    const productSelector = `${this.productItems}:has-text("${productName}")`;
    const priceSelector = `${productSelector} ${this.productPrice}`;
    return await this.getElementText(priceSelector);
  }

  async getProductDescription(productName: string): Promise<string> {
    const productSelector = `${this.productItems}:has-text("${productName}")`;
    const descSelector = `${productSelector} ${this.productDescription}`;
    return await this.getElementText(descSelector);
  }

  async isAddToCartButtonVisible(productName: string): Promise<boolean> {
    const productSelector = `${this.productItems}:has-text("${productName}")`;
    const buttonSelector = `${productSelector} ${this.addToCartButton}`;
    return await this.isElementVisible(buttonSelector);
  }

  async isRemoveButtonVisible(productName: string): Promise<boolean> {
    const productSelector = `${this.productItems}:has-text("${productName}")`;
    const buttonSelector = `${productSelector} ${this.removeButton}`;
    return await this.isElementVisible(buttonSelector);
  }

  async openMenu(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.waitForElementToBeVisible(this.logoutLink);
    await this.clickElement(this.logoutLink);
  }
}
