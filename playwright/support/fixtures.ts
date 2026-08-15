import { test as base } from '@playwright/test'

import { createLandingActions } from './actions/landingActions'
import { createConfiguratorActions } from './actions/configuratorActions'
import { createOrderActions } from './actions/orderActions'
import { createOrderLookupActions } from './actions/orderLookupActions'

type App = {
    landing: ReturnType<typeof createLandingActions>
    configurator: ReturnType<typeof createConfiguratorActions>
    order: ReturnType<typeof createOrderActions>
    orderLookup: ReturnType<typeof createOrderLookupActions>
}

export const test = base.extend<{ app: App }>({
    app: async ({ page }, useApp) => {
        const app: App = {
            landing: createLandingActions(page),
            configurator: createConfiguratorActions(page),
            order: createOrderActions(page),
            orderLookup: createOrderLookupActions(page),
        }

        await useApp(app)
    },
})

export { expect } from '@playwright/test'
