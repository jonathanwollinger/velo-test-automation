import { test } from '../support/fixtures'

test.describe('Configuração do veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('deve atualizar a imagem e manter o preço base ao alterar a cor', async ({ app }) => {
    await app.configurator.expectTotalPrice('R$ 40.000,00')

    await app.configurator.selectColor('Midnight Black')
    await app.configurator.expectTotalPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/midnight-black-aero-wheels.png')
  })

  test('deve atualizar a imagem e o preço base ao alterar as rodas e restaurar os valores padrao', async ({ app }) => {
    await app.configurator.expectTotalPrice('R$ 40.000,00')

    await app.configurator.selectWhells(/Sport Wheels/)
    await app.configurator.expectTotalPrice('R$ 42.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-sport-wheels.png')

    await app.configurator.selectWhells(/Aero Wheels/)
    await app.configurator.expectTotalPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-aero-wheels.png')
  })

  test('deve atualizar o preço ao adicionar e remover o Precision Park', async ({ app }) => {
    await app.configurator.expectTotalPrice('R$ 40.000,00')
    await app.configurator.setOptional('precision-park', false)

    await app.configurator.setOptional('precision-park', true)
    await app.configurator.expectTotalPrice('R$ 45.500,00')

    await app.configurator.setOptional('precision-park', false)
    await app.configurator.expectTotalPrice('R$ 40.000,00')
  })

  test('deve atualizar o preço ao adicionar e remover o Flux Capacitor', async ({ app }) => {
    await app.configurator.expectTotalPrice('R$ 40.000,00')
    await app.configurator.setOptional('flux-capacitor', false)

    await app.configurator.setOptional('flux-capacitor', true)
    await app.configurator.expectTotalPrice('R$ 45.000,00')

    await app.configurator.setOptional('flux-capacitor', false)
    await app.configurator.expectTotalPrice('R$ 40.000,00')
  })

  test('deve calcular o preço ao combinar e remover opcionais e exibir o total no checkout', async ({ app }) => {
    await app.configurator.expectTotalPrice('R$ 40.000,00')

    await app.configurator.setOptional('precision-park', true)
    await app.configurator.expectTotalPrice('R$ 45.500,00')

    await app.configurator.setOptional('flux-capacitor', true)
    await app.configurator.expectTotalPrice('R$ 50.500,00')

    await app.configurator.setOptional('precision-park', false)
    await app.configurator.expectTotalPrice('R$ 45.000,00')

    await app.configurator.setOptional('flux-capacitor', false)
    await app.configurator.expectTotalPrice('R$ 40.000,00')

    await app.configurator.goToCheckout()
    await app.order.expectTotalPrice('R$ 40.000,00')
  })

  test('deve calcular e exibir no checkout o preço total com rodas e opcionais', async ({ app }) => {
    await app.configurator.expectTotalPrice('R$ 40.000,00')

    await app.configurator.selectWhells(/Sport Wheels/)
    await app.configurator.expectTotalPrice('R$ 42.000,00')

    await app.configurator.setOptional('precision-park', true)
    await app.configurator.expectTotalPrice('R$ 47.500,00')

    await app.configurator.setOptional('flux-capacitor', true)
    await app.configurator.expectTotalPrice('R$ 52.500,00')

    await app.configurator.goToCheckout()
    await app.order.expectTotalPrice('R$ 52.500,00')
  })
})
