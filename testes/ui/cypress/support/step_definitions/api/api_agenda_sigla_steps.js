/// <reference types="cypress" />

import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor'

const UUID_INEXISTENTE = '00000000-0000-0000-0000-000000000000'

// Constrói URL completa para o microsserviço de Agenda (bypassa o SIGLA_BASE_PATH de processos)
const agendaUrl = (path) => {
  const base = Cypress.env('SIGLA_BASE_URL') || 'https://hom-api-sigla.sme.prefeitura.sp.gov.br'
  return `${base}/ms-agenda/api/v1${path}`
}

Before({ tags: '@agenda_sigla' }, function () {
  Cypress.log({ name: 'AGENDA API', message: 'Início do teste de Agenda SIGLA' })
})

Given('que a API de Agenda SIGLA está acessível', () => {
  Cypress.log({
    name: 'AGENDA API',
    message: `Base URL: ${Cypress.env('SIGLA_BASE_URL')} — sem autenticação`,
  })
})

Given('que tenho uma agenda criada', () => {
  cy.sigla_get(agendaUrl('/agendas/')).then((res) => {
    expect(res.status).to.eq(200)
    const agendas = res.body.results || res.body
    expect(agendas).to.be.an('array').and.have.length.greaterThan(0)
    const agenda = agendas[0]
    cy.wrap(agenda.uuid).as('agendaUuid')
    cy.wrap(agenda).as('agendaDados')
    Cypress.log({ name: 'Setup Agenda', message: `UUID reutilizado: ${agenda.uuid}` })
  })
})

When('eu crio uma agenda com dados válidos', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.sigla_post(agendaUrl('/agendas/'), payloads.agendaValida).then((res) => {
      cy.wrap(res).as('response')
      if (res.status === 201) {
        cy.wrap(res.body.uuid).as('agendaUuid')
      }
      Cypress.log({ name: 'Criar Agenda', message: `HTTP ${res.status}` })
    })
  })
})

When('eu busco a agenda pelo UUID criado', () => {
  cy.get('@agendaUuid').then((uuid) => {
    cy.sigla_get(agendaUrl(`/agendas/${uuid}/`)).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Buscar Agenda', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

When('eu busco uma agenda por UUID inexistente', () => {
  cy.sigla_get(agendaUrl(`/agendas/${UUID_INEXISTENTE}/`)).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'Buscar Agenda UUID Inex.', message: `HTTP ${res.status}` })
  })
})

When('eu busco uma agenda por UUID em formato inválido', () => {
  cy.sigla_get(agendaUrl('/agendas/nao-e-um-uuid-valido/')).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'Buscar Agenda UUID Inválido', message: `HTTP ${res.status}` })
  })
})

Then('a resposta de listagem de agendas deve ter estrutura de paginação', () => {
  cy.get('@response').then((res) => {
    expect(res.body).to.have.property('count')
    expect(res.body).to.have.property('results').and.be.an('array')
    expect(res.body).to.have.property('links')
    expect(res.body).to.have.property('page')
    expect(res.body).to.have.property('page_size')
    Cypress.log({ name: 'Paginação Agenda', message: `count=${res.body.count}, page=${res.body.page}` })
  })
})

Then('a resposta da agenda deve conter os campos obrigatórios', () => {
  cy.get('@response').then((res) => {
    const campos = ['uuid', 'processo_convocacao_uuid', 'cargo_uuid', 'cargo_nome', 'modalidade', 'escolha_em', 'nomeacao_em', 'classificacao']
    campos.forEach((campo) => {
      expect(res.body).to.have.property(campo)
      Cypress.log({ name: 'Campo Agenda', message: `${campo} = ${res.body[campo]}` })
    })
  })
})

When('eu atualizo uma agenda inexistente via PUT', () => {
  // Busca um payload de referência a partir de uma agenda existente
  cy.sigla_get(agendaUrl('/agendas/')).then((listRes) => {
    const agenda = (listRes.body.results || listRes.body)[0]
    const payload = {
      processo_convocacao_uuid: agenda.processo_convocacao_uuid,
      processo_convocacao_nome: agenda.processo_convocacao_nome,
      cargo_uuid: agenda.cargo_uuid,
      cargo_nome: agenda.cargo_nome,
      cargo_codigo: agenda.cargo_codigo,
      modalidade: agenda.modalidade || 'ONLINE',
      escolha_em: agenda.escolha_em,
      nomeacao_em: agenda.nomeacao_em,
      sessao: agenda.sessao || 'Sessao',
      classificacao: agenda.classificacao,
      retardatario: false,
      hora_convocacao_inicio: null,
      hora_convocacao_fim: null,
      candidatos_uuids: [],
    }
    cy.sigla_put(agendaUrl(`/agendas/${UUID_INEXISTENTE}/`), payload).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'PUT UUID Inex.', message: `HTTP ${res.status}` })
    })
  })
})

When('eu atualizo a agenda pelo UUID criado com body vazio via PUT', () => {
  cy.get('@agendaUuid').then((uuid) => {
    cy.sigla_put(agendaUrl(`/agendas/${uuid}/`), {}).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'PUT Body Vazio', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

When('eu atualizo parcialmente uma agenda inexistente via PATCH', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.sigla_patch(agendaUrl(`/agendas/${UUID_INEXISTENTE}/`), payloads.agendaPatch).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'PATCH UUID Inex.', message: `HTTP ${res.status}` })
    })
  })
})

When('eu deleto uma agenda por UUID inexistente', () => {
  cy.sigla_delete(agendaUrl(`/agendas/${UUID_INEXISTENTE}/`)).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'DELETE UUID Inex.', message: `HTTP ${res.status}` })
  })
})

// --- Atualizar (PUT) ---
When('eu atualizo a agenda pelo UUID criado com dados válidos', () => {
  cy.get('@agendaDados').then((agenda) => {
    cy.get('@agendaUuid').then((uuid) => {
      // PUT requer todos os campos obrigatórios da agenda existente
      const payload = {
        processo_convocacao_uuid: agenda.processo_convocacao_uuid,
        processo_convocacao_nome: agenda.processo_convocacao_nome,
        cargo_uuid: agenda.cargo_uuid,
        cargo_nome: agenda.cargo_nome,
        cargo_codigo: agenda.cargo_codigo,
        modalidade: agenda.modalidade || 'ONLINE',
        escolha_em: agenda.escolha_em,
        nomeacao_em: agenda.nomeacao_em,
        sessao: agenda.sessao || 'Sessao Atualizada Automacao',
        classificacao: agenda.classificacao,
        retardatario: agenda.retardatario || false,
        hora_convocacao_inicio: agenda.hora_convocacao_inicio,
        hora_convocacao_fim: agenda.hora_convocacao_fim,
        candidatos_uuids: agenda.candidatos_uuids || [],
      }
      cy.sigla_put(agendaUrl(`/agendas/${uuid}/`), payload).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'Atualizar Agenda', message: `UUID: ${uuid} → HTTP ${res.status}` })
      })
    })
  })
})

When('eu atualizo parcialmente a agenda pelo UUID criado com dados válidos', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.get('@agendaUuid').then((uuid) => {
      cy.sigla_patch(agendaUrl(`/agendas/${uuid}/`), payloads.agendaPatch).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'Patch Agenda', message: `UUID: ${uuid} → HTTP ${res.status}` })
      })
    })
  })
})

When('eu deleto a agenda pelo UUID criado', () => {
  cy.get('@agendaUuid').then((uuid) => {
    cy.sigla_delete(agendaUrl(`/agendas/${uuid}/`)).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Deletar Agenda', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

Then('a resposta deve conter o campo {string} igual ao UUID da agenda criada', (campo) => {
  cy.get('@agendaUuid').then((uuid) => {
    cy.get('@response').then((res) => {
      expect(res.body[campo]).to.eq(uuid)
      Cypress.log({ name: 'Validação UUID Agenda', message: `${campo} = ${uuid}` })
    })
  })
})
