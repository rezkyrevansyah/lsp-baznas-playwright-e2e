import { test, expect } from '../../fixtures';

test.describe('Responsive layout (mobile)', { tag: '@mobile' }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('TC-MOB-01 hamburger toggle is shown and desktop menu is hidden', async ({ homePage }) => {
    await expect(homePage.nav.mobileToggle).toBeVisible();
    await expect(homePage.nav.menu('Profil')).toBeHidden();
  });

  test('TC-MOB-02 hamburger opens and closes the mobile menu', async ({ homePage }) => {
    await homePage.nav.openMobileMenu();
    await expect(homePage.nav.menu('Profil')).toBeVisible();
    await expect(homePage.nav.mobileToggle).toHaveClass(/bi-x/);

    await homePage.nav.mobileToggle.click();
    await expect(homePage.nav.root).not.toHaveClass(/navbar-mobile/);
  });

  test('TC-MOB-03 dropdown expands on tap and its link navigates', async ({ homePage, page }) => {
    await homePage.nav.openMobileMenu();
    await homePage.nav.expandMobileDropdown('Informasi');

    const faqLink = homePage.nav.subMenu('FAQ');
    await expect(faqLink).toBeVisible();
    await faqLink.click();
    await expect(page).toHaveURL(/\/faq$/);
  });

  test('TC-MOB-04 page has no horizontal scroll', async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('TC-MOB-05 statistic counters stay visible on small screens', async ({ homePage }) => {
    await homePage.counters.first().scrollIntoViewIfNeeded();
    await expect(homePage.counters.first()).toBeVisible();
  });
});
