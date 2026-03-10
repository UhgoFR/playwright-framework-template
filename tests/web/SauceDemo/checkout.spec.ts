import { test, expect } from '@playwright/test';
import { LoginPage } from '@/web/pages/SauceDemo/LoginPage';
import { InventoryPage } from '@/web/pages/SauceDemo/InventoryPage';
import { CartPage } from '@/web/pages/SauceDemo/CartPage';
import { CheckoutPage } from '@/web/pages/SauceDemo/CheckoutPage';
import userData from '../../data/SauceDemo/users.json';
import productData from '../../data/SauceDemo/products.json';
import checkoutData from '../../data/SauceDemo/checkout.json';

test.describe('SauceDemo Checkout Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    // Login and add product to cart
    await loginPage.navigateToLoginPage();
    await loginPage.login(userData.validUser.username, userData.validUser.password);
    await inventoryPage.waitForPageToLoad();
    
    // Add a product to cart
    await inventoryPage.addProductToCart(productData.testProduct.name);
  });

  test('should complete checkout flow successfully', async ({ page }) => {
    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Verify item is in cart
    expect(await cartPage.isItemInCart(productData.testProduct.name)).toBe(true);
    
    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutStepOne();
    
    // Fill checkout information
    await checkoutPage.fillCheckoutInformation(
      checkoutData.validCustomer.firstName,
      checkoutData.validCustomer.lastName,
      checkoutData.validCustomer.postalCode
    );
    
    // Continue to overview
    await checkoutPage.continueToStepTwo();
    await checkoutPage.waitForCheckoutStepTwo();
    
    // Finish checkout
    await checkoutPage.finishCheckout();
    await checkoutPage.waitForCheckoutComplete();
    
    // Verify success message
    const completeMessage = await checkoutPage.getCompleteMessage();
    expect(completeMessage).toBe(checkoutData.successMessages.orderComplete);
    
    const completeText = await checkoutPage.getCompleteText();
    expect(completeText).toBe(checkoutData.successMessages.orderDispatched);
    
    // Go back home
    await checkoutPage.backToHome();
    
    // Verify we're back on inventory page
    expect(await page.url()).toContain('inventory.html');
  });

  test('should show error for missing first name', async () => {
    // Navigate to checkout
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutStepOne();
    
    // Fill with missing first name
    await checkoutPage.fillCheckoutInformation(
      checkoutData.missingFirstName.firstName,
      checkoutData.missingFirstName.lastName,
      checkoutData.missingFirstName.postalCode
    );
    
    // Try to continue
    await checkoutPage.continueToStepTwo();
    
    // Verify error message
    expect(await checkoutPage.isErrorMessageVisible()).toBe(true);
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toBe(checkoutData.errorMessages.firstNameRequired);
    
    // Verify we're still on step one
    expect(await checkoutPage.isCheckoutStepOne()).toBe(true);
  });

  test('should show error for missing last name', async () => {
    // Navigate to checkout
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutStepOne();
    
    // Fill with missing last name
    await checkoutPage.fillCheckoutInformation(
      checkoutData.missingLastName.firstName,
      checkoutData.missingLastName.lastName,
      checkoutData.missingLastName.postalCode
    );
    
    // Try to continue
    await checkoutPage.continueToStepTwo();
    
    // Verify error message
    expect(await checkoutPage.isErrorMessageVisible()).toBe(true);
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toBe(checkoutData.errorMessages.lastNameRequired);
  });

  test('should show error for missing postal code', async () => {
    // Navigate to checkout
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutStepOne();
    
    // Fill with missing postal code
    await checkoutPage.fillCheckoutInformation(
      checkoutData.missingPostalCode.firstName,
      checkoutData.missingPostalCode.lastName,
      checkoutData.missingPostalCode.postalCode
    );
    
    // Try to continue
    await checkoutPage.continueToStepTwo();
    
    // Verify error message
    expect(await checkoutPage.isErrorMessageVisible()).toBe(true);
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toBe(checkoutData.errorMessages.postalCodeRequired);
  });

  test('should cancel checkout from step one', async ({ page }) => {
    // Navigate to checkout
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutStepOne();
    
    // Cancel checkout
    await checkoutPage.cancelCheckout();
    
    // Verify we're back on cart page
    expect(await page.url()).toContain('cart.html');
    await cartPage.waitForPageToLoad();
  });

  test('should cancel checkout from step two', async ({ page }) => {
    // Navigate to checkout step two
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.waitForCheckoutStepOne();
    
    await checkoutPage.fillCheckoutInformation(
      checkoutData.validCustomer.firstName,
      checkoutData.validCustomer.lastName,
      checkoutData.validCustomer.postalCode
    );
    
    await checkoutPage.continueToStepTwo();
    await checkoutPage.waitForCheckoutStepTwo();
    
    // Cancel checkout
    await checkoutPage.cancelFromStepTwo();
    
    // Verify we're back on inventory page
    expect(await page.url()).toContain('inventory.html');
  });

  test('should checkout with multiple items', async () => {
    // Add multiple products to cart
    await inventoryPage.addProductToCart(productData.multipleProducts[1]);
    await inventoryPage.addProductToCart(productData.multipleProducts[2]);
    
    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Verify all items are in cart
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

  test('should continue shopping from cart', async ({ page }) => {
    // Navigate to cart
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageToLoad();
    
    // Continue shopping
    await cartPage.continueShopping();
    
    // Verify we're back on inventory page
    expect(await page.url()).toContain('inventory.html');
    
    // Verify product is still in cart
    const cartCount = await inventoryPage.getCartBadgeCount();
    expect(cartCount).toBe('1');
  });
});
