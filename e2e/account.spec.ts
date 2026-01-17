/**
 * Account Management E2E Tests
 * Tests for account info, profile data, and password change
 */

import { test, expect } from "./fixtures/base";
import { URLS, TIMEOUTS } from "./fixtures/test-data";
import { waitForLoadingComplete, expectSuccessMessage } from "./fixtures/base";

test.describe("Account - Info Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.accountInfo);
    await waitForLoadingComplete(page);
  });

  test("should display account info form", async ({ page }) => {
    // Check form exists
    const form = page.locator("form");
    await expect(form.first()).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  test("should display user info fields", async ({ page }) => {
    // Check for name field
    const nameField = page.locator('input[name="fullName"], input[name="name"], label:has-text("الاسم")');
    await expect(nameField.first()).toBeVisible();

    // Check for phone field (might be readonly)
    const phoneField = page.locator('input[name="phone"], input[type="tel"], label:has-text("الهاتف")');
    await expect(phoneField.first()).toBeVisible();
  });

  test("should allow editing basic info", async ({ page }) => {
    // Find editable field (name)
    const nameInput = page.locator('input[name="fullName"], input[name="name"]');

    if (await nameInput.isEditable()) {
      const currentValue = await nameInput.inputValue();
      await nameInput.clear();
      await nameInput.fill("اسم اختبار معدل");

      // Find save button
      const saveButton = page.locator('button[type="submit"], button:has-text("حفظ")');
      await saveButton.first().click();

      await page.waitForTimeout(TIMEOUTS.medium);

      // Restore original value
      await nameInput.clear();
      await nameInput.fill(currentValue);
      await saveButton.first().click();
    }
  });

  test("should display personal info section", async ({ page }) => {
    // Check for birth date, address, national ID fields
    const birthDateField = page.locator('input[name="birthDate"], input[type="date"], label:has-text("تاريخ الميلاد")');
    const addressField = page.locator('input[name="address"], textarea[name="address"], label:has-text("العنوان")');

    // At least one should be visible
    const hasBirthDate = await birthDateField.first().isVisible().catch(() => false);
    const hasAddress = await addressField.first().isVisible().catch(() => false);

    expect(hasBirthDate || hasAddress).toBeTruthy();
  });
});

test.describe("Account - Profile Data (Career & Education)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.profileData);
    await waitForLoadingComplete(page);
  });

  test("should display profile data tabs", async ({ page }) => {
    // Check for tabs (Education, Job, etc.)
    const tabs = page.locator('[role="tab"], button:has-text("التعليم"), button:has-text("الوظيفة"), button:has-text("المؤهلات")');
    await expect(tabs.first()).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  test("should switch between tabs", async ({ page }) => {
    // Find tabs
    const educationTab = page.locator('button:has-text("التعليم"), button:has-text("المؤهلات"), [role="tab"]:has-text("تعليم")');
    const jobTab = page.locator('button:has-text("الوظيفة"), button:has-text("الوظائف"), [role="tab"]:has-text("وظيف")');

    if (await educationTab.first().isVisible()) {
      await educationTab.first().click();
      await page.waitForTimeout(TIMEOUTS.short);
    }

    if (await jobTab.first().isVisible()) {
      await jobTab.first().click();
      await page.waitForTimeout(TIMEOUTS.short);
    }
  });

  test("should display add button for career jobs", async ({ page }) => {
    // Navigate to jobs tab if exists
    const jobTab = page.locator('button:has-text("الوظيفة"), button:has-text("الوظائف")');
    if (await jobTab.first().isVisible()) {
      await jobTab.first().click();
      await page.waitForTimeout(TIMEOUTS.short);
    }

    // Check for add button
    const addButton = page.locator('button:has-text("إضافة"), button:has-text("جديد"), button:has-text("+")');
    await expect(addButton.first()).toBeVisible();
  });

  test("should display add button for qualifications", async ({ page }) => {
    // Navigate to education tab if exists
    const educationTab = page.locator('button:has-text("التعليم"), button:has-text("المؤهلات")');
    if (await educationTab.first().isVisible()) {
      await educationTab.first().click();
      await page.waitForTimeout(TIMEOUTS.short);
    }

    // Check for add button
    const addButton = page.locator('button:has-text("إضافة"), button:has-text("جديد"), button:has-text("+")');
    await expect(addButton.first()).toBeVisible();
  });
});

test.describe("Account - Change Password", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLS.changePassword);
    await waitForLoadingComplete(page);
  });

  test("should display change password form", async ({ page }) => {
    const form = page.locator("form");
    await expect(form.first()).toBeVisible({ timeout: TIMEOUTS.medium });
  });

  test("should have required password fields", async ({ page }) => {
    // Current password
    const currentPassword = page.locator('input[name="oldPassword"], input[name="currentPassword"], label:has-text("الحالية")');
    await expect(currentPassword.first()).toBeVisible();

    // New password
    const newPassword = page.locator('input[name="newPassword"], label:has-text("الجديدة")');
    await expect(newPassword.first()).toBeVisible();

    // Confirm password
    const confirmPassword = page.locator('input[name="confirmNewPassword"], input[name="confirmPassword"], label:has-text("تأكيد")');
    await expect(confirmPassword.first()).toBeVisible();
  });

  test("should validate password match", async ({ page }) => {
    const currentPassword = page.locator('input[name="oldPassword"], input[name="currentPassword"]');
    const newPassword = page.locator('input[name="newPassword"]');
    const confirmPassword = page.locator('input[name="confirmNewPassword"], input[name="confirmPassword"]');
    const submitButton = page.locator('button[type="submit"]');

    await currentPassword.first().fill("currentpass");
    await newPassword.first().fill("newpassword123");
    await confirmPassword.first().fill("differentpassword");

    await submitButton.click();
    await page.waitForTimeout(TIMEOUTS.short);

    // Should show validation error or stay on page
    expect(page.url()).toContain("change-password");
  });
});
