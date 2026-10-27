import { type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/** A page whose main content is a form. Tests check HTML5 validity only – they never submit. */
export abstract class FormPage extends BasePage {
  abstract readonly form: Locator;

  /** Native HTML5 validity of the whole form, evaluated without submitting it. */
  isFormValid(): Promise<boolean> {
    return this.form.evaluate((f) => (f as HTMLFormElement).checkValidity());
  }
}
