/// <reference types="cypress" />

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

// =====================================================
// HELPERS — compartilhados entre features
// =====================================================

export const obterBaseUrl = () =>
  Cypress.env('SIGLA_UI_BASE_URL') || 'https://qa-sigla.sme.prefeitura.sp.gov.br/alvo'

// Portal SIGLA (escolha entre ALVO e LOCUS) fica na mesma origem do ALVO, em /sigla
const obterUrlPortal = () => `${new URL(obterBaseUrl()).origin}/sigla`

// Seletores mapeados via inspeção de /sigla/login (labels com for="usuario"/"senha")
const portalSelectors = {
  campos: {
    'registro funcional (rf)': '#usuario',
    'senha': '#senha'
  },
  // Cards do portal são links para o sistema: /alvo/ e /locus/
  sistema: (nome) => `a[href="/${nome.trim().toLowerCase()}/"]`
}

const obterCampoPortal = (campo) => {
  const seletor = portalSelectors.campos[campo.trim().toLowerCase()]
  if (!seletor) {
    throw new Error(`Campo "${campo}" não mapeado na tela de login do portal SIGLA`)
  }
  return cy.get(seletor, { timeout: 15000 })
}

// Fluxo completo: /sigla/login → portal (escolha do sistema) → ALVO
export const realizarLoginPortalAlvo = (rf, senha) => {
  cy.visit(`${obterUrlPortal()}/login`)
  obterCampoPortal('Registro funcional (RF)').should('be.visible').click({ force: true })
    .clear({ force: true }).type(rf, { force: true, delay: 100 })
  obterCampoPortal('Senha').should('be.visible').click({ force: true })
    .clear({ force: true }).type(senha, { force: true, delay: 100, log: false })
  cy.contains('button', /^\s*Acessar\s*$/i).should('be.visible').click({ force: true })
  // Mesmo timeout estendido do login do ALVO: a API de autenticação do QA é lenta
  cy.url({ timeout: 45000 }).should('not.include', '/login').and('match', /\/sigla\/?$/)
  cy.contains(/Escolha o sistema que deseja acessar/i, { timeout: 15000 }).should('be.visible')
  cy.get(portalSelectors.sistema('ALVO'), { timeout: 15000 })
    .should('be.visible')
    .invoke('removeAttr', 'target')
    .click({ force: true })
  cy.url({ timeout: 30000 }).should('include', '/alvo').and('not.include', '/login')
}

export const obterCredenciaisAdmin = () => ({
  rf: Cypress.env('SIGLA_LOGIN_RF') || '007001',
  senha: Cypress.env('SIGLA_LOGIN_SENHA') || 'Alvo123@'
})

// A partir da versão 1.0.33.01 do ALVO a rota /alvo/login deixou de existir:
// o login é feito só pelo portal /sigla/login, que grava o TOKEN no localStorage
// da mesma origem e o ALVO o reaproveita. Mantido como alias para não alterar
// os passos que já chamam realizarLoginAdmin.
export const realizarLoginAdmin = (rf, senha) => realizarLoginPortalAlvo(rf, senha)

const normalizarTexto = (texto) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const escaparRegex = (texto) =>
  texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const criarRegex = (texto) =>
  new RegExp(
    escaparRegex(texto.trim())
      .replace(/ç|Ç/g, '[çc]')
      .replace(/ã|Ã/g, '[ãa]')
      .replace(/õ|Õ/g, '[õo]')
      .replace(/é|É/g, '[eé]')
      .replace(/í|Í/g, '[ií]')
      .replace(/ó|Ó/g, '[oó]')
      .replace(/ú|Ú/g, '[uú]')
      .replace(/â|Â/g, '[aâ]')
      .replace(/ê|Ê/g, '[eê]'),
    'i'
  )

// =====================================================
// STEPS — LOGIN / SESSÃO
// =====================================================

Given('que estou logado no SIGLA com perfil administrador', () => {
  const { rf, senha } = obterCredenciaisAdmin()
  cy.session(`sigla-admin-${rf}`, () => { realizarLoginAdmin(rf, senha) })
  cy.visit(obterBaseUrl())
  Cypress.log({ name: 'LOGIN ADMIN', message: `Sessão restaurada — RF: ${rf}` })
})

// Passo único: faz o login pelo portal uma vez e reaproveita a sessão (cy.session)
// nos cenários seguintes. Nome de sessão próprio para não misturar com a sessão
// do passo 'que estou logado no SIGLA com perfil administrador' ('sigla-admin-*'),
// que também passou a logar pelo portal via realizarLoginAdmin.
Given('que estou logado no ALVO pelo portal SIGLA', () => {
  const { rf, senha } = obterCredenciaisAdmin()
  cy.session(`sigla-portal-alvo-${rf}`, () => { realizarLoginPortalAlvo(rf, senha) })
  cy.visit(obterBaseUrl())
  cy.url({ timeout: 20000 }).should('include', '/alvo').and('not.include', '/login')
  cy.get('header', { timeout: 20000 }).should('be.visible')
  Cypress.log({ name: 'LOGIN PORTAL', message: `Sessão ALVO via portal SIGLA — RF: ${rf}` })
})

// =====================================================
// STEPS — LOGIN PELO PORTAL SIGLA (/sigla/login → portal → ALVO)
// Versão passo a passo, para cenários que validam o próprio fluxo de login.
// O botão "Acessar" usa o step genérico 'clico no botão {string}'
// (nova_convocacao_steps.js), que já é compartilhado entre as features.
// =====================================================

Given('que acesso a página de login do portal SIGLA', () => {
  cy.visit(`${obterUrlPortal()}/login`)
  cy.url().should('include', '/sigla/login')
  obterCampoPortal('Registro funcional (RF)').should('be.visible')
})

When('clico no campo {string}', (campo) => {
  obterCampoPortal(campo).should('be.visible').click({ force: true })
})

When('preencho o campo {string} com o RF de teste', (campo) => {
  const { rf } = obterCredenciaisAdmin()
  obterCampoPortal(campo).clear({ force: true }).type(rf, { force: true, delay: 100 })
})

When('preencho o campo {string} com a senha de teste', (campo) => {
  const { senha } = obterCredenciaisAdmin()
  obterCampoPortal(campo).clear({ force: true }).type(senha, { force: true, delay: 100, log: false })
})

Then('sou redirecionado para o portal SIGLA', () => {
  // Mesmo timeout estendido do login do ALVO: a API de autenticação do QA é lenta
  cy.url({ timeout: 45000 }).should('not.include', '/login').and('match', /\/sigla\/?$/)
})

Then('o portal exibe a mensagem {string}', (mensagem) => {
  cy.contains(criarRegex(mensagem), { timeout: 15000 }).should('be.visible')
})

When('clico na opção {string} no portal', (sistema) => {
  cy.get(portalSelectors.sistema(sistema), { timeout: 15000 })
    .should('be.visible')
    // Garante navegação na mesma aba caso o card abra em nova janela
    .invoke('removeAttr', 'target')
    .click({ force: true })
})

Then('sou redirecionado para o sistema ALVO', () => {
  cy.url({ timeout: 30000 }).should('include', '/alvo').and('not.include', '/login')
})

Then('o sistema ALVO exibe a página inicial', () => {
  cy.get('header', { timeout: 20000 }).should('be.visible')
  cy.get('body').should(($body) => {
    expect(normalizarTexto($body.text())).to.include('alocacao de vagas online')
  })
})

// =====================================================
// STEPS — PÁGINA INICIAL
// =====================================================

Given('que estou na página inicial do SIGLA', () => {
  cy.visit(obterBaseUrl())
  cy.url().should('not.include', '/login')
  cy.wait(1000)
})

Then('o sistema exibe o título {string}', (titulo) => {
  cy.get('body', { timeout: 10000 }).then(($body) => {
    const temTitulo = normalizarTexto($body.text()).includes(normalizarTexto(titulo))
    if (temTitulo) {
      cy.log(`Título "${titulo}" encontrado`)
    } else {
      cy.contains(new RegExp(escaparRegex(titulo), 'i'), { timeout: 10000 }).should('be.visible')
    }
  })
})

Then('o sistema exibe a descrição institucional do sistema', () => {
  cy.contains(
    /Sistema para convoca[çc][ãa]o e escolha de habilitados/i,
    { timeout: 10000 }
  ).should('be.visible')
})

Then('o sistema exibe os benefícios da plataforma:', (dataTable) => {
  const beneficios = dataTable.raw().flat().filter(Boolean)
  beneficios.forEach((texto) => {
    cy.contains(criarRegex(texto), { timeout: 10000 }).should('be.visible')
  })
})
