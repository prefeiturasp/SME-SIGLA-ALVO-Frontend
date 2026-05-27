/// <reference types="cypress" />

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const UUID_INEXISTENTE = '00000000-0000-0000-0000-000000000000'

// ── Contexto ─────────────────────────────────────────────────────────────────

Given('que a API de Importação de Arquivo SIGLA está acessível', () => {
  const baseUrl = Cypress.env('IMPORTA_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'
  Cypress.log({
    name: 'IMPORTA API',
    message: `Base URL: ${baseUrl}/ms-importa-arquivos — sem autenticação`,
  })
})

// ── Requisições genéricas ────────────────────────────────────────────────────

When('eu faço uma requisição IMPORTA GET para {string}', (url) => {
  cy.importa_get(url).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'IMPORTA GET', message: `${url} → HTTP ${res.status}` })
  })
})

When('eu faço um POST IMPORTA para {string} com body vazio', (url) => {
  cy.importa_post(url, {}).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'IMPORTA POST vazio', message: `${url} → HTTP ${res.status}` })
  })
})

// ── Cabeçalho Lote ───────────────────────────────────────────────────────────

When('eu crio um cabeçalho de lote com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)

    cy.importa_post('/exportacao/cabecalho-lote/', payload).then((res) => {
      cy.wrap(res).as('response')
      cy.log(`Response Status: ${res.status}`)
      cy.log(`Response Body: ${JSON.stringify(res.body, null, 2)}`)

      if ((res.status === 200 || res.status === 201) && res.body.uuid) {
        cy.wrap(res.body.uuid).as('cabecalhoUuid')
        cy.log(`Cabeçalho UUID salvo: ${res.body.uuid}`)
      }

      Cypress.log({
        name: 'POST Cabeçalho Lote',
        message: `Payload: ${payloadKey} → HTTP ${res.status}`,
      })
    })
  })
})

When('eu busco o cabeçalho de lote com UUID inexistente', () => {
  cy.importa_get(`/exportacao/cabecalho-lote/${UUID_INEXISTENTE}/`).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'GET Cabeçalho inexistente', message: `HTTP ${res.status}` })
  })
})

// ── Exportação Candidatos Processo ───────────────────────────────────────────

When('eu faço exportação de candidatos com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)

    cy.importa_post('/exportacao/candidatos-processo/', payload).then((res) => {
      cy.wrap(res).as('response')
      cy.log(`Response Status: ${res.status}`)

      Cypress.log({
        name: 'POST Exportação Candidatos',
        message: `Payload: ${payloadKey} → HTTP ${res.status}`,
      })
    })
  })
})

// ── Exportação Lote ──────────────────────────────────────────────────────────

When('eu faço exportação de lote com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)

    cy.importa_post('/exportacao/lote/', payload).then((res) => {
      cy.wrap(res).as('response')
      cy.log(`Response Status: ${res.status}`)

      if ((res.status === 200 || res.status === 201) && res.body && res.body.uuid) {
        cy.wrap(res.body.uuid).as('loteUuid')
        cy.log(`Lote UUID salvo: ${res.body.uuid}`)
      }

      Cypress.log({
        name: 'POST Exportação Lote',
        message: `Payload: ${payloadKey} → HTTP ${res.status}`,
      })
    })
  })
})

When('eu faço download de lote com UUID inexistente', () => {
  cy.importa_get(`/exportacao/lote/${UUID_INEXISTENTE}/download/`).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'GET Download Lote inexistente', message: `HTTP ${res.status}` })
  })
})

// ── Exportação Vagas Processo ────────────────────────────────────────────────

When('eu faço exportação de vagas processo com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)

    cy.importa_post('/exportacao/vagas-processo/', payload).then((res) => {
      cy.wrap(res).as('response')
      cy.log(`Response Status: ${res.status}`)

      Cypress.log({
        name: 'POST Exportação Vagas Processo',
        message: `Payload: ${payloadKey} → HTTP ${res.status}`,
      })
    })
  })
})

// ── Exportação Vagas SIGPEC ──────────────────────────────────────────────────

When('eu faço exportação de vagas SIGPEC com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)

    cy.importa_post('/exportacao/vagas-sigpec/', payload).then((res) => {
      cy.wrap(res).as('response')
      cy.log(`Response Status: ${res.status}`)

      Cypress.log({
        name: 'POST Exportação Vagas SIGPEC',
        message: `Payload: ${payloadKey} → HTTP ${res.status}`,
      })
    })
  })
})

// ── Importação Habilitados ───────────────────────────────────────────────────

When('eu faço importação de habilitados com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)

    cy.importa_post('/importacao-arquivo/habilitados/', payload).then((res) => {
      cy.wrap(res).as('response')
      cy.log(`Response Status: ${res.status}`)

      Cypress.log({
        name: 'POST Importação Habilitados',
        message: `Payload: ${payloadKey} → HTTP ${res.status}`,
      })
    })
  })
})

When('eu busco importação de habilitados com ID inexistente', () => {
  cy.importa_get('/importacao-arquivo/habilitados/999999/').then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'GET Habilitados inexistente', message: `HTTP ${res.status}` })
  })
})

// ── Importação Vagas ─────────────────────────────────────────────────────────

When('eu faço importação de vagas com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)

    cy.importa_post('/importacao-arquivo/vagas/', payload).then((res) => {
      cy.wrap(res).as('response')
      cy.log(`Response Status: ${res.status}`)

      Cypress.log({
        name: 'POST Importação Vagas',
        message: `Payload: ${payloadKey} → HTTP ${res.status}`,
      })
    })
  })
})

When('eu busco importação de vagas com ID inexistente', () => {
  cy.importa_get('/importacao-arquivo/vagas/999999/').then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'GET Vagas inexistente', message: `HTTP ${res.status}` })
  })
})

// ── Importação Escolhas ──────────────────────────────────────────────────────

When('eu faço importação de escolhas com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)

    cy.importa_post('/importacao-escolhas/', payload).then((res) => {
      cy.wrap(res).as('response')
      cy.log(`Response Status: ${res.status}`)

      Cypress.log({
        name: 'POST Importação Escolhas',
        message: `Payload: ${payloadKey} → HTTP ${res.status}`,
      })
    })
  })
})
