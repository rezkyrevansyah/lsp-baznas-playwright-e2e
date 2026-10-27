import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  protected readonly path = '/';

  readonly carousel: Locator;
  readonly carouselItems: Locator;
  readonly carouselNext: Locator;
  readonly carouselPrev: Locator;
  readonly intro: Locator;
  readonly counters: Locator;
  readonly latestNewsTitles: Locator;
  readonly seeAllNews: Locator;

  constructor(page: Page) {
    super(page);
    this.carousel = page.locator('#carouselExampleControls');
    this.carouselItems = this.carousel.locator('.carousel-item');
    this.carouselNext = this.carousel.locator('.carousel-control-next');
    this.carouselPrev = this.carousel.locator('.carousel-control-prev');
    this.intro = page.getByText('Lembaga Sertifikasi Profesi Badan Amil Zakat Nasional').first();
    this.counters = page.locator('.row.counters > div');
    this.latestNewsTitles = page.locator('main a[href*="/berita/"] h4');
    this.seeAllNews = page.getByRole('link', { name: /Lihat Semua/ });
  }

  async activeSlideIndex(): Promise<number> {
    return this.carouselItems.evaluateAll((items) =>
      items.findIndex((item) => item.classList.contains('active')),
    );
  }

  /** Reads the final value of a statistic counter by its label, e.g. "Asesor Kompetensi". */
  async counterValue(label: string): Promise<number> {
    const box = this.counters.filter({ has: this.page.locator('p', { hasText: label }) });
    const end = await box.locator('.purecounter').getAttribute('data-purecounter-end');
    return Number(end);
  }

  /** Names of the certification-scheme cards shown on the homepage. */
  async schemeCardNames(): Promise<string[]> {
    const texts = await this.page
      .locator('main p')
      .filter({ hasText: /^\s*Skema Sertifikasi .+/ })
      .allInnerTexts();
    return texts.map((t) => t.replace(/^\s*Skema Sertifikasi\s+/, '').trim());
  }

  processStep(name: string): Locator {
    return this.page.locator('main').getByText(name, { exact: true }).first();
  }
}
