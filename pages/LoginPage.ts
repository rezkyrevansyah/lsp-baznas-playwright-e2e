import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Login page. Tests only check the UI – no credentials are ever entered. */
export class LoginPage extends BasePage {
  protected readonly path = '/login';

  readonly credential: Locator;
  readonly password: Locator;
  readonly submitButton: Locator;
  readonly forgotPassword: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);
    this.credential = page.locator('input[name="credential"]');
    this.password = page.locator('input[name="password"]');
    this.submitButton = page.getByRole('button', { name: 'Log In' });
    this.forgotPassword = page.getByRole('link', { name: /Forgot your password/i });
    this.registerLink = page.getByRole('link', { name: 'Daftar Sekarang' });
  }
}
