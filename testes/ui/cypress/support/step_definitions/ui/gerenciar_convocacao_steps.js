/// <reference types="cypress" />

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

// =====================================================
// SELECTORES — EDITAR/EXCLUIR CONVOCAÇÃO
// =====================================================
// Tela real: lista de convocações (menu Processos > Convocação de
// Candidatos), coluna "Gerenciar" — confirmada ao vivo em
// cypress/e2e/ui/gerenciar_convocacao.feature. A ordem dos botões da linha
// é fixa: 0 = Editar (lápis), 1 = Visualizar (olho), 2 = Excluir (lixeira).

const gerenciarSelectors = {
  botaoTotalRegistros: () => cy.contains(/Mostrando .* de .* registro/i, { timeout: 10000 }),

  formularioEdicao: {
    botaoCancelar: () => cy.contains('button', 'Cancelar', { timeout: 10000 })
  },

  dialogoExcluir: {
    container: () => cy.get('.ant-modal:visible, [role="dialog"]:visible', { timeout: 10000 }).filter(':contains("Excluir processo")'),
    botaoCancelar: () =>
      cy.get('.ant-modal:visible, [role="dialog"]:visible').filter(':contains("Excluir processo")').contains('button', 'Cancelar'),
    botaoExcluir: () =>
      cy.get('.ant-modal:visible, [role="dialog"]:visible').filter(':contains("Excluir processo")').contains('button', 'Excluir')
  }
}

const extrairTotalRegistros = (texto) => {
  const match = texto.match(/de\s+(\d+)\s+registro/i)
  return match ? parseInt(match[1], 10) : null
}

let totalRegistrosAntes = null

// =====================================================
// HELPER — LOCALIZAR LINHA PELO PROCESSO EM LISTA PAGINADA
// =====================================================
// A lista de convocações não tem filtro de busca por nome de processo, e a
// massa de dados de QA acumula centenas de registros (confirmado em
// execução real: 267, 10 por página) — inclusive muitos "Processo de Teste
// Automacao" gerados por execuções anteriores de outras features, que podem
// cair em qualquer página. Antes de procurar, tenta aumentar o tamanho de
// página para o maior disponível (reduz o número de páginas a percorrer);
// depois avança página a página até achar o texto ou esgotar a paginação.

// Otimização best-effort: se o size changer não existir ou o dropdown não
// abrir por qualquer motivo, segue sem aumentar o tamanho de página — a
// busca por paginação em `linhaPorProcesso` continua funcionando (só mais
// devagar), então essa função nunca deve quebrar o cenário.
const aumentarTamanhoDePagina = () => {
  cy.get('body').then(($body) => {
    const $changer = $body.find('.ant-pagination-options-size-changer')
    if ($changer.length === 0) return
    // Clicar no wrapper .ant-select diretamente não abre o dropdown —
    // confirmado em execução real. Igual a todo outro select do projeto, é
    // preciso clicar no .ant-select-selector interno (ou no input dele).
    cy.wrap($changer).find('.ant-select-selector').click({ force: true })
    cy.wait(400)
    cy.get('body').then(($body2) => {
      const $dropdown = $body2.find('.ant-select-dropdown:visible')
      if ($dropdown.length === 0) return
      cy.wrap($dropdown.last()).find('.ant-select-item-option').last().click({ force: true })
      cy.wait(800)
    })
  })
}

const linhaPorProcesso = (nomeProcesso, paginasRestantes = 30) => {
  return cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }).then(($linhas) => {
    const $encontrada = $linhas.filter((_, el) => Cypress.$(el).text().includes(nomeProcesso))
    if ($encontrada.length > 0) {
      return cy.wrap($encontrada.first())
    }
    if (paginasRestantes <= 0) {
      throw new Error(`Processo "${nomeProcesso}" não encontrado em nenhuma página da lista de convocações`)
    }
    return cy.get('body').then(($body) => {
      const $proximaPagina = $body.find('.ant-pagination-next:not(.ant-pagination-disabled)')
      if ($proximaPagina.length === 0) {
        throw new Error(`Processo "${nomeProcesso}" não encontrado — paginação esgotada`)
      }
      cy.wrap($proximaPagina).click({ force: true })
      cy.wait(600)
      return linhaPorProcesso(nomeProcesso, paginasRestantes - 1)
    })
  })
}

// =====================================================
// STEPS — AÇÕES DA COLUNA GERENCIAR
// =====================================================

When('clico em {string} na convocação {string}', (acao, nomeProcesso) => {
  const indicePorAcao = { Editar: 0, Visualizar: 1, Excluir: 2 }
  const indice = indicePorAcao[acao]
  aumentarTamanhoDePagina()
  linhaPorProcesso(nomeProcesso)
    .find('button')
    .eq(indice)
    .click({ force: true })
  cy.wait(1000)
})

// =====================================================
// STEPS — EDITAR (REABRE O WIZARD DE NOVA CONVOCAÇÃO)
// =====================================================

// O cabeçalho do wizard é um componente Steps do Ant Design (círculo
// numerado/check + título), não botões — confirmado ao vivo (print de
// tela): "Dados do processo" com ✓ (concluída) e "Seleção e configuração
// dos cargos" destacada em azul com o número 2 (ativa). Usa as classes
// padrão do componente (`ant-steps-item-finish`/`ant-steps-item-process`).
Then('a etapa {string} aparece concluída no formulário de edição', (etapa) => {
  cy.contains('.ant-steps-item', etapa, { timeout: 10000 }).should('have.class', 'ant-steps-item-finish')
})

Then('a etapa {string} está ativa no formulário de edição', (etapa) => {
  cy.contains('.ant-steps-item', etapa, { timeout: 10000 }).should('have.class', 'ant-steps-item-process')
})

Then('o resumo somente leitura dos dados do processo é exibido:', (dataTable) => {
  const campos = dataTable.raw().flat().filter(Boolean)
  campos.forEach((campo) => {
    cy.contains(campo, { timeout: 10000 }).should('be.visible')
  })
})

When('clico em {string} no formulário de edição de convocação', (texto) => {
  if (/Cancelar/i.test(texto)) {
    gerenciarSelectors.formularioEdicao.botaoCancelar().click({ force: true })
  }
  cy.wait(1500)
})

// =====================================================
// STEPS — EXCLUIR (DIÁLOGO DE CONFIRMAÇÃO)
// =====================================================

Given('que anoto a quantidade total de convocações exibida na lista', () => {
  gerenciarSelectors.botaoTotalRegistros().invoke('text').then((texto) => {
    totalRegistrosAntes = extrairTotalRegistros(texto)
    expect(totalRegistrosAntes, 'Deve conseguir ler a quantidade total de registros').to.not.be.null
  })
})

Then('o diálogo {string} é exibido', (titulo) => {
  cy.get('.ant-modal:visible, [role="dialog"]:visible', { timeout: 10000 }).should('contain.text', titulo)
})

Then('o diálogo de exclusão exibe o aviso {string}', (aviso) => {
  gerenciarSelectors.dialogoExcluir.container().should('contain.text', aviso)
})

When('confirmo a exclusão da convocação', () => {
  gerenciarSelectors.dialogoExcluir.botaoExcluir().click({ force: true })
  cy.wait(1500)
})

When('cancelo a exclusão da convocação', () => {
  gerenciarSelectors.dialogoExcluir.botaoCancelar().click({ force: true })
  cy.wait(800)
})

Then('o diálogo de exclusão é fechado', () => {
  cy.contains('.ant-modal:visible, [role="dialog"]:visible', 'Excluir processo').should('not.exist')
})

Then('a quantidade total de convocações na lista diminui em 1', () => {
  gerenciarSelectors.botaoTotalRegistros().invoke('text').then((texto) => {
    const totalDepois = extrairTotalRegistros(texto)
    expect(totalDepois).to.equal(totalRegistrosAntes - 1)
  })
})

Then('a quantidade total de convocações na lista permanece a mesma', () => {
  gerenciarSelectors.botaoTotalRegistros().invoke('text').then((texto) => {
    const totalDepois = extrairTotalRegistros(texto)
    expect(totalDepois).to.equal(totalRegistrosAntes)
  })
})
