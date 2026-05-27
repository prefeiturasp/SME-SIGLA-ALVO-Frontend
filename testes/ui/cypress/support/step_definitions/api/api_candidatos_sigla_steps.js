/// <reference types="cypress" />

import { Given, When } from '@badeball/cypress-cucumber-preprocessor'


Given('que a API de Candidatos SIGLA está acessível', () => {
  Cypress.log({
    name: 'SIGLA API',
    message: `Base URL: ${Cypress.env('SIGLA_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'} — sem autenticação`,
  })
})

// ── Ações de Candidato ───────────────────────────────────────────────────────

When('eu crio um candidato SIGLA com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    let payload = { ...payloads[payloadKey] }
    
    // Gerar CPF único com timestamp para evitar duplicação
    const timestamp = Date.now().toString().slice(-8)
    if (payload.cpf) {
      payload.cpf = `${timestamp}001`
    }
    
    // Gerar email único
    if (payload.email && !payload.email.includes('invalid')) {
      payload.email = `teste.${timestamp}@sme.prefeitura.sp.gov.br`
    }
    
    // Normalizar formatos
    if (payload.celular) {
      payload.celular = payload.celular.replace(/\D/g, '') // Remove formatação
    }
    if (payload.telefone) {
      payload.telefone = payload.telefone.replace(/\D/g, '') // Remove formatação
    }
    if (payload.cep) {
      payload.cep = payload.cep.replace(/\D/g, '') // Remove formatação
    }
    
    const baseUrl = Cypress.env('SIGLA_BASE_URL') || 'https://hom-api-sigla.sme.prefeitura.sp.gov.br'
    const url = `${baseUrl}/ms-candidatos/api/v1/candidatos/`
    
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)
    
    cy.sigla_post(url, payload).then((res) => {
      cy.wrap(res).as('response')
      
      // Log detalhado da resposta
      cy.log(`Response Status: ${res.status}`)
      cy.log(`Response Body: ${JSON.stringify(res.body, null, 2)}`)
      
      // Se erro 400, logar detalhes para debug
      if (res.status === 400) {
        cy.log('ERRO 400 - Detalhes:')
        cy.log(`Body: ${JSON.stringify(res.body, null, 2)}`)
        console.error('ERRO 400 DETALHADO:', res.body)
      }
      
      Cypress.log({ 
        name: 'POST Candidato', 
        message: `Payload: ${payloadKey} → HTTP ${res.status}` 
      })
    })
  })
})

// ── Ações de Habilitado ──────────────────────────────────────────────────────

When('eu crio um habilitado SIGLA com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    const baseUrl = Cypress.env('SIGLA_BASE_URL') || 'https://hom-api-sigla.sme.prefeitura.sp.gov.br'
    const url = `${baseUrl}/ms-candidatos/api/v1/habilitados/`
    
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)
    
    cy.sigla_post(url, payload).then((res) => {
      cy.wrap(res).as('response')
      
      // Log detalhado da resposta
      cy.log(`Response Status: ${res.status}`)
      cy.log(`Response Body: ${JSON.stringify(res.body, null, 2)}`)
      
      // Se criado com sucesso, salvar o ID
      if (res.status === 201 && res.body.id) {
        cy.wrap(res.body.id).as('habilitadoId')
        cy.wrap(res.body.uuid).as('habilitadoUuid')
      }
      
      Cypress.log({ 
        name: 'POST Habilitado', 
        message: `Payload: ${payloadKey} → HTTP ${res.status}` 
      })
    })
  })
})

When('eu busco habilitados SIGLA por UUIDs com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    const baseUrl = Cypress.env('SIGLA_BASE_URL') || 'https://hom-api-sigla.sme.prefeitura.sp.gov.br'
    const url = `${baseUrl}/ms-candidatos/api/v1/habilitados/buscar-por-uuids/`
    
    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)
    
    cy.sigla_post(url, payload).then((res) => {
      cy.wrap(res).as('response')
      
      cy.log(`Response Status: ${res.status}`)
      cy.log(`Response Body: ${JSON.stringify(res.body, null, 2)}`)
      
      Cypress.log({ 
        name: 'POST Buscar por UUIDs', 
        message: `Payload: ${payloadKey} → HTTP ${res.status}` 
      })
    })
  })
})

// ============================================================================
// Nota: Steps genéricos como "When eu faço uma requisição SIGLA GET" e
// "Then o status SIGLA deve ser" estão definidos em api_sigla_steps.js
// ============================================================================
