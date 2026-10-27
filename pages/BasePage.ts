import { type Locator, type Page, type Response, expect } from '@playwright/test';
import { NavBar } from './components/NavBar';

export abstract class BasePage {
  readonly nav: NavBar;
  readonly footer: Locator;
  /** Main page heading (h2 – the site uses an empty logo <h1>). */
  readonly pageHeading: Locator;

  protected abstract readonly path: string;

  constructor(readonly page: Page) {
    this.nav = new NavBar(page);
    this.footer = page.locator('footer');
    this.pageHeading = page.getByRole('heading', { level: 2 }).first();
  }

  async open(): Promise<Response | null> {
    return this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Scrolls to the bottom so lazy images load, waits until every image in `scope` has
   * settled, then returns the ones that failed to render. Only `scope` is awaited, so a
   * heavy section elsewhere on the page does not slow the check down.
   */
  async brokenImages(scope: Locator = this.page.locator('body')): Promise<string[]> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const images = scope.locator('img');
    await expect
      .poll(
        () =>
          images.evaluateAll((imgs) => (imgs as HTMLImageElement[]).every((img) => img.complete)),
        { timeout: 30_000 },
      )
      .toBe(true);
    return images.evaluateAll((imgs) =>
      (imgs as HTMLImageElement[])
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src),
    );
  }
}
