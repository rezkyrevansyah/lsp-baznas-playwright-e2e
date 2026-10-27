import { test, expect } from '../../fixtures';

/**
 * IMPORTANT: these tests run against production.
 * Forms are NEVER submitted and no credentials are entered –
 * only client-side behaviour (fields, HTML5 validity, UI toggles, links) is verified.
 */

test.describe('Registration form (client-side only)', { tag: '@regression' }, () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.open();
  });

  test('TC-REG-01 shows every registration field and the submit button', async ({
    registerPage,
    page,
  }) => {
    await expect(page.getByText('Registrasi Akun')).toBeVisible();
    for (const field of [
      registerPage.username,
      registerPage.fullName,
      registerPage.email,
      registerPage.phone,
      registerPage.password,
      registerPage.confirmPassword,
    ]) {
      await expect.soft(field).toBeVisible();
      await expect.soft(field).toBeEditable();
    }
    await expect(registerPage.submitButton).toBeEnabled();
  });

  test('TC-REG-02 placeholders explain the expected input format', async ({ registerPage }) => {
    await expect(registerPage.username).toHaveAttribute('placeholder', /minimal 6 digit/i);
    await expect(registerPage.phone).toHaveAttribute('placeholder', /08\d+/);
    await expect(registerPage.password).toHaveAttribute('placeholder', /minimal 8 karakter/i);
  });

  test('TC-REG-03 empty form is invalid (username is required)', async ({ registerPage }) => {
    expect(await registerPage.isFormValid()).toBe(false);
    const valueMissing = await registerPage.username.evaluate(
      (el) => (el as HTMLInputElement).validity.valueMissing,
    );
    expect(valueMissing).toBe(true);
  });

  test('TC-REG-04 password visibility can be toggled', async ({ registerPage }) => {
    await registerPage.password.fill('Rahasia123');
    await expect(registerPage.password).toHaveAttribute('type', 'password');

    await registerPage.visibilityToggle(registerPage.password).click();
    await expect(registerPage.password).toHaveAttribute('type', 'text');

    await registerPage.visibilityToggle(registerPage.password).click();
    await expect(registerPage.password).toHaveAttribute('type', 'password');
  });

  test('TC-REG-05 terms checkbox is unchecked by default', async ({ registerPage }) => {
    await expect(registerPage.agreeCheckbox).not.toBeChecked();
  });

  test('TC-REG-06 "Login" link navigates to the login page', async ({ registerPage, page }) => {
    await registerPage.loginLink.click();
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe('Login page (UI only)', { tag: '@regression' }, () => {
  test('TC-LOGIN-01 shows credential & password fields, forgot-password and register links', async ({
    loginPage,
    page,
  }) => {
    await loginPage.open();
    await expect(page).toHaveTitle(/Login/);
    await expect(loginPage.credential).toBeVisible();
    await expect(loginPage.password).toHaveAttribute('type', 'password');
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.forgotPassword).toBeVisible();

    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/\/register$/);
  });
});

test.describe('Contact form (client-side only)', { tag: '@regression' }, () => {
  test.beforeEach(async ({ kontakPage }) => {
    await kontakPage.open();
  });

  test('TC-CONTACT-01 all fields are required and the empty form is invalid', async ({
    kontakPage,
  }) => {
    for (const name of ['name', 'email', 'subject', 'message'] as const) {
      await expect.soft(kontakPage.field(name)).toHaveAttribute('required', /.*/);
    }
    expect(await kontakPage.isFormValid()).toBe(false);
  });

  test('TC-CONTACT-02 form becomes valid once all fields are filled (not submitted)', async ({
    kontakPage,
  }) => {
    await kontakPage.field('name').fill('QA Automation');
    await kontakPage.field('email').fill('qa@example.com');
    await kontakPage.field('subject').fill('Test');
    await kontakPage.field('message').fill('Pesan uji – tidak dikirim.');
    expect(await kontakPage.isFormValid()).toBe(true);
  });

  test('TC-CONTACT-03 rejects an invalid e-mail address (HTML5 validation)', async ({
    kontakPage,
  }) => {
    await kontakPage.field('email').fill('bukan-email');
    const typeMismatch = await kontakPage
      .field('email')
      .evaluate((el) => (el as HTMLInputElement).validity.typeMismatch);
    expect(typeMismatch).toBe(true);
  });

  test('TC-CONTACT-04 shows an embedded Google Map', async ({ kontakPage }) => {
    await expect(kontakPage.map).toBeAttached();
  });
});
