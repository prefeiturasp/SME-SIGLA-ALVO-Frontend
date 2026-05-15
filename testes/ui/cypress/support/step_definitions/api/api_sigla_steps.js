/// <reference types="cypress" />

import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor'

// ============================================================================
// STEPS — API SIGLA (Processos Convocação)
// Projeto: SME-SIGLA-ALVO-Frontend
// ============================================================================

const UUID_INEXISTENTE = '00000000-0000-0000-0000-000000000000'

// ── Hooks ────────────────────────────────────────────────────────────────────

Before({ tags: '@api' }, function () {
  this.testStart = Date.now()
  Cypress.log({ name: 'SIGLA API', message: 'Início do teste de API' })
})

// ── Contexto ─────────────────────────────────────────────────────────────────

Given('que a API de Processos Convocação está acessível', () => {
  Cypress.log({
    name: 'SIGLA API',
    message: `Base URL: ${Cypress.env('SIGLA_BASE_URL')} — sem autenticação`,
  })
})

// ── Requisições genéricas ────────────────────────────────────────────────────

When('eu faço uma requisição SIGLA GET para {string}', (path) => {
  cy.sigla_get(path).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'SIGLA GET', message: `${path} → HTTP ${res.status}` })
  })
})

When('eu faço uma requisição SIGLA de método {string} para {string} sem body', (method, path) => {
  cy.sigla_request(method, path).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: `SIGLA ${method}`, message: `${path} → HTTP ${res.status}` })
  })
})

When('eu faço um POST SIGLA para {string} com body vazio', (path) => {
  cy.sigla_post(path, {}).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'SIGLA POST vazio', message: `${path} → HTTP ${res.status}` })
  })
})

When('eu faço um POST SIGLA para {string} sem body', (path) => {
  cy.sigla_post(path, {}).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'SIGLA POST sem body', message: `${path} → HTTP ${res.status}` })
  })
})

When('eu faço um POST SIGLA para {string} com body:', (path, dataTable) => {
  const rows = dataTable.rawTable.slice(1)
  const body = {}
  rows.forEach((row) => { body[row[0]] = row[1] })
  cy.sigla_post(path, body).then((res) => {
    cy.wrap(res).as('response')
    Cypress.log({ name: 'SIGLA POST body', message: `${path} → HTTP ${res.status}` })
  })
})

// ── Assertivas de status ─────────────────────────────────────────────────────

Then('o status SIGLA deve ser {int}', (statusEsperado) => {
  cy.get('@response').its('status').should('eq', statusEsperado)
})

Then('o status SIGLA deve ser {int} ou {int}', (s1, s2) => {
  cy.get('@response').its('status').then((status) => {
    expect([s1, s2], `Status deve ser ${s1} ou ${s2}`).to.include(status)
  })
})

Then('o status SIGLA deve ser {int} ou {int} ou {int}', (s1, s2, s3) => {
  cy.get('@response').its('status').then((status) => {
    expect([s1, s2, s3], `Status deve ser ${s1}, ${s2} ou ${s3}`).to.include(status)
  })
})

Then('o status SIGLA não deve ser {int}', (statusIndesejado) => {
  cy.get('@response').its('status').should('not.eq', statusIndesejado)
})

// ── Assertivas de estrutura ──────────────────────────────────────────────────

Then('a resposta SIGLA deve ser uma lista', () => {
  cy.get('@response').then((res) => {
    const body = res.body
    const isList = Array.isArray(body) || (body && Array.isArray(body.results))
    expect(isList, 'Resposta deve ser lista ou objeto paginado com results').to.be.true
    Cypress.log({ name: 'Validação', message: 'Resposta é uma lista' })
  })
})

Then('a resposta SIGLA deve ser uma lista ou paginada', () => {
  cy.get('@response').then((res) => {
    const body = res.body
    const isListOrPaginated =
      Array.isArray(body) ||
      (body && (Array.isArray(body.results) || typeof body.count !== 'undefined'))
    expect(isListOrPaginated, 'Resposta deve ser lista ou paginada').to.be.true
    Cypress.log({ name: 'Validação', message: 'Resposta é lista ou paginada' })
  })
})

Then('a resposta SIGLA deve ser um objeto', () => {
  cy.get('@response').then((res) => {
    expect(res.body).to.be.an('object').and.not.be.null
    Cypress.log({ name: 'Validação', message: 'Resposta é um objeto' })
  })
})

Then('a resposta SIGLA deve ser um objeto ou lista', () => {
  cy.get('@response').then((res) => {
    const body = res.body
    expect(typeof body === 'object' && body !== null, 'Resposta deve ser objeto ou lista').to.be.true
    Cypress.log({ name: 'Validação', message: `Tipo: ${Array.isArray(body) ? 'array' : 'object'}` })
  })
})

Then('o header Content-Type SIGLA deve conter {string}', (valor) => {
  cy.get('@response').its('headers').its('content-type').should('include', valor)
})

Then('o tempo de resposta SIGLA deve ser menor que {int} milissegundos', (limite) => {
  cy.get('@response').its('duration').should('be.lessThan', limite)
  Cypress.log({ name: 'Performance', message: `Limite: ${limite}ms` })
})

Then('a resposta deve conter o campo {string}', (campo) => {
  cy.get('@response').then((res) => {
    expect(res.body).to.have.property(campo)
    expect(res.body[campo]).to.not.be.undefined
    Cypress.log({ name: 'Validação campo', message: `"${campo}" presente` })
  })
})

Then('o campo {string} da resposta deve ser um UUID válido', (campo) => {
  cy.get('@response').then((res) => {
    const valor = res.body[campo]
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(valor, `Campo "${campo}" deve ser UUID`).to.match(uuidRegex)
    Cypress.log({ name: 'Validação UUID', message: `${campo} = ${valor}` })
  })
})

// ── Campos obrigatórios em listas ─────────────────────────────────────────────

Then('cada carta de convocação deve ter os campos obrigatórios:', (dataTable) => {
  const campos = dataTable.rawTable.slice(1).map((row) => row[0])
  cy.get('@response').then((res) => {
    const items = Array.isArray(res.body) ? res.body : (res.body.results || [])
    if (items.length === 0) {
      Cypress.log({ name: 'Campos obrigatórios', message: 'Lista vazia — validação ignorada' })
      return
    }
    campos.forEach((campo) => {
      expect(items[0], `Carta deve ter campo "${campo}"`).to.have.property(campo)
    })
    Cypress.log({ name: 'Campos obrigatórios', message: `Validados: ${campos.join(', ')}` })
  })
})

Then('cada processo deve ter os campos obrigatórios:', (dataTable) => {
  const campos = dataTable.rawTable.slice(1).map((row) => row[0])
  cy.get('@response').then((res) => {
    const items = Array.isArray(res.body) ? res.body : (res.body.results || [])
    if (items.length === 0) {
      Cypress.log({ name: 'Campos obrigatórios', message: 'Lista vazia — validação ignorada' })
      return
    }
    campos.forEach((campo) => {
      expect(items[0], `Processo deve ter campo "${campo}"`).to.have.property(campo)
    })
    Cypress.log({ name: 'Campos obrigatórios', message: `Validados: ${campos.join(', ')}` })
  })
})

// ── CARTA DE CONVOCAÇÃO — setup e ações ──────────────────────────────────────

When('eu crio uma carta de convocação com dados válidos', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.sigla_post('/carta-convocacao/', payloads.cartaConvocacao).then((res) => {
      cy.wrap(res).as('response')
      if (res.status === 200 || res.status === 201) {
        cy.wrap(res.body.uuid).as('cartaUuid')
      }
      Cypress.log({ name: 'Criar Carta', message: `HTTP ${res.status}` })
    })
  })
})

Given('que tenho uma carta de convocação criada', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.sigla_post('/carta-convocacao/', payloads.cartaConvocacao).then((res) => {
      expect([200, 201]).to.include(res.status)
      cy.wrap(res.body.uuid).as('cartaUuid')
      Cypress.log({ name: 'Setup Carta', message: `UUID: ${res.body.uuid}` })
    })
  })
})

When('eu busco a carta de convocação pelo UUID criado', () => {
  cy.get('@cartaUuid').then((uuid) => {
    cy.sigla_get(`/carta-convocacao/${uuid}/`).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Buscar Carta', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

Then('a resposta deve conter o campo {string} igual ao UUID da carta criada', (campo) => {
  cy.get('@cartaUuid').then((uuid) => {
    cy.get('@response').then((res) => {
      expect(res.body[campo]).to.eq(uuid)
      Cypress.log({ name: 'Validação UUID Carta', message: `${campo} = ${uuid}` })
    })
  })
})

// ── PROCESSO DE CONVOCAÇÃO — setup e ações ───────────────────────────────────

When('eu crio um processo de convocação com dados válidos', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.sigla_post('/processos-convocacao/', payloads.processoConvocacao).then((res) => {
      cy.wrap(res).as('response')
      if (res.status === 200 || res.status === 201) {
        cy.wrap(res.body.uuid).as('processoUuid')
      }
      Cypress.log({ name: 'Criar Processo', message: `HTTP ${res.status}` })
    })
  })
})

Given('que tenho um processo de convocação existente', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.sigla_post('/processos-convocacao/', payloads.processoConvocacao).then((res) => {
      expect([200, 201]).to.include(res.status)
      cy.wrap(res.body.uuid).as('processoUuid')
      Cypress.log({ name: 'Setup Processo', message: `UUID: ${res.body.uuid}` })
    })
  })
})

When('eu busco o processo de convocação pelo UUID criado', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_get(`/processos-convocacao/${uuid}/`).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Buscar Processo', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

Then('a resposta deve conter o campo {string} igual ao UUID do processo criado', (campo) => {
  cy.get('@processoUuid').then((uuid) => {
    cy.get('@response').then((res) => {
      expect(res.body[campo]).to.eq(uuid)
      Cypress.log({ name: 'Validação UUID Processo', message: `${campo} = ${uuid}` })
    })
  })
})

When('eu faço um PUT no processo de convocação criado com dados válidos', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.get('@processoUuid').then((uuid) => {
      cy.sigla_put(`/processos-convocacao/${uuid}/`, payloads.processoConvocacaoUpdate).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'PUT Processo', message: `UUID: ${uuid} → HTTP ${res.status}` })
      })
    })
  })
})

When('eu faço um PUT no processo de convocação criado sem body', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_put(`/processos-convocacao/${uuid}/`, {}).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'PUT Processo sem body', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

When('eu faço um PATCH no processo de convocação criado com dados parciais', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.get('@processoUuid').then((uuid) => {
      cy.sigla_patch(`/processos-convocacao/${uuid}/`, payloads.processoConvocacaoPatch).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'PATCH Processo', message: `UUID: ${uuid} → HTTP ${res.status}` })
      })
    })
  })
})

When('eu faço um PATCH no processo de convocação criado com campo inválido', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_patch(`/processos-convocacao/${uuid}/`, { campo_inexistente_xyz: 'valor_invalido' }).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'PATCH Processo inválido', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

When('eu deleto o processo de convocação criado', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_delete(`/processos-convocacao/${uuid}/`).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'DELETE Processo', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

Then('o processo deletado não deve mais existir', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_get(`/processos-convocacao/${uuid}/`).then((res) => {
      expect(res.status).to.eq(404)
      Cypress.log({ name: 'Verificar exclusão', message: `UUID: ${uuid} → 404 confirmado` })
    })
  })
})

When('eu tento deletar o mesmo processo novamente', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_delete(`/processos-convocacao/${uuid}/`).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'DELETE duplo Processo', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

When('eu finalizo o processo de convocação criado', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_post(`/processos-convocacao/${uuid}/finalizar/`, {}).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Finalizar Processo', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

When('eu avanço o passo do processo de convocação criado', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.get('@processoUuid').then((uuid) => {
      cy.sigla_patch(`/processos-convocacao/${uuid}/passo/`, payloads.passoPatch).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'Avançar Passo', message: `UUID: ${uuid} → HTTP ${res.status}` })
      })
    })
  })
})

When('eu faço um PATCH no passo do processo com body inválido', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_patch(`/processos-convocacao/${uuid}/passo/`, { campo_invalido: 'xyz' }).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'PATCH passo inválido', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

// ── CARGOS — setup e ações ───────────────────────────────────────────────────

When('eu listo os cargos do processo de convocação criado', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_get(`/processos-convocacao/${uuid}/cargos/`).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Listar Cargos', message: `Processo: ${uuid} → HTTP ${res.status}` })
    })
  })
})

When('eu adiciono um cargo ao processo de convocação criado', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.get('@processoUuid').then((uuid) => {
      cy.sigla_post(`/processos-convocacao/${uuid}/cargos/`, payloads.cargo).then((res) => {
        cy.wrap(res).as('response')
        if (res.status === 200 || res.status === 201) {
          cy.wrap(res.body.uuid).as('cargoUuid')
        }
        Cypress.log({ name: 'Adicionar Cargo', message: `Processo: ${uuid} → HTTP ${res.status}` })
      })
    })
  })
})

When('eu adiciono um cargo sem dados ao processo de convocação criado', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_post(`/processos-convocacao/${uuid}/cargos/`, {}).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Cargo sem dados', message: `Processo: ${uuid} → HTTP ${res.status}` })
    })
  })
})

Given('que tenho um cargo adicionado ao processo de convocação', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.sigla_post('/processos-convocacao/', payloads.processoConvocacao).then((processoRes) => {
      expect([200, 201]).to.include(processoRes.status)
      const processoUuid = processoRes.body.uuid
      cy.wrap(processoUuid).as('processoUuid')
      cy.sigla_post(`/processos-convocacao/${processoUuid}/cargos/`, payloads.cargo).then((cargoRes) => {
        expect([200, 201]).to.include(cargoRes.status)
        cy.wrap(cargoRes.body.uuid).as('cargoUuid')
        Cypress.log({
          name: 'Setup Cargo',
          message: `Processo: ${processoUuid} | Cargo: ${cargoRes.body.uuid}`,
        })
      })
    })
  })
})

When('eu busco o cargo pelo UUID criado no processo', () => {
  cy.get('@processoUuid').then((processoUuid) => {
    cy.get('@cargoUuid').then((cargoUuid) => {
      cy.sigla_get(`/processos-convocacao/${processoUuid}/cargos/${cargoUuid}/`).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'Buscar Cargo', message: `UUID: ${cargoUuid} → HTTP ${res.status}` })
      })
    })
  })
})

Then('a resposta deve conter o campo {string} igual ao UUID do cargo criado', (campo) => {
  cy.get('@cargoUuid').then((uuid) => {
    cy.get('@response').then((res) => {
      expect(res.body[campo]).to.eq(uuid)
      Cypress.log({ name: 'Validação UUID Cargo', message: `${campo} = ${uuid}` })
    })
  })
})

When('eu busco cargo com UUID inexistente no processo', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_get(`/processos-convocacao/${uuid}/cargos/${UUID_INEXISTENTE}/`).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Cargo inexistente', message: `Processo: ${uuid} → HTTP ${res.status}` })
    })
  })
})

When('eu faço uma requisição SIGLA GET com UUID de cargo inválido no processo', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_get(`/processos-convocacao/${uuid}/cargos/uuid-invalido/`).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Cargo UUID inválido', message: `HTTP ${res.status}` })
    })
  })
})

When('eu faço um PUT no cargo criado com dados válidos', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.get('@processoUuid').then((processoUuid) => {
      cy.get('@cargoUuid').then((cargoUuid) => {
        cy.sigla_put(
          `/processos-convocacao/${processoUuid}/cargos/${cargoUuid}/`,
          payloads.cargoUpdate
        ).then((res) => {
          cy.wrap(res).as('response')
          Cypress.log({ name: 'PUT Cargo', message: `UUID: ${cargoUuid} → HTTP ${res.status}` })
        })
      })
    })
  })
})

When('eu faço um PUT no cargo criado sem body', () => {
  cy.get('@processoUuid').then((processoUuid) => {
    cy.get('@cargoUuid').then((cargoUuid) => {
      cy.sigla_put(`/processos-convocacao/${processoUuid}/cargos/${cargoUuid}/`, {}).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'PUT Cargo sem body', message: `UUID: ${cargoUuid} → HTTP ${res.status}` })
      })
    })
  })
})

When('eu faço um PUT em cargo inexistente no processo', () => {
  cy.get('@processoUuid').then((processoUuid) => {
    cy.sigla_put(
      `/processos-convocacao/${processoUuid}/cargos/${UUID_INEXISTENTE}/`,
      {}
    ).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'PUT Cargo inexistente', message: `HTTP ${res.status}` })
    })
  })
})

When('eu faço um PATCH no cargo criado com dados parciais', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.get('@processoUuid').then((processoUuid) => {
      cy.get('@cargoUuid').then((cargoUuid) => {
        cy.sigla_patch(
          `/processos-convocacao/${processoUuid}/cargos/${cargoUuid}/`,
          payloads.cargoPatch
        ).then((res) => {
          cy.wrap(res).as('response')
          Cypress.log({ name: 'PATCH Cargo', message: `UUID: ${cargoUuid} → HTTP ${res.status}` })
        })
      })
    })
  })
})

When('eu faço um PATCH no cargo criado com campo inválido', () => {
  cy.get('@processoUuid').then((processoUuid) => {
    cy.get('@cargoUuid').then((cargoUuid) => {
      cy.sigla_patch(
        `/processos-convocacao/${processoUuid}/cargos/${cargoUuid}/`,
        { campo_inexistente_xyz: 'valor' }
      ).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'PATCH Cargo inválido', message: `UUID: ${cargoUuid} → HTTP ${res.status}` })
      })
    })
  })
})

When('eu faço um PATCH em cargo inexistente no processo', () => {
  cy.get('@processoUuid').then((processoUuid) => {
    cy.sigla_patch(
      `/processos-convocacao/${processoUuid}/cargos/${UUID_INEXISTENTE}/`,
      {}
    ).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'PATCH Cargo inexistente', message: `HTTP ${res.status}` })
    })
  })
})

When('eu deleto o cargo criado do processo', () => {
  cy.get('@processoUuid').then((processoUuid) => {
    cy.get('@cargoUuid').then((cargoUuid) => {
      cy.sigla_delete(`/processos-convocacao/${processoUuid}/cargos/${cargoUuid}/`).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'DELETE Cargo', message: `UUID: ${cargoUuid} → HTTP ${res.status}` })
      })
    })
  })
})

Then('o cargo deletado não deve mais existir no processo', () => {
  cy.get('@processoUuid').then((processoUuid) => {
    cy.get('@cargoUuid').then((cargoUuid) => {
      cy.sigla_get(`/processos-convocacao/${processoUuid}/cargos/${cargoUuid}/`).then((res) => {
        expect(res.status).to.eq(404)
        Cypress.log({ name: 'Verificar exclusão cargo', message: `UUID: ${cargoUuid} → 404 confirmado` })
      })
    })
  })
})

When('eu tento deletar o mesmo cargo novamente no processo', () => {
  cy.get('@processoUuid').then((processoUuid) => {
    cy.get('@cargoUuid').then((cargoUuid) => {
      cy.sigla_delete(`/processos-convocacao/${processoUuid}/cargos/${cargoUuid}/`).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'DELETE duplo Cargo', message: `UUID: ${cargoUuid} → HTTP ${res.status}` })
      })
    })
  })
})

// ── FLUXO COMPLETO ────────────────────────────────────────────────────────────

When('eu adiciono um cargo ao processo criado no fluxo completo', () => {
  cy.fixture('api/sigla_payloads').then((payloads) => {
    cy.get('@processoUuid').then((uuid) => {
      cy.sigla_post(`/processos-convocacao/${uuid}/cargos/`, payloads.cargo).then((res) => {
        cy.wrap(res).as('response')
        if (res.status === 200 || res.status === 201) {
          cy.wrap(res.body.uuid).as('cargoUuidFluxo')
        }
        Cypress.log({ name: 'Fluxo: Adicionar Cargo', message: `HTTP ${res.status}` })
      })
    })
  })
})

When('eu deleto o cargo criado no fluxo completo', () => {
  cy.get('@processoUuid').then((processoUuid) => {
    cy.get('@cargoUuidFluxo').then((cargoUuid) => {
      cy.sigla_delete(`/processos-convocacao/${processoUuid}/cargos/${cargoUuid}/`).then((res) => {
        cy.wrap(res).as('response')
        Cypress.log({ name: 'Fluxo: DELETE Cargo', message: `UUID: ${cargoUuid} → HTTP ${res.status}` })
      })
    })
  })
})

When('eu deleto o processo criado no fluxo completo', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_delete(`/processos-convocacao/${uuid}/`).then((res) => {
      cy.wrap(res).as('response')
      Cypress.log({ name: 'Fluxo: DELETE Processo', message: `UUID: ${uuid} → HTTP ${res.status}` })
    })
  })
})

// ── ASSERTIVAS DE VALOR / CONSISTÊNCIA ───────────────────────────────────────

Then('o processo criado deve aparecer na listagem de processos', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_get('/processos-convocacao/').then((res) => {
      expect(res.status).to.eq(200)
      const items = Array.isArray(res.body) ? res.body : (res.body.results || [])
      const found = items.some((p) => p.uuid === uuid)
      expect(found, `Processo ${uuid} deve aparecer na listagem`).to.be.true
      Cypress.log({ name: 'Consistência listagem', message: `UUID ${uuid} encontrado` })
    })
  })
})

Then('ao buscar novamente o mesmo processo o resultado deve ser idêntico', () => {
  cy.get('@response').then((primeiraRes) => {
    cy.get('@processoUuid').then((uuid) => {
      cy.sigla_get(`/processos-convocacao/${uuid}/`).then((segundaRes) => {
        expect(segundaRes.status).to.eq(200)
        expect(segundaRes.body).to.deep.equal(primeiraRes.body)
        Cypress.log({ name: 'Idempotência GET', message: 'Respostas idênticas confirmadas' })
      })
    })
  })
})

Then('ao buscar o processo atualizado o campo modificado deve refletir a mudança', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.fixture('api/sigla_payloads').then((payloads) => {
      cy.sigla_get(`/processos-convocacao/${uuid}/`).then((res) => {
        expect(res.status).to.eq(200)
        const campoAlterado = Object.keys(payloads.processoConvocacaoPatch)[0]
        expect(res.body[campoAlterado]).to.eq(payloads.processoConvocacaoPatch[campoAlterado])
        Cypress.log({ name: 'Validação PATCH', message: `Campo "${campoAlterado}" reflete mudança` })
      })
    })
  })
})

Then('a lista de cargos do processo criado deve ser uma lista válida', () => {
  cy.get('@processoUuid').then((uuid) => {
    cy.sigla_get(`/processos-convocacao/${uuid}/cargos/`).then((res) => {
      expect(res.status).to.eq(200)
      const items = Array.isArray(res.body) ? res.body : (res.body.results || [])
      expect(items).to.be.an('array')
      Cypress.log({ name: 'Lista cargos válida', message: `${items.length} cargo(s) encontrado(s)` })
    })
  })
})
