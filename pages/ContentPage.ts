import { type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Simple static content pages (Profil, Alur Sertifikasi, Skema, Dokumentasi, ...). */
export class ContentPage extends BasePage {
  constructor(
    page: Page,
    protected readonly path: string,
  ) {
    super(page);
  }

  /** H3 titles on the "Skema Sertifikasi" page. */
  async schemeNames(): Promise<string[]> {
    return (await this.page.locator('main h3').allInnerTexts()).map((t) => t.trim());
  }
}
