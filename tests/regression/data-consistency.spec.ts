import { test, expect } from '../../fixtures';

/**
 * Cross-page checks: the statistics advertised on the homepage must match
 * the actual data published on the corresponding listing pages.
 */
test.describe('Homepage statistics vs. published data', { tag: '@regression' }, () => {
  test('TC-DATA-01 "Asesor Kompetensi" counter equals asesor table total', async ({
    homePage,
    asesorPage,
  }) => {
    await homePage.open();
    const advertised = await homePage.counterValue('Asesor Kompetensi');

    await asesorPage.open();
    expect(await asesorPage.totalEntries()).toBe(advertised);
  });

  test('TC-DATA-02 "Tempat Uji Kompetensi" counter equals TUK table total', async ({
    homePage,
    tukPage,
  }) => {
    await homePage.open();
    const advertised = await homePage.counterValue('Tempat Uji Kompetensi');

    await tukPage.open();
    expect(await tukPage.totalEntries()).toBe(advertised);
  });

  test('TC-DATA-03 "Skema Sertifikasi" counter equals number of schemes listed', async ({
    homePage,
    skemaPage,
  }) => {
    await homePage.open();
    const advertised = await homePage.counterValue('Skema Sertifikasi');

    await skemaPage.open();
    expect(await skemaPage.schemeNames()).toHaveLength(advertised);
  });
});
