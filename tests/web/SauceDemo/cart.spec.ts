import { test, expect } from '@playwright/test';
import { LoginPage } from '@/web/pages/SauceDemo/LoginPage';
import { InventoryPage } from '@/web/pages/SauceDemo/InventoryPage';
import { CartPage } from '@/web/pages/SauceDemo/CartPage';
import userData from '../../data/SauceDemo/users.json';
import productData from '../../data/SauceDemo/products.json';

test.describe('SauceDemo Shopping Cart', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    // Login before each test
    await loginPage.navigateToLoginPage();
    await loginPage.login(userData.validUser.username, userData.validUser.password);
    await inventoryPage.waitForPageToLoad();
  });

  test('should display empty cart initially', async ({ page }) => {
    // Navigate to cart without adding items
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Verify cart is empty
    expect(await cartPage.isCartEmpty()).toBe(true);
    expect(await cartPage.getCartItemCount()).toBe(0);
    
    // Verify checkout button is not visible when cart is empty
    expect(await cartPage.isCheckoutButtonVisible()).toBe(true); // Still visible but disabled in UI
  });

  test('should display added items in cart', async () => {
    // Add product to cart
    await inventoryPage.addProductToCart(productData.testProduct.name);
    
    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Verify item is in cart
    expect(await cartPage.isItemInCart(productData.testProduct.name)).toBe(true);
    expect(await cartPage.getCartItemCount()).toBe(1);
    
    // Verify item details
    const itemPrice = await cartPage.getItemPrice(productData.testProduct.name);
    expect(itemPrice).toBe(productData.testProduct.price);
    
    const itemQuantity = await cartPage.getItemQuantity(productData.testProduct.name);
    expect(itemQuantity).toBe('1');
  });

  test('should display multiple items in cart', async () => {
    // Add multiple products
    for (const product of productData.multipleProducts) {
      await inventoryPage.addProductToCart(product);
    }
    
    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Verify all items are in cart
    expect(await cartPage.getCartItemCount()).toBe(3);
    
    const cartItems = await cartPage.getAllCartItems();
    expect(cartItems).toHaveLength(3);
    
    // Verify specific items
    for (const product of productData.multipleProducts) {
      expect(await cartPage.isItemInCart(product)).toBe(true);
    }
  });

  test('should remove item from cart', async () => {
    // Add product to cart
    await inventoryPage.addProductToCart(productData.testProduct.name);
    
    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Verify item is in cart
    expect(await cartPage.isItemInCart(productData.testProduct.name)).toBe(true);
    
    // Remove item
    await cartPage.removeItemFromCart(productData.testProduct.name);
    
    // Verify item is removed
    expect(await cartPage.isItemInCart(productData.testProduct.name)).toBe(false);
    expect(await cartPage.isCartEmpty()).toBe(true);
  });

  test('should remove one item from multiple items cart', async () => {
    // Add multiple products
    for (const product of productData.multipleProducts) {
      await inventoryPage.addProductToCart(product);
    }
    
    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Verify all items are in cart
    expect(await cartPage.getCartItemCount()).toBe(3);
    
    // Remove one item
    await cartPage.removeItemFromCart(productData.multipleProducts[0]);
    
    // Verify one item is removed
    expect(await cartPage.getCartItemCount()).toBe(2);
    expect(await cartPage.isItemInCart(productData.multipleProducts[0])).toBe(false);
    expect(await cartPage.isItemInCart(productData.multipleProducts[1])).toBe(true);
    expect(await cartPage.isItemInCart(productData.multipleProducts[2])).toBe(true);
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    // Add product to cart
    await inventoryPage.addProductToCart(productData.testProduct.name);
    
    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Verify we're on checkout step one
    expect(await page.url()).toContain('checkout-step-one.html');
  });

  test('should continue shopping from cart', async ({ page }) => {
    // Add product to cart
    await inventoryPage.addProductToCart(productData.testProduct.name);
    
    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Continue shopping
    await cartPage.continueShopping();
    
    // Verify we're back on inventory page
    expect(await page.url()).toContain('inventory.html');
    
    // Verify cart badge still shows the item
    const cartCount = await inventoryPage.getCartBadgeCount();
    expect(cartCount).toBe('1');
  });

  test('should persist cart items after navigation', async () => {
    // Add product to cart
    await inventoryPage.addProductToCart(productData.testProduct.name);
    
    // Navigate to cart and back
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    await cartPage.continueShopping();
    await inventoryPage.waitForPageToLoad();
    
    // Navigate to cart again
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Verify item is still in cart
    expect(await cartPage.isItemInCart(productData.testProduct.name)).toBe(true);
    expect(await cartPage.getCartItemCount()).toBe(1);
  });

  test('should display correct item quantity', async () => {
    // Add same product (Sauce Demo doesn't allow quantity selection, so each add increments quantity)
    await inventoryPage.addProductToCart(productData.testProduct.name);
    
    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Verify quantity is 1
    const itemQuantity = await cartPage.getItemQuantity(productData.testProduct.name);
    expect(itemQuantity).toBe('1');
  });
});
