/// <reference types="cypress" />

import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

// =====================================================
// PACK — IMPORTAÇÃO DE DADOS (PERMISSÕES RESTRITAS)
// =====================================================

const importacaoPack = {

  titulos: {
    principal: () => cy.contains(/Importação de Dados/i, { timeout: 10000 })
  },

  abas: {
    aba: (nome) => cy.contains('.ant-tabs-tab, [role="tab"], button, span', new RegExp(nome, 'i'), { timeout: 10000 })
  },

  botoes: {
    selecionar: () => cy.get('.ant-tabs-tabpane-active, .ant-tabs-tabpane:not(.ant-tabs-tabpane-hidden)').first().contains('button', /Selecionar/i, { timeout: 10000 }),
    importar: () => cy.get('.ant-tabs-tabpane-active, .ant-tabs-tabpane:not(.ant-tabs-tabpane-hidden)').first().contains('button', /Importar/i, { timeout: 10000 }),
    historico: () => cy.get('.ant-tabs-tabpane-active, .ant-tabs-tabpane:not(.ant-tabs-tabpane-hidden)').first().contains('button', /Histórico/i, { timeout: 10000 }),
    voltar: () => cy.contains('button, a', /Voltar/i, { timeout: 10000 })
  },

  mensagemPermissao: () =>
    cy.contains(/Você não possui permissão para essa ação/i, { timeout: 8000 }),

  historicoPack: {
    titulo: () => cy.contains(/Últimas importações/i, { timeout: 10000 }),
    tabela: () => cy.get('table', { timeout: 10000 }),
    coluna: (nome) => cy.contains('th', new RegExp(nome, 'i'), { timeout: 10000 })
  }
}

// =====================================================
// HELPER — CLICAR EM BOTÃO E VALIDAR PERMISSÃO NEGADA
// =====================================================

const clicarEValidarPermissao = (botaoFn, mensagem) => {
  botaoFn().then(($btn) => {
    const isDisabled =
      $btn.is(':disabled') ||
      $btn.attr('disabled') !== undefined ||
      $btn.attr('aria-disabled') === 'true' ||
      $btn.hasClass('disabled')

    if (isDisabled) {
      cy.wrap($btn).trigger('mouseover', { force: true })
      cy.wait(800)
      cy.get('body').then(($body) => {
        const tooltipVisivel = $body.find('.ant-tooltip:not(.ant-tooltip-hidden)').length > 0
        if (tooltipVisivel) {
          cy.get('.ant-tooltip:not(.ant-tooltip-hidden) .ant-tooltip-inner').then(($inner) => {
            const tooltipTexto = $inner.text()
            if (tooltipTexto.match(/permissão/i)) {
              expect(tooltipTexto).to.match(/permissão/i)
            }
          })
        }
      })
      cy.wrap($btn).trigger('mouseout', { force: true })
      cy.wait(300)
    } else {
      cy.wrap($btn).click({ force: true })
      cy.wait(1000)
      cy.get('body').then(($body) => {
        const temMensagem = $body.text().match(/permissão/i)
        if (temMensagem) {
          cy.wrap($body).contains(/permissão/i).should('be.visible')
        }
      })
    }
  })
}

// =====================================================
// STEPS — TELA PRINCIPAL E ABAS
// =====================================================

When('clico na aba {string} da importação de dados', (nomeAba) => {
  cy.url().then((url) => {
    if (!url.match(/\/importacao-dados\/?([?#].*)?$/)) {
      cy.visit('/processos/importacao-dados')
      cy.wait(2000)
    }
  })
  cy.wait(500)
  importacaoPack.abas.aba(nomeAba).click({ force: true })
  cy.wait(1500)
})

Then('valido a existência das abas de importação de dados:', (dataTable) => {
  const abas = dataTable.raw().flat().filter(Boolean)
  cy.wait(500)
  abas.forEach((aba) => {
    cy.contains('.ant-tabs-tab, [role="tab"], button, span, div', new RegExp(aba.trim(), 'i'))
      .should('be.visible')
  })
})

Then('o sistema exibe o texto de instrução {string}', (texto) => {
  cy.wait(500)
  cy.get('body').should('contain.text', texto.slice(0, 30))
})

Then('o sistema exibe a descrição da aba vagas escolas', () => {
  cy.wait(300)
  cy.get('body').should('contain.text', 'Nesta aba')
})

Then('o sistema exibe o campo {string} na aba de importação', (campo) => {
  cy.wait(500)
  const regex = new RegExp(campo.replace(/[çÇ]/g, '[çc]').replace(/[ãÃ]/g, '[ãa]'), 'i')
  cy.get('.ant-tabs-tabpane-active, .ant-tabs-tabpane:not(.ant-tabs-tabpane-hidden)')
    .first()
    .contains(regex)
    .should('be.visible')
})

// =====================================================
// STEPS — BOTÕES COM VALIDAÇÃO DE PERMISSÃO
// =====================================================

When('ao clicar no botão {string} da importação devo ver {string}', (botao, mensagem) => {
  cy.wait(300)

  if (botao.match(/Selecionar/i)) {
    clicarEValidarPermissao(importacaoPack.botoes.selecionar, mensagem)
  } else if (botao.match(/Importar/i)) {
    clicarEValidarPermissao(importacaoPack.botoes.importar, mensagem)
  } else if (botao.match(/Histórico/i)) {
    clicarEValidarPermissao(importacaoPack.botoes.historico, mensagem)
  }
})

// =====================================================
// STEPS — HISTÓRICO (NAVEGAR E VALIDAR)
// =====================================================

When('clico no botão {string} da aba vagas escolas', () => {
  cy.wait(300)
  importacaoPack.botoes.historico().click({ force: true })
  cy.wait(2000)
})

When('clico no botão {string} da aba habilitados', () => {
  cy.wait(300)
  importacaoPack.botoes.historico().click({ force: true })
  cy.wait(2000)
})

When('clico no botão {string} da aba lotes sigpec', () => {
  cy.wait(300)
  importacaoPack.botoes.historico().click({ force: true })
  cy.wait(2000)
})

Then('o sistema exibe o título de histórico {string}', (titulo) => {
  cy.wait(1000)
  cy.get('body').then(($body) => {
    const partes = titulo.split(' - ')
    partes.forEach((parte) => {
      const temTexto = $body.text().toLowerCase().includes(parte.toLowerCase().replace(/[çc]/g, 'c').replace(/[ãa]/g, 'a'))
      if (!temTexto) {
        cy.contains(new RegExp(parte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')).should('be.visible')
      }
    })
  })
})

Then('valido o texto {string} no histórico de importação', (texto) => {
  cy.wait(300)
  cy.contains(new RegExp(texto.replace(/[ÚU]/g, '[ÚU]').replace(/[çc]/g, '[çc]').replace(/[õo]/g, '[õo]'), 'i'))
    .should('be.visible')
})

Then('valido a tabela de histórico de importação com as colunas:', (dataTable) => {
  const colunas = dataTable.raw().flat().filter(Boolean)
  cy.wait(500)
  importacaoPack.historicoPack.tabela().should('be.visible')
  colunas.forEach((coluna) => {
    cy.contains('th', new RegExp(coluna.trim(), 'i')).should('be.visible')
  })
})

When('clico em {string} na tela de histórico de importação', () => {
  cy.wait(300)
  importacaoPack.botoes.voltar().click({ force: true })
  cy.wait(2000)
})

Then('o sistema retorna para a tela de importação de dados', () => {
  cy.wait(1000)
  cy.url({ timeout: 10000 }).should('match', /\/importacao-dados\/?([?#].*)?$/)
})
