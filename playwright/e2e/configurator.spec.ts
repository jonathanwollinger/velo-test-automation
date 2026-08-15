import { test } from '../support/fixtures'

test.describe('Configuração do veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('deve atualizar a imagem e manter o preço base ao alterar a cor', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.selectColor('Midnight Black')
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/midnight-black-aero-wheels.png')
  })

  test('deve atualizar a imagem e o preço base ao alterar as rodas e restaurar os valores padrao', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.selectWhells(/Sport Wheels/)
    await app.configurator.expectPrice('R$ 42.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-sport-wheels.png')
    
    await app.configurator.selectWhells(/Aero Wheels/)
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-aero-wheels.png')
  })
})
