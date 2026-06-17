/// <reference types="cypress" />

import { Then } from '@badeball/cypress-cucumber-preprocessor'


Then('o status CONCURSO deve ser {int}', (statusEsperado) => {
  cy.get('@response').its('status').should('eq', statusEsperado)
})

Then('o status CONCURSO deve ser {int} ou {int}', (s1, s2) => {
  cy.get('@response').its('status').then((status) => {
    expect([s1, s2], `Status deve ser ${s1} ou ${s2}`).to.include(status)
  })
})

Then('o status CONCURSO não deve ser {int}', (statusIndesejado) => {
  cy.get('@response').its('status').should('not.eq', statusIndesejado)
})

// ── Assertivas de estrutura ──────────────────────────────────────────────────

Then('a resposta CONCURSO deve ser uma lista', () => {
  cy.get('@response').then((res) => {
    const body = res.body
    const isList = Array.isArray(body) || (body && Array.isArray(body.results))
    expect(isList, 'Resposta deve ser lista ou objeto paginado com results').to.be.true
    Cypress.log({ name: 'Validação', message: 'Resposta é uma lista' })
  })
})

Then('a resposta CONCURSO deve ser um objeto', () => {
  cy.get('@response').then((res) => {
    expect(res.body).to.be.an('object').and.not.be.null
    Cypress.log({ name: 'Validação', message: 'Resposta é um objeto' })
  })
})

Then('a resposta CONCURSO deve conter {string}', (chave) => {
  cy.get('@response').then((res) => {
    const body = res.body
    // Se a resposta é string, verifica se contém a chave como texto
    // Se é objeto/JSON, verifica propriedade
    if (typeof body === 'string') {
      expect(body).to.include(chave)
      Cypress.log({ name: 'Validação', message: `Resposta contém "${chave}"` })
    } else if (typeof body === 'object') {
      expect(JSON.stringify(body)).to.include(chave)
      Cypress.log({ name: 'Validação', message: `Resposta contém "${chave}"` })
    }
  })
})

Then('o header Content-Type CONCURSO deve conter {string}', (valor) => {
  cy.get('@response').its('headers').its('content-type').should('include', valor)
})

Then('o tempo de resposta CONCURSO deve ser menor que {int} milissegundos', (limite) => {
  cy.get('@response').its('duration').should('be.lessThan', limite)
  Cypress.log({ name: 'Performance', message: `Limite: ${limite}ms` })
})

Then('o campo {string} da resposta CONCURSO deve ser um UUID válido', (campo) => {
  cy.get('@response').then((res) => {
    const body = res.body
    const valorTopLevel = body[campo]
    const valorEmCargos = body.cargos && body.cargos[0] ? body.cargos[0][campo] : undefined
    const valor = valorTopLevel !== undefined ? valorTopLevel : valorEmCargos
    
    expect(valor, `Campo "${campo}" deve estar presente`).to.not.be.undefined
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(valor, `Campo "${campo}" deve ser um UUID válido`).to.match(uuidRegex)
    
    Cypress.log({ name: 'Validação UUID', message: `"${campo}" é UUID válido` })
  })
})

Then('o campo {string} da resposta CONCURSO deve ser uma data válida', (campo) => {
  cy.get('@response').then((res) => {
    const body = res.body
    const valor = body[campo]
    
    expect(valor, `Campo "${campo}" deve estar presente`).to.not.be.undefined
    
    const date = new Date(valor)
    expect(date.toString(), `Campo "${campo}" deve ser uma data válida`).to.not.equal('Invalid Date')
    
    Cypress.log({ name: 'Validação Data', message: `"${campo}" é data válida` })
  })
})

Then('a lista de resultados CONCURSO não deve estar vazia', () => {
  cy.get('@response').then((res) => {
    const body = res.body
    const results = body.results || body
    expect(Array.isArray(results) && results.length > 0, 'Resultados não devem estar vazios').to.be.true
    Cypress.log({ name: 'Validação', message: `${results.length} resultado(s) encontrado(s)` })
  })
})

Then('a contagem total CONCURSO deve ser maior que zero', () => {
  cy.get('@response').then((res) => {
    const count = res.body.count
    expect(count, 'Count deve ser maior que zero').to.be.greaterThan(0)
    Cypress.log({ name: 'Validação', message: `Total: ${count} registro(s)` })
  })
})
