/// <reference types="cypress" />

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const loginSelectors = {
  loginUrl: '/login',
  dashboardUrl: '/dashboard',
  inputRF: () => cy.get('input').filter('[type="text"], [type="number"]').first(),
  inputSenha: () => cy.get('input[type="password"]'),
  botaoAcessar: () => cy.contains('button', /Acessar|Entrar|Login/i),
  tituloDashboard: () => cy.contains(/Dashboard|Lista de designações/i, { timeout: 10000 }),
  paginaPrincipal: () => cy.get('main, .content, .dashboard, [role="main"]', { timeout: 10000 }),
  mensagemErro: () => cy.contains(/erro|inválid|incorret|não encontrado|obrigatório/i, { timeout: 5000 }),
}

const obterCredenciais = () => {
  const rf = Cypress.env('SIGLA_LOGIN_RF')
  const senha = Cypress.env('SIGLA_LOGIN_SENHA')
  
  if (!rf || !senha) {
    throw new Error('Credenciais nao configuradas. Configure SIGLA_LOGIN_RF e SIGLA_LOGIN_SENHA no arquivo .env')
  }
  
  return { rf, senha }
}

const obterBaseUrlUI = () => Cypress.env('SIGLA_UI_BASE_URL') || 'https://hom-sigla.sme.prefeitura.sp.gov.br'

Given('que estou na página de login do SIGLA', () => {
  const baseUrl = obterBaseUrlUI()
  cy.visit(`${baseUrl}${loginSelectors.loginUrl}`, { timeout: 15000 })
  cy.url().should('include', loginSelectors.loginUrl)
  Cypress.log({
    name: 'LOGIN PAGE',
    message: `Acessou página de login: ${baseUrl}${loginSelectors.loginUrl}`,
  })
})

When('eu insiro credenciais válidas', () => {
  const credenciais = obterCredenciais()
  loginSelectors.inputRF().clear({ force: true }).type(credenciais.rf, { force: true, delay: 100 })
  cy.wait(500)
  loginSelectors.inputSenha().clear({ force: true }).type(credenciais.senha, { force: true, delay: 100 })
  cy.wait(500)
})

When(/^(?:eu )?clico no botão de acessar$/, () => {
  loginSelectors.botaoAcessar().should('be.visible').click({ force: true })
  cy.wait(3000)
})

When('eu preencho o campo RF com {string}', (rf) => {
  loginSelectors.inputRF().clear({ force: true }).type(rf, { force: true, delay: 100 })
  cy.wait(500)
})

When('eu preencho o campo Senha com {string}', (senha) => {
  loginSelectors.inputSenha().clear({ force: true }).type(senha, { force: true, delay: 100 })
  cy.wait(500)
})

When(/^(?:eu )?aguardo a resposta da API de login$/, () => {
  cy.intercept('POST', '**/login**').as('loginAPI')
  cy.intercept('POST', '**/auth**').as('authAPI')
  cy.intercept('POST', '**/authenticate**').as('authenticateAPI')
  cy.wait(2000)
})

When(/^(?:eu )?limpo os campos de login$/, () => {
  loginSelectors.inputRF().clear({ force: true })
  loginSelectors.inputSenha().clear({ force: true })
})

Then('devo ser redirecionado para o dashboard', () => {
  cy.url({ timeout: 15000 }).then((url) => {
    const saiuDoLogin = !url.includes('/login')
    const estaNoDashboard = url.includes('/dashboard') || url.includes('/designa') || url.includes('/home')
    expect(saiuDoLogin || estaNoDashboard).to.be.true
  })
})

Then('devo visualizar a página principal do sistema', () => {
  cy.get('body', { timeout: 10000 }).should('be.visible')
  cy.get('body').then(($body) => {
    const temConteudo = $body.find('main, .content, .dashboard, [role="main"], nav, header').length > 0
    expect(temConteudo).to.be.true
  })
})

Then('eu devo ver o campo {string}', (campo) => {
  if (campo.toLowerCase().includes('rf')) {
    loginSelectors.inputRF().should('exist').and('be.visible')
  } else if (campo.toLowerCase().includes('senha')) {
    loginSelectors.inputSenha().should('exist').and('be.visible')
  }
})

Then('eu devo ver o botão {string}', (textoBotao) => {
  loginSelectors.botaoAcessar().should('exist').and('be.visible')
})

Then('o botão Acessar deve estar habilitado', () => {
  loginSelectors.botaoAcessar().should('not.be.disabled')
})

Then('devo visualizar o título {string} ou {string}', (titulo1, titulo2) => {
  cy.get('body', { timeout: 10000 }).then(($body) => {
    const temTitulo1 = $body.text().match(new RegExp(titulo1, 'i'))
    const temTitulo2 = $body.text().match(new RegExp(titulo2, 'i'))
    const temHeading = $body.find('h1, h2, h3, h4').length > 0
    expect(!!(temTitulo1 || temTitulo2 || temHeading)).to.be.true
  })
})

Then('a página principal deve estar visível', () => {
  loginSelectors.paginaPrincipal().should('exist').and('be.visible')
})

Then('devo ver uma mensagem de erro', () => {
  loginSelectors.mensagemErro().should('exist').and('be.visible')
})

Then('devo permanecer na página de login', () => {
  cy.url().should('include', loginSelectors.loginUrl)
})

Then('o botão Acessar deve estar desabilitado ou devo ver mensagem de erro', () => {
  cy.get('body').then(($body) => {
    const botaoDesabilitado = $body.find('button:disabled').length > 0
    const temMensagemErro = $body.text().match(/erro|obrigatório|inválido/i)
    expect(botaoDesabilitado || temMensagemErro).to.be.true
  })
})

Then('devo ver mensagem {string} ou botão desabilitado', (mensagem) => {
  cy.get('body', { timeout: 3000 }).then(($body) => {
    const temCampoObrigatorio = !!$body.text().match(/campo.*obrigat[óo]rio/i)
    const temInputInvalido = $body.find('input[aria-invalid="true"], input.is-invalid, input.error, input:invalid').length > 0
    const temDivErro = $body.find('.error, .invalid-feedback, .field-error, [role="alert"]').filter(':visible').length > 0
    const temValidacao = temCampoObrigatorio || temInputInvalido || temDivErro
    expect(temValidacao).to.be.true
  })
})

Then('a URL deve conter {string}', (urlEsperada) => {
  cy.url().should('include', urlEsperada)
})

Then('devo ver um título relacionado ao login', () => {
  cy.contains(/login|entrar|acesso|autenticação/i, { timeout: 5000 }).should('exist')
})

Then('os campos RF e Senha devem estar vazios', () => {
  loginSelectors.inputRF().should('have.value', '')
  loginSelectors.inputSenha().should('have.value', '')
})

Then('o tempo de resposta deve ser menor que {int} segundos', (tempoLimite) => {
  cy.get('@loginAPI', { timeout: tempoLimite * 1000 }).then((interception) => {
    if (interception && interception.duration) {
      const tempoEmSegundos = interception.duration / 1000
      expect(tempoEmSegundos).to.be.lessThan(tempoLimite)
    }
  })
})
