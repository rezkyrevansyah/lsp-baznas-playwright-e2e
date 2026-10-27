import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { DataTablePage } from '../pages/DataTablePage';
import { ContentPage } from '../pages/ContentPage';
import { BeritaPage } from '../pages/BeritaPage';
import { FaqPage } from '../pages/FaqPage';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { KontakPage } from '../pages/KontakPage';

type PageFixtures = {
  homePage: HomePage;
  skemaPage: ContentPage;
  asesorPage: DataTablePage;
  jadwalPage: DataTablePage;
  tukPage: DataTablePage;
  beritaPage: BeritaPage;
  faqPage: FaqPage;
  registerPage: RegisterPage;
  loginPage: LoginPage;
  kontakPage: KontakPage;
};

/** Injects ready-to-use page objects into every test. */
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  skemaPage: async ({ page }, use) => use(new ContentPage(page, '/skema_sertifikasi')),
  asesorPage: async ({ page }, use) => use(new DataTablePage(page, '/asesor_kompetensi')),
  jadwalPage: async ({ page }, use) => use(new DataTablePage(page, '/jadwal')),
  tukPage: async ({ page }, use) => use(new DataTablePage(page, '/tempat_uji_kompetensi')),
  beritaPage: async ({ page }, use) => use(new BeritaPage(page)),
  faqPage: async ({ page }, use) => use(new FaqPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  kontakPage: async ({ page }, use) => use(new KontakPage(page)),
});

export { expect };
