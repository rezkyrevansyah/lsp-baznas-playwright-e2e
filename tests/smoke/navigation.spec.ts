import { test, expect } from '../../fixtures';
import navigation from '../../test-data/navigation.json';
import { escapeRegExp, looseText } from '../../utils/helpers';

test.describe('Main navigation (desktop)', { tag: '@smoke' }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  // Data-driven: one test per sub-menu link defined in test-data/navigation.json
  for (const item of navigation) {
    test(`TC-NAV ${item.parent} › ${item.child} opens ${item.path}`, async ({ homePage, page }) => {
      await homePage.nav.navigateTo(item.parent, item.child);

      await expect(page).toHaveURL(new RegExp(`${escapeRegExp(item.path)}$`));
      await expect(page.locator('body')).toContainText(looseText(item.heading));
    });
  }

  test('TC-NAV "Kontak" opens the contact page', async ({ homePage, page }) => {
    await homePage.nav.menu('Kontak').click();
    await expect(page).toHaveURL(/\/kontak$/);
    await expect(page.locator('body')).toContainText(/kontak kami/i);
  });

  test('TC-NAV "Home" returns to the homepage', async ({ homePage, page }) => {
    await page.goto('/faq');
    await homePage.nav.menu('Home').click();
    await expect(homePage.intro).toBeVisible();
  });
});
