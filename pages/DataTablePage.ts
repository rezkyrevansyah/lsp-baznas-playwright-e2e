import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Generic page object for listing pages rendered with DataTables 2.x
 * (Asesor Kompetensi, Jadwal Uji Kompetensi, Tempat Uji Kompetensi).
 * Filtering/paging is client-side, so these interactions create no extra server load.
 */
export class DataTablePage extends BasePage {
  readonly container: Locator;
  readonly table: Locator;
  readonly headers: Locator;
  readonly rows: Locator;
  readonly searchInput: Locator;
  readonly info: Locator;
  readonly emptyRow: Locator;
  readonly pageLength: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(
    page: Page,
    protected readonly path: string,
  ) {
    super(page);
    this.container = page.locator('.dt-container');
    this.table = this.container.locator('table');
    this.headers = this.table.locator('thead th');
    this.rows = this.table.locator('tbody tr');
    this.searchInput = this.container.locator('.dt-search input');
    this.info = this.container.locator('.dt-info');
    this.emptyRow = this.table.locator('td.dt-empty');
    this.pageLength = this.container.locator('.dt-length select');
    this.nextButton = this.container.locator('.dt-paging [aria-label="Next"]');
    this.previousButton = this.container.locator('.dt-paging [aria-label="Previous"]');
  }

  async headerTexts(): Promise<string[]> {
    return (await this.headers.allInnerTexts()).map((t) => t.trim());
  }

  /** Parses "Showing 1 to 10 of 73 entries" → 73 (total before filtering). */
  async totalEntries(): Promise<number> {
    await expect(this.info).toContainText('entries');
    const text = await this.info.innerText();
    const filtered = text.match(/filtered from (\d+)/);
    if (filtered) return Number(filtered[1]);
    const match = text.match(/of (\d+) entries/);
    if (!match) throw new Error(`Unable to parse DataTables info: "${text}"`);
    return Number(match[1]);
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  columnValues(index: number): Promise<string[]> {
    return this.rows.locator(`td:nth-child(${index})`).allInnerTexts();
  }
}
