import { defineConfig, devices } from '@playwright/test';

/**
 * The target is the live production website.
 * Keep the load low: few workers, no load testing, read-only scenarios only.
 */
const BASE_URL = process.env.BASE_URL ?? 'https://lsp.baznas.go.id';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  workers: isCI ? 1 : 2,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    baseURL: BASE_URL,
    locale: 'id-ID',
    timezoneId: 'Asia/Jakarta',
    navigationTimeout: 45_000,
    actionTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Full regression on desktop Chromium.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      grepInvert: /@mobile/,
    },
    // Cross-browser coverage limited to smoke tests to keep traffic low.
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grep: /@smoke/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      grep: /@smoke/,
    },
    // Responsive behaviour.
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      grep: /@mobile/,
    },
  ],
});
