import { test, expect } from '@playwright/test';
import { LoginPage } from '@/web/pages/SauceDemo/LoginPage';
import { InventoryPage } from '@/web/pages/SauceDemo/InventoryPage';
import { CartPage } from '@/web/pages/SauceDemo/CartPage';
import { CheckoutPage } from '@/web/pages/SauceDemo/CheckoutPage';
import userData from '../../data/SauceDemo/users.json';
import productData from '../../data/SauceDemo/products.json';
import checkoutData from '../../data/SauceDemo/checkout.json';

test.describe('SauceDemo End-to-End Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('complete user journey from login to order confirmation', async ({ page }) => {
    // Step 1: Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(userData.validUser.username, userData.validUser.password);
    await loginPage.waitForLoginSuccess();
    
    // Step 2: Browse products and add to cart
    await inventoryPage.waitForPageToLoad();
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(6);
    
    // Add a product to cart
    await inventoryPage.addProductToCart(productData.testProduct.name);
    
    // Verify cart badge updated
    const cartCount = await inventoryPage.getCartBadgeCount();
    expect(cartCount).toBe('1');
    
    // Step 3: View cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Verify item in cart
    expect(await cartPage.isItemInCart(productData.testProduct.name)).toBe(true);
    expect(await cartPage.getItemPrice(productData.testProduct.name)).toBe(productData.testProduct.price);
    
    // Step 4: Checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutStepOne();
    
    // Fill shipping information
    await checkoutPage.fillCheckoutInformation(
      checkoutData.validCustomer.firstName,
      checkoutData.validCustomer.lastName,
      checkoutData.validCustomer.postalCode
    );
    
    await checkoutPage.continueToStepTwo();
    await checkoutPage.waitForCheckoutStepTwo();
    
    // Step 5: Complete order
    await checkoutPage.finishCheckout();
    await checkoutPage.waitForCheckoutComplete();
    
    // Verify order completion
    expect(await checkoutPage.getCompleteMessage()).toBe(checkoutData.successMessages.orderComplete);
    expect(await checkoutPage.getCompleteText()).toBe(checkoutData.successMessages.orderDispatched);
    
    // Step 6: Return to home
    await checkoutPage.backToHome();
    expect(await page.url()).toContain('inventory.html');
    
    // Step 7: Logout
    await inventoryPage.logout();
    expect(await page.url()).toBe('https://www.saucedemo.com/');
  });

  test('complete journey with multiple items', async ({ page }) => {
    // Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(userData.validUser.username, userData.validUser.password);
    await inventoryPage.waitForPageToLoad();
    
    // Add multiple products
    for (const product of productData.multipleProducts) {
      await inventoryPage.addProductToCart(product);
    }
    
    // Verify cart count
    const cartCount = await inventoryPage.getCartBadgeCount();
    expect(cartCount).toBe('3');
    
    // Navigate to cart and verify items
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    expect(await cartPage.getCartItemCount()).toBe(3);
    
    // Complete checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutStepOne();
    
    await checkoutPage.fillCheckoutInformation(
      checkoutData.validCustomer.firstName,
      checkoutData.validCustomer.lastName,
      checkoutData.validCustomer.postalCode
    );
    
    await checkoutPage.continueToStepTwo();
    await checkoutPage.waitForCheckoutStepTwo();
    
    await checkoutPage.finishCheckout();
    await checkoutPage.waitForCheckoutComplete();
    
    // Verify success
    expect(await checkoutPage.getCompleteMessage()).toBe(checkoutData.successMessages.orderComplete);
  });

  test('user journey with cart management', async ({ page }) => {
    // Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(userData.validUser.username, userData.validUser.password);
    await inventoryPage.waitForPageToLoad();
    
    // Add products
    await inventoryPage.addProductToCart(productData.multipleProducts[0]);
    await inventoryPage.addProductToCart(productData.multipleProducts[1]);
    
    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Remove one item
    await cartPage.removeItemFromCart(productData.multipleProducts[0]);
    expect(await cartPage.getCartItemCount()).toBe(1);
    
    // Continue shopping
    await cartPage.continueShopping();
    expect(await page.url()).toContain('inventory.html');
    
    // Add different product
    await inventoryPage.addProductToCart(productData.multipleProducts[2]);
    
    // Navigate to cart again
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    expect(await cartPage.getCartItemCount()).toBe(2);
    
    // Complete checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutStepOne();
    
    await checkoutPage.fillCheckoutInformation(
      checkoutData.validCustomer.firstName,
      checkoutData.validCustomer.lastName,
      checkoutData.validCustomer.postalCode
    );
    
    await checkoutPage.continueToStepTwo();
    await checkoutPage.waitForCheckoutStepTwo();
    
    await checkoutPage.finishCheckout();
    await checkoutPage.waitForCheckoutComplete();
    
    // Verify success and logout
    expect(await checkoutPage.getCompleteMessage()).toBe(checkoutData.successMessages.orderComplete);
    
    await checkoutPage.backToHome();
    await inventoryPage.logout();
  });

  test('failed login journey', async ({ page }) => {
    // Try to login with invalid credentials
    await loginPage.navigateToLoginPage();
    await loginPage.login(userData.invalidUser.username, userData.invalidUser.password);
    await loginPage.waitForLoginFailure();
    
    // Verify error message
    expect(await loginPage.isErrorMessageVisible()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain('Epic sadface');
    
    // Verify still on login page
    expect(await page.url()).toBe('https://www.saucedemo.com/');
    
    // Try valid login
    await loginPage.login(userData.validUser.username, userData.validUser.password);
    await loginPage.waitForLoginSuccess();
    
    // Verify successful login
    expect(await page.url()).toContain('inventory.html');
  });

  test('checkout cancellation journey', async ({ page }) => {
    // Login and add product
    await loginPage.navigateToLoginPage();
    await loginPage.login(userData.validUser.username, userData.validUser.password);
    await inventoryPage.waitForPageToLoad();
    
    await inventoryPage.addProductToCart(productData.testProduct.name);
    
    // Navigate to checkout
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutStepOne();
    
    // Fill information
    await checkoutPage.fillCheckoutInformation(
      checkoutData.validCustomer.firstName,
      checkoutData.validCustomer.lastName,
      checkoutData.validCustomer.postalCode
    );
    
    // Continue to overview
    await checkoutPage.continueToStepTwo();
    await checkoutPage.waitForCheckoutStepTwo();
    
    // Cancel checkout
    await checkoutPage.cancelFromStepTwo();
    
    // Verify back to inventory
    expect(await page.url()).toContain('inventory.html');
    
    // Verify cart still has item
    const cartCount = await inventoryPage.getCartBadgeCount();
    expect(cartCount).toBe('1');
    
    // Logout
    await inventoryPage.logout();
  });
});
