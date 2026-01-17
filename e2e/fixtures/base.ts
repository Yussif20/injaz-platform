/**
 * Base Test Fixtures
 * Extended Playwright test with custom fixtures
 */

import { test as base, expect, Page } from "@playwright/test";
import { URLS, TIMEOUTS } from "./test-data";

/**
 * Custom test fixtures
 */
export const test = base.extend<{
  authenticatedPage: Page;
}>({
  // Authenticated page fixture (uses stored auth state)
  authenticatedPage: async ({ page }, use) => {
    await page.goto(URLS.dashboard);
    await use(page);
  },
});

export { expect };

/**
 * Helper functions for tests
 */

// Wait for API response
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse(
    (response) =>
      (typeof urlPattern === "string"
        ? response.url().includes(urlPattern)
        : urlPattern.test(response.url())) && response.status() === 200,
    { timeout: TIMEOUTS.apiResponse }
  );
}

// Wait for loading to complete
export async function waitForLoadingComplete(page: Page) {
  await page.waitForSelector(".animate-spin", { state: "hidden", timeout: TIMEOUTS.long }).catch(() => {});
}

// Check for success message
export async function expectSuccessMessage(page: Page, text?: string) {
  const message = page.locator(".bg-green-100, .text-green-800, .text-green-600");
  await expect(message.first()).toBeVisible({ timeout: TIMEOUTS.medium });
  if (text) {
    await expect(message.first()).toContainText(text);
  }
}

// Check for error message
export async function expectErrorMessage(page: Page, text?: string) {
  const message = page.locator(".bg-red-100, .text-red-800, .text-red-600");
  await expect(message.first()).toBeVisible({ timeout: TIMEOUTS.medium });
  if (text) {
    await expect(message.first()).toContainText(text);
  }
}

// Fill input by label (Arabic)
export async function fillInputByLabel(page: Page, label: string, value: string) {
  const input = page.locator(`label:has-text("${label}") + input, label:has-text("${label}") ~ input`);
  await input.fill(value);
}

// Click button by text
export async function clickButtonByText(page: Page, text: string) {
  await page.locator(`button:has-text("${text}")`).click();
}

// Select option by text
export async function selectOptionByText(page: Page, selectLabel: string, optionText: string) {
  const select = page.locator(`label:has-text("${selectLabel}") + select, label:has-text("${selectLabel}") ~ select`);
  await select.selectOption({ label: optionText });
}

// Navigate and wait for load
export async function navigateAndWait(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
}

// Login helper
export async function login(page: Page, phone: string, password: string) {
  await page.goto(URLS.login);
  await page.fill('input[type="tel"], input[name="phone"]', phone);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard/, { timeout: TIMEOUTS.apiResponse });
}

// Logout helper
export async function logout(page: Page) {
  // Click user menu or logout button
  const logoutButton = page.locator('button:has-text("تسجيل الخروج"), a:has-text("تسجيل الخروج")');
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  }
}
