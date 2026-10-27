import { test, expect } from '../../fixtures';
import content from '../../test-data/site-content.json';
import { SHORT_DATE } from '../../utils/helpers';

test.describe('Homepage', { tag: '@smoke' }, () => {
  test.beforeEach(async ({ homePage }) => {
    const response = await homePage.open();
    expect(response?.status()).toBe(200);
  });

  test('TC-HOME-01 loads with title and LSP introduction', async ({ homePage, page }) => {
    await expect(page).toHaveTitle(/LSP BAZNAS/);
    await expect(homePage.intro).toBeVisible();
    await expect(page.locator('main')).toContainText('BNSP');
  });

  test('TC-HOME-02 shows all four statistic counters with positive values', async ({
    homePage,
  }) => {
    await expect(homePage.counters).toHaveCount(content.counterLabels.length);
    for (const label of content.counterLabels) {
      const value = await homePage.counterValue(label);
      expect.soft(value, `counter "${label}"`).toBeGreaterThan(0);
    }
  });

  test('TC-HOME-03 hero carousel moves to another slide when "Next" is clicked', async ({
    homePage,
  }) => {
    await expect(homePage.carouselItems.first()).toBeAttached();
    expect(await homePage.carouselItems.count()).toBeGreaterThan(1);

    const before = await homePage.activeSlideIndex();
    await homePage.carouselNext.click();
    await expect.poll(() => homePage.activeSlideIndex()).not.toBe(before);
  });

  test('TC-HOME-04 shows the six-step certification process', async ({ homePage }) => {
    for (const step of content.certificationProcessSteps) {
      await expect.soft(homePage.processStep(step), step).toBeVisible();
    }
  });

  test('TC-HOME-05 lists latest news with a date and links to the news index', async ({
    homePage,
    page,
  }) => {
    await expect(homePage.latestNewsTitles.first()).toBeVisible();
    expect(await homePage.latestNewsTitles.count()).toBeGreaterThanOrEqual(1);
    await expect(page.locator('main')).toContainText(SHORT_DATE);

    await homePage.seeAllNews.click();
    await expect(page).toHaveURL(/\/berita$/);
  });

  test('TC-HOME-06 header "Login" button opens the login page', async ({ homePage, page }) => {
    await homePage.nav.loginButton.click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
