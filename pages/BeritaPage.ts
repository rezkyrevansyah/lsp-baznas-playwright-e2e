import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BeritaPage extends BasePage {
  protected readonly path = '/berita';

  /** Article title links in the main list (titles are wrapped in <b>). */
  readonly articleTitles: Locator;
  readonly pagination: Locator;
  readonly popularNewsHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.articleTitles = page.locator('main a[href*="/berita/"]:has(b)');
    this.pagination = page.locator('.pagination').first();
    this.popularNewsHeading = page.getByRole('heading', { name: 'Berita Populer' });
  }

  pageLink(label: string): Locator {
    return this.pagination.getByRole('link', { name: label, exact: true });
  }
}

export class BeritaDetailPage extends BasePage {
  protected readonly path: string;
  /** Article body column (excludes the "Berita Terkait" sidebar). */
  readonly article: Locator;
  readonly relatedNewsHeading: Locator;

  constructor(page: Page, path = '/berita') {
    super(page);
    this.path = path;
    this.article = page.locator('#new-details .col-lg-8');
    this.relatedNewsHeading = page.getByRole('heading', { name: 'Berita Terkait' });
  }
}
