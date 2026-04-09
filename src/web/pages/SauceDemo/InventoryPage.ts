import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class InventoryPage extends BasePage {
  readonly page: Page;

  // Locators
  private readonly productTitle: Locator;
  private readonly productItems: Locator;
  private readonly productName: Locator;
  private readonly productPrice: Locator;
  private readonly productDescription: Locator;
  private readonly addToCartButton: Locator;
  private readonly removeButton: Locator;
  private readonly shoppingCartBadge: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly sortDropdown: Locator;
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    
    // Inicializar locators
    this.productTitle = page.locator('.title');
    this.productItems = page.locator('.inventory_item');
    this.productName = page.locator('.inventory_item_name');
    this.productPrice = page.locator('.inventory_item_price');
    this.productDescription = page.locator('.inventory_item_desc');
    this.addToCartButton = page.locator('[data-test^="add-to-cart-"]');
    this.removeButton = page.locator('[data-test^="remove-"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  // Métodos específicos de la página
  async waitForPageToLoad(): Promise<void> {
    await this.productTitle.waitFor({ state: 'visible' });
    await this.waitForURLContains('inventory.html');
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async getAllProductNames(): Promise<string[]> {
    return await this.productName.allTextContents();
  }

  async getAllProductPrices(): Promise<string[]> {
    return await this.productPrice.allTextContents();
  }

  async addProductToCart(productName: string): Promise<void> {
    const productItem = this.productItems.filter({ hasText: productName });
    await productItem.waitFor({ state: 'visible' });
    await productItem.locator('[data-test^="add-to-cart-"]').click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const productItem = this.productItems.filter({ hasText: productName });
    await productItem.locator('[data-test^="remove-"]').click();
  }

  async getCartBadgeCount(): Promise<string> {
    if (await this.shoppingCartBadge.isVisible()) {
      return await this.shoppingCartBadge.textContent() || '0';
    }
    return '0';
  }

  async navigateToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async sortProducts(sortOption: string): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
  }

  async isProductDisplayed(productName: string): Promise<boolean> {
    const productItem = this.productItems.filter({ hasText: productName });
    return await productItem.isVisible();
  }

  async getProductPrice(productName: string): Promise<string> {
    const productItem = this.productItems.filter({ hasText: productName });
    return await productItem.locator('.inventory_item_price').textContent() || '';
  }

  async getProductDescription(productName: string): Promise<string> {
    const productItem = this.productItems.filter({ hasText: productName });
    return await productItem.locator('.inventory_item_desc').textContent() || '';
  }

  async isAddToCartButtonVisible(productName: string): Promise<boolean> {
    const productItem = this.productItems.filter({ hasText: productName });
    return await productItem.locator('[data-test^="add-to-cart-"]').isVisible();
  }

  async isRemoveButtonVisible(productName: string): Promise<boolean> {
    const productItem = this.productItems.filter({ hasText: productName });
    return await productItem.locator('[data-test^="remove-"]').isVisible();
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
  }
}
