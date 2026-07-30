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

const resolverData = (referencia) => {
  const data = new Date()
  if (/ontem/i.test(referencia)) data.setDate(data.getDate() - 1)
  else if (/amanhã|amanha/i.test(referencia)) data.setDate(data.getDate() + 1)
  return formatarData(data)
}

// Formata data como atributo title do calendário Ant Design (YYYY-MM-DD)
const toAttrDate = (data) => {
  const yyyy = data.getFullYear()
  const mm = String(data.getMonth() + 1).padStart(2, '0')
  const dd = String(data.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// Seleciona um range de datas clicando nas células do calendário Ant Design.
// Abordagem necessária porque qualquer keypress ({enter}, .blur()) dentro do
// formulário de Agenda dispara o onFinish do form pai e fecha a seção.
// Recebe uma função (não um seletor de posição) porque na modalidade Presencial
// existe mais de um .ant-picker-range na tela (período de escolha + hora da
// convocação) — usar ":first" pega o range errado dependendo da ordem no DOM.
const selecionarRangePicker = (obterRange, inicio, fim) => {
  obterRange()
    .find('input').first()
    .click({ force: true })
  cy.get('.ant-picker-dropdown:visible', { timeout: 8000 })
    .find(`td[title="${toAttrDate(inicio)}"]`)
    .first()
    .click({ force: true })
  cy.wait(500)
  cy.get('.ant-picker-dropdown:visible', { timeout: 8000 })
    .find(`td[title="${toAttrDate(fim)}"]`)
    .first()
    .click({ force: true })
  cy.wait(1500)
}

// Confirma a data digitada clicando na célula do calendário Ant Design —
// mas só se o popup realmente abrir. Alguns campos (ex.: "Escolha em" e
// "Nomeação em" na modalidade Presencial) são inputs de texto livre sem
// calendário; nesse caso o valor já digitado é suficiente e não há popup
// para esperar (esperar por ele cegamente estouraria timeout).
const confirmarDataNoPicker = (data) => {
  cy.wait(800)
  cy.get('body').then(($body) => {
    if ($body.find('.ant-picker-dropdown:visible').length > 0) {
      cy.get('.ant-picker-dropdown:visible')
        .find(`td[title="${toAttrDate(data)}"]`)
        .first()
        .click({ force: true })
      cy.wait(1000)
    }
  })
}

const aguardarCarregamento = (timeout = 20000) => {
  cy.wait(1500)
  cy.get('body').then($body => {
    if ($body.find('.ant-spin-spinning').length > 0) {
      cy.get('.ant-spin-spinning', { timeout }).should('not.exist')
    }
  })
  cy.get('body').then($body => {
    if ($body.find('.ant-btn-loading').length > 0) {
      cy.get('.ant-btn-loading', { timeout }).should('not.exist')
    }
  })
}

// A API de concursos (usada para popular o select "Concurso") por vezes
// responde 503 momentaneamente no ambiente de QA. Quando isso acontece o
// dropdown abre vazio (.ant-select-dropdown-empty) e o teste nunca encontra
// as opções. Recarregar a página refaz a chamada; só reage a erro 5xx —
// uma lista realmente vazia (200 sem itens) não deve ser mascarada.
const CONCURSOS_SELECT_URL = '**/ms-processos-concursos/api/v1/concursos/**'

const aguardarConcursosDisponiveis = (tentativasRestantes = 3) => {
  cy.wait('@concursosSelect', { timeout: 20000 }).then((interception) => {
    const status = interception.response && interception.response.statusCode
    if (status >= 500 && tentativasRestantes > 1) {
      cy.log(`API de concursos retornou ${status} — recarregando página (tentativas restantes: ${tentativasRestantes - 1})`)
      cy.intercept('GET', CONCURSOS_SELECT_URL).as('concursosSelect')
      cy.reload()
      aguardarCarregamento()
      aguardarConcursosDisponiveis(tentativasRestantes - 1)
    }
  })
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
  const abreNovaConvocacao = /nova convoca[çc][ãa]o/i.test(botao)
  if (abreNovaConvocacao) {
    cy.intercept('GET', CONCURSOS_SELECT_URL).as('concursosSelect')
  }
  cy.contains('button', criarRegex(botao), { timeout: 8000 })
    .should('be.visible')
    .click({ force: true })
  aguardarCarregamento()
  if (abreNovaConvocacao) {
    aguardarConcursosDisponiveis()
  }
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
  cy.get('.ant-select-dropdown:visible', { timeout: 10000 }).should('be.visible')
  cy.get('.ant-select-dropdown:visible .rc-virtual-list-holder')
    .scrollTo('bottom', { ensureScrollable: false })
  cy.wait(2000)
  cy.contains('.ant-select-item-option-content', valor, { timeout: 12000 })
    .scrollIntoView()
    .click({ force: true })
  cy.wait(1200)
})

When('seleciono {string} no campo Tipo de Escolha', (valor) => {
  cy.contains('label, span', /Tipo de Escolha/i, { timeout: 8000 })
    .closest('.ant-form-item, .ant-row')
    .find('.ant-select-selector')
    .click({ force: true })
  cy.wait(2000)
  cy.contains('.ant-select-item-option-content', valor, { timeout: 8000 })
    .click({ force: true })
  cy.wait(1200)
})

When('preencho o campo Descrição com {string} no formulário de convocação', (valor) => {
  cy.contains('label, span', /^Descri[çc][ãa]o$/i, { timeout: 8000 })
    .closest('.ant-form-item, .ant-row')
    .find('input, textarea')
    .first()
    .clear({ force: true })
    .type(valor, { force: true, delay: 80 })
})

When('preencho a Data da convocação com a data de ontem', () => {
  const ontem = new Date()
  ontem.setDate(ontem.getDate() - 1)
  const dataFormatada = formatarData(ontem)

  cy.contains('label, span', /Data da convoca[çc][ãa]o/i, { timeout: 10000 })
    .closest('.ant-form-item')
    .find('.ant-picker-input input')
    .first()
    .click({ force: true })
    .type('{selectall}' + dataFormatada, { force: true })
    .type('{enter}', { force: true })
  cy.wait(1500)
})

When('preencho a Data corte de vagas com a data de amanhã', () => {
  const amanha = new Date()
  amanha.setDate(amanha.getDate() + 1)
  const dataFormatada = formatarData(amanha)

  cy.contains('label, span', /Data corte de Vagas/i, { timeout: 10000 })
    .closest('.ant-form-item')
    .find('.ant-picker-input input')
    .first()
    .click({ force: true })
    .type('{selectall}' + dataFormatada, { force: true })
    .type('{enter}', { force: true })
  cy.wait(1500)
})

When('clico em {string} no formulário de convocação', (botao) => {
  cy.contains('button', criarRegex(botao), { timeout: 8000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(4000)
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

// =====================================================
// STEPS — VALIDAÇÃO DE FORMULÁRIO
// =====================================================

Then('o sistema exibe mensagens de erro nos campos obrigatórios', () => {
  cy.get('.ant-form-item-explain-error', { timeout: 8000 })
    .should('have.length.greaterThan', 0)
    .first()
    .should('be.visible')
})

// =====================================================
// STEPS — ETAPA 1 (PHRASINGS REFINADOS)
// =====================================================

When('seleciono o concurso {string}', (valor) => {
  cy.contains('label, span', /^Concurso$/i, { timeout: 10000 })
    .closest('.ant-form-item, .ant-row')
    .find('.ant-select-selector')
    .click({ force: true })
  cy.get('.ant-select-dropdown:visible', { timeout: 10000 }).should('be.visible')
  cy.get('.ant-select-dropdown:visible .rc-virtual-list-holder')
    .scrollTo('bottom', { ensureScrollable: false })
  cy.wait(2000)
  cy.contains('.ant-select-item-option-content', valor, { timeout: 12000 })
    .scrollIntoView()
    .click({ force: true })
  cy.wait(2000)
})

When('seleciono o tipo de escolha {string}', (valor) => {
  cy.contains('label, span', /Tipo de Escolha/i, { timeout: 10000 })
    .closest('.ant-form-item, .ant-row')
    .find('.ant-select-selector')
    .click({ force: true })
  cy.wait(3000)
  cy.contains('.ant-select-item-option-content', valor, { timeout: 10000 })
    .click({ force: true })
  cy.wait(2000)
})

// "Candidatos" e "Sessão" (agenda presencial) exibem o texto num card de
// resumo que não tem nenhum input dentro — não existe uma relação de
// ancestralidade entre o texto e o campo de fato. O input real só é
// identificável pela posição entre os inputs visíveis do formulário
// (3º = Candidatos, 4º = Sessão), conforme mapeado no DOM real.
const INDICE_INPUT_VISIVEL_POR_CAMPO = {
  candidatos: 2,
  'sessão': 3,
  sessao: 3,
}

// O breadcrumb do topo da página ("Convocação de Candidatos") sempre contém o
// texto de campos como "Candidatos", e por estar antes no DOM cy.contains()
// pegaria esse texto em vez do label do formulário — por isso os matches
// dentro de .ant-breadcrumb são explicitamente excluídos.
const preencherCampoPorLabel = (campo, valor) => {
  const indice = INDICE_INPUT_VISIVEL_POR_CAMPO[campo.trim().toLowerCase()]
  if (indice !== undefined) {
    cy.get('input', { timeout: 10000 })
      .filter(':visible')
      .eq(indice)
      .then(($input) => {
        // "Candidatos"/"Sessão" têm um máximo real ligado à quantidade de
        // candidatos de fato adicionados ao cargo (que pode ser menor do que
        // o pedido em "Autorizações Digitadas" — a API de cálculo/reposição
        // não garante devolver exatamente a quantidade solicitada). Digitar
        // um valor acima do máximo permitido trava o formulário mais adiante
        // sem nenhum erro visível (botão "Adicionar"/avançar fica
        // desabilitado). InputNumber do Ant Design expõe esse limite via
        // aria-valuemax (ou max, se for input[type=number]) — usamos o menor
        // entre o valor pedido no cenário e o disponível.
        const max = $input.attr('aria-valuemax') ?? $input.attr('max')
        const valorFinal = max && Number(valor) > Number(max) ? String(max) : valor
        if (valorFinal !== valor) {
          cy.log(`Campo "${campo}": valor "${valor}" excede o máximo disponível (${max}) — usando "${valorFinal}"`)
        }
        cy.wrap($input).clear({ force: true }).type(valorFinal, { force: true, delay: 80 })
      })
    return
  }

  const regex = criarRegex(campo)
  cy.get('label, span', { timeout: 10000 })
    .filter((i, el) => regex.test(el.textContent) && !el.closest('.ant-breadcrumb'))
    .should('have.length.greaterThan', 0)
    .first()
    .then($label => {
      const $formItem = $label.closest('.ant-form-item')
      if ($formItem.length > 0) {
        return cy.wrap($formItem)
          .find('input, textarea').not('[type="hidden"]').first()
          .clear({ force: true }).type(valor, { force: true, delay: 80 })
      }

      const $row = $label.closest('.ant-row')
      if ($row.length > 0) {
        return cy.wrap($row)
          .find('input, textarea').not('[type="hidden"]').first()
          .clear({ force: true }).type(valor, { force: true, delay: 80 })
      }

      let $container = $label
      for (let i = 0; i < 4; i++) {
        $container = $container.parent()
        if ($container.find('input, textarea').not('[type="hidden"]').length > 0) break
      }
      cy.wrap($container)
        .find('input, textarea').not('[type="hidden"]').first()
        .clear({ force: true })
        .type(valor, { force: true, delay: 80 })
        .trigger('blur', { force: true })
      cy.wait(1500)
    })
}

When('preencho o campo {string} com {string}', (campo, valor) => {
  preencherCampoPorLabel(campo, valor)
})

When('clica e preencho o campo {string} com {string}', (campo, valor) => {
  preencherCampoPorLabel(campo, valor)
})

When('seleciono a data da convocação como sendo {string}', (referencia) => {
  const dataFormatada = resolverData(referencia)
  cy.contains('label, span', /Data da convoca[çc][ãa]o/i, { timeout: 10000 })
    .closest('.ant-form-item')
    .find('.ant-picker-input input')
    .first()
    .click({ force: true })
    .type('{selectall}' + dataFormatada, { force: true })
    .type('{enter}', { force: true })
  cy.wait(1500)
})

When('seleciono a data corte de vagas como sendo {string}', (referencia) => {
  const dataFormatada = resolverData(referencia)
  cy.contains('label, span', /Data corte de Vagas/i, { timeout: 10000 })
    .closest('.ant-form-item')
    .find('.ant-picker-input input')
    .first()
    .click({ force: true })
    .type('{selectall}' + dataFormatada, { force: true })
    .type('{enter}', { force: true })
  cy.wait(1500)
})

// Verifica no log do Cypress qualquer sinal de que o clique não teve efeito:
// erro inline de formulário, toast/notificação de erro do backend, ou o
// próprio botão estar desabilitado (clique forçado em botão disabled não
// dispara o handler React, então o teste segue sem navegar e sem erro óbvio).
const diagnosticarFalhaDeClique = (botao, $botaoClicado) => {
  if ($botaoClicado && ($botaoClicado.is(':disabled') || $botaoClicado.attr('aria-disabled') === 'true' || $botaoClicado.hasClass('ant-btn-disabled'))) {
    cy.log(`⚠ Botão "${botao}" estava DESABILITADO no momento do clique — o clique forçado não teve efeito.`)
  }
  cy.get('body').then($body => {
    const erros = $body.find('.ant-form-item-explain-error')
    if (erros.length > 0) {
      cy.log('⚠ Erros de validação após clicar em "' + botao + '": ' +
        erros.toArray().map(el => el.textContent).join(' | '))
    }
    const toasts = $body.find('.ant-message-notice-content, .ant-notification-notice-message, .ant-notification-notice-description, .ant-alert-message')
    if (toasts.length > 0) {
      cy.log('⚠ Toast/notificação exibida após clicar em "' + botao + '": ' +
        toasts.toArray().map(el => el.textContent).join(' | '))
    }
  })
}

When('clico no botão {string}', (botao) => {
  cy.get('body').then($body => {
    const regex = criarRegex(botao)
    const modalTemBotao = $body
      .find('.ant-modal:visible button')
      .toArray()
      .some(el => regex.test(el.textContent))

    if (modalTemBotao) {
      cy.get('.ant-modal:visible')
        .contains('button', regex, { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible')
        .then($btn => {
          diagnosticarFalhaDeClique(botao, $btn)
          cy.wrap($btn).click({ force: true })
        })
    } else {
      cy.contains('button', regex, { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible')
        .then($btn => {
          diagnosticarFalhaDeClique(botao, $btn)
          cy.wrap($btn).click({ force: true })
        })
    }
  })
  aguardarCarregamento()
  // Diagnóstico pós-clique: se o clique não navegar (ex.: campo obrigatório
  // não preenchido ou regra de negócio no backend), captura no log do Cypress
  // qualquer erro/toast visível na tela para identificar o motivo.
  diagnosticarFalhaDeClique(botao, null)
})

Then('o sistema exibe a etapa {string}', (titulo) => {
  // Verifica pela URL — mais confiável que o texto do stepper que aparece em todas as etapas
  const slugPorEtapa = [
    { pattern: /sele[çc][ãa]o/i, slug: 'selecao-cargos' },
    { pattern: /agendar/i,        slug: 'agenda' },
    { pattern: /resumo/i,         slug: 'resumo' },
  ]
  const entry = slugPorEtapa.find(({ pattern }) => pattern.test(titulo))
  if (entry) {
    cy.url({ timeout: 15000 }).should('include', entry.slug)
  } else {
    cy.contains(criarRegex(titulo), { timeout: 15000 }).should('be.visible')
  }
})

Then('o sistema exibe o resumo dos dados do processo', () => {
  cy.contains(/Dados do processo/i, { timeout: 8000 }).should('be.visible')
})

Then('o sistema exibe {string}', (texto) => {
  cy.contains(criarRegex(texto), { timeout: 20000 }).should('be.visible')
})

// =====================================================
// STEPS — ETAPA 2 — CONFIGURAÇÃO DE CARGOS
// =====================================================

// Mesmo padrão do select de Concurso: lista virtualizada pré-carregada
// (não é busca remota) — precisa esperar o .rc-virtual-list-holder renderizar
// antes de procurar a opção, em vez de digitar para filtrar.
When('seleciono o cargo {string}', (cargo) => {
  cy.contains('label', /^Cargo$/i, { timeout: 10000 })
    .closest('.ant-form-item, .ant-row')
    .find('.ant-select-selector')
    .click({ force: true })
  cy.get('.ant-select-dropdown:visible', { timeout: 10000 }).should('be.visible')
  cy.get('.ant-select-dropdown:visible .rc-virtual-list-holder')
    .scrollTo('bottom', { ensureScrollable: false })
  cy.wait(2000)
  cy.contains('.ant-select-item-option-content', cargo, { timeout: 12000 })
    .scrollIntoView()
    .click({ force: true })
  cy.wait(2000)
})

Then('o sistema exibe o modal {string}', (titulo) => {
  cy.get('.ant-modal', { timeout: 10000 }).should('be.visible')
  cy.get('.ant-modal').contains(criarRegex(titulo), { timeout: 8000 }).should('be.visible')
})

Then('o sistema exibe a tabela de cargos adicionados', () => {
  cy.get('table', { timeout: 10000 }).should('be.visible')
  cy.get('tbody tr', { timeout: 8000 }).should('have.length.greaterThan', 0)
})

// =====================================================
// STEPS — ETAPA 3 — AGENDAR
// =====================================================

When('clico em {string} na linha do cargo', (botao) => {
  cy.get('tbody', { timeout: 10000 })
    .contains('button', criarRegex(botao))
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true })
  aguardarCarregamento()
})

Then('o sistema exibe o formulário de agendamento', () => {
  cy.contains('.ant-radio-wrapper', /Online|Presencial/i, { timeout: 10000 }).should('be.visible')
})

When('seleciono a modalidade {string}', (modalidade) => {
  cy.contains('.ant-radio-wrapper', modalidade, { timeout: 10000 })
    .click({ force: true })
  cy.wait(2000)
})

// Na modalidade Online o campo "Escolha em" é um período (range picker).
// Na modalidade Presencial é uma data única (input[name="escolhaEm"]) —
// por isso o container é inspecionado antes de decidir qual fluxo seguir.
When('seleciono o período de escolha', () => {
  cy.contains('label', /Escolha em/i, { timeout: 10000 })
    .parent()
    .parent()
    .then(($container) => {
      if ($container.find('.ant-picker-range').length > 0) {
        const inicio = new Date()
        inicio.setDate(inicio.getDate() + 1)
        const fim = new Date()
        fim.setDate(fim.getDate() + 7)
        selecionarRangePicker(
          () => cy.wrap($container).find('.ant-picker-range'),
          inicio,
          fim
        )
      } else {
        const data = new Date()
        data.setDate(data.getDate() + 1)
        cy.wrap($container)
          .find('input[name="escolhaEm"]')
          .click({ force: true })
          .clear({ force: true })
          .type(formatarData(data), { force: true, delay: 60 })
        confirmarDataNoPicker(data)
      }
    })
})

When('preencho a data de nomeação', () => {
  const nomeacao = new Date()
  nomeacao.setDate(nomeacao.getDate() + 15)

  cy.get('input[name="nomeacaoEm"]', { timeout: 10000 })
    .click({ force: true })
    .clear({ force: true })
    .type(formatarData(nomeacao), { force: true, delay: 60 })
  confirmarDataNoPicker(nomeacao)
})

// Campo tinha um atributo customizado (date-range="start"/"end") que o app
// parou de renderizar; a tentativa seguinte (classes nativas do Ant Design
// .ant-picker-input-start/-end) também não bateu com o DOM atual — sem
// acesso ao DOM ao vivo, adivinhar mais uma classe é method arriscado.
// Em vez disso, localizamos os inputs pelo mesmo padrão já comprovado nos
// outros campos deste formulário ("Data da convocação", "Data corte de
// Vagas"): a partir do label visível, sobe até o .ant-form-item/.ant-row
// mais próximo e pega os inputs visíveis ali dentro (1º = início, 2º = fim).
//
// Digitar o texto direto no input não atualiza a seleção interna do painel do
// TimePicker — é preciso clicar nas células de hora/minuto
// (.ant-picker-time-panel-column) para o "OK" habilitar e o valor ser
// realmente commitado (confirmado via screenshot: "OK" ficava acinzentado
// depois de só digitar).
//
// IMPORTANTE: os dois inputs (start/end) pertencem a um único Ant Design
// RangePicker (classe .ant-picker-dropdown-range no dropdown) — não são dois
// TimePickers independentes. Por isso, clicar em "OK" depois de selecionar
// o horário de início NÃO fecha o dropdown: ele só transiciona internamente
// para a seleção do horário de fim, permanecendo aberto. Só o "OK" clicado
// depois que os dois lados (início e fim) estão selecionados de fato fecha o
// dropdown — esperar o fechamento logo após o primeiro "OK" trava o teste
// num timeout, pois esse fechamento nunca acontece nesse ponto do fluxo.
const selecionarHoraNoPainel = (horaTexto) => {
  const [hh, mm] = horaTexto.split(':')
  cy.get('.ant-picker-dropdown:visible', { timeout: 8000 })
    .should('be.visible')
    .within(() => {
      cy.get('.ant-picker-time-panel-column').eq(0)
        .contains('.ant-picker-time-panel-cell-inner', new RegExp(`^${hh}$`))
        .scrollIntoView()
        .click({ force: true })
      cy.get('.ant-picker-time-panel-column').eq(1)
        .contains('.ant-picker-time-panel-cell-inner', new RegExp(`^${mm}$`))
        .scrollIntoView()
        .click({ force: true })
      cy.contains('.ant-btn, button, a', /^OK$/i, { timeout: 8000 })
        .should('not.be.disabled')
        .click({ force: true })
    })
}

const inputsHoraPorLabel = () => {
  const regex = /Hora da convoca[çc][ãa]o/i
  return cy.get('label, span', { timeout: 10000 })
    .filter((i, el) => regex.test(el.textContent) && !el.closest('.ant-breadcrumb'))
    .should('have.length.greaterThan', 0)
    .first()
    .then(($label) => {
      const $formItem = $label.closest('.ant-form-item, .ant-row')
      let $container = $formItem.length > 0 ? $formItem : $label.parent().parent()
      let $inputs = $container.find('input').filter(':visible')

      // Três tentativas anteriores (atributo customizado, classes do Ant
      // Design, container do label) já erraram o alvo desse campo. Em vez de
      // arriscar mais um seletor às cegas sem ver o DOM real, sobe até 4
      // níveis a partir do label procurando algum ancestral que já contenha
      // inputs visíveis — e loga o HTML do container final usado, pra
      // diagnosticar com precisão caso ainda erre.
      for (let i = 0; $inputs.length === 0 && i < 4; i++) {
        $container = $container.parent()
        $inputs = $container.find('input').filter(':visible')
      }

      cy.log(
        `[DEBUG Hora da convocação] inputs visíveis encontrados: ${$inputs.length} — HTML do container: ${($container.prop('outerHTML') || '').slice(0, 3000)}`
      )

      return cy.wrap($inputs)
    })
}

const preencherPeriodoDeHoras = (inicio, fim) => {
  inputsHoraPorLabel().eq(0).click({ force: true })
  selecionarHoraNoPainel(inicio)
  cy.wait(500)

  inputsHoraPorLabel().eq(1).click({ force: true })
  selecionarHoraNoPainel(fim)

  // Só agora — depois que início E fim foram selecionados — o dropdown
  // deve de fato fechar.
  cy.get('.ant-picker-dropdown:visible', { timeout: 8000 }).should('not.exist')

  inputsHoraPorLabel().eq(0).should('have.value', inicio)
  inputsHoraPorLabel().eq(1).should('have.value', fim)
}

When('preencho o período de horas de {string} a {string}', (inicio, fim) => {
  preencherPeriodoDeHoras(inicio, fim)
})

When('clica e preencho o período de horas de {string} a {string}', (inicio, fim) => {
  preencherPeriodoDeHoras(inicio, fim)
})

When('adiciono um novo período', () => {
  // Este clique confirma/salva o período preenchido na agenda.
  // O botão comita o período atual na tabela — não tenta preencher um segundo picker.
  cy.contains('button', /Adicionar per[íi]odo/i, { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
    .then($btn => {
      diagnosticarFalhaDeClique('Adicionar período', $btn)
      cy.wrap($btn).click({ force: true })
    })
  aguardarCarregamento()
  // Diagnóstico: se algum campo obrigatório não foi preenchido, o clique não
  // adiciona o período e a validação aparece na tela — captura no log do Cypress.
  diagnosticarFalhaDeClique('Adicionar período', null)
})

// =====================================================
// STEPS — ETAPA 4 — RESUMO
// =====================================================

Then('o sistema retorna para a lista de convocações', () => {
  cy.url({ timeout: 15000 }).should('include', '/convocacao')
  cy.contains(/Lista de Convoca[çc][õo]es/i, { timeout: 10000 }).should('be.visible')
})
