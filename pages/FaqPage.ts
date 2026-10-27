import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FaqPage extends BasePage {
  protected readonly path = '/faq';

  readonly questions: Locator;

  constructor(page: Page) {
    super(page);
    this.questions = page.locator('.accordion-button');
  }

  question(index: number): Locator {
    return this.questions.nth(index);
  }

  /**
   * Clicks a question and waits for the Bootstrap collapse animation to finish –
   * clicks made mid-transition are ignored by Bootstrap.
   */
  async toggle(index: number): Promise<void> {
    await this.question(index).click();
    await expect(this.page.locator('.accordion .collapsing')).toHaveCount(0);
  }

  /** Collapsible answer panel controlled by the question button. */
  async answer(index: number): Promise<Locator> {
    const target = await this.question(index).getAttribute('data-bs-target');
    if (!target) throw new Error(`FAQ question ${index} has no data-bs-target attribute`);
    return this.page.locator(target);
  }
}
