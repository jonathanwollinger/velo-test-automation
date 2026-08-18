import { expect, Page } from '@playwright/test'

type CarOptional = 'precision-park' | 'flux-capacitor'

export function createConfiguratorActions(page: Page) {
    const optionalCheckbox = (optional: CarOptional) =>
        page.getByTestId(`opt-${optional}`)

    const wheelOption = (wheel: string) =>
        page.getByTestId(`wheel-option-${wheel}`)

    return {
        async open() {
            await page.goto('/configure')
        },

        async selectColor(name: string) {
            await page.getByRole('button', { name }).click()
        },

        async selectWheels(wheelName: string) {
            await expect(wheelOption(wheelName)).toBeVisible()
            await wheelOption(wheelName).click()
        },

        async checkOptional(optional: CarOptional) {
            await expect(optionalCheckbox(optional)).toBeVisible()
            await optionalCheckbox(optional).check()
        },

        async uncheckOptional(optional: CarOptional) {
            await expect(optionalCheckbox(optional)).toBeVisible()
            await optionalCheckbox(optional).uncheck()
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

        async finishConfigurator() {
            const checkoutButton = page.getByTestId('checkout-button')

            await expect(checkoutButton).toBeVisible()
            await checkoutButton.click()
            await expect(page).toHaveURL('/order')
        },
    }
}
