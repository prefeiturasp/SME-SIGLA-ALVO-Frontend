/// <reference types="cypress" />

import { Given, Then } from '@badeball/cypress-cucumber-preprocessor'

// =====================================================
// HELPERS — compartilhados entre features
// =====================================================

export const obterBaseUrl = () =>
  Cypress.env('SIGLA_UI_BASE_URL') || 'https://qa-sigla.sme.prefeitura.sp.gov.br'

export const obterCredenciaisAdmin = () => ({
  rf: Cypress.env('SIGLA_LOGIN_RF') || '007001',
  senha: Cypress.env('SIGLA_LOGIN_SENHA') || 'Alvo123@'
})

export const realizarLoginAdmin = (rf, senha) => {
  cy.visit(`${obterBaseUrl()}/login`, { timeout: 15000 })
  cy.get('input').filter('[type="text"], [type="number"]').first()
    .clear({ force: true }).type(rf, { force: true, delay: 100 })
  cy.wait(500)
  cy.get('input[type="password"]')
    .clear({ force: true }).type(senha, { force: true, delay: 100 })
  cy.wait(500)
  cy.contains('button', /Acessar|Entrar|Login/i).click({ force: true })
  cy.wait(3000)
  cy.url().should('not.include', '/login')
}

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
  cy.visit(obterBaseUrl(), { timeout: 15000 })
  Cypress.log({ name: 'LOGIN ADMIN', message: `Sessão restaurada — RF: ${rf}` })
})

// =====================================================
// STEPS — PÁGINA INICIAL
// =====================================================

Given('que estou na página inicial do SIGLA', () => {
  cy.visit(obterBaseUrl(), { timeout: 15000 })
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
