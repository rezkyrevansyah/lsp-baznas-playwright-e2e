import { test, expect } from '../../fixtures';

test.describe('Link integrity', { tag: '@regression' }, () => {
  test('TC-LINK-01 every internal link on the homepage responds without 4xx/5xx', async ({
    homePage,
    page,
    request,
    baseURL,
  }) => {
    await homePage.open();
    const origin = new URL(baseURL!).origin;

    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((anchors) => (anchors as HTMLAnchorElement[]).map((a) => a.href));
    const internal = [...new Set(hrefs)]
      .map((href) => href.split('#')[0])
      .filter((href) => href.startsWith(origin) && !/logout/i.test(href));
    const unique = [...new Set(internal)];

    test.info().annotations.push({ type: 'checked-links', description: String(unique.length) });

    // Sequential on purpose: keeps the load on the production server minimal.
    for (const url of unique) {
      const response = await request.get(url, { maxRedirects: 5 });
      expect.soft(response.status(), url).toBeLessThan(400);
    }
  });
});

test.describe('Error handling', { tag: '@regression' }, () => {
  test('TC-ERR-01 unknown URL returns a friendly 404 page', async ({ page }) => {
    const response = await page.goto('/halaman-yang-tidak-ada-qa', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/404/);
    await expect(page.locator('body')).toContainText(/Page Not Found|Cannot seem to find/i);
  });
});
