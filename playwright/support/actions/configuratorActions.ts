import { expect, Page } from '@playwright/test'

export function createConfiguratorActions(page: Page) {
    return {
        async open() {
            await page.goto('/configure')
        },

        async selectColor(name: string) {
            await page.getByRole('button', { name }).click()
        },

        async selectWhells(name: string | RegExp) {
            await page.getByRole('button', { name }).click()
        },

        async expectPrice(price: string) {
            const priceElement = page.getByTestId('total-price')
            await expect(priceElement).toBeVisible()
            await expect(priceElement).toHaveText(price)
        },

        async expectCarImageSrc(src: string) {
            const carImage = page.getByTestId('car-exterior-image')
            await expect(carImage).toHaveAttribute('src', src)
        },
    }
}
