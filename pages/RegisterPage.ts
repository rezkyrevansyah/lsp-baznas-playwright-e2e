import { type Locator, type Page } from '@playwright/test';
import { FormPage } from './FormPage';

/**
 * Registration form. Tests NEVER submit this form – only client-side behaviour is verified,
 * so no account is created on the production system.
 */
export class RegisterPage extends FormPage {
  protected readonly path = '/register';

  readonly form: Locator;
  readonly username: Locator;
  readonly fullName: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly agreeCheckbox: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.locator('form');
    this.username = page.locator('input[name="username"]');
    this.fullName = page.locator('input[name="nama_lengkap"]');
    this.email = page.locator('input[name="email"]');
    this.phone = page.locator('input[name="hp"]');
    this.password = page.locator('input[name="password"]');
    this.confirmPassword = page.locator('input[name="confirm"]');
    this.agreeCheckbox = page.locator('input[name="agree"]');
    this.submitButton = page.getByRole('button', { name: 'Daftar' });
    this.loginLink = page.getByRole('link', { name: 'Login', exact: true });
  }

  /** The eye icon that toggles password visibility for the given input. */
  visibilityToggle(input: Locator): Locator {
    return input.locator('xpath=..').locator('.password-addon');
  }
}
