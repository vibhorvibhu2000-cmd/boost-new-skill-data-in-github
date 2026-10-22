// RFT-002 · Header — Writing dropdown with 10 latest blog posts
// Requirement: rfp/home-page/requirement.md
const { test, expect } = require('@playwright/test');

const POSTS = [
  'The boring parts of scale: what actually breaks at 10x',
  'Your CI is a product, treat it like one',
  'Interfaces that explain themselves',
  "Ten years in: what I'd tell my junior self",
  'Caching is not free: the hidden cost of a cache hit',
  'Zero-downtime database migrations, step by step',
  'Building a design system nobody hates',
  'Observability for small teams: logs, traces, and sane alerts',
  'The tools I actually kept after five years',
  'Shipping feedback loops into small teams',
];

test.describe('RFT-002 · Header writing menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('header shows nav links and subscribe button', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop nav is collapsed on mobile');
    await expect(page.locator('.site-header .brand-name')).toHaveText('Emberlog');
    await expect(page.locator('#nav')).toContainText('Topics');
    await expect(page.locator('#nav')).toContainText('About');
    await expect(page.getByRole('link', { name: 'Subscribe' }).first()).toBeVisible();
  });

  test('mobile: hamburger opens nav and Writing accordion lists 10 posts', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile-only behaviour');
    await page.click('#navToggle');
    await expect(page.locator('#nav')).toBeVisible();
    await page.click('#blogMenuBtn');
    await expect(page.locator('#blogMenu')).toBeVisible();
    await expect(page.locator('#blogMenu .blog-list li')).toHaveCount(10);
  });

  test('Writing menu is closed by default and opens on click', async ({ page, isMobile }) => {
    test.skip(isMobile, 'dropdown is an accordion on mobile');
    const menu = page.locator('#blogMenu');
    await expect(menu).toBeHidden();
    await page.click('#blogMenuBtn');
    await expect(menu).toBeVisible();
    await expect(page.locator('#blogMenuBtn')).toHaveAttribute('aria-expanded', 'true');
  });

  test('Writing menu lists 10 posts with title and meta', async ({ page, isMobile }) => {
    test.skip(isMobile, 'dropdown is an accordion on mobile');
    await page.click('#blogMenuBtn');
    const items = page.locator('#blogMenu .blog-list li');
    await expect(items).toHaveCount(10);
    for (const title of POSTS) {
      await expect(page.locator('#blogMenu .blog-title', { hasText: title })).toHaveCount(1);
    }
    await expect(page.locator('#blogMenu .blog-meta').first()).toContainText('·');
  });

  test('Writing menu closes on Escape', async ({ page, isMobile }) => {
    test.skip(isMobile, 'dropdown is an accordion on mobile');
    await page.click('#blogMenuBtn');
    await expect(page.locator('#blogMenu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#blogMenu')).toBeHidden();
  });

  test('Writing menu links point to real post pages', async ({ page, isMobile }) => {
    test.skip(isMobile, 'dropdown is an accordion on mobile');
    await page.click('#blogMenuBtn');
    const hrefs = await page.locator('#blogMenu .blog-list a').evaluateAll((els) =>
      els.map((e) => e.getAttribute('href'))
    );
    expect(hrefs).toHaveLength(10);
    for (const href of hrefs) {
      expect(href).toMatch(/^\/posts\/[a-z0-9-]+\.html$/);
    }
  });
});
