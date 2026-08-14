import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({
  quiet: true,
});

if (!process.env.BASE_URL) {
  throw new Error('A variável BASE_URL não foi definida.');
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Tempo maximo de espera para cada teste completo (padrao 30s)
  timeout: 60000,

  // Tempo maximo para asserções - toVisible, toContainText, etc. (padrao 5s)
  expect: {
    timeout: 5000, // nao vale a pena alterar, pois o teste pode demorar no tempo de execução, utilizar o timeout explicito
  },

  testDir: './playwright/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    // tempo maximo para actions interativas - click, fill, etc. (padrao 10s)
    // Quando o valor é 0, significa que o teste herda o timeout do teste completo
    actionTimeout: 5000, 

    // tempo maximo para navegação - goto(), waitforurl(), reload(), etc. (padrao 10s)
    // Quando o valor é 0, significa que o teste herda o timeout do teste completo
    navigationTimeout: 10000, 
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
