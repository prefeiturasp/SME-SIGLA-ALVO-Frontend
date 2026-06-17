/// <reference types="cypress" />

import { Given, When } from '@badeball/cypress-cucumber-preprocessor'


Given('que a API de Concursos SIGLA está acessível', () => {
  const baseUrl = Cypress.env('CONCURSO_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'
  Cypress.log({
    name: 'CONCURSO API',
    message: `Base URL: ${baseUrl}/ms-processos-concursos — sem autenticação`,
  })
})

// ── Requisições genéricas ────────────────────────────────────────────────────

When('eu faço uma requisição CONCURSO GET para {string}', (url) => {
  cy.concurso_get(url).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'CONCURSO GET', message: `${url} → HTTP ${res.status}` })
  })
})

// ── Ações de Autorização Publicada ──────────────────────────────────────────

When('eu crio uma autorização CONCURSO com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    const baseUrl = Cypress.env('CONCURSO_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'
    const url = `${baseUrl}/ms-processos-concursos/api/v1/autorizacoes-publicadas/`
    
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)
    
    cy.concurso_post(url, payload).then((res) => {
      cy.wrap(res).as('response')
      
      cy.log(`Response Status: ${res.status}`)
      cy.log(`Response Body: ${JSON.stringify(res.body, null, 2)}`)
      
      Cypress.log({ 
        name: 'POST Autorização', 
        message: `Payload: ${payloadKey} → HTTP ${res.status}` 
      })
    })
  })
})

// ── Ações de Cargo ───────────────────────────────────────────────────────────

When('eu crio um cargo CONCURSO com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    const baseUrl = Cypress.env('CONCURSO_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'
    const url = `${baseUrl}/ms-processos-concursos/api/v1/cargos/`
    
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)
    
    cy.concurso_post(url, payload).then((res) => {
      cy.wrap(res).as('response')
      
      cy.log(`Response Status: ${res.status}`)
      cy.log(`Response Body: ${JSON.stringify(res.body, null, 2)}`)
      
      Cypress.log({ 
        name: 'POST Cargo', 
        message: `Payload: ${payloadKey} → HTTP ${res.status}` 
      })
    })
  })
})

// ── Ações de Concurso ────────────────────────────────────────────────────────

When('eu crio um concurso CONCURSO com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    const baseUrl = Cypress.env('CONCURSO_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'
    const url = `${baseUrl}/ms-processos-concursos/api/v1/concursos/`
    
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)
    
    cy.concurso_post(url, payload).then((res) => {
      cy.wrap(res).as('response')
      
      cy.log(`Response Status: ${res.status}`)
      cy.log(`Response Body: ${JSON.stringify(res.body, null, 2)}`)
      
      // Salvar UUID do concurso criado para testes futuros
      if (res.status === 201 && res.body.uuid) {
        cy.wrap(res.body.uuid).as('concursoUuid')
        cy.log(`💾 Concurso UUID salvo: ${res.body.uuid}`)
      }
      
      Cypress.log({ 
        name: 'POST Concurso', 
        message: `Payload: ${payloadKey} → HTTP ${res.status}` 
      })
    })
  })
})

// ============================================================================
// Nota: Steps genéricos como "Then o status CONCURSO deve ser" estão
// definidos em api_concurso_commands.js
// ============================================================================
