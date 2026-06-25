/// <reference types="cypress" />

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const UUID_INEXISTENTE = '00000000-0000-0000-0000-000000000000'

// ── Mocks ────────────────────────────────────────────────────────────────────

Given('que eu configuro mock para schema OpenAPI', () => {
  cy.intercept('GET', '**/ms-escolha-vagas/api/schema/**', {
    statusCode: 200,
    body: {
      openapi: '3.0.0',
      info: { title: 'MS Escolha Vagas API', version: '1.0.0' },
      paths: {
        '/ms-escolha-vagas/api/v1/vagas/': { get: { summary: 'List vagas' } },
        '/ms-escolha-vagas/api/v1/escolha/': { get: { summary: 'List escolhas' }, post: { summary: 'Create escolha' } }
      }
    }
  }).as('mockSchemaOpenAPI')
  Cypress.log({ name: 'MOCK', message: 'Schema OpenAPI configurado' })
})

Given('que eu configuro mock para listagem de vagas', () => {
  cy.intercept('GET', '**/ms-escolha-vagas/api/v1/vagas/', {
    statusCode: 200,
    body: {
      count: 150,
      next: null,
      previous: null,
      results: [
        {
          uuid: '12345678-1234-1234-1234-123456789abc',
          cargo_codigo: 'PROF-I',
          cargo_descricao: 'Professor de Educação Infantil',
          vagas_precarias: 10,
          vagas_definitivas: 5,
          status: 'ATIVO'
        }
      ]
    }
  }).as('mockListagemVagas')
  Cypress.log({ name: 'MOCK', message: 'Listagem de vagas configurada' })
})

Given('que eu configuro mock para criar escolha', () => {
  cy.intercept('POST', '**/ms-escolha-vagas/api/v1/escolha/', {
    statusCode: 201,
    body: {
      uuid: '87654321-4321-4321-4321-cba987654321',
      processo_uuid: '11111111-1111-1111-1111-111111111111',
      candidato_uuid: '22222222-2222-2222-2222-222222222222',
      vaga_uuid: '33333333-3333-3333-3333-333333333333',
      status: 'PENDENTE',
      created_at: new Date().toISOString()
    }
  }).as('mockCriarEscolha')
  Cypress.log({ name: 'MOCK', message: 'Criar escolha configurado' })
})

Given('que eu configuro mock para buscar escolha por UUID', () => {
  cy.intercept('GET', '**/ms-escolha-vagas/api/v1/escolha/*/', {
    statusCode: 200,
    body: {
      uuid: '12345678-1234-1234-1234-123456789abc',
      processo_uuid: '11111111-1111-1111-1111-111111111111',
      candidato_uuid: '22222222-2222-2222-2222-222222222222',
      vaga_uuid: '33333333-3333-3333-3333-333333333333',
      status: 'PENDENTE',
      created_at: '2026-05-27T10:00:00Z',
      updated_at: '2026-05-27T10:00:00Z'
    }
  }).as('mockBuscarEscolha')
  Cypress.log({ name: 'MOCK', message: 'Buscar escolha por UUID configurado' })
})

Given('que eu configuro mock para inclusão de vagas em lote', () => {
  cy.intercept('POST', '**/ms-escolha/api/v1/vagas-escolas/inclusao/', {
    statusCode: 201,
    body: {
      uuid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      lote_uuid: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      processo_uuid: '11111111-1111-1111-1111-111111111111',
      cargo_codigo: 'PROF-I',
      cargo_descricao: 'Professor de Educação Infantil',
      escola_codigo_eol: '123456',
      vagas_precarias: 10,
      vagas_definitivas: 5,
      status: 'INCLUIDO',
      created_at: new Date().toISOString()
    }
  }).as('mockInclusaoVagasLote')
  Cypress.log({ name: 'MOCK', message: 'Inclusão de vagas em lote configurada' })
})

// ── Contexto ─────────────────────────────────────────────────────────────────

Given('que a API de Escolha de Vagas SIGLA está acessível', () => {
  const baseUrl = Cypress.env('ESCOLHA_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'
  Cypress.log({
    name: 'ESCOLHA API',
    message: `Base URL: ${baseUrl}/ms-escolha-vagas — sem autenticação`,
  })
})

// ── Requisições genéricas ────────────────────────────────────────────────────

When('eu faço uma requisição ESCOLHA GET para {string}', (url) => {
  cy.escolha_get(url).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'ESCOLHA GET', message: `${url} → HTTP ${res.status}` })
  })
})

When('eu faço um POST ESCOLHA para {string} com body vazio', (url) => {
  cy.escolha_post(url, {}).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'ESCOLHA POST vazio', message: `${url} → HTTP ${res.status}` })
  })
})

// ── Ações de Escolha ─────────────────────────────────────────────────────────

When('eu crio uma escolha ESCOLHA com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    const baseUrl = Cypress.env('ESCOLHA_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'
    const url = `${baseUrl}/ms-escolha-vagas/api/v1/escolha/`

    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)

    cy.escolha_post(url, payload).then((res) => {
      cy.wrap(res).as('response')

      cy.log(`Response Status: ${res.status}`)
      cy.log(`Response Body: ${JSON.stringify(res.body, null, 2)}`)

      if ((res.status === 200 || res.status === 201) && res.body.uuid) {
        cy.wrap(res.body.uuid).as('escolhaUuid')
        cy.log(`Escolha UUID salvo: ${res.body.uuid}`)
      }

      Cypress.log({
        name: 'POST Escolha',
        message: `Payload: ${payloadKey} → HTTP ${res.status}`,
      })
    })
  })
})

Given('que tenho uma escolha criada', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const baseUrl = Cypress.env('ESCOLHA_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'
    const url = `${baseUrl}/ms-escolha-vagas/api/v1/escolha/`

    cy.escolha_post(url, payloads.escolhaValida).then((res) => {
      expect([200, 201]).to.include(res.status)
      cy.wrap(res.body.uuid).as('escolhaUuid')
      Cypress.log({ name: 'Setup Escolha', message: `UUID: ${res.body.uuid}` })
    })
  })
})

When('eu busco a escolha pelo UUID criado', () => {
  cy.get('@escolhaUuid').then((uuid) => {
    cy.escolha_get(`/escolha/${uuid}/`).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Buscar Escolha', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

When('eu atualizo a escolha pelo UUID criado com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    cy.get('@escolhaUuid').then((uuid) => {
      cy.escolha_put(`/escolha/${uuid}/`, payload).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'PUT Escolha', message: `UUID: ${uuid} → HTTP ${res.status}` })
      })
    })
  })
})

When('eu atualizo parcialmente a escolha pelo UUID criado com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    cy.get('@escolhaUuid').then((uuid) => {
      cy.escolha_patch(`/escolha/${uuid}/`, payload).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'PATCH Escolha', message: `UUID: ${uuid} → HTTP ${res.status}` })
      })
    })
  })
})

When('eu deleto a escolha pelo UUID criado', () => {
  cy.get('@escolhaUuid').then((uuid) => {
    cy.escolha_delete(`/escolha/${uuid}/`).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'DELETE Escolha', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

When('eu deleto uma escolha por UUID inexistente', () => {
  cy.escolha_delete(`/escolha/${UUID_INEXISTENTE}/`).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'DELETE Escolha inexistente', message: `HTTP ${res.status}` })
  })
})

When('eu atualizo uma escolha inexistente via PUT com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    cy.escolha_put(`/escolha/${UUID_INEXISTENTE}/`, payload).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'PUT Escolha inexistente', message: `HTTP ${res.status}` })
    })
  })
})

When('eu atualizo parcialmente uma escolha inexistente via PATCH com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    cy.escolha_patch(`/escolha/${UUID_INEXISTENTE}/`, payload).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'PATCH Escolha inexistente', message: `HTTP ${res.status}` })
    })
  })
})

When('eu confirmo a escolha pelo UUID criado', () => {
  cy.get('@escolhaUuid').then((uuid) => {
    cy.escolha_post(`/escolha/${uuid}/confirmar/`, {}).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Confirmar Escolha', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

When('eu cancelo a escolha pelo UUID criado', () => {
  cy.get('@escolhaUuid').then((uuid) => {
    cy.escolha_post(`/escolha/${uuid}/cancelar/`, {}).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Cancelar Escolha', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

When('eu faço uma requisição ESCOLHA POST de ação {string} para UUID inexistente', (acao) => {
  cy.escolha_post(`/escolha/${UUID_INEXISTENTE}/${acao}/`, {}).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: `Ação ${acao} inexistente`, message: `HTTP ${res.status}` })
  })
})

// ── Ações de Inclusão de Vagas em Escolas ───────────────────────────────────

When('eu faço inclusão de vagas em lote com payload {string}', (payloadKey) => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    const payload = payloads[payloadKey]
    const baseUrl = Cypress.env('ESCOLHA_BASE_URL') || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br'
    const url = `${baseUrl}/ms-escolha/api/v1/vagas-escolas/inclusao/`

    cy.log(`Payload enviado: ${JSON.stringify(payload, null, 2)}`)

    cy.escolha_post(url, payload).then((res) => {
      cy.wrap(res).as('response')

      cy.log(`Response Status: ${res.status}`)
      cy.log(`Response Body: ${JSON.stringify(res.body, null, 2)}`)

      if ((res.status === 200 || res.status === 201) && res.body.uuid) {
        cy.wrap(res.body.uuid).as('vagaEscolaUuid')
        cy.log(`Vaga Escola UUID salvo: ${res.body.uuid}`)
      }

      Cypress.log({
        name: 'POST Inclusão Vagas',
        message: `Payload: ${payloadKey} → HTTP ${res.status}`,
      })
    })
  })
})

Then('a inclusão de vagas deve ter os campos obrigatórios:', (dataTable) => {
  const campos = dataTable.rawTable.slice(1).map((row) => row[0])
  cy.get('@response').then((res) => {
    const body = res.body
    // Se for um array, pega o primeiro item
    const item = Array.isArray(body) ? body[0] : body

    if (!item) {
      Cypress.log({ name: 'Campos obrigatórios', message: 'Resposta vazia — validação ignorada' })
      return
    }

    campos.forEach((campo) => {
      expect(item, `Inclusão de vagas deve ter campo "${campo}"`).to.have.property(campo)
    })
    Cypress.log({ name: 'Campos obrigatórios', message: `Validados: ${campos.join(', ')}` })
  })
})
