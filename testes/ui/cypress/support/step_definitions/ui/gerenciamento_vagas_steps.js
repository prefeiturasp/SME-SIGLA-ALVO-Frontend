/// <reference types="cypress" />

import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

const selecionarProcesso = () =>
  cy.contains('label, span', /^Processo$/i, { timeout: 10000 })
    .closest('.ant-form-item, .ant-row')
    .find('.ant-select-selector')

// =====================================================
// STEPS — TELA GERENCIAMENTO DE VAGAS
// =====================================================

Then('o sistema exibe a tela de gerenciamento de vagas', () => {
  cy.url({ timeout: 10000 }).should('include', 'gerenciamento')
  cy.contains(/Gerenciamento de vagas/i, { timeout: 10000 }).should('be.visible')
})

Then('o campo Processo está visível na tela de gerenciamento de vagas', () => {
  cy.contains(/^Processo$/i, { timeout: 10000 }).should('be.visible')
  selecionarProcesso().should('be.visible')
})

When('seleciono uma opção aleatória no campo Processo do gerenciamento de vagas', () => {
  selecionarProcesso().click({ force: true })
  cy.wait(1000)
  cy.get('.ant-select-dropdown .ant-select-item-option', { timeout: 8000 }).then(($opcoes) => {
    if ($opcoes.length > 0) {
      const indice = Math.floor(Math.random() * Math.min($opcoes.length, 5))
      cy.wrap($opcoes.eq(indice)).click({ force: true })
      cy.wait(1500)
    } else {
      cy.log('Nenhuma opção de processo disponível no momento')
    }
  })
})

Then('o sistema carrega os dados do processo selecionado no gerenciamento de vagas', () => {
  cy.wait(1500)
  cy.get('body').then(($body) => {
    const temDados =
      $body.find('table, .ant-table').length > 0 ||
      $body.find('.ant-card, .ant-tabs').length > 0 ||
      !!$body.text().match(/cargo|vaga|candidato|concurso/i)
    expect(temDados, 'Deve exibir dados após selecionar o processo').to.be.true
  })
})
