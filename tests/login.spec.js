import { test, expect } from '@playwright/test'
import { obterCodigo2FA } from '../support/db'

import { LoginPage } from '../pages/LoginPage'
import { DashPage } from '../pages/DashPage'

import { cleanJobs, getJob } from '../support/redis'

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

// test('Login com código de autenticação válido via DB', async ({ page }) => {
//     const loginPage = new LoginPage(page)
//     const dashPage = new DashPage(page)

//     const usuario = {
//         cpf: '00000014141',
//         senha: '147258',
//     }

//     await cleanJobs()

//     await loginPage.acessaPagina()
//     await loginPage.informaCpf(usuario.cpf)
//     await loginPage.informaSenha(usuario.senha)

//     await page.getByRole('heading', { name: 'Verificação em duas etapas' }).waitFor({ timeout: 3000 })

//     const code = await obterCodigo2FA(usuario.cpf)
//     await loginPage.informa2FA(code)

//     await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
// })

test('Login com código de autenticação válido via Redis', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashPage = new DashPage(page)

    const usuario = {
        cpf: '00000014141',
        senha: '147258',
    }

    await cleanJobs()

    await loginPage.acessaPagina()
    await loginPage.informaCpf(usuario.cpf)
    await loginPage.informaSenha(usuario.senha)

    await page.getByRole('heading', { name: 'Verificação em duas etapas' }).waitFor({ timeout: 3000 })

    const code = await getJob()
    await loginPage.informa2FA(code)

    await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
})
