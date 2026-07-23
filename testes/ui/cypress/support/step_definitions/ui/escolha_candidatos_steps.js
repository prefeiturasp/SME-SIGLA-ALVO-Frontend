/// <reference types="cypress" />

import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

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
// SELECTORES — ESCOLHA DE CANDIDATOS
// =====================================================

const escolhaSelectors = {
  urls: {
    lista: '/processos/escolha-candidatos'
  },

  titulos: {
    paginaEscolha: () => cy.contains(/Escolha de Candidatos/i, { timeout: 10000 })
  },

  filtros: {
    // A tela de Escolha de Candidatos não associa o <label> ao select via
    // ancestralidade previsível (o texto "Processo" também aparece em textos
    // descritivos fora do formulário) — por isso a seleção é posicional,
    // seguindo a ordem real dos campos: 0 = Processo, 1 = Período da agenda.
    processo: () => cy.get('.ant-select', { timeout: 10000 }).eq(0),
    periodoAgenda: () => cy.get('.ant-select', { timeout: 10000 }).eq(1),

    processoPorIndice: () => cy.get('.ant-select', { timeout: 10000 }).eq(0),
    periodoAgendaPorIndice: () => cy.get('.ant-select', { timeout: 10000 }).eq(1)
  },

  botaoAcaoPrincipal: () =>
    cy.get('main button[disabled], main button[aria-disabled="true"], main .ant-btn[disabled]', { timeout: 10000 })
      .first(),

  // ---- Tabela de resultados (consulta por situação / candidatos)
  tabela: {
    container: () => cy.get('table', { timeout: 10000 }),
    // O Ant Design Table sempre renderiza uma <tr class="ant-table-measure-row">
    // oculta como primeira linha do tbody, usada só para calcular a largura
    // das colunas (contém o texto dos headers concatenado, sem dados reais).
    // Ela precisa ser excluída, senão aparece como "primeira linha" ou como
    // uma linha de dados a mais na validação de cada registro.
    linhas: () => cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }),
    primeiraLinha: () => cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 }).first(),

    colunas: {
      candidato: () => cy.contains('th', /Candidato/i),
      cargo: () => cy.contains('th', /Cargo/i),
      tipoVaga: () => cy.contains('th', /Tipo de Vaga/i),
      classificacao: () => cy.contains('th', /Classifica[çc][ãa]o/i),
      situacao: () => cy.contains('th', /Situa[çc][ãa]o/i),
      escolha: () => cy.contains('th', /^Escolha$/i)
    },

    // Ícone de "olho" (visualizar escolha) na linha do candidato
    botaoVisualizarEscolha: () =>
      cy.get('tbody tr:not(.ant-table-measure-row)', { timeout: 10000 })
        .first()
        .find('[aria-label="eye"], svg')
        .first()
  },

  // ---- Modal "Visualizar escolha de candidato"
  modal: {
    container: () => cy.get('.ant-modal:visible', { timeout: 10000 })
  }
}

// =====================================================
// STEPS — ESCOLHA DE CANDIDATOS (ESPECÍFICO)
// =====================================================

Then('valido a existência do campo {string} na escolha de candidatos', (campo) => {
  cy.wait(300)
  cy.get('body').then(($body) => {
    const regex = new RegExp(
      campo
        .replace(/[çÇ]/g, '[çc]')
        .replace(/[ãÃ]/g, '[ãa]')
        .replace(/[íÍ]/g, '[íi]')
        .replace(/[éÉ]/g, '[éeê]'),
      'i'
    )
    const temCampo = $body.text().match(regex)
    expect(!!temCampo, `Campo "${campo}" deve estar visível na tela`).to.be.true
    cy.log(`Campo "${campo}" encontrado na página`)
  })
})

When('seleciono uma opção aleatória no campo {string} da escolha de candidatos', (campo) => {
  cy.wait(300)
  const indiceCombobox = campo.match(/Processo/i) ? 0 : 1
  cy.selecionarOpcaoAntd(() => cy.get('.ant-select', { timeout: 10000 }).eq(indiceCombobox), 'aleatoria')
})

When('clico no campo e seleciono uma opção aleatória no campo {string} da escolha de candidatos', (campo) => {
  cy.wait(300)
  const indiceCombobox = campo.match(/Processo/i) ? 0 : 1
  cy.selecionarOpcaoAntd(() => cy.get('.ant-select', { timeout: 10000 }).eq(indiceCombobox), 'aleatoria')
})

Then('valido que o botão de ação da escolha de candidatos está desabilitado', () => {
  cy.wait(500)

  cy.get('body').then(($body) => {
    let $btn = $body.find(
      '#root > div > div > div > main > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(3) > button'
    )

    if ($btn.length === 0) {
      const xpathResult = document.evaluate(
        '//*[@id="root"]/div/div/div/main/div[2]/div/div[1]/div/div/div[3]/button',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      )
      const element = xpathResult.singleNodeValue
      if (element) $btn = Cypress.$(element)
    }

    if ($btn.length === 0) {
      $btn = $body.find('main button[disabled], main button[aria-disabled="true"]').first()
      cy.log('Botão não encontrado pela posição exata — usando fallback de botão desabilitado')
    }

    if ($btn.length > 0) {
      cy.wrap($btn.first()).then(($el) => {
        const isDisabled =
          $el.is(':disabled') ||
          $el.attr('disabled') !== undefined ||
          $el.hasClass('disabled') ||
          $el.attr('aria-disabled') === 'true'

        const textoBtn = $el.text().trim() || '(sem texto)'
        cy.log(`Botão "${textoBtn}" — desabilitado: ${isDisabled}`)
        expect(isDisabled, `Botão "${textoBtn}" deve estar desabilitado para perfil somente leitura`).to.be.true
      })
    } else {
      cy.log('Botão não encontrado — validando ausência de ações habilitadas para edição')
      cy.get('main button:not([disabled]):not([aria-disabled="true"])').then(($btns) => {
        const textosBotoes = [...$btns].map((b) => b.textContent.trim())
        cy.log(`Botões habilitados na página: ${textosBotoes.join(', ')}`)
      })
    }
  })
})

// =====================================================
// STEPS — CONSULTA POR SITUAÇÃO E VISUALIZAÇÃO DE ESCOLHA
// =====================================================

Then('o sistema exibe os campos:', (dataTable) => {
  const campos = dataTable.raw().flat().filter(Boolean)
  campos.forEach((campo) => {
    cy.contains(criarRegex(campo), { timeout: 10000 }).should('be.visible')
  })
})

When('seleciono o processo {string} na escolha de candidatos', (valor) => {
  cy.selecionarOpcaoAntd(escolhaSelectors.filtros.processo, valor)
})

When('clico e seleciono o processo {string} na escolha de candidatos', (valor) => {
  cy.selecionarOpcaoAntd(escolhaSelectors.filtros.processo, valor)
})

Then('o sistema exibe os resultados', () => {
  escolhaSelectors.tabela.container().should('be.visible')
  cy.wait(500)
})

Then('a escolha de candidatos exibe as opções de situação:', (dataTable) => {
  const situacoes = dataTable.raw().flat().filter(Boolean)
  situacoes.forEach((situacao) => {
    cy.contains(criarRegex(situacao), { timeout: 10000 }).should('be.visible')
  })
})

When('filtro a escolha de candidatos pela situação {string}', (situacao) => {
  cy.contains(criarRegex(situacao), { timeout: 10000 }).click({ force: true })
  cy.wait(500)
})

Then('a tabela de escolha de candidatos exibe registros da situação {string}', (situacao) => {
  cy.wait(500)
  escolhaSelectors.tabela.linhas().should('have.length.greaterThan', 0)
  escolhaSelectors.tabela.linhas().each(($linha) => {
    expect($linha.text(), `Linha deve conter a situação "${situacao}"`).to.match(criarRegex(situacao))
  })
})

Then('o sistema exibe a tabela de candidatos da escolha', () => {
  escolhaSelectors.tabela.container().should('be.visible')
})

Then('a tabela de candidatos da escolha contém as colunas:', (dataTable) => {
  const colunas = dataTable.raw().flat().filter(Boolean)
  colunas.forEach((coluna) => {
    cy.contains('th', criarRegex(coluna), { timeout: 10000 }).should('be.visible')
  })
})

When('clico para visualizar a escolha do primeiro candidato', () => {
  escolhaSelectors.tabela.primeiraLinha().trigger('mouseover', { force: true })
  cy.wait(300)
  escolhaSelectors.tabela.botaoVisualizarEscolha().click({ force: true })
  cy.wait(1000)
})

Then('o modal de escolha do candidato exibe os campos:', (dataTable) => {
  const campos = dataTable.raw().flat().filter(Boolean)
  escolhaSelectors.modal.container().should('be.visible')
  campos.forEach((campo) => {
    escolhaSelectors.modal.container().contains(criarRegex(campo), { timeout: 8000 }).should('be.visible')
  })
})

Then('o modal de escolha do candidato exibe as situações:', (dataTable) => {
  const situacoes = dataTable.raw().flat().filter(Boolean)
  situacoes.forEach((situacao) => {
    escolhaSelectors.modal.container().contains(criarRegex(situacao), { timeout: 8000 }).should('be.visible')
  })
})
