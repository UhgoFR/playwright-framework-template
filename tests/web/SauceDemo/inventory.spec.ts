import { test, expect } from '@playwright/test';
import { LoginPage } from '@/web/pages/SauceDemo/LoginPage';
import { InventoryPage } from '@/web/pages/SauceDemo/InventoryPage';
import userData from '../../data/SauceDemo/users.json';
import productData from '../../data/SauceDemo/products.json';

test.describe('SauceDemo Inventory', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    
    // Login before each test
    await loginPage.navigateToLoginPage();
    await loginPage.login(userData.validUser.username, userData.validUser.password);
    await inventoryPage.waitForPageToLoad();
  });

  test('should display all products correctly', async () => {
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(6); // Sauce Demo has 6 products
    
    const productNames = await inventoryPage.getAllProductNames();
    expect(productNames).toHaveLength(6);
    
    // Verify specific products exist
    expect(productNames).toContain('Sauce Labs Backpack');
    expect(productNames).toContain('Sauce Labs Bike Light');
    expect(productNames).toContain('Sauce Labs Bolt T-Shirt');
  });

  test('should display product details correctly', async () => {
    const testProduct = productData.testProduct;
    
    // Verify product is displayed
    expect(await inventoryPage.isProductDisplayed(testProduct.name)).toBe(true);
    
    // Verify product price
    const price = await inventoryPage.getProductPrice(testProduct.name);
    expect(price).toBe(testProduct.price);
    
    // Verify product description exists and is not empty
    const description = await inventoryPage.getProductDescription(testProduct.name);
    expect(description).toBeTruthy();
    expect(description.length).toBeGreaterThan(0);
  });

  test('should add product to cart successfully', async () => {
    const testProduct = productData.testProduct;
    
    // Verify add to cart button is visible
    expect(await inventoryPage.isAddToCartButtonVisible(testProduct.name)).toBe(true);
    
    // Add product to cart
    await inventoryPage.addProductToCart(testProduct.name);
    
    // Verify cart badge count is updated
    const cartCount = await inventoryPage.getCartBadgeCount();
    expect(cartCount).toBe('1');
    
    // Verify remove button is now visible
    expect(await inventoryPage.isRemoveButtonVisible(testProduct.name)).toBe(true);
    
    // Verify add to cart button is no longer visible
    expect(await inventoryPage.isAddToCartButtonVisible(testProduct.name)).toBe(false);
  });

  test('should add multiple products to cart', async () => {
    const products = productData.multipleProducts;
    
    // Add multiple products
    for (const product of products) {
      await inventoryPage.addProductToCart(product);
    }
    
    // Verify cart badge count is updated
    const cartCount = await inventoryPage.getCartBadgeCount();
    expect(cartCount).toBe('3');
    
    // Verify all products have remove buttons
    for (const product of products) {
      expect(await inventoryPage.isRemoveButtonVisible(product)).toBe(true);
    }
  });

  test('should remove product from cart', async () => {
    const testProduct = productData.testProduct;
    
    // Add product first
    await inventoryPage.addProductToCart(testProduct.name);
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');
    
    // Remove product
    await inventoryPage.removeProductFromCart(testProduct.name);
    
    // Verify cart badge count is updated
    const cartCount = await inventoryPage.getCartBadgeCount();
    expect(cartCount).toBe('0');
    
    // Verify add to cart button is visible again
    expect(await inventoryPage.isAddToCartButtonVisible(testProduct.name)).toBe(true);
  });

  test('should navigate to cart page', async ({ page }) => {
    // Add a product first
    await inventoryPage.addProductToCart(productData.testProduct.name);
    
    // Navigate to cart
    await inventoryPage.navigateToCart();
    
    // Verify we're on cart page
    expect(await page.url()).toContain('cart.html');
  });

  test('should sort products by name (A to Z)', async () => {
    // Sort by name A to Z
    await inventoryPage.sortProducts('az');
    
    const productNames = await inventoryPage.getAllProductNames();
    const sortedNames = [...productNames].sort();
    
    expect(productNames).toEqual(sortedNames);
  });

  test('should sort products by name (Z to A)', async () => {
    // Sort by name Z to A
    await inventoryPage.sortProducts('za');
    
    const productNames = await inventoryPage.getAllProductNames();
    const sortedNames = [...productNames].sort().reverse();
    
    expect(productNames).toEqual(sortedNames);
  });

  test('should sort products by price (low to high)', async () => {
    // Sort by price low to high
    await inventoryPage.sortProducts('lohi');
    
    const productPrices = await inventoryPage.getAllProductPrices();
    const numericPrices = productPrices.map(price => parseFloat(price.replace('$', '')));
    const sortedPrices = [...numericPrices].sort((a, b) => a - b);
    
    expect(numericPrices).toEqual(sortedPrices);
  });

  test('should sort products by price (high to low)', async () => {
    // Sort by price high to low
    await inventoryPage.sortProducts('hilo');
    
    const productPrices = await inventoryPage.getAllProductPrices();
    const numericPrices = productPrices.map(price => parseFloat(price.replace('$', '')));
    const sortedPrices = [...numericPrices].sort((a, b) => b - a);
    
    expect(numericPrices).toEqual(sortedPrices);
  });

  test('should logout successfully', async ({ page }) => {
    await inventoryPage.logout();
    
    // Verify we're back on login page
    expect(await page.url()).toBe('https://www.saucedemo.com/');
    
    // Verify login form is visible
    expect(await loginPage.areCredentialsInfoVisible()).toBe(true);
  });
});
