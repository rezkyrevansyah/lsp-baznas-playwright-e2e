import { test, expect } from '../../fixtures';
import { ContentPage } from '../../pages/ContentPage';

type ContentCase = {
  path: string;
  heading: RegExp;
  /** Known bug that breaks the image check; covered in known-issues.spec.ts instead. */
  knownImageIssue?: string;
};

const pages: ContentCase[] = [
  { path: '/profile/3/sejarah-lsp', heading: /sejarah/i },
  { path: '/profile/5/legalitas-lsp', heading: /legalitas/i, knownImageIssue: 'BUG-08' },
  { path: '/profile/2/visi-misi-lsp', heading: /visi dan misi/i },
  { path: '/profile/6/struktur-organisasi', heading: /struktur organisasi/i },
  { path: '/profile/alur-sertifikasi', heading: /alur sertifikasi/i },
  { path: '/skema_sertifikasi', heading: /skema sertifikasi/i },
  { path: '/dokumentasi', heading: /dokumentasi/i },
];

test.describe('Static content pages', { tag: '@regression' }, () => {
  for (const p of pages) {
    test(`TC-CONTENT ${p.path} returns 200, shows its heading and has no broken images`, async ({
      page,
    }) => {
      const contentPage = new ContentPage(page, p.path);
      const response = await contentPage.open();

      expect(response?.status()).toBe(200);
      await expect(contentPage.pageHeading).toHaveText(p.heading);
      await expect(contentPage.footer).toBeVisible();

      if (p.knownImageIssue) {
        test.info().annotations.push({ type: 'known-issue', description: p.knownImageIssue });
        return;
      }
      expect(await contentPage.brokenImages()).toEqual([]);
    });
  }

  test('TC-CONTENT-01 Skema Sertifikasi lists every scheme with a non-empty name', async ({
    skemaPage,
  }) => {
    await skemaPage.open();

    const names = await skemaPage.schemeNames();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) expect.soft(name).not.toBe('');
    expect(new Set(names).size, 'scheme names should be unique').toBe(names.length);
  });

  test('TC-CONTENT-02 Dokumentasi shows a gallery of images', async ({ page }) => {
    const docPage = new ContentPage(page, '/dokumentasi');
    await docPage.open();
    expect(await page.locator('main img').count()).toBeGreaterThan(0);
  });
});
