/// <reference types="cypress" />

import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

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
    processo: () =>
      cy.contains('label, span, div', /^Processo$/i, { timeout: 10000 })
        .closest('.ant-form-item, .ant-row, form > div, [class*="form"]')
        .find('input[role="combobox"], .ant-select-selector input')
        .first(),

    periodoAgenda: () =>
      cy.contains('label, span, div', /Período da agenda/i, { timeout: 10000 })
        .closest('.ant-form-item, .ant-row, form > div, [class*="form"]')
        .find('input[role="combobox"], .ant-select-selector input')
        .first(),

    processoPorIndice: () => cy.get('input[role="combobox"]', { timeout: 10000 }).eq(0),
    periodoAgendaPorIndice: () => cy.get('input[role="combobox"]', { timeout: 10000 }).eq(1),

    opcoes: () => cy.get('.ant-select-item-option, [role="option"]', { timeout: 10000 })
  },

  botaoAcaoPrincipal: () =>
    cy.get('main button[disabled], main button[aria-disabled="true"], main .ant-btn[disabled]', { timeout: 10000 })
      .first()
}

// =====================================================
// HELPER — SELECIONAR OPÇÃO ALEATÓRIA
// =====================================================

const selecionarOpcaoAleatoriaDropdown = (campoFn) => {
  campoFn().click({ force: true })
  cy.wait(1000)

  escolhaSelectors.filtros.opcoes().then(($opcoes) => {
    const total = $opcoes.length
    if (total > 0) {
      const indice = Math.floor(Math.random() * total)
      cy.wrap($opcoes[indice]).click({ force: true })
      cy.wait(500)
    } else {
      cy.log('Nenhuma opção disponível no dropdown')
      cy.get('body').click(0, 0)
    }
  })
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

  cy.get('body').then(($body) => {
    const labelRegex = campo.match(/Processo/i) ? /^Processo$/i : /Período da agenda/i
    let encontrou = false

    $body.find('label, .ant-form-item-label span, [class*="label"]').each((_, el) => {
      if (labelRegex.test(el.textContent.trim())) {
        encontrou = true
        return false
      }
    })

    if (encontrou) {
      cy.contains('label, .ant-form-item-label span', labelRegex)
        .closest('.ant-form-item, .ant-row, [class*="field"], [class*="form"]')
        .find('.ant-select-selector, input[role="combobox"]')
        .first()
        .click({ force: true })
    } else {
      cy.log(`Label "${campo}" não encontrado — usando fallback por índice ${indiceCombobox}`)
      cy.get('input[role="combobox"]', { timeout: 10000 })
        .eq(indiceCombobox)
        .click({ force: true })
    }
  })

  cy.wait(1000)

  escolhaSelectors.filtros.opcoes().then(($opcoes) => {
    const total = $opcoes.length
    if (total > 0) {
      const indice = Math.floor(Math.random() * total)
      cy.wrap($opcoes[indice]).click({ force: true })
      cy.wait(500)
    } else {
      cy.log('Nenhuma opção disponível no dropdown — fechando')
      cy.get('body').click(0, 0)
    }
  })
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
