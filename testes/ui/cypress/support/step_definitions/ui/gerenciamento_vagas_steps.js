/// <reference types="cypress" />

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const selecionarProcesso = () =>
  cy.contains('label, span', /^Processo$/i, { timeout: 10000 })
    .closest('.ant-form-item, .ant-row')
    .find('.ant-select-selector')

// O campo Cargo só aparece para processos que têm cargos/vagas configurados
// — confirmado em execução real: processos sorteados aleatoriamente entre
// TODAS as opções do select muitas vezes não têm cargo nenhum, e nesse caso
// a tabela "Vagas por unidade escolar" também nunca é exibida (não é um
// estado alternativo válido, é ausência de dados). Os processos abaixo
// foram confirmados ao vivo (print de tela) como tendo cargo disponível e
// tabela de vagas populada — o sorteio é feito só dentro desse conjunto
// curado, em vez de entre todas as opções do select.
//
// Confirmado em execução real: diferente do Concurso da tela de Extração de
// Dados, este select de Processo NÃO filtra a lista ao digitar (a busca
// digitada zera o dropdown, mesmo digitando só o trecho identificador sem
// acentuação) — mesma limitação já documentada para os selects de Ano,
// Cargo e DRE em outras telas do menu "Gerenciar"/"Processos". Como a lista
// tem centenas de itens e é virtualizada (só renderiza uma janela por vez),
// achar uma opção específica exige rolar o dropdown internamente até o
// texto aparecer no DOM — ver `selecionarOpcaoRolando`.
const PROCESSOS_COM_CARGO = ['Convocacao 2708.1', 'Convocacao 2508.1', 'Convocacao vhc 2', 'teste elastic']

// Rola o dropdown aberto (lista virtualizada) até a opção com o texto
// procurado aparecer no DOM, então clica nela. O Ant Design usa a lib
// rc-virtual-list, cujo container de rolagem real tem a classe
// `.rc-virtual-list-holder` — confirmado em execução real que o elemento
// `[role="listbox"]` (`#rc_select_0_list`) que aparece como candidato óbvio
// é só um wrapper de acessibilidade com 0x0px, não o scroller de verdade.
// Por isso o fallback genérico exige clientHeight > 0 (visível), evitando
// pegar esse wrapper.
const selecionarOpcaoRolando = (texto, tentativasRestantes = 40) => {
  return cy.get('.ant-select-dropdown:visible', { timeout: 10000 }).last().then(($dropdown) => {
    const $opcao = $dropdown
      .find('.ant-select-item-option-content')
      .filter((_, el) => Cypress.$(el).text().toLowerCase().includes(texto.toLowerCase()))

    if ($opcao.length > 0) {
      return cy.wrap($opcao.first()).scrollIntoView().click({ force: true })
    }

    if (tentativasRestantes <= 0) {
      throw new Error(`Opção "${texto}" não encontrada no dropdown após rolar a lista virtualizada`)
    }

    const $holder = $dropdown.find('.rc-virtual-list-holder')
    const candidatos = $holder.length > 0
      ? $holder.toArray()
      : $dropdown.find('*').toArray().filter((el) => el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 5)
    const containerRolavel = candidatos[0] || $dropdown[0]
    containerRolavel.scrollTop += containerRolavel.clientHeight * 0.8
    cy.wrap(containerRolavel).trigger('scroll')
    cy.wait(150)

    return selecionarOpcaoRolando(texto, tentativasRestantes - 1)
  })
}

const selecionarCargo = () =>
  cy.contains('label, span', /^Cargo$/i, { timeout: 10000 })
    .closest('.ant-form-item, .ant-row')
    .find('.ant-select-selector')

// Tabela "Vagas por unidade escolar" — colunas Vagas definitivas/Vagas
// precárias começam somente leitura (spinbutton disabled) e viram editáveis
// (input de texto vazio ao lado do valor cinza) ao clicar no ícone de editar
// da linha (coluna "Editar", última célula), que troca o ícone único de
// "editar" por dois botões lado a lado — confirmar (✓) e cancelar (✗).
// Confirmado ao vivo (print de tela): são identificados pela posição (1º e
// 2º botão da célula "Editar"), não pela classe do ícone — os ícones reais
// não usam as classes padrão `.anticon-check`/`.anticon-close` do Ant
// Design (não deu match em execução real).
const tabelaVagas = {
  container: () => cy.contains('strong', /Vagas por unidade escolar/i, { timeout: 10000 })
    .closest('div')
    .find('table'),
  linhas: () => cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }),
  primeiraLinha: () => cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }).first(),
  celulaEditarPrimeiraLinha: () =>
    cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }).first().find('.ant-table-cell').last()
}

let valoresVagasAnotados = []

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
  cy.selecionarOpcaoAntd(selecionarProcesso, 'aleatoria')
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

// =====================================================
// STEPS — CAMPO CARGO E TABELA DE VAGAS POR UNIDADE ESCOLAR
// =====================================================

// Usado pelos cenários que dependem da tabela de vagas: sorteia um processo
// dentre o conjunto curado PROCESSOS_COM_CARGO, em vez de entre todas as
// opções do select — processos aleatórios "quaisquer" muitas vezes não têm
// cargo configurado.
When('seleciono um processo com cargo disponível no filtro do gerenciamento de vagas', () => {
  const processoSorteado = PROCESSOS_COM_CARGO[Math.floor(Math.random() * PROCESSOS_COM_CARGO.length)]
  selecionarProcesso()
    .then(($el) => ($el.is('input') ? $el : $el.find('input').first()))
    .click({ force: true })
  cy.wait(500)
  selecionarOpcaoRolando(processoSorteado)
  cy.wait(1200)
})

When('seleciono uma opção aleatória no campo Cargo do gerenciamento de vagas', () => {
  cy.selecionarOpcaoAntd(selecionarCargo, 'aleatoria')
  cy.wait(1000)
})

Then('a tabela de vagas por unidade escolar é exibida', () => {
  tabelaVagas.container().should('be.visible')
  tabelaVagas.linhas().should('have.length.greaterThan', 0)
})

Then('a tabela de vagas por unidade escolar exibe as colunas:', (dataTable) => {
  const colunas = dataTable.raw().flat().filter(Boolean)
  colunas.forEach((coluna) => {
    cy.contains('th', new RegExp(coluna.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), { timeout: 10000 }).should('be.visible')
  })
})

// =====================================================
// STEPS — EDIÇÃO INLINE DE VAGAS DE UMA UNIDADE ESCOLAR
// =====================================================

When('clico no ícone de editar da primeira linha da tabela de vagas', () => {
  tabelaVagas.celulaEditarPrimeiraLinha().find('button').last().click({ force: true })
  cy.wait(500)
})

Then('os campos de vagas da primeira linha ficam editáveis', () => {
  // Confirmado ao vivo: o spinbutton de exibição permanece na linha, mas um
  // novo input editável (sem o atributo disabled) é adicionado nas células
  // de Vagas definitivas/Vagas precárias (4ª e 5ª .ant-table-cell) ao entrar
  // em modo de edição. Escopado a essas duas células — não à linha inteira
  // — para não confundir com o checkbox de seleção da linha (também um
  // input não desabilitado, mas sempre presente).
  tabelaVagas.primeiraLinha().find('.ant-table-cell').then(($celulas) => {
    const $inputsEditaveis = $celulas.slice(4, 6).find('input:not([disabled])')
    expect($inputsEditaveis.length, 'Deve haver input editável nas colunas de vagas').to.be.greaterThan(0)
  })
})

Then('a primeira linha exibe os botões de confirmar e cancelar edição', () => {
  // Os ícones reais de confirmar/cancelar não usam as classes padrão
  // `.anticon-check`/`.anticon-close` do Ant Design (confirmado em execução
  // real) — identificados pela posição: a célula "Editar" passa a ter 2
  // botões lado a lado (confirmar, cancelar) em vez do único ícone de lápis.
  tabelaVagas.celulaEditarPrimeiraLinha().find('button').should('have.length', 2)
})

Given('que anoto os valores de vagas da primeira linha da tabela', () => {
  tabelaVagas.primeiraLinha().find('.ant-table-cell').then(($celulas) => {
    // Colunas "Vagas definitivas" e "Vagas precárias" são a 5ª e a 6ª célula
    // da linha (após checkbox, Código EOL, DRE e Unidade Escolar).
    valoresVagasAnotados = [$celulas.eq(4).text().trim(), $celulas.eq(5).text().trim()]
  })
})

When('clico no botão de cancelar edição da primeira linha', () => {
  // 2º botão da célula "Editar" = cancelar (✗), confirmado ao vivo — o 1º é
  // confirmar (✓).
  tabelaVagas.celulaEditarPrimeiraLinha().find('button').last().click({ force: true })
  cy.wait(500)
})

Then('os campos de vagas da primeira linha voltam a ficar somente leitura', () => {
  tabelaVagas.primeiraLinha().find('.ant-table-cell').then(($celulas) => {
    const $inputsEditaveis = $celulas.slice(4, 6).find('input:not([disabled])')
    expect($inputsEditaveis.length, 'Não deve haver input editável nas colunas de vagas').to.equal(0)
  })
})

Then('os valores de vagas da primeira linha permanecem os mesmos anotados', () => {
  tabelaVagas.primeiraLinha().find('.ant-table-cell').then(($celulas) => {
    const valoresAtuais = [$celulas.eq(4).text().trim(), $celulas.eq(5).text().trim()]
    expect(valoresAtuais).to.deep.equal(valoresVagasAnotados)
  })
})
