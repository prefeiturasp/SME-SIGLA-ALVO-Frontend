/// <reference types="cypress" />

import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

// =====================================================
// SELECTORES — MEUS DADOS / ALTERAR E-MAIL
// =====================================================

const meusDadosSelectors = {
  urls: {
    home: 'https://qa-sigla.sme.prefeitura.sp.gov.br',
    meusDados: '/meus-dados'
  },

  perfil: {
    // XPath confirmado via inspeção do DOM
    botao: '//*[@id="root"]/div/div/header/div/div[2]/span',
    // Dropdown renderizado no body pelo Ant Design — coberto por cy.contains()
    dadosUsuario: '/html/body/div[2]/div/ul/li[1]/span'
  },

  modal: {
    container: '.ant-modal, [role="dialog"]',
    wrap: '.ant-modal-wrap, .ant-modal-root'
  }
}

// =====================================================
// HELPERS
// =====================================================

const escaparRegex = (texto) =>
  texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const criarRegex = (texto) =>
  new RegExp(
    escaparRegex(texto.trim())
      .replace(/\[\\.\*\+.*\]/g, (m) => m)
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
// STEPS — NAVEGAÇÃO PARA MEUS DADOS
// =====================================================

When('acesso o menu de perfil do usuário', () => {
  cy.wait(800)
  // XPath confirmado via inspeção: span wrapping o ícone SVG no header
  cy.xpath('//*[@id="root"]/div/div/header/div/div[2]/span')
    .should('exist')
    .click({ force: true })
  cy.wait(800)
})

When('seleciono {string} no menu de perfil', () => {
  // XPath confirmado via inspeção: li[1]/span do dropdown Ant Design renderizado no body
  cy.xpath('/html/body/div[2]/div/ul/li[1]/span')
    .should('be.visible')
    .click({ force: true })
  cy.wait(1500)
})

// =====================================================
// STEPS — TELA MEUS DADOS
// =====================================================

Then('o sistema exibe os campos do perfil do usuário:', (dataTable) => {
  const campos = dataTable.raw().flat().filter(Boolean)
  campos.forEach((campo) => {
    cy.contains(criarRegex(campo), { timeout: 8000 }).should('be.visible')
    cy.log(`✅ Campo "${campo.trim()}" exibido`)
  })
})

// =====================================================
// STEPS — MODAL ALTERAR E-MAIL
// =====================================================

When('clico em {string} nos meus dados', (botao) => {
  cy.contains('button', criarRegex(botao), { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(1000)
})

Then('o modal de alterar e-mail é exibido', () => {
  cy.get(meusDadosSelectors.modal.container, { timeout: 10000 })
    .filter(':visible')
    .should('exist')
  cy.contains(/Alterar e-mail/i, { timeout: 8000 }).should('be.visible')
  cy.log('✅ Modal "Alterar e-mail" exibido')
})

Then('o modal de alterar e-mail exibe o campo {string}', (campo) => {
  cy.get(meusDadosSelectors.modal.container, { timeout: 10000 })
    .filter(':visible')
    .contains(criarRegex(campo))
    .should('be.visible')
  cy.log(`✅ Campo "${campo}" encontrado no modal`)
})

Then('o modal de alterar e-mail exibe os botões {string} e {string}', (botao1, botao2) => {
  const modal = () =>
    cy.get(meusDadosSelectors.modal.container, { timeout: 10000 }).filter(':visible')

  modal().contains('button', criarRegex(botao1)).should('be.visible')
  modal().contains('button', criarRegex(botao2)).should('be.visible')
  cy.log(`✅ Botões "${botao1}" e "${botao2}" encontrados no modal`)
})

When('preencho o campo {string} no modal com {string}', (campo, valor) => {
  cy.get(meusDadosSelectors.modal.container, { timeout: 10000 })
    .filter(':visible')
    .within(() => {
      cy.contains(criarRegex(campo))
        .closest('.ant-form-item, .ant-row, label, div')
        .find('input')
        .should('be.visible')
        .clear({ force: true })
        .type(valor, { force: true, delay: 80 })
    })
  cy.log(`✅ Campo "${campo}" preenchido com "${valor}"`)
})

When('clico em {string} no modal de alterar e-mail', (botao) => {
  cy.get(meusDadosSelectors.modal.container, { timeout: 10000 })
    .filter(':visible')
    .contains('button', criarRegex(botao))
    .click({ force: true })
  cy.wait(1000)
})

Then('o modal de alterar e-mail é fechado', () => {
  cy.wait(500)
  cy.get('body').then(($body) => {
    const $wrap = $body.find(meusDadosSelectors.modal.wrap)
    if ($wrap.length > 0) {
      cy.get(meusDadosSelectors.modal.wrap).should('not.be.visible')
    } else {
      cy.get(meusDadosSelectors.modal.container).should('not.exist')
    }
  })
  cy.log('✅ Modal de alteração de e-mail fechado')
})

Then('permaneço na tela de meus dados', () => {
  cy.url({ timeout: 8000 }).should('include', 'meus-dados')
  cy.contains(/Meus Dados/i, { timeout: 8000 }).should('be.visible')
  cy.log('✅ Permanece na tela Meus Dados')
})
