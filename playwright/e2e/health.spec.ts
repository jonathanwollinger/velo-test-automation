import { test, expect } from '../support/fixtures'

test('Aplicacao Velo deve estar online', async ({ app, page }) => {
  await app.landing.goto()

  await expect(page).toHaveTitle(/Velô by Papito/)
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
})
