import { test, expect } from '../../fixtures';
import content from '../../test-data/site-content.json';
import { ContentPage } from '../../pages/ContentPage';
import { normaliseName } from '../../utils/helpers';

/** Upper bound for all images on one news article page (BUG-09). */
const ARTICLE_IMAGE_BUDGET_MB = 5;

/**
 * Known issues found during exploratory testing (see docs/FINDINGS.md).
 *
 * Each test asserts the EXPECTED (correct) behaviour and is marked with `test.fail()`.
 * - While the bug exists the test "fails as expected" → suite stays green.
 * - Once the bug is fixed the test passes unexpectedly → Playwright flags it,
 *   reminding us to remove `test.fail()` and promote it to a regression test.
 */
test.describe('Known issues', { tag: ['@regression', '@known-issue'] }, () => {
  test('BUG-01 homepage copy contains no spelling mistakes', async ({ homePage, page }) => {
    test.fail(true, 'BUG-01: typos in homepage copy');
    await homePage.open();
    const text = (await page.locator('main').innerText()).toLowerCase();
    for (const typo of content.knownTypos) {
      expect.soft(text, `typo "${typo}"`).not.toContain(typo);
    }
  });

  test('BUG-02 "Pemegang Sertifikat" menu links to a real page', async ({ homePage }) => {
    test.fail(true, 'BUG-02: menu item points to "#"');
    await homePage.open();
    await expect(homePage.nav.subMenu('Pemegang Sertifikat')).not.toHaveAttribute('href', '#');
  });

  test('BUG-03 non-existent news article returns a 404 page', async ({ page }) => {
    test.fail(true, 'BUG-03: invalid article id shows a generic "Whoops" error page');
    const response = await page.goto('/berita/999999/artikel-tidak-ada', {
      waitUntil: 'domcontentloaded',
    });
    expect.soft(response?.status()).toBe(404);
    await expect(page.locator('body')).not.toContainText('Whoops');
  });

  test('BUG-04 homepage scheme names match the official scheme list', async ({
    homePage,
    skemaPage,
  }) => {
    test.fail(true, 'BUG-04: scheme names differ between homepage and Skema page');
    await homePage.open();
    const homepageNames = (await homePage.schemeCardNames()).map(normaliseName);

    await skemaPage.open();
    const officialNames = (await skemaPage.schemeNames()).map(normaliseName);

    for (const name of homepageNames) {
      expect.soft(officialNames, `"${name}"`).toContain(name);
    }
  });

  test('BUG-05 <html lang> matches the Indonesian content', async ({ page }) => {
    test.fail(true, 'BUG-05: lang="en" on Indonesian pages');
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', /^id/);
  });

  test('BUG-06 every page has a unique, descriptive <title>', async ({ page }) => {
    test.fail(true, 'BUG-06: most pages share the generic title "LSP BAZNAS"');
    const titles: string[] = [];
    for (const path of ['/', '/skema_sertifikasi', '/asesor_kompetensi', '/jadwal', '/faq']) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      titles.push(await page.title());
    }
    expect(new Set(titles).size).toBe(titles.length);
  });

  test('BUG-07 each page has exactly one non-empty <h1>', async ({ page }) => {
    test.fail(true, 'BUG-07: the only <h1> is the logo and contains no text');
    await page.goto('/skema_sertifikasi');
    const h1Texts = await page.locator('h1').allInnerTexts();
    expect(h1Texts).toHaveLength(1);
    expect(h1Texts[0].trim()).not.toBe('');
  });

  test('BUG-08 "Legalitas" page has no broken images', async ({ page }) => {
    test.fail(true, 'BUG-08: empty <img src=""> under the "Legalitas" heading');
    const legalitasPage = new ContentPage(page, '/profile/5/legalitas-lsp');
    await legalitasPage.open();
    expect(await legalitasPage.brokenImages()).toEqual([]);
  });

  test(`BUG-09 news article images weigh less than ${ARTICLE_IMAGE_BUDGET_MB} MB`, async ({
    beritaPage,
    page,
    request,
  }) => {
    test.fail(true, 'BUG-09: "Berita Terkait" loads ~70 full-size images as 75px thumbnails');
    // Images are blocked and measured with HEAD requests, so the test itself stays light.
    await page.route(/\.(jpe?g|png|gif|webp)(\?|$)/i, (route) => route.abort());

    await beritaPage.open();
    await beritaPage.articleTitles.first().click();
    await expect(page).toHaveURL(/\/berita\/\d+\//);

    const srcs = await page
      .locator('img')
      .evaluateAll((imgs) => (imgs as HTMLImageElement[]).map((img) => img.src));
    let totalBytes = 0;
    // Sequential on purpose: keeps the load on the production server minimal.
    for (const src of new Set(srcs)) {
      const response = await request.head(src);
      totalBytes += Number(response.headers()['content-length'] ?? 0);
    }

    const totalMb = totalBytes / 1024 / 1024;
    test.info().annotations.push({ type: 'image-weight', description: `${totalMb.toFixed(1)} MB` });
    expect(totalMb).toBeLessThan(ARTICLE_IMAGE_BUDGET_MB);
  });
});
