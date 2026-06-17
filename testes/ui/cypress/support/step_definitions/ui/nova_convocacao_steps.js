/// <reference types="cypress" />

import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

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

const formatarData = (data) => {
  const dd = String(data.getDate()).padStart(2, '0')
  const mm = String(data.getMonth() + 1).padStart(2, '0')
  const yyyy = data.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

// =====================================================
// STEPS — LISTA DE CONVOCAÇÕES
// =====================================================

Then('a lista de convocações exibe o botão {string}', (texto) => {
  cy.contains('button', criarRegex(texto), { timeout: 8000 }).should('be.visible')
})

Then('a lista de convocações exibe os textos:', (dataTable) => {
  const textos = dataTable.raw().flat()
  textos.forEach((texto) => {
    cy.contains(criarRegex(texto), { timeout: 8000 }).should('be.visible')
  })
})

Then('a lista de convocações exibe os botões de filtro:', (dataTable) => {
  const botoes = dataTable.raw().flat()
  botoes.forEach((botao) => {
    cy.contains('button', criarRegex(botao), { timeout: 5000 }).should('be.visible')
  })
})

When('clico em {string} na lista de convocações', (botao) => {
  cy.contains('button', criarRegex(botao), { timeout: 8000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(1500)
})

// =====================================================
// STEPS — FORMULÁRIO NOVA CONVOCAÇÃO
// =====================================================

Then('o sistema exibe o formulário de nova convocação', () => {
  cy.contains(/Nova convoca[çc][ãa]o/i, { timeout: 10000 }).should('be.visible')
  cy.contains(/Processo de convoca[çc][ãa]o de candidatos/i, { timeout: 8000 }).should('be.visible')
})

Then('o formulário exibe as etapas do processo:', (dataTable) => {
  const etapas = dataTable.raw().flat()
  etapas.forEach((etapa) => {
    cy.contains(criarRegex(etapa), { timeout: 8000 }).should('be.visible')
  })
})

Then('o formulário exibe os campos da etapa 1:', (dataTable) => {
  const campos = dataTable.raw().flat()
  campos.forEach((campo) => {
    cy.contains(criarRegex(campo), { timeout: 8000 }).should('be.visible')
  })
})

Then('o formulário exibe os botões {string} e {string} na etapa 1', (botao1, botao2) => {
  cy.contains('button', criarRegex(botao1), { timeout: 8000 }).should('be.visible')
  cy.contains('button', criarRegex(botao2), { timeout: 8000 }).should('be.visible')
})

// =====================================================
// STEPS — PREENCHIMENTO ETAPA 1
// =====================================================

When('seleciono {string} no campo Concurso', (valor) => {
  cy.contains('label, span', /^Concurso$/i, { timeout: 8000 })
    .closest('.ant-form-item, .ant-row')
    .find('.ant-select-selector')
    .click({ force: true })
  cy.wait(1000)
  cy.contains('.ant-select-item-option-content', valor, { timeout: 8000 })
    .click({ force: true })
  cy.wait(500)
})

When('seleciono {string} no campo Tipo de Escolha', (valor) => {
  cy.contains('label, span', /Tipo de Escolha/i, { timeout: 8000 })
    .closest('.ant-form-item, .ant-row')
    .find('.ant-select-selector')
    .click({ force: true })
  cy.wait(1000)
  cy.contains('.ant-select-item-option-content', valor, { timeout: 8000 })
    .click({ force: true })
  cy.wait(500)
})

When('preencho o campo Descrição com {string} no formulário de convocação', (valor) => {
  cy.contains('label, span', /^Descri[çc][ãa]o$/i, { timeout: 8000 })
    .closest('.ant-form-item, .ant-row')
    .find('input, textarea')
    .first()
    .clear({ force: true })
    .type(valor, { force: true, delay: 50 })
})

When('preencho a Data da convocação com a data de ontem', () => {
  const ontem = new Date()
  ontem.setDate(ontem.getDate() - 1)
  const dataFormatada = formatarData(ontem)

  cy.contains('label, span', /Data da convoca[çc][ãa]o/i, { timeout: 8000 })
    .closest('.ant-form-item, .ant-row')
    .find('input')
    .first()
    .click({ force: true })
    .clear({ force: true })
    .type(dataFormatada, { force: true })
  cy.get('body').type('{esc}')
  cy.wait(300)
})

When('preencho a Data corte de vagas com a data de amanhã', () => {
  const amanha = new Date()
  amanha.setDate(amanha.getDate() + 1)
  const dataFormatada = formatarData(amanha)

  cy.contains('label, span', /Data corte/i, { timeout: 8000 })
    .closest('.ant-form-item, .ant-row')
    .find('input')
    .first()
    .click({ force: true })
    .clear({ force: true })
    .type(dataFormatada, { force: true })
  cy.get('body').type('{esc}')
  cy.wait(300)
})

When('clico em {string} no formulário de convocação', (botao) => {
  cy.contains('button', criarRegex(botao), { timeout: 8000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(2000)
})

// =====================================================
// STEPS — ETAPA 2
// =====================================================

Then('o sistema avança para a etapa 2 de configuração de cargos', () => {
  cy.contains(/Sele[çc][ãa]o e configura[çc][ãa]o do\(s\) cargo\(s\)/i, { timeout: 15000 })
    .should('be.visible')
})

Then('a etapa 2 exibe o resumo dos dados preenchidos:', (dataTable) => {
  const itens = dataTable.raw().flat()
  itens.forEach((item) => {
    cy.contains(criarRegex(item), { timeout: 8000 }).should('be.visible')
  })
})
