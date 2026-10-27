import { type Locator, type Page } from '@playwright/test';
import { FormPage } from './FormPage';

/** Contact page. The form is validated client-side only – never submitted. */
export class KontakPage extends FormPage {
  protected readonly path = '/kontak';

  readonly form: Locator;
  readonly map: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.locator('main form');
    this.map = page.locator('main iframe[src*="google.com"]');
  }

  field(name: 'name' | 'email' | 'subject' | 'message'): Locator {
    return this.form.locator(`[name="${name}"]`);
  }
}
