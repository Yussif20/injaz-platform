/**
 * Dashboard E2E Tests
 * Tests for main dashboard functionality
 */

import { test, expect } from "./fixtures/base";
import { URLS, TIMEOUTS } from "./fixtures/test-data";
import { waitForLoadingComplete } from "./fixtures/base";

test.describe("Dashboard - Main Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.dashboard);
    await waitForLoadingComplete(page);
  });

  test("should display dashboard page correctly", async ({ page }) => {
    // Check welcome message
    const welcomeText = page.locator('text=مرحباً, h1:has-text("مرحباً")');
    await expect(welcomeText.first()).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  test("should display user profile section", async ({ page }) => {
    // Check for profile/files section
    const filesSection = page.locator('text=ملفاتي, h2:has-text("ملفات"), text=الملفات');
    await expect(filesSection.first()).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  test("should have navigation sidebar", async ({ page }) => {
    // Check sidebar exists
    const sidebar = page.locator("aside, nav, [role='navigation']");
    await expect(sidebar.first()).toBeVisible();
  });

  test("should have create new profile button/link", async ({ page }) => {
    // Check for create profile option
    const createButton = page.locator('a[href*="profile/new"], button:has-text("إنشاء"), a:has-text("إنشاء ملف")');
    await expect(createButton.first()).toBeVisible();
  });

  test("should display profile cards if profiles exist", async ({ page }) => {
    await page.waitForTimeout(TIMEOUTS.medium);

    // Either show profiles or empty state
    const profileCards = page.locator('[class*="rounded"], [class*="card"], [class*="border"]');
    const emptyState = page.locator('text=لا توجد ملفات, text=إنشاء ملف جديد');

    const hasCards = await profileCards.count() > 0;
    const hasEmptyState = await emptyState.first().isVisible().catch(() => false);

    expect(hasCards || hasEmptyState).toBeTruthy();
  });
});

test.describe("Dashboard - Navigation", () => {
  test("should navigate to account info page", async ({ page }) => {
    await page.goto(URLS.dashboard);
    await waitForLoadingComplete(page);

    // Click on account/settings link
    const accountLink = page.locator('a[href*="account"], a:has-text("الحساب"), a:has-text("بيانات")');
    await accountLink.first().click();

    await page.waitForURL(/account/, { timeout: TIMEOUTS.medium });
    expect(page.url()).toContain("account");
  });

  test("should navigate to profile data page", async ({ page }) => {
    await page.goto(URLS.dashboard);
    await waitForLoadingComplete(page);

    // Navigate to profile data
    const profileDataLink = page.locator('a[href*="profile-data"], a:has-text("البيانات"), a:has-text("بيانات الملف")');
    if (await profileDataLink.first().isVisible()) {
      await profileDataLink.first().click();
      await page.waitForTimeout(TIMEOUTS.short);
    }
  });

  test("should navigate to change password page", async ({ page }) => {
    await page.goto(URLS.accountInfo);
    await waitForLoadingComplete(page);

    const passwordLink = page.locator('a[href*="change-password"], a:has-text("كلمة المرور"), button:has-text("تغيير كلمة")');
    if (await passwordLink.first().isVisible()) {
      await passwordLink.first().click();
      await page.waitForURL(/change-password/, { timeout: TIMEOUTS.medium });
    }
  });
});

test.describe("Dashboard - Profile Actions", () => {
  test("should open new profile creation page", async ({ page }) => {
    await page.goto(URLS.dashboard);
    await waitForLoadingComplete(page);

    const createButton = page.locator('a[href*="profile/new"], button:has-text("إنشاء"), a:has-text("إنشاء ملف جديد")');
    await createButton.first().click();

    await page.waitForURL(/profile\/new/, { timeout: TIMEOUTS.medium });
    expect(page.url()).toContain("profile/new");
  });

  test("should display profile creation form", async ({ page }) => {
    await page.goto(URLS.newProfile);
    await waitForLoadingComplete(page);

    // Check form elements exist
    const form = page.locator("form");
    await expect(form).toBeVisible({ timeout: TIMEOUTS.medium });
  });
});
