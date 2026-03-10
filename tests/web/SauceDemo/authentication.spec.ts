import { test, expect } from '@playwright/test';
import { LoginPage } from '@/web/pages/SauceDemo/LoginPage';
import { InventoryPage } from '@/web/pages/SauceDemo/InventoryPage';
import userData from '../../data/SauceDemo/users.json';

test.describe('SauceDemo Authentication', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.login(userData.validUser.username, userData.validUser.password);
    await loginPage.waitForLoginSuccess();
    
    // Verify we're on the inventory page
    expect(await page.url()).toContain('inventory.html');
    
    // Verify inventory page elements are visible
    await inventoryPage.waitForPageToLoad();
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await loginPage.login(userData.invalidUser.username, userData.invalidUser.password);
    await loginPage.waitForLoginFailure();
    
    // Verify error message is displayed
    expect(await loginPage.isErrorMessageVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface');
    
    // Verify we're still on login page
    expect(await page.url()).toBe('https://www.saucedemo.com/');
  });

  test('should show error with empty credentials', async ({ page }) => {
    await loginPage.login('', '');
    await loginPage.waitForLoginFailure();
    
    // Verify error message is displayed
    expect(await loginPage.isErrorMessageVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Username is required');
  });

  test('should show error with empty password', async ({ page }) => {
    await loginPage.login(userData.validUser.username, '');
    await loginPage.waitForLoginFailure();
    
    // Verify error message is displayed
    expect(await loginPage.isErrorMessageVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Password is required');
  });

  test('should show locked out message for locked user', async ({ page }) => {
    await loginPage.login(userData.lockedOutUser.username, userData.lockedOutUser.password);
    await loginPage.waitForLoginFailure();
    
    // Verify locked out error message
    expect(await loginPage.isErrorMessageVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out');
  });

  test('should display credentials information on login page', async () => {
    // Verify that credentials info is displayed
    expect(await loginPage.areCredentialsInfoVisible()).toBe(true);
  });
});
