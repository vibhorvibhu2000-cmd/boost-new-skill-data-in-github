// RFT-001 · Home page — header, hero, sections, navigation
// Requirement: rfp/home-page/requirement.md
const { test, expect } = require('@playwright/test');

test.describe('RFT-001 · Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero shows headline, lede and both CTAs', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Notes on building things');
    await expect(page.locator('.lede')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Read the latest' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'More about me' })).toBeVisible();
  });

  test('featured post and three cards are rendered', async ({ page }) => {
    await expect(page.locator('.featured')).toBeVisible();
    await expect(page.locator('.card')).toHaveCount(3);
  });

  test('topics, about, newsletter and footer sections exist', async ({ page }) => {
    await expect(page.locator('#topics .topic')).toHaveCount(6);
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#newsletter')).toBeVisible();
    await expect(page.locator('.site-footer')).toBeVisible();
  });

  test('subscribe rejects an invalid email', async ({ page }) => {
    await page.locator('#email').fill('not-an-email');
    await page.locator('#subscribeForm button[type="submit"]').click();
    await expect(page.locator('#formMsg')).toHaveClass(/error/);
    await expect(page.locator('#formMsg')).toContainText('valid email');
  });

  test('subscribe accepts a valid email', async ({ page }) => {
    await page.locator('#email').fill('reader@example.com');
    await page.locator('#subscribeForm button[type="submit"]').click();
    await expect(page.locator('#formMsg')).not.toHaveClass(/error/);
    await expect(page.locator('#formMsg')).toContainText('reader@example.com');
  });
});
