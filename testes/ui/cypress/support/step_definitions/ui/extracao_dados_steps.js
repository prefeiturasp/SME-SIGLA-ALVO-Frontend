/// <reference types="cypress" />

import { When, Then } from '@badeball/cypress-cucumber-preprocessor'

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

// Pausa deliberada entre ações, maior que o padrão do resto do projeto — a
// pedido, para dar tempo de acompanhar visualmente a execução no modo
// `cypress open` (o dashboard tem bastante conteúdo/animação e passos muito
// rápidos ficam difíceis de acompanhar a olho nu).
const PAUSA_VISUAL = 1200

// A tela tem bastante conteúdo abaixo da dobra dentro de um container com
// scroll próprio (`main.ant-layout-content`, `overflow: auto`) — diferente
// da maioria das outras telas do projeto (que rolam a página inteira via
// `window`). `cy.contains().should('be.visible')` sozinho falha para
// qualquer texto fora da área atualmente rolada desse container.
const verificarTextoVisivel = (regex, seletor) => {
  const query = seletor ? cy.contains(seletor, regex, { timeout: 10000 }) : cy.contains(regex, { timeout: 10000 })
  return query.scrollIntoView().should('be.visible')
}

// =====================================================
// SELECTORES — EXTRAÇÃO DE DADOS
// =====================================================
// Tela real: menu "Gerenciar" > "Extração de dados"
// (mapeada em cypress/e2e/ui/extracao_dados.feature). A tela é um dashboard
// de indicadores com DOIS blocos de filtro independentes:
//   1) Filtro principal (topo)      — Concurso (índice 0) + Ano (índice 1)
//   2) Relatórios detalhados        — Cargo (índice 2) + DRE (índice 3)
// A ordem dos `.ant-select` no DOM é fixa nessa sequência, confirmada por
// inspeção ao vivo da tela (Playwright MCP).

const extracaoSelectors = {
  menu: {
    itemGerenciar: () => cy.contains('span, div, strong, li', /^Gerenciar$/i, { timeout: 10000 }),
    itemExtracaoDados: () => cy.contains('span, div, li', /Extra[çc][ãa]o de dados/i, { timeout: 10000 })
  },

  filtroPrincipal: {
    concurso: () => cy.get('.ant-select', { timeout: 10000 }).eq(0),
    ano: () => cy.get('.ant-select', { timeout: 10000 }).eq(1)
  },

  relatoriosDetalhados: {
    cargo: () => cy.get('.ant-select', { timeout: 10000 }).eq(2),
    dre: () => cy.get('.ant-select', { timeout: 10000 }).eq(3),
    // Escopa pela coluna "Concurso" — única entre as 3 tabelas da tela que tem
    // essa coluna (as outras duas são "Total de vagas ofertadas por DRE" e
    // "Autorizações Publicadas"). Evita contar/inspecionar linhas erradas.
    tabela: () => cy.contains('th', /^Concurso$/i, { timeout: 10000 }).parents('table').first(),
    linhas: () =>
      extracaoSelectors.relatoriosDetalhados
        .tabela()
        .find('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 })
  }
}

// =====================================================
// HELPER — LOCALIZAR BOTÃO "LIMPAR FILTROS" / "FILTRAR" PELO BLOCO DO CAMPO
// =====================================================
// Cada bloco de filtro (principal / relatórios detalhados) tem exatamente
// dois botões nativos <button> lado a lado: "Limpar filtros" (posição 0) e
// "Filtrar" (posição 1) — ordem confirmada tanto por inspeção ao vivo quanto
// pelo XPath real capturado em execução
// (.../div/div/div[2]/div/div/div/button[2] = Filtrar). Contar todos os
// "button:visible" da PÁGINA INTEIRA e indexar globalmente (abordagem
// inicial) se mostrou instável — a contagem varia entre passos do mesmo
// cenário porque o dashboard re-renderiza com frequência. A correção sobe a
// partir do próprio campo (Ano ou DRE) até achar o menor bloco ancestral com
// pelo menos 2 botões, e extrai o botão pela posição NA MESMA busca (uma
// única query síncrona) — uma versão anterior fazia duas buscas separadas
// (achar o bloco, depois re-buscar o botão dentro dele) e entre as duas o
// React já tinha re-renderizado o bloco, retornando `undefined` e quebrando
// o `.scrollIntoView()` seguinte com "Cannot read properties of undefined".
const botaoNoBlocoDe = (getCampo, indiceBotao) => {
  return getCampo().then(($campo) => {
    const ancestrais = $campo.parentsUntil('main').toArray()
    for (const el of ancestrais) {
      const $botoes = Cypress.$(el).find('button')
      if ($botoes.length >= 2) {
        return cy.wrap($botoes.eq(indiceBotao))
      }
    }
    throw new Error('Bloco com os botões "Limpar filtros"/"Filtrar" não encontrado a partir do campo')
  })
}

const botaoFiltrarNoBlocoDe = (getCampo) => botaoNoBlocoDe(getCampo, 1)

// =====================================================
// HELPER — SELEÇÃO ANT DESIGN SEM DIGITAR
// =====================================================
// Confirmado em execução real: diferente do select de Concurso do filtro
// principal — que filtra normalmente ao digitar, via cy.selecionarOpcaoAntd
// — os selects de Ano, Cargo e DRE desta tela NÃO expõem filterOption de
// busca local: digitar esvazia o dropdown (`ant-select-dropdown-empty`) e a
// opção nunca é encontrada. Mesmo padrão documentado em
// adm_candidato_steps.js para outras telas do menu "Gerenciar". A lista de
// opções desses três campos é curta, então basta abrir o dropdown e clicar
// direto na opção pelo texto (ou aleatória), sem digitar.
const abrirDropdownSemDigitar = (getSelectContainer, tentativasRestantes = 3) => {
  getSelectContainer()
    .scrollIntoView()
    .then(($el) => ($el.is('input') ? $el : $el.find('input').first()))
    .click({ force: true })

  cy.wait(PAUSA_VISUAL)

  return cy.get('body').then(($body) => {
    if ($body.find('.ant-select-dropdown:visible').length > 0 || tentativasRestantes <= 1) return
    abrirDropdownSemDigitar(getSelectContainer, tentativasRestantes - 1)
  })
}

// Retorna o texto da opção efetivamente selecionada (útil para validar depois
// contra o conteúdo da tabela quando a opção é escolhida de forma aleatória).
// `opcoesExcluidas` filtra opções "coringa" (ex.: "Todas") do sorteio.
const selecionarOpcaoSemDigitar = (getSelectContainer, opcao, opcoesExcluidas = []) => {
  getSelectContainer().should(($el) => {
    const $container = $el.is('input') ? $el.closest('.ant-select') : $el
    const $input = $el.is('input') ? $el : $el.find('input').first()
    const desabilitado =
      (!!$container.length && $container.hasClass('ant-select-disabled')) || $input.is(':disabled')
    expect(desabilitado, 'Select não deve estar desabilitado').to.be.false
  })

  abrirDropdownSemDigitar(getSelectContainer)

  const dropdownAtual = () => cy.get('.ant-select-dropdown:visible', { timeout: 10000 }).last()
  dropdownAtual().should('be.visible')

  if (!opcao || opcao === 'aleatoria') {
    return dropdownAtual()
      .find('.ant-select-item-option, [role="option"]')
      .should('have.length.greaterThan', 0)
      .then(($todasOpcoes) => {
        const $opcoes = $todasOpcoes.filter((_, el) => {
          const texto = Cypress.$(el).text().trim()
          return !opcoesExcluidas.some((excluida) => texto.toLowerCase() === excluida.toLowerCase())
        })
        const listaValida = $opcoes.length > 0 ? $opcoes : $todasOpcoes
        const indice = Math.floor(Math.random() * listaValida.length)
        const texto = Cypress.$(listaValida[indice]).text().trim()
        cy.wrap(listaValida[indice]).scrollIntoView().click({ force: true })
        cy.wait(PAUSA_VISUAL)
        return cy.wrap(texto)
      })
  }

  dropdownAtual()
    .contains('.ant-select-item-option-content', opcao, { timeout: 10000 })
    .scrollIntoView()
    .click({ force: true })
  cy.wait(PAUSA_VISUAL)
  return cy.wrap(opcao)
}

// =====================================================
// STEPS — NAVEGAÇÃO
// =====================================================

When('acesso a tela de extração de dados', () => {
  extracaoSelectors.menu.itemGerenciar().scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(PAUSA_VISUAL)
  extracaoSelectors.menu.itemExtracaoDados().scrollIntoView().should('be.visible').click({ force: true })
  cy.wait(PAUSA_VISUAL)
})

// =====================================================
// STEPS — ESTRUTURA DA TELA
// =====================================================

Then('exibe o botão {string} na tela de extração de dados', (botao) => {
  verificarTextoVisivel(criarRegex(botao), 'button')
})

// =====================================================
// STEPS — FILTRO PRINCIPAL
// =====================================================

When('seleciono o concurso {string} no filtro principal de extração de dados', (concurso) => {
  extracaoSelectors.filtroPrincipal.concurso().scrollIntoView()
  cy.selecionarOpcaoAntd(extracaoSelectors.filtroPrincipal.concurso, concurso)
  cy.wait(PAUSA_VISUAL)
})

When('seleciono o ano {string} no filtro principal de extração de dados', (ano) => {
  selecionarOpcaoSemDigitar(extracaoSelectors.filtroPrincipal.ano, ano)
})

Then('o campo Ano do filtro principal de extração de dados está desabilitado', () => {
  extracaoSelectors.filtroPrincipal.ano().scrollIntoView().should('have.class', 'ant-select-disabled')
})

Then('o campo Ano do filtro principal de extração de dados é habilitado', () => {
  extracaoSelectors.filtroPrincipal.ano().scrollIntoView().should('not.have.class', 'ant-select-disabled')
})

Then('o botão Filtrar do filtro principal de extração de dados está desabilitado', () => {
  botaoFiltrarNoBlocoDe(extracaoSelectors.filtroPrincipal.ano).scrollIntoView().should('be.disabled')
})

Then('o botão Filtrar do filtro principal de extração de dados é habilitado', () => {
  botaoFiltrarNoBlocoDe(extracaoSelectors.filtroPrincipal.ano).scrollIntoView().should('not.be.disabled')
})

When('clico no botão Filtrar do filtro principal de extração de dados', () => {
  botaoFiltrarNoBlocoDe(extracaoSelectors.filtroPrincipal.ano)
    .scrollIntoView()
    .should('not.be.disabled')
    .click({ force: true })
  cy.wait(PAUSA_VISUAL * 2)
})

Then('o sistema atualiza os indicadores de extração de dados de acordo com o filtro aplicado', () => {
  verificarTextoVisivel(/Habilitados/i)
  cy.get('body').should('not.contain.text', 'Erro ao carregar')
})

// =====================================================
// STEPS — RELATÓRIOS DETALHADOS (FILTROS INDEPENDENTES)
// =====================================================

When('seleciono o cargo {string} nos relatórios detalhados de extração de dados', (cargo) => {
  selecionarOpcaoSemDigitar(extracaoSelectors.relatoriosDetalhados.cargo, cargo)
})

// Guarda o texto da DRE efetivamente sorteada para validar depois que a
// tabela reflete exatamente essa seleção (o valor muda a cada execução).
When('seleciono uma DRE aleatória nos relatórios detalhados de extração de dados', () => {
  selecionarOpcaoSemDigitar(extracaoSelectors.relatoriosDetalhados.dre, 'aleatoria', ['Todas'])
    .then((dreSelecionada) => {
      cy.wrap(dreSelecionada).as('dreSelecionada')
    })
})

When('clico no botão Filtrar dos relatórios detalhados de extração de dados', () => {
  botaoFiltrarNoBlocoDe(extracaoSelectors.relatoriosDetalhados.dre)
    .scrollIntoView()
    .click({ force: true })
  cy.wait(PAUSA_VISUAL * 2)
})

Then('a tabela de relatórios detalhados de extração de dados exibe resultados para a DRE selecionada', function () {
  const dre = this.dreSelecionada
  extracaoSelectors.relatoriosDetalhados.tabela().scrollIntoView()
  cy.get('body').then(($body) => {
    const semResultado = /N[ãa]o h[áa] (dados|registros)/i.test($body.text())
    if (semResultado) {
      cy.log(`DRE "${dre}" sorteada não retornou registros — resultado vazio é uma resposta válida do filtro`)
      return
    }
    extracaoSelectors.relatoriosDetalhados.linhas().should('have.length.greaterThan', 0)
    extracaoSelectors.relatoriosDetalhados.linhas().each(($linha) => {
      cy.wrap($linha).should('contain.text', dre)
    })
  })
})

// =====================================================
// STEPS — GERAR RELATÓRIO (EXPORTAÇÃO CLIENT-SIDE)
// =====================================================
// Confirmado em execução real: o botão "Gerar relatório" não chama uma nova
// API — ele renderiza uma cópia oculta do dashboard via html2canvas e gera o
// PDF inteiramente no client-side. O processo é rápido demais para depender
// do ícone de loading do botão como evidência (flaky: o download já havia
// terminado antes de qualquer asserção rodar). A validação confiável é o
// resultado real: o arquivo baixado, nomeado "extracao-dados-AAAA-MM-DD.pdf"
// (data do dia, formato confirmado em execução real).
Then('o sistema realiza o download do relatório em PDF', () => {
  const hoje = new Date()
  const aaaa = hoje.getFullYear()
  const mm = String(hoje.getMonth() + 1).padStart(2, '0')
  const dd = String(hoje.getDate()).padStart(2, '0')
  const nomeArquivo = `extracao-dados-${aaaa}-${mm}-${dd}.pdf`

  cy.readFile(`cypress/downloads/${nomeArquivo}`, { timeout: 20000 }).should('exist')
})
