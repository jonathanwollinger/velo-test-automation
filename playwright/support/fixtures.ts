import { test as base } from '@playwright/test'

import { createLandingActions } from './actions/landingActions'
import { createOrderLookupActions } from './actions/orderLookupActions'

type App = {
    landing: ReturnType<typeof createLandingActions>
    orderLookup: ReturnType<typeof createOrderLookupActions>
}

export const test = base.extend<{ app: App }>({
    app: async ({ page }, useApp) => {
        const app: App = {
            landing: createLandingActions(page),
            orderLookup: createOrderLookupActions(page),
        }

        await useApp(app)
    },
})

export { expect } from '@playwright/test'
