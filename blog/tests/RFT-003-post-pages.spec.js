// RFT-003 · Post pages — all 10 posts are reachable and render correctly
// Requirement: rfp/home-page/requirement.md
const { test, expect } = require('@playwright/test');

const POSTS = [
  { slug: 'boring-parts-of-scale', title: 'The boring parts of scale: what actually breaks at 10x' },
  { slug: 'ci-is-a-product', title: 'Your CI is a product, treat it like one' },
  { slug: 'interfaces-that-explain-themselves', title: 'Interfaces that explain themselves' },
  { slug: 'ten-years-in', title: "Ten years in: what I'd tell my junior self" },
  { slug: 'caching-is-not-free', title: 'Caching is not free: the hidden cost of a cache hit' },
  { slug: 'zero-downtime-migrations', title: 'Zero-downtime database migrations, step by step' },
  { slug: 'design-system-nobody-hates', title: 'Building a design system nobody hates' },
  { slug: 'observability-for-small-teams', title: 'Observability for small teams: logs, traces, and sane alerts' },
  { slug: 'tools-i-actually-kept', title: 'The tools I actually kept after five years' },
  { slug: 'shipping-feedback-loops', title: 'Shipping feedback loops into small teams' },
];

test.describe('RFT-003 · Post pages', () => {
  test('posts index lists all 10 posts', async ({ page }) => {
    await page.goto('/posts/');
    await expect(page.locator('.grid .card')).toHaveCount(10);
  });

  for (const post of POSTS) {
    test(`post page renders: ${post.title}`, async ({ page }) => {
      const response = await page.goto(`/posts/${post.slug}.html`);
      expect(response.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title);
      await expect(page.locator('.post .meta .tag')).toBeVisible();
      await expect(page.locator('.post-lede')).toBeVisible();
      await expect(page.locator('.post p')).not.toHaveCount(0);
    });
  }

  test('post page header dropdown still lists 10 posts', async ({ page, isMobile }) => {
    await page.goto('/posts/boring-parts-of-scale.html');
    if (isMobile) {
      await page.click('#navToggle');
    }
    await page.click('#blogMenuBtn');
    await expect(page.locator('#blogMenu .blog-list li')).toHaveCount(10);
  });

  test('post page links back to the posts index', async ({ page }) => {
    await page.goto('/posts/ten-years-in.html');
    await page.click('.back-link');
    await expect(page).toHaveURL(/\/posts\/$/);
    await expect(page.locator('.grid .card')).toHaveCount(10);
  });
});
