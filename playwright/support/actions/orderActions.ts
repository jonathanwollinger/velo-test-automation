import { expect, Page } from '@playwright/test'

export function createOrderActions(page: Page) {
    return {
        async open() {
            await page.goto('/order')
        },

        async expectTotalPrice(price: string) {
            const totalPrice = page.getByTestId('summary-total-price')
            await expect(totalPrice).toBeVisible()
            await expect(totalPrice).toHaveText(price)
        },
    }
}
