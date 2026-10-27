import { type Locator, type Page, expect } from '@playwright/test';
import { escapeRegExp } from '../../utils/helpers';

/** Top navigation bar shared by every public page (BootstrapMade-style template). */
export class NavBar {
  readonly root: Locator;
  readonly mobileToggle: Locator;
  readonly loginButton: Locator;
  readonly logo: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('#navbar');
    this.mobileToggle = this.root.locator('.mobile-nav-toggle');
    this.loginButton = page.locator('header').getByRole('link', { name: 'Login', exact: true });
    this.logo = page.locator('header a').first();
  }

  /** A top-level menu item, e.g. "Profil", "Sertifikasi", "Kontak". */
  menu(name: string): Locator {
    return this.root.locator(':scope > ul > li > a').filter({ hasText: exactText(name) });
  }

  /** A link inside a dropdown, e.g. "Sejarah LSP". */
  subMenu(name: string): Locator {
    return this.root.locator(':scope > ul > li ul a').filter({ hasText: exactText(name) });
  }

  /** Desktop: dropdowns open on hover. */
  async hoverMenu(name: string): Promise<void> {
    await this.menu(name).hover();
  }

  /** Desktop: hover a parent menu and click one of its children. */
  async navigateTo(parent: string, child: string): Promise<void> {
    await this.hoverMenu(parent);
    const link = this.subMenu(child);
    await expect(link).toBeVisible();
    await link.click();
  }

  /** Mobile: open the hamburger menu. */
  async openMobileMenu(): Promise<void> {
    await this.mobileToggle.click();
    await expect(this.root).toHaveClass(/navbar-mobile/);
  }

  /** Mobile: expand a dropdown by tapping its parent. */
  async expandMobileDropdown(name: string): Promise<void> {
    await this.menu(name).click();
  }
}

/** Whole-text match that ignores surrounding whitespace (menu labels carry icons/spaces). */
function exactText(value: string): RegExp {
  return new RegExp(`^\\s*${escapeRegExp(value)}\\s*$`);
}
