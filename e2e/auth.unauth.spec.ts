/**
 * Authentication E2E Tests (Unauthenticated)
 * Tests for login, registration, and password reset flows
 */

import { test, expect } from "@playwright/test";
import { URLS, TIMEOUTS, TEST_USER } from "./fixtures/test-data";

test.describe("Authentication - Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.login);
  });

  test("should display login page correctly", async ({ page }) => {
    // Check page title/heading
    await expect(page.locator("h1, h2").first()).toBeVisible();

    // Check form elements exist (use .first() to handle mobile/desktop duplicates)
    const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await expect(phoneInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test("should show validation errors for empty form", async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Should show validation errors or stay on page
    await expect(page).toHaveURL(/sign\/in/);
  });

  test("should show error for invalid credentials", async ({ page }) => {
    const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await phoneInput.fill("966999999999");
    await passwordInput.fill("wrongpassword");
    await submitButton.click();

    // Wait for error message
    await page.waitForTimeout(TIMEOUTS.medium);

    // Should show error or stay on login page
    const currentUrl = page.url();
    expect(currentUrl).toContain("sign/in");
  });

  test("should login successfully with valid credentials", async ({ page }) => {
    const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    await phoneInput.fill(TEST_USER.phone);
    await passwordInput.fill(TEST_USER.password);
    await submitButton.click();

    // Should redirect to dashboard
    await page.waitForURL(/dashboard/, { timeout: TIMEOUTS.apiResponse });
    expect(page.url()).toContain("dashboard");
  });

  test("should have link to register page", async ({ page }) => {
    const registerLink = page.locator('a[href*="sign/up"], a:has-text("تسجيل"), a:has-text("إنشاء حساب")');
    await expect(registerLink.first()).toBeVisible();
  });

  test("should have link to forgot password", async ({ page }) => {
    const forgotLink = page.locator('a:has-text("نسيت"), a:has-text("كلمة المرور"), button:has-text("نسيت")');
    await expect(forgotLink.first()).toBeVisible();
  });
});

test.describe("Authentication - Registration Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.register);
  });

  test("should display registration page correctly", async ({ page }) => {
    // Check page loads
    await expect(page.locator("h1, h2").first()).toBeVisible();

    // Check form elements (use .first() to handle mobile/desktop duplicates)
    const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first();
    await expect(phoneInput).toBeVisible();
  });

  test("should have link to login page", async ({ page }) => {
    const loginLink = page.locator('a[href*="sign/in"], a:has-text("تسجيل الدخول"), a:has-text("لديك حساب")');
    await expect(loginLink.first()).toBeVisible();
  });

  test("should validate phone number format", async ({ page }) => {
    const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    // Enter invalid phone
    await phoneInput.fill("123");

    // Submit button should be disabled with invalid phone, or validation error should show
    const isDisabled = await submitButton.isDisabled();
    const validationError = page.locator('text=رقم الجوال, [class*="error"], [class*="text-red"]');
    const hasValidationError = await validationError.first().isVisible().catch(() => false);

    // Either button is disabled or validation error is shown
    expect(isDisabled || hasValidationError).toBeTruthy();

    // Should stay on registration page
    expect(page.url()).toContain("sign/up");
  });
});

test.describe("Authentication - Protected Routes", () => {
  test("should redirect to login when accessing dashboard without auth", async ({ page }) => {
    await page.goto(URLS.dashboard);

    // Should redirect to login
    await page.waitForURL(/sign\/in/, { timeout: TIMEOUTS.medium });
    expect(page.url()).toContain("sign/in");
  });

  test("should redirect to login when accessing account settings without auth", async ({ page }) => {
    await page.goto(URLS.accountInfo);

    // Should redirect to login
    await page.waitForURL(/sign\/in/, { timeout: TIMEOUTS.medium });
    expect(page.url()).toContain("sign/in");
  });
});
