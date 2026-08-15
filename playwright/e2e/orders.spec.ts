import { expect, test } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import { OrderDetails } from '../support/actions/orderLookupActions'

test.describe('Consulta de Pedido', () => {

    test.beforeEach(async ({ app }) => {
        await app.orderLookup.open()
    })

    test('deve consultar um pedido APROVADO', async ({ app }) => {
        const order: OrderDetails = {
            number: 'VLO-86R45Q',
            status: 'APROVADO' as const,
            color: 'Midnight Black',
            wheels: 'sport Wheels',
            customer: {
                name: 'Jonathan Wollinger',
                email: 'jonathanwollinger@gmail.com'
            },
            payment: 'À Vista'
        }

        await app.orderLookup.searchOrder(order.number)

        await app.orderLookup.validateOrderDetails(order)
        await app.orderLookup.validateStatusBadge(order.status)
    })

    test('deve consultar um pedido REPROVADO', async ({ app }) => {
        const order: OrderDetails = {
            number: 'VLO-QBJBF3',
            status: 'REPROVADO' as const,
            color: 'Glacier Blue',
            wheels: 'sport Wheels',
            customer: {
                name: 'Teste Reprovado',
                email: 'teste-reprovado@email.com'
            },
            payment: 'À Vista'
        }

        await app.orderLookup.searchOrder(order.number)

        await app.orderLookup.validateOrderDetails(order)
        await app.orderLookup.validateStatusBadge(order.status)
    })

    test('deve consultar um pedido EM ANALISE', async ({ app }) => {
        const order: OrderDetails = {
            number: 'VLO-83Q38G',
            status: 'EM_ANALISE' as const,
            color: 'Lunar White',
            wheels: 'sport Wheels',
            customer: {
                name: 'Teste Em Analise',
                email: 'teste-em-analise@email.com'
            },
            payment: 'À Vista'
        }

        await app.orderLookup.searchOrder(order.number)

        await app.orderLookup.validateOrderDetails(order)
        await app.orderLookup.validateStatusBadge(order.status)
    })

    test('deve exibir mensagem de erro ao consultar um pedido inexistente', async ({ app }) => {
        const orderNumber = generateOrderCode()

        await app.orderLookup.searchOrder(orderNumber)
        await app.orderLookup.validateOrderNotFound()
    })

    test('deve exibir mensagem de erro ao consultar um pedido fora do padrao', async ({ app }) => {
        const orderNumber = 'COD INVÁLIDO'

        await app.orderLookup.searchOrder(orderNumber)
        await app.orderLookup.validateOrderNotFound()
    })

    test('deve manter o botao de busca desabilitado com campos vazio ou apenas espaços', async ({ app }) => {
        const button = app.orderLookup.elements.searchButton
        await expect(button).toBeDisabled()

        await app.orderLookup.elements.orderInput.fill('    ')
        await expect(button).toBeDisabled()
    })
})
