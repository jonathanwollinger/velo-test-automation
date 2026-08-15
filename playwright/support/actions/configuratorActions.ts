import { expect, Page } from '@playwright/test'

type OptionalFeature = 'precision-park' | 'flux-capacitor'

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

        async toggleOptional(optional: OptionalFeature) {
            const optionalCheckbox = page.getByTestId(`opt-${optional}`)
            await expect(optionalCheckbox).toBeVisible()
            await optionalCheckbox.click()
        },

        async expectOptionalSelected(optional: OptionalFeature, selected: boolean) {
            const optionalCheckbox = page.getByTestId(`opt-${optional}`)
            await expect(optionalCheckbox).toBeVisible()

            if (selected) {
                await expect(optionalCheckbox).toBeChecked()
                return
            }

            await expect(optionalCheckbox).not.toBeChecked()
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

        async checkout() {
            const checkoutButton = page.getByTestId('checkout-button')
            await expect(checkoutButton).toBeVisible()
            await checkoutButton.click()
            await expect(page).toHaveURL(/\/order$/)
        },

        async expectCheckoutPrice(price: string) {
            const checkoutPrice = page.getByTestId('summary-total-price')
            await expect(checkoutPrice).toBeVisible()
            await expect(checkoutPrice).toHaveText(price)
        },
    }
}
