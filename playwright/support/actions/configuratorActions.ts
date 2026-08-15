import { expect, Page } from '@playwright/test'

type CarOptional = 'precision-park' | 'flux-capacitor'

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

        async setOptional(optional: CarOptional, enabled: boolean) {
            const optionalCheckbox = page.getByTestId(`opt-${optional}`)
        
            await expect(optionalCheckbox).toBeVisible()
        
            if (await optionalCheckbox.isChecked() !== enabled) {
                await optionalCheckbox.click()
            }
        
            await expect(optionalCheckbox).toBeChecked({
                checked: enabled,
            })
        },

        async expectTotalPrice(price: string) {
            const priceElement = page.getByTestId('total-price')
            await expect(priceElement).toBeVisible()
            await expect(priceElement).toHaveText(price)
        },

        async expectCarImageSrc(src: string) {
            const carImage = page.getByTestId('car-exterior-image')
            await expect(carImage).toHaveAttribute('src', src)
        },

        async goToCheckout() {
            const checkoutButton = page.getByTestId('checkout-button')
            await expect(checkoutButton).toBeVisible()
            await checkoutButton.click()
            await expect(page).toHaveURL(/\/order$/)
        },
    }
}
