import { test, expect } from '../../fixtures';

const pages = [
  '/',
  '/skema_sertifikasi',
  '/asesor_kompetensi',
  '/jadwal',
  '/berita',
  '/faq',
  '/kontak',
];

test.describe('Basic SEO & page health', { tag: '@regression' }, () => {
  for (const path of pages) {
    test(`TC-SEO ${path} has a title, meta description, viewport and no JS errors`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      page.on('pageerror', (err) => consoleErrors.push(err.message));

      const response = await page.goto(path, { waitUntil: 'load' });
      expect(response?.status()).toBe(200);

      expect((await page.title()).trim()).not.toBe('');
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S+/);
      await expect(page.locator('meta[name="viewport"]')).toHaveCount(1);
      expect(consoleErrors, 'uncaught JavaScript errors').toEqual([]);
    });
  }
});
