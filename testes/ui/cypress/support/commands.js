// Comandos customizados — SME SIGLA ALVO
// Comandos específicos de features estão em cypress/support/api/commands.js

// =====================================================
// COMANDO: Interação robusta com Ant Design Select
// =====================================================
// Problema recorrente: o Ant Design mantém a lista de opções do último
// select aberto no DOM mesmo após fechar (display:none). Selecionar opções
// por classe global (.ant-select-item-option / .ant-select-item-option-content)
// sem escopar ao select que foi de fato aberto pode acabar clicando numa
// opção oculta de OUTRO campo — o clique roda sem erro (principalmente com
// force: true), mas não tem efeito algum na tela, e só se descobre o
// problema passos depois (botão continua desabilitado, tabela não carrega).
//
// Correção: uma tentativa anterior deste comando escopava as opções pelo ID
// do <input> (antd gera IDs previsíveis: input="rc_select_N",
// opções="rc_select_N_list_M") — mas esses elementos com ID não carregam o
// texto da opção como descendente direto (são wrappers de posicionamento do
// rc-virtual-list), então buscas por texto (.contains) neles nunca batiam.
// A abordagem que já funciona no resto do projeto (nova_convocacao_steps.js
// etc.) é buscar por `.ant-select-item-option-content`, que sempre contém o
// texto real. O problema nunca foi o seletor — foi escopar num container
// ERRADO: ao abrir um select, o antd deixa o dropdown do select anterior no
// DOM (ainda ':visible' durante a transição de fechamento), então
// `cy.get('.ant-select-dropdown:visible')` pode retornar 2 elementos ao
// mesmo tempo, e uma busca dentro de "todos eles" combina opções de dois
// campos diferentes. Como o antd sempre anexa o dropdown recém-aberto por
// último no body, `.last()` isola exatamente o dropdown certo.
//
// Uso:
//   cy.selecionarOpcaoAntd(() => cy.get('.ant-select').eq(0), 'Candidatura')
//   cy.selecionarOpcaoAntd(() => cy.get('.ant-select').eq(1), 'aleatoria')
//
// getSelectContainer pode resolver tanto para o <input> do select quanto para
// um container que o contém (div.ant-select, .ant-form-item, etc.) — o
// comando identifica qual é o caso.
Cypress.Commands.add('selecionarOpcaoAntd', (getSelectContainer, opcao) => {
  // Alguns campos ficam desabilitados até terminar de carregar suas opções
  // de forma assíncrona (ex.: um campo que só habilita depois da resposta de
  // uma chamada de API disparada pela seleção do campo anterior). Clicar num
  // select ainda desabilitado não abre o dropdown — e como o clique não é
  // refeito automaticamente, só aumentar o timeout da espera pelo dropdown
  // não resolve. Por isso esperamos o campo sair do estado disabled antes de
  // clicar, em vez de confiar num wait fixo.
  getSelectContainer().should(($el) => {
    const $container = $el.is('input') ? $el.closest('.ant-select') : $el
    const $input = $el.is('input') ? $el : $el.find('input').first()
    const desabilitado =
      (!!$container.length && $container.hasClass('ant-select-disabled')) || $input.is(':disabled')
    expect(desabilitado, 'Select não deve estar desabilitado').to.be.false
  })

  getSelectContainer()
    .then(($el) => ($el.is('input') ? $el : $el.find('input').first()))
    .click({ force: true })

  cy.wait(500)

  // Quando uma opção específica é pedida por texto (não "aleatoria"), digita
  // no campo antes de procurar. O dropdown do Ant Design é virtualizado (só
  // renderiza uma janela pequena de opções por vez, a partir do topo da
  // lista) — em selects com muitas opções, a opção procurada pode nunca
  // estar nessa janela inicial, e `.contains()` não encontra algo que não
  // está no DOM, não importa o timeout. Digitar filtra o dropdown e traz o
  // item procurado pra dentro da janela renderizada.
  if (opcao && opcao !== 'aleatoria') {
    getSelectContainer()
      .then(($el) => ($el.is('input') ? $el : $el.find('input').first()))
      .type(opcao, { delay: 50, force: true })
    cy.wait(500)
  }

  const dropdownAtual = () => cy.get('.ant-select-dropdown:visible', { timeout: 10000 }).last()

  dropdownAtual().should('be.visible')

  // Ao escolher aleatoriamente, algumas opções podem não ter efeito real ao
  // clicar (ex.: desabilitadas por regra de negócio, como período já
  // encerrado) — um clique forçado nelas "funciona" sem erro do Cypress,
  // mas não marca o campo como preenchido, deixando o botão de ação
  // seguinte desabilitado silenciosamente. Em vez de tentar adivinhar a
  // classe/atributo exato que o antd usa para marcar isso (arriscado sem
  // inspecionar o DOM ao vivo), tenta as opções uma a uma — depois de cada
  // clique, confirma que o dropdown realmente fechou (sinal de que a
  // seleção foi aplicada); se não fechar, tenta outra opção ainda não
  // testada, até esgotar as opções disponíveis.
  const clicarOpcaoAleatoria = (indicesTentados = []) => {
    dropdownAtual()
      .find('.ant-select-item-option, [role="option"]')
      .should('have.length.greaterThan', 0)
      .then(($opcoes) => {
        const total = $opcoes.length
        const indicesDisponiveis = [...Array(total).keys()].filter((i) => !indicesTentados.includes(i))
        if (indicesDisponiveis.length === 0) {
          cy.log('Nenhuma das opções do dropdown resultou em seleção válida')
          return
        }
        const indice = indicesDisponiveis[Math.floor(Math.random() * indicesDisponiveis.length)]
        cy.wrap($opcoes[indice]).click({ force: true })
        cy.wait(300)
        cy.get('body').then(($body) => {
          const aindaAberto = $body.find('.ant-select-dropdown:visible').length > 0
          if (aindaAberto) {
            cy.log(`Opção ${indice} não fechou o dropdown — tentando outra`)
            clicarOpcaoAleatoria([...indicesTentados, indice])
          }
        })
      })
  }

  if (!opcao || opcao === 'aleatoria') {
    clicarOpcaoAleatoria()
  } else {
    dropdownAtual()
      .contains('.ant-select-item-option-content', opcao, { timeout: 10000 })
      .click({ force: true })
  }

  cy.wait(300)
})
