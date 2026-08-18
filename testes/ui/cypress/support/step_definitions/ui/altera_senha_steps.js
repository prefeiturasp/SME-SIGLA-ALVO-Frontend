/// <reference types="cypress" />

import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

// =====================================================
// SELECTORES — MEUS DADOS / ALTERAR SENHA
// =====================================================

const senhaSelectors = {
  modal: {
    container: '.ant-modal, [role="dialog"]',
    wrap: '.ant-modal-wrap, .ant-modal-root'
  },

  alterarSenha: {
    senhaAtual:           '/html/body/div[2]/div/div[2]/div/div[1]/div/div[2]/div[1]/div[2]/div[1]/span[2]/input',
    novaSenha:            '/html/body/div[2]/div/div[2]/div/div[1]/div/div[2]/div[1]/div[2]/div[2]/span[2]/input',
    confirmacaoNovaSenha: '/html/body/div[2]/div/div[2]/div/div[1]/div/div[2]/div[1]/div[2]/div[3]/span[2]/input'
  }
}

// Mapa: nome do campo (sem acento, lowercase) → XPath do input
const semAcento = (str) =>
  str.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const campoXPathMap = {
  'nova senha':                   senhaSelectors.alterarSenha.novaSenha,
  'confirmacao da nova senha':    senhaSelectors.alterarSenha.confirmacaoNovaSenha,
  'confirmacao':                   senhaSelectors.alterarSenha.confirmacaoNovaSenha
}

// =====================================================
// HELPERS
// =====================================================

const escaparRegex = (texto) =>
  texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const criarRegex = (texto) =>
  new RegExp(
    escaparRegex(texto.trim())
      .replace(/ç|Ç/g, '[çc]')
      .replace(/ã|Ã/g, '[ãa]')
      .replace(/õ|Õ/g, '[õo]')
      .replace(/é|É/g, '[eé]')
      .replace(/í|Í/g, '[ií]')
      .replace(/ó|Ó/g, '[oó]')
      .replace(/ú|Ú/g, '[uú]')
      .replace(/â|Â/g, '[aâ]')
      .replace(/ê|Ê/g, '[eê]'),
    'i'
  )

// =====================================================
// STEPS — MODAL ALTERAR SENHA
// =====================================================

Then('o modal de alterar senha é exibido', () => {
  cy.get(senhaSelectors.modal.container, { timeout: 10000 })
    .filter(':visible')
    .should('exist')
  cy.contains(/Nova senha/i, { timeout: 8000 }).should('be.visible')
})

Then('o modal de alterar senha exibe o campo {string}', (campo) => {
  cy.get(senhaSelectors.modal.container, { timeout: 10000 })
    .filter(':visible')
    .contains(criarRegex(campo))
    .should('be.visible')
})

Then('o modal de alterar senha exibe os botões {string} e {string}', (botao1, botao2) => {
  const modal = () =>
    cy.get(senhaSelectors.modal.container, { timeout: 10000 }).filter(':visible')
  modal().contains('button', criarRegex(botao1)).should('be.visible')
  modal().contains('button', criarRegex(botao2)).should('be.visible')
})

When('clico em {string} no modal de alterar senha', (botao) => {
  cy.wait(800)
  cy.get(senhaSelectors.modal.container, { timeout: 10000 })
    .filter(':visible')
    .contains('button', criarRegex(botao))
    .click({ force: true })
  cy.wait(1000)
})

When('preencho a senha atual no modal de alterar senha', () => {
  const senhaAtual = Cypress.env('SIGLA_LOGIN_SENHA')
  cy.wait(500)
  cy.xpath(senhaSelectors.alterarSenha.senhaAtual, { timeout: 10000 })
    .should('be.visible')
    .clear({ force: true })
    .type(senhaAtual, { force: true, delay: 120 })
  cy.wait(600)
  cy.log('✅ Senha atual preenchida')
})

When('preencho o campo {string} com {string} no modal de alterar senha', (campo, valor) => {
  const xpath = campoXPathMap[semAcento(campo)]

  cy.wait(500)
  if (xpath) {
    cy.xpath(xpath, { timeout: 10000 })
      .should('be.visible')
      .clear({ force: true })
      .type(valor, { force: true, delay: 120 })
  } else {
    cy.get(senhaSelectors.modal.container, { timeout: 10000 })
      .filter(':visible')
      .within(() => {
        cy.contains(criarRegex(campo))
          .closest('.ant-form-item')
          .find('input')
          .should('be.visible')
          .clear({ force: true })
          .type(valor, { force: true, delay: 120 })
      })
  }
  cy.wait(600)
  cy.log(`✅ Campo "${campo}" preenchido com "${valor}"`)
})

When('fecho o modal de alterar senha pelo botão fechar', () => {
  cy.get('body').then(($body) => {
    if ($body.find('.ant-modal-close:visible').length > 0) {
      cy.get('.ant-modal-close').filter(':visible').click({ force: true })
    } else {
      cy.xpath('/html/body/div[2]/div/div[2]/div/div[1]/div/button').click({ force: true })
    }
  })
  cy.wait(500)
})

Then('o modal de alterar senha é fechado', () => {
  cy.wait(500)
  cy.get('body').then(($body) => {
    const $wrap = $body.find(senhaSelectors.modal.wrap)
    if ($wrap.length > 0) {
      cy.get(senhaSelectors.modal.wrap).should('not.be.visible')
    } else {
      cy.get(senhaSelectors.modal.container).should('not.exist')
    }
  })
  cy.log('✅ Modal de alteração de senha fechado')
})
