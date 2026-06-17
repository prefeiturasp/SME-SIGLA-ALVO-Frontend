/// <reference types="cypress" />

import { Given, When } from '@badeball/cypress-cucumber-preprocessor'

// ============================================================================
// STEPS ESPECÍFICOS — Candidatos SIGLA
// ============================================================================

// ── Contexto ─────────────────────────────────────────────────────────────────

Given('que a API de Candidatos SIGLA está acessível', () => {
  Cypress.log({
    name: 'SIGLA API',
    message: `Base URL: ${Cypress.env('SIGLA_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'} — sem autenticação`,
  })
})

// ── Ações de Candidato ───────────────────────────────────────────────────────

When('eu crio um candidato SIGLA com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    const url = 'https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/'
    
    cy.log(`🔍 Payload enviado: ${JSON.stringify(payload, null, 2)}`)
    
    cy.sigla_post(url, payload).then((res) => {
      cy.wrap(res).as('response')
      
      // Log detalhado da resposta
      cy.log(`📋 Response Status: ${res.status}`)
      cy.log(`📋 Response Body: ${JSON.stringify(res.body, null, 2)}`)
      
      Cypress.log({ 
        name: 'POST Candidato', 
        message: `Payload: ${payloadKey} → HTTP ${res.status}` 
      })
    })
  })
})

// ============================================================================
// Nota: Steps genéricos como "When eu faço uma requisição SIGLA GET" e
// "Then o status SIGLA deve ser" estão definidos em api_sigla_steps.js
// ============================================================================
