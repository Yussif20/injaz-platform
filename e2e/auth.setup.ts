/**
 * Auth Setup
 * Authenticates and saves session state for other tests
 */

import { test as setup, expect } from "@playwright/test";
import { TEST_USER, URLS, TIMEOUTS } from "./fixtures/test-data";

const authFile = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // Go to login page
  await page.goto(URLS.login);

  // Wait for page to load
  await page.waitForLoadState("networkidle");

  // Fill login form (use .first() to handle mobile/desktop duplicates)
  const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  const submitButton = page.locator('button[type="submit"]').first();

  await phoneInput.fill(TEST_USER.phone);
  await passwordInput.fill(TEST_USER.password);

  // Submit and wait for navigation
  await submitButton.click();

  // Wait for successful login - should redirect to dashboard
  await page.waitForURL(/dashboard/, { timeout: TIMEOUTS.apiResponse });

  // Verify we're logged in by checking for dashboard elements
  await expect(page.locator('text=مرحباً, text=ملفاتي, text=لوحة التحكم').first()).toBeVisible({
    timeout: TIMEOUTS.medium,
  });

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
