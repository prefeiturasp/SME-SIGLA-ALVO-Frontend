/// <reference types="cypress" />

import { Then } from '@badeball/cypress-cucumber-preprocessor'

// ── Validações de Status ─────────────────────────────────────────────────────

Then('o status IMPORTA deve ser {int}', (expectedStatus) => {
  cy.get('@response').then((res) => {
    expect(res.status, `Status deve ser ${expectedStatus}`).to.equal(expectedStatus)
  })
})

Then('o status IMPORTA deve ser {int} ou {int}', (status1, status2) => {
  cy.get('@response').then((res) => {
    expect([status1, status2], `Status deve ser ${status1} ou ${status2}`).to.include(res.status)
  })
})

// ── Validações de Resposta ───────────────────────────────────────────────────

Then('a resposta IMPORTA deve conter {string}', (expectedText) => {
  cy.get('@response').then((res) => {
    const responseBody = typeof res.body === 'string' ? res.body : JSON.stringify(res.body)
    expect(responseBody, `Resposta deve conter "${expectedText}"`).to.include(expectedText)
  })
})

Then('o campo {string} da resposta IMPORTA deve ser um UUID válido', (fieldName) => {
  cy.get('@response').then((res) => {
    const value = res.body[fieldName]
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(value, `Campo "${fieldName}" deve ser um UUID válido`).to.match(uuidRegex)
  })
})

Then('o campo {string} da resposta IMPORTA deve existir', (fieldName) => {
  cy.get('@response').then((res) => {
    expect(res.body, `Resposta deve ter campo "${fieldName}"`).to.have.property(fieldName)
  })
})

Then('o campo {string} da resposta IMPORTA deve ser {string}', (fieldName, expectedValue) => {
  cy.get('@response').then((res) => {
    expect(res.body[fieldName], `Campo "${fieldName}" deve ser "${expectedValue}"`).to.equal(expectedValue)
  })
})

// ── Validações de Performance ────────────────────────────────────────────────

Then('o tempo de resposta IMPORTA deve ser menor que {int} milissegundos', (maxDuration) => {
  cy.get('@response').then((res) => {
    expect(res.duration, `Tempo de resposta deve ser menor que ${maxDuration}ms`).to.be.lessThan(maxDuration)
  })
})

// ── Validações de Lista/Paginação ────────────────────────────────────────────

Then('a resposta IMPORTA deve ser uma lista paginada', () => {
  cy.get('@response').then((res) => {
    expect(res.body, 'Resposta deve ter campo "count"').to.have.property('count')
    expect(res.body, 'Resposta deve ter campo "results"').to.have.property('results')
    expect(res.body.results, '"results" deve ser um array').to.be.an('array')
  })
})

Then('a resposta IMPORTA deve ter {int} ou mais resultados', (minCount) => {
  cy.get('@response').then((res) => {
    expect(res.body.count, `Deve ter ${minCount} ou mais resultados`).to.be.at.least(minCount)
  })
})

// ── Validações de Arquivo/Download ───────────────────────────────────────────

Then('a resposta IMPORTA deve ser um arquivo', () => {
  cy.get('@response').then((res) => {
    const contentType = res.headers['content-type']
    const contentDisposition = res.headers['content-disposition']
    
    expect(
      contentType === 'text/plain' || 
      contentType === 'application/octet-stream' ||
      contentDisposition?.includes('attachment'),
      'Resposta deve ser um arquivo (text/plain ou application/octet-stream ou com content-disposition attachment)'
    ).to.be.true
  })
})

// ── Validações de Campos Obrigatórios ────────────────────────────────────────

Then('a resposta IMPORTA deve indicar erro de campo obrigatório', () => {
  cy.get('@response').then((res) => {
    const bodyStr = JSON.stringify(res.body).toLowerCase()
    const hasErrorIndicator = 
      bodyStr.includes('required') ||
      bodyStr.includes('obrigatório') ||
      bodyStr.includes('obrigatorio') ||
      bodyStr.includes('este campo') ||
      bodyStr.includes('this field') ||
      bodyStr.includes('não pode estar em branco') ||
      bodyStr.includes('nao pode estar em branco')
    
    expect(hasErrorIndicator, 'Resposta deve indicar erro de campo obrigatório').to.be.true
  })
})
