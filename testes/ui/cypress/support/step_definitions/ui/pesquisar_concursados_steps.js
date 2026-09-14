/// <reference types="cypress" />

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

// =====================================================
// HELPER — REGEX TOLERANTE A ACENTUAÇÃO
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
// SELECTORES — PESQUISAR CONCURSADOS
// =====================================================
// Tela real: menu "Processos" > "Pesquisar Concursados"
// (mapeada ao vivo em cypress/e2e/ui/pesquisar_concursados.feature). Os
// mesmos placeholders de campo da tela de Eliminação e Reclassificação
// (adm_candidato_steps.js) são usados aqui — "Digite o nome/RF/RG/CPF".
// Diferente daquela tela, aqui não há filtro de Concurso/Cargo: o botão
// "Filtrar" só habilita depois que ao menos um campo é preenchido.

const concursadoSelectors = {
  filtros: {
    nome: () => cy.get('input[placeholder="Digite o nome"]', { timeout: 10000 }),
    rf: () => cy.get('input[placeholder="Digite o RF"]', { timeout: 10000 }),
    rg: () => cy.get('input[placeholder="Digite o RG"]', { timeout: 10000 }),
    cpf: () => cy.get('input[placeholder="Digite o CPF"]', { timeout: 10000 })
  },

  botaoLimpar: () => cy.contains('button', 'Limpar', { timeout: 5000 }),
  botaoFiltrar: () => cy.contains('button', 'Filtrar', { timeout: 5000 }),

  tabela: {
    container: () => cy.get('table', { timeout: 10000 }),
    // O Ant Design Table sempre renderiza uma <tr class="ant-table-measure-row">
    // oculta como primeira linha do tbody — precisa ser excluída para não
    // contar como registro ou linha de dados.
    linhas: () => cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }),
    primeiraLinha: () => cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }).first(),
    // Colunas "Alterar" (ícone de lápis) e "Histórico" (ícone de lista) são,
    // respectivamente, o 1º e o 2º botão da linha — confirmado ao vivo.
    botaoAlterarPrimeiraLinha: () =>
      cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }).first().find('button').eq(0),
    botaoHistoricoPrimeiraLinha: () =>
      cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }).first().find('button').eq(1)
  },

  // Modal "Alterar candidato" — Candidato/Concurso/Cargo somente leitura,
  // Telefone e E-mail editáveis. Confirmado ao vivo.
  modalAlterar: {
    container: () => cy.get('.ant-modal:visible', { timeout: 10000 }).filter(':contains("Alterar candidato")'),
    telefone: () => cy.get('.ant-modal:visible input[placeholder="(XX) X XXXX-XXXX"]', { timeout: 10000 }),
    email: () => cy.get('.ant-modal:visible input[placeholder="E-mail"], .ant-modal:visible input[type="email"]', { timeout: 10000 }),
    botaoCancelar: () => cy.get('.ant-modal:visible').contains('button', 'Cancelar'),
    botaoSalvar: () => cy.get('.ant-modal:visible').contains('button', 'Salvar')
  },

  // Modal "Histórico de alterações" — duas subseções: reclassificação/
  // eliminação e escolhas. Confirmado ao vivo.
  modalHistorico: {
    container: () => cy.get('.ant-modal:visible', { timeout: 10000 }).filter(':contains("Histórico de alterações")'),
    botaoFechar: () => cy.get('.ant-modal:visible').contains('button', 'Fechar')
  }
}

// Guarda o último filtro preenchido para validar que a tabela retornada
// reflete de fato a busca realizada no cenário.
let ultimoFiltroPreenchido = ''

// =====================================================
// STEPS — CONTEXTO (FILTROS E BOTÕES)
// =====================================================

Then('o sistema exibe os filtros de pesquisa de concursados:', (dataTable) => {
  const filtros = dataTable.raw().flat().filter(Boolean)
  filtros.forEach((filtro) => {
    cy.contains(criarRegex(filtro), { timeout: 10000 }).should('be.visible')
  })
})

Then('exibe os botões {string} e {string} da pesquisa de concursados', (botao1, botao2) => {
  cy.contains('button', botao1, { timeout: 5000 }).should('be.visible')
  cy.contains('button', botao2, { timeout: 5000 }).should('be.visible')
})

// =====================================================
// STEPS — PREENCHIMENTO DE FILTROS
// =====================================================

When('preencho o CPF {string} na pesquisa de concursados', (cpf) => {
  ultimoFiltroPreenchido = cpf
  concursadoSelectors.filtros.cpf().clear({ force: true }).type(cpf, { force: true })
})

When('preencho o RF {string} na pesquisa de concursados', (rf) => {
  ultimoFiltroPreenchido = rf
  concursadoSelectors.filtros.rf().clear({ force: true }).type(rf, { force: true })
})

When('clico em {string} na pesquisa de concursados', (texto) => {
  if (/Filtrar/i.test(texto)) {
    concursadoSelectors.botaoFiltrar().should('not.be.disabled').click({ force: true })
  } else if (/Limpar/i.test(texto)) {
    concursadoSelectors.botaoLimpar().click({ force: true })
  }
  cy.wait(1000)
})

// =====================================================
// STEPS — RESULTADO DA CONSULTA
// =====================================================

Then('o sistema exibe o concursado correspondente na pesquisa de concursados', () => {
  concursadoSelectors.tabela.linhas().should('have.length.greaterThan', 0)
  if (ultimoFiltroPreenchido) {
    concursadoSelectors.tabela.primeiraLinha().should('contain.text', ultimoFiltroPreenchido)
  }
})

Then('a tabela de concursados exibe as colunas:', (dataTable) => {
  const colunas = dataTable.raw().flat().filter(Boolean)
  colunas.forEach((coluna) => {
    cy.contains('th', criarRegex(coluna), { timeout: 10000 }).should('be.visible')
  })
})

Then('o sistema exibe a mensagem {string} na pesquisa de concursados', (mensagem) => {
  cy.contains(criarRegex(mensagem), { timeout: 10000 }).should('be.visible')
})

// =====================================================
// STEPS — LIMPAR FILTROS
// =====================================================

Given('que preenchi os filtros da pesquisa de concursados', () => {
  concursadoSelectors.filtros.cpf().clear({ force: true }).type('96728566287', { force: true })
})

Then('os filtros da pesquisa de concursados retornam para o estado inicial', () => {
  concursadoSelectors.filtros.cpf().should('have.value', '')
  concursadoSelectors.filtros.nome().should('have.value', '')
  concursadoSelectors.filtros.rf().should('have.value', '')
  concursadoSelectors.filtros.rg().should('have.value', '')
})

// =====================================================
// STEPS — CONSULTA VÁLIDA (MASSA DE DADOS CONHECIDA)
// =====================================================
// CPF 96728566287 é uma massa de dados confirmada ao vivo com múltiplos
// registros — usada para garantir que os cenários de modal tenham dado real.

When('realizo uma consulta válida na pesquisa de concursados', () => {
  concursadoSelectors.filtros.cpf().clear({ force: true }).type('96728566287', { force: true })
  concursadoSelectors.botaoFiltrar().should('not.be.disabled').click({ force: true })
  cy.wait(1000)
})

// =====================================================
// STEPS — MODAL "ALTERAR CANDIDATO"
// =====================================================

When('clico no ícone de alterar do primeiro concursado', () => {
  concursadoSelectors.tabela.botaoAlterarPrimeiraLinha().click({ force: true })
  cy.wait(800)
})

Then('o modal {string} é exibido', (tituloModal) => {
  cy.get('.ant-modal:visible', { timeout: 10000 }).should('contain.text', tituloModal)
})

Then('o modal de alterar candidato exibe os campos:', (dataTable) => {
  const campos = dataTable.raw().flat().filter(Boolean)
  campos.forEach((campo) => {
    concursadoSelectors.modalAlterar.container().should('contain.text', campo)
  })
})

When('altero o telefone para {string} no modal de alterar candidato', (telefone) => {
  concursadoSelectors.modalAlterar.telefone().clear({ force: true }).type(telefone, { force: true })
})

When('clico em {string} no modal de alterar candidato', (texto) => {
  if (/Salvar/i.test(texto)) {
    concursadoSelectors.modalAlterar.botaoSalvar().click({ force: true })
  } else if (/Cancelar/i.test(texto)) {
    concursadoSelectors.modalAlterar.botaoCancelar().click({ force: true })
  }
  cy.wait(800)
})

Then('o modal de alterar candidato é fechado', () => {
  cy.contains('.ant-modal:visible', 'Alterar candidato').should('not.exist')
})

// =====================================================
// STEPS — MODAL "HISTÓRICO DE ALTERAÇÕES"
// =====================================================

When('clico no ícone de histórico do primeiro concursado', () => {
  concursadoSelectors.tabela.botaoHistoricoPrimeiraLinha().click({ force: true })
  cy.wait(800)
})

Then('o modal de histórico exibe a seção {string}', (secao) => {
  concursadoSelectors.modalHistorico.container().should('contain.text', secao)
})

When('clico em {string} no modal de histórico de alterações', (texto) => {
  if (/Fechar/i.test(texto)) {
    concursadoSelectors.modalHistorico.botaoFechar().click({ force: true })
  }
  cy.wait(800)
})

Then('o modal de histórico de alterações é fechado', () => {
  cy.contains('.ant-modal:visible', 'Histórico de alterações').should('not.exist')
})
