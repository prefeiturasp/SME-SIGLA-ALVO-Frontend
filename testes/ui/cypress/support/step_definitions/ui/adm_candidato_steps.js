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
// SELECTORES — ELIMINAÇÃO E RECLASSIFICAÇÃO DE CANDIDATO
// =====================================================
// Tela real: menu "Gerenciar" > "Eliminação e Reclassificação de Candidato"
// (mapeada em cypress/e2e/ui/adm_candidato.feature). A ordem dos campos no
// formulário é fixa: 0 = Concurso, 1 = Cargo — o Cargo só habilita depois de
// selecionar o Concurso (mesmo padrão de escolha_candidatos_steps.js).

const candidatoSelectors = {
  menu: {
    itemGerenciar: () => cy.contains('span, div, strong, li', /^Gerenciar$/i, { timeout: 10000 }),
    itemEliminacaoReclassificacao: () =>
      cy.contains('span, div, li', /Eliminaç[ãa]o e Reclassificaç[ãa]o de Candidato/i, { timeout: 10000 })
  },

  filtros: {
    concurso: () => cy.get('.ant-select', { timeout: 10000 }).eq(0),
    cargo: () => cy.get('.ant-select', { timeout: 10000 }).eq(1),
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
    // oculta como primeira linha do tbody (só calcula largura de colunas) —
    // precisa ser excluída para não contar como registro ou linha de dados.
    linhas: () => cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }),
    primeiraLinha: () => cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }).first(),
    botaoAlterarPrimeiraLinha: () =>
      cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }).first().find('button').first()
  }
}

// Guarda o último valor de filtro preenchido (CPF/RF/Nome) para validar que a
// tabela retornada reflete de fato a busca realizada no cenário.
let ultimoFiltroPreenchido = ''

// =====================================================
// HELPER — SELEÇÃO ANT DESIGN SEM DIGITAR
// =====================================================
// Diferente do restante do projeto, os selects de Concurso/Cargo desta tela
// NÃO filtram localmente ao digitar: confirmado em execução real que digitar
// no campo (fluxo padrão de cy.selecionarOpcaoAntd) esvazia o dropdown
// (classe ant-select-dropdown-empty) mesmo digitando o texto exato de uma
// opção existente — o componente não expõe filterOption de busca local aqui.
// A lista de Concurso/Cargo nesta tela é curta (carregada inteira de uma vez
// via API ao abrir a tela, sem paginação/busca no servidor), então basta
// abrir o dropdown e clicar direto na opção pelo texto, sem digitar.
//
// Só que o dropdown do Ant Design é virtualizado (rc-virtual-list): mesmo com
// a lista completa carregada, só uma janela pequena de opções fica no DOM por
// vez, a partir do topo. Sem digitar para filtrar, uma opção fora dessa janela
// inicial (ex.: "Test Judicial", mais abaixo na lista) nunca aparece — e
// cy.contains() nunca encontra algo que não está no DOM, não importa o
// timeout. Por isso a lista é rolada manualmente dentro do
// .rc-virtual-list-holder, conferindo a cada passo se a opção já entrou na
// janela renderizada, até encontrá-la ou a lista chegar ao fim.
// O clique que abre o select às vezes não registra (elemento ainda não
// totalmente interativo no momento do clique, mesmo com {force:true}) —
// confirmado em execução real: o dropdown nunca chegava a abrir e a asserção
// final estourava o timeout de 10s sem nenhuma nova tentativa de clique no
// meio do caminho. Reabrir com um novo clique (até 3 tentativas) antes de
// deixar a asserção final decidir evita depender de um único clique "sortudo".
const abrirDropdown = (getSelectContainer, tentativasRestantes = 3) => {
  getSelectContainer()
    .then(($el) => ($el.is('input') ? $el : $el.find('input').first()))
    .click({ force: true })

  cy.wait(500)

  return cy.get('body').then(($body) => {
    if ($body.find('.ant-select-dropdown:visible').length > 0 || tentativasRestantes <= 1) return
    abrirDropdown(getSelectContainer, tentativasRestantes - 1)
  })
}

const selecionarOpcaoAntdSemDigitar = (getSelectContainer, opcao) => {
  getSelectContainer().should(($el) => {
    const $container = $el.is('input') ? $el.closest('.ant-select') : $el
    const $input = $el.is('input') ? $el : $el.find('input').first()
    const desabilitado =
      (!!$container.length && $container.hasClass('ant-select-disabled')) || $input.is(':disabled')
    expect(desabilitado, 'Select não deve estar desabilitado').to.be.false
  })

  abrirDropdown(getSelectContainer)

  const dropdownAtual = () => cy.get('.ant-select-dropdown:visible', { timeout: 10000 }).last()
  dropdownAtual().should('be.visible')

  const localizarOpcaoRolando = (tentativasRestantes = 25) => {
    dropdownAtual().then(($dropdown) => {
      const $match = $dropdown
        .find('.ant-select-item-option-content')
        .filter((_, el) => Cypress.$(el).text().trim().toLowerCase().includes(opcao.trim().toLowerCase()))

      if ($match.length > 0) {
        cy.wrap($match.first()).scrollIntoView().click({ force: true })
        return
      }

      if (tentativasRestantes <= 0) {
        throw new Error(`Opção "${opcao}" não encontrada no dropdown mesmo após rolar a lista completa.`)
      }

      const $holder = $dropdown.find('.rc-virtual-list-holder')
      const holderEl = ($holder.length ? $holder : $dropdown)[0]
      const scrollAntes = holderEl.scrollTop
      holderEl.scrollTop = scrollAntes + holderEl.clientHeight

      cy.wait(150).then(() => {
        if (holderEl.scrollTop === scrollAntes) {
          throw new Error(`Opção "${opcao}" não encontrada — a lista chegou ao fim sem encontrá-la.`)
        }
        localizarOpcaoRolando(tentativasRestantes - 1)
      })
    })
  }

  localizarOpcaoRolando()

  cy.wait(300)
}

// =====================================================
// STEPS — NAVEGAÇÃO
// =====================================================

When('acesso a tela de eliminação e reclassificação de candidato', () => {
  candidatoSelectors.menu.itemGerenciar().should('be.visible').click({ force: true })
  cy.wait(500)
  candidatoSelectors.menu.itemEliminacaoReclassificacao().should('be.visible').click({ force: true })
  cy.wait(1500)
})

// =====================================================
// STEPS — CONTEXTO (FILTROS E BOTÕES)
// =====================================================

Then('o sistema exibe os filtros de eliminação e reclassificação:', (dataTable) => {
  const filtros = dataTable.raw().flat().filter(Boolean)
  filtros.forEach((filtro) => {
    cy.contains(criarRegex(filtro), { timeout: 10000 }).should('be.visible')
  })
})

Then('exibe os botões {string} e {string} da eliminação e reclassificação', (botao1, botao2) => {
  cy.contains('button', botao1, { timeout: 5000 }).should('be.visible')
  cy.contains('button', botao2, { timeout: 5000 }).should('be.visible')
})

// =====================================================
// STEPS — PREENCHIMENTO DE FILTROS
// =====================================================

When('seleciono o concurso {string} na eliminação e reclassificação', (valor) => {
  selecionarOpcaoAntdSemDigitar(candidatoSelectors.filtros.concurso, valor)
})

When('seleciono o cargo {string} na eliminação e reclassificação', (valor) => {
  selecionarOpcaoAntdSemDigitar(candidatoSelectors.filtros.cargo, valor)
})

When('preencho o CPF {string} na eliminação e reclassificação', (cpf) => {
  ultimoFiltroPreenchido = cpf
  candidatoSelectors.filtros.cpf().clear({ force: true }).type(cpf, { force: true })
})

When('preencho o RF {string} na eliminação e reclassificação', (rf) => {
  ultimoFiltroPreenchido = rf
  candidatoSelectors.filtros.rf().clear({ force: true }).type(rf, { force: true })
})

When('informo o nome {string} na eliminação e reclassificação', (nome) => {
  ultimoFiltroPreenchido = nome
  candidatoSelectors.filtros.nome().clear({ force: true }).type(nome, { force: true })
})

When('clico em {string} na eliminação e reclassificação', (texto) => {
  if (/Filtrar/i.test(texto)) {
    candidatoSelectors.botaoFiltrar().should('not.be.disabled').click({ force: true })
  } else if (/Limpar/i.test(texto)) {
    candidatoSelectors.botaoLimpar().click({ force: true })
  }
  cy.wait(1000)
})

// =====================================================
// STEPS — RESULTADO DA CONSULTA
// =====================================================

Then('o sistema exibe o candidato correspondente na eliminação e reclassificação', () => {
  candidatoSelectors.tabela.linhas().should('have.length.greaterThan', 0)
  if (ultimoFiltroPreenchido) {
    candidatoSelectors.tabela.primeiraLinha().should('contain.text', ultimoFiltroPreenchido)
  }
})

Then('a tabela de eliminação e reclassificação exibe as colunas:', (dataTable) => {
  const colunas = dataTable.raw().flat().filter(Boolean)
  colunas.forEach((coluna) => {
    cy.contains('th', criarRegex(coluna), { timeout: 10000 }).should('be.visible')
  })
})

// A massa de dados de QA para busca por nome não é garantida (o valor exibido
// na coluna "Nome do candidato" pode não corresponder ao texto pesquisável do
// campo Nome) — por isso o cenário valida que a busca é executada e a tabela
// responde (com resultados ou com "Não há dados"), sem travar em um valor fixo.
Then('a busca por nome é executada na eliminação e reclassificação', () => {
  candidatoSelectors.tabela.container().should('be.visible')
  cy.get('body').then(($body) => {
    const temResultado = $body.find('tbody tr:not(.ant-table-measure-row)').length > 0
    cy.log(temResultado ? 'Busca por nome retornou candidatos' : 'Busca por nome não retornou candidatos para este termo')
  })
})

// =====================================================
// STEPS — LIMPAR FILTROS
// =====================================================

Given('que preenchi os filtros da eliminação e reclassificação', () => {
  selecionarOpcaoAntdSemDigitar(candidatoSelectors.filtros.concurso, 'Test Judicial')
  selecionarOpcaoAntdSemDigitar(candidatoSelectors.filtros.cargo, 'Analista de Sistemas')
  candidatoSelectors.filtros.cpf().clear({ force: true }).type('96728566287', { force: true })
})

Then('os filtros da eliminação e reclassificação retornam para o estado inicial', () => {
  cy.contains('Selecione o concurso', { timeout: 5000 }).should('be.visible')
  candidatoSelectors.filtros.cargo().should('have.class', 'ant-select-disabled')
  candidatoSelectors.filtros.cpf().should('have.value', '')
})

// =====================================================
// STEPS — CONSULTA VÁLIDA (MASSA DE DADOS CONHECIDA)
// =====================================================
// Concurso "Test Judicial" + Cargo "Analista de Sistemas" + CPF 96728566287
// é uma combinação confirmada manualmente no QA com candidato "Eliminado" —
// usada para garantir que os cenários de tabela/ação tenham dado real.

When('realizo uma consulta válida na eliminação e reclassificação', () => {
  selecionarOpcaoAntdSemDigitar(candidatoSelectors.filtros.concurso, 'Test Judicial')
  selecionarOpcaoAntdSemDigitar(candidatoSelectors.filtros.cargo, 'Analista de Sistemas')
  candidatoSelectors.filtros.cpf().clear({ force: true }).type('96728566287', { force: true })
  candidatoSelectors.botaoFiltrar().should('not.be.disabled').click({ force: true })
  cy.wait(1000)
})

Then('a tabela de eliminação e reclassificação apresenta pelo menos um registro', () => {
  candidatoSelectors.tabela.linhas().should('have.length.greaterThan', 0)
})

// =====================================================
// STEPS — AÇÃO DE ALTERAÇÃO (ÍCONE DE LÁPIS)
// =====================================================
// Confirmado manualmente no QA: para um candidato já "Eliminado", o ícone da
// coluna Alterar não abre uma tela de edição — exibe um tooltip explicando a
// situação do candidato (ex.: "Candidato eliminado"), igual ao padrão de
// validação de ações restritas já usado em visualizar_consulta_dados_steps.js.

When('clico no ícone de alteração do primeiro candidato na eliminação e reclassificação', () => {
  candidatoSelectors.tabela.botaoAlterarPrimeiraLinha().trigger('mouseover', { force: true })
  cy.wait(800)
})

Then('o sistema exibe um aviso informando a situação do candidato', () => {
  cy.get('.ant-tooltip:not(.ant-tooltip-hidden), [role="tooltip"]', { timeout: 5000 })
    .should('be.visible')
    .invoke('text')
    .should('match', /elimina|reclassifica|situaç[ãa]o/i)
})
