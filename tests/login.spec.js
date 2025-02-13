import { test, expect } from '@playwright/test'
import { obterCodigo2FA } from '../support/db'
import { LoginPage } from '../pages/LoginPage'
import { DashPage } from '../pages/DashPage'

test('Login com código de autenticação inválido', async ({ page }) => {
    const loginPage = new LoginPage(page)

    const usuario = {
        cpf: '00000014141',
        senha: '147258',
    }

    await loginPage.acessaPagina()
    await loginPage.informaCpf(usuario.cpf)
    await loginPage.informaSenha(usuario.senha)
    await loginPage.informa2FA('123456')

    await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.')
})

test('Login com código de autenticação válido', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashPage = new DashPage(page)

    const usuario = {
        cpf: '00000014141',
        senha: '147258',
    }

    await loginPage.acessaPagina()
    await loginPage.informaCpf(usuario.cpf)
    await loginPage.informaSenha(usuario.senha)

    await page.waitForTimeout(3000) // temporário
    const codigo = await obterCodigo2FA()
    await loginPage.informa2FA(codigo)
    await page.waitForTimeout(3000)

    expect(await dashPage.obterSaldo()).toContainText('R$ 5.000,00')
})
