import { test, expect } from '../../fixtures';
import { BeritaDetailPage } from '../../pages/BeritaPage';
import { looseText } from '../../utils/helpers';

test.describe('Berita (news)', { tag: '@regression' }, () => {
  test.beforeEach(async ({ beritaPage }) => {
    await beritaPage.open();
  });

  test('TC-NEWS-01 index lists articles and a "Berita Populer" sidebar', async ({ beritaPage }) => {
    await expect(beritaPage.articleTitles.first()).toBeVisible();
    await expect(beritaPage.popularNewsHeading).toBeVisible();
  });

  test('TC-NEWS-02 opening an article shows its detail page', async ({ beritaPage, page }) => {
    const firstTitle = (await beritaPage.articleTitles.first().innerText()).trim();
    await beritaPage.articleTitles.first().click();

    await expect(page).toHaveURL(/\/berita\/\d+\//);
    const detail = new BeritaDetailPage(page);
    await expect(detail.pageHeading).toHaveText(looseText(firstTitle.slice(0, 40)));
    await expect(detail.relatedNewsHeading).toBeVisible();
    expect(await detail.brokenImages(detail.article)).toEqual([]);
  });

  test('TC-NEWS-03 pagination opens page 2 with different articles', async ({
    beritaPage,
    page,
  }) => {
    const firstOnPage1 = await beritaPage.articleTitles.first().innerText();

    await beritaPage.pageLink('2').click();

    await expect(page).toHaveURL(/page_berita_lsp=2/);
    await expect(beritaPage.articleTitles.first()).not.toHaveText(firstOnPage1);
  });
});
