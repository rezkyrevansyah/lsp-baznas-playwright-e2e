import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures';

/**
 * Accessibility AUDIT (WCAG 2.1 A/AA) with axe-core.
 *
 * This is a reporting test: violations are attached to the HTML report as JSON and
 * summarised in annotations. It only fails on an unexpected page error, so a third-party
 * site we don't control can't break the pipeline – the findings go to docs/FINDINGS.md.
 */
const pages = ['/', '/skema_sertifikasi', '/jadwal', '/faq', '/register', '/kontak'];

test.describe('Accessibility audit', { tag: '@a11y' }, () => {
  for (const path of pages) {
    test(`TC-A11Y axe audit ${path}`, async ({ page }, testInfo) => {
      const response = await page.goto(path, { waitUntil: 'load' });
      expect(response?.status()).toBe(200);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const byImpact = results.violations.reduce<Record<string, number>>((acc, v) => {
        const key = v.impact ?? 'unknown';
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {});

      testInfo.annotations.push({
        type: 'a11y-violations',
        description: `${results.violations.length} rule(s) – ${JSON.stringify(byImpact)}: ${results.violations
          .map((v) => v.id)
          .join(', ')}`,
      });

      await testInfo.attach(`axe-${path.replace(/\W+/g, '_') || 'home'}.json`, {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });
    });
  }
});
