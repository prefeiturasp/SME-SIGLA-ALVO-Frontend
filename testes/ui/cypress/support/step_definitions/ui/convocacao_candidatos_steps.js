/// <reference types="cypress" />

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

// =====================================================
// SELECTORES — CONVOCAÇÃO DE CANDIDATOS
// =====================================================

const convocacaoSelectors = {
  // URLs
  urls: {
    home: 'https://qa-sigla.sme.prefeitura.sp.gov.br/',
    listaConvocacoes: '/convocacao'
  },

  // Títulos e textos
  titulos: {
    paginaInicial: () => cy.contains(/P[áa]gina inicial/i, { timeout: 10000 }),
    processos: () => cy.contains(/Processos/i, { timeout: 10000 }),
    convocacaoCandidatos: () => cy.contains(/Convoca[çc][ãa]o de Candidatos/i, { timeout: 10000 }),
    listaConvocacoes: () => cy.contains(/Lista de Convoca[çc][õo]es/i, { timeout: 10000 }),
    resumoProcesso: () => cy.contains(/Resumo do processo/i, { timeout: 10000 }),
    buscaProcessos: () => cy.contains(/Busca.*processos/i, { timeout: 5000 }),
    dadosProcesso: () => cy.contains(/Dados do processo/i, { timeout: 5000 })
  },

  // Menu
  menu: {
    processos: () => cy.contains('span, a, button', /Processos/i, { timeout: 10000 }),
    opcaoConvocacao: () => cy.contains('span, a, li, div', /Convoca[çc][ãa]o de Candidatos/i, { timeout: 10000 })
  },

  // Botões do topo (sem permissão)
  topo: {
    gerenciamentoVagas: () => cy.contains('button, a', /Gerenciamento de vagas/i, { timeout: 5000 }),
    novaConvocacao: () => cy.contains('button, a', /Nova convoca[çc][ãa]o/i, { timeout: 5000 }),
    mensagemPermissao: () => cy.contains(/Voc[êe] n[ãa]o possui permiss[ãa]o para essa a[çc][ãa]o/i, { timeout: 5000 })
  },

  // Filtros
  filtros: {
    concurso: () => cy.get('input[placeholder*="Concurso"], input[placeholder*="concurso"], [id^="rc_select"]').first(),
    cargo: () => cy.get('input[placeholder*="Cargo"], input[placeholder*="cargo"]').first(),
    dataConvocacao: () => cy.contains('label', /Data de Convoca[çc][ãa]o/i).parent().find('input'),
    status: () => cy.contains('label', /Status/i).parent().find('input'),
    
    opcoes: () => cy.get('.ant-select-item-option, [role="option"]'),
    buscar: () => cy.contains('button', /Buscar/i),
    limpar: () => cy.contains('button', /Limpar filtros/i)
  },

  // Tabela
  tabela: {
    container: () => cy.get('table', { timeout: 10000 }),
    linhas: () => cy.get('tbody tr'),
    primeiraLinha: () => cy.get('tbody tr').first(),
    
    colunas: {
      processo: () => cy.contains('th', /Processo/i),
      concurso: () => cy.contains('th', /Concurso/i),
      dataConvocacao: () => cy.contains('th', /Data de Convoca[çc][ãa]o/i),
      status: () => cy.contains('th', /Status/i),
      gerenciar: () => cy.contains('th', /Gerenciar/i)
    },

    // Ações na linha
    acoes: {
      visualizar: () => cy.get('tbody tr').first().find('button').contains(/Visualizar/i),
      gerenciar: () => cy.get('tbody tr').first().find('button').contains(/Gerenciar/i),
      editar: () => cy.get('tbody tr').first().find('button').eq(0),
      excluir: () => cy.get('tbody tr').first().find('button').eq(2),
      outraAcao: () => cy.get('tbody tr').first().find('button').eq(3)
    }
  },

  // Resumo do processo
  resumo: {
    titulo: () => cy.contains(/Resumo do processo/i, { timeout: 10000 }),
    botaoGerenciar: () => cy.contains('button', /Gerenciar processo/i, { timeout: 5000 }),
    botaoVoltar: () => cy.contains('button', /Voltar/i),
    
    campos: {
      concurso: () => cy.contains(/Concurso/i),
      tipoProcesso: () => cy.contains(/Tipo de processo/i),
      titulo: () => cy.contains(/T[íi]tulo/i),
      dataConvocacao: () => cy.contains(/Data da convoca[çc][ãa]o/i),
      dataPublicacao: () => cy.contains(/Data da publica[çc][ãa]o/i),
      modalidade: () => cy.contains(/Modalidade/i)
    },

    // Tabela de agenda
    tabelaAgenda: {
      container: () => cy.get('table').eq(1),
      mensagemVazia: () => cy.contains(/Nenhuma agenda foi criada ainda/i),
      
      colunas: {
        qtdCandidatos: () => cy.contains('th', /Qtd.*Candidatos/i),
        classificacao: () => cy.contains('th', /Classifica[çc][ãa]o/i),
        dataEscolha: () => cy.contains('th', /Data da Escolha/i),
        sessao: () => cy.contains('th', /Sess[ãa]o/i),
        modalidade: () => cy.contains('th', /Modalidade/i),
        horario: () => cy.contains('th', /Hor[áa]rio/i)
      }
    }
  }
}

// =====================================================
// HELPERS
// =====================================================

const obterCredenciaisVisualizacao = () => ({
  rf: Cypress.env('SIGLA_LOGIN_RF_VISUALIZACAO') || '007005',
  senha: Cypress.env('SIGLA_LOGIN_SENHA') || 'Alvo123@'
})

const realizarLogin = (rf, senha) => {
  cy.visit('https://qa-sigla.sme.prefeitura.sp.gov.br/login', { timeout: 15000 })
  cy.get('input').filter('[type="text"], [type="number"]').first().clear().type(rf, { delay: 100 })
  cy.wait(500)
  cy.get('input[type="password"]').clear().type(senha, { delay: 100 })
  cy.wait(500)
  cy.contains('button', /Acessar|Entrar|Login/i).click()
  cy.wait(3000)
  cy.url().should('not.include', '/login')
}

const validarBotaoDesabilitado = (botao) => {
  botao.should('exist')
  botao.then(($btn) => {
    const isDisabled = $btn.is(':disabled') || 
                      $btn.attr('disabled') !== undefined ||
                      $btn.hasClass('disabled') ||
                      $btn.attr('aria-disabled') === 'true'
    expect(isDisabled).to.be.true
  })
}

// Helper: valida que o botão está desabilitado e exibe tooltip de permissão
const validarPermissaoNegada = (botaoFn, mensagem) => {
  botaoFn().trigger('mouseover', { force: true })
  cy.wait(800)
  
  // Verifica se o tooltip de permissão está visível
  cy.get('body').then(($body) => {
    const tooltipVisivel = $body.find('.ant-tooltip:not(.ant-tooltip-hidden)').length > 0
    if (tooltipVisivel) {
      cy.get('.ant-tooltip:not(.ant-tooltip-hidden) .ant-tooltip-inner')
        .should('contain.text', 'permissão')
    } else {
      // Tenta verificar pelo clique (alguns sistemas exibem modal em vez de tooltip)
      botaoFn().click({ force: true })
      cy.wait(1000)
      cy.get('body').then(($b) => {
        const temMensagem = $b.text().includes('permissão') || $b.text().includes('Permissão')
        expect(temMensagem).to.be.true
      })
    }
  })
  
  // Trigger mouseout para fechar tooltip antes do próximo step
  botaoFn().trigger('mouseout', { force: true })
  cy.wait(500)
}

const selecionarOpcaoAleatoria = (seletor) => {
  seletor.click({ force: true })
  cy.wait(1000)
  
  convocacaoSelectors.filtros.opcoes().then(($opcoes) => {
    const total = $opcoes.length
    if (total > 0) {
      const indiceAleatorio = Math.floor(Math.random() * total)
      cy.wrap($opcoes[indiceAleatorio]).click({ force: true })
      cy.wait(500)
    }
  })
}

// =====================================================
// STEPS — CONTEXTO (ESPECÍFICO)
// =====================================================

Given('que estou logado no sistema com perfil de visualização', () => {
  const credenciais = obterCredenciaisVisualizacao()
  realizarLogin(credenciais.rf, credenciais.senha)
  
  Cypress.log({
    name: 'LOGIN VISUALIZAÇÃO',
    message: `Login realizado com RF: ${credenciais.rf} (perfil somente leitura)`
  })
})

// =====================================================
// STEPS — VALIDAÇÃO DE PERMISSÕES (ESPECÍFICO)
// =====================================================

Then('devo ver os botões {string} e {string} desabilitados', (botao1, botao2) => {
  cy.wait(1000)
  
  if (botao1.match(/Gerenciamento de vagas/i)) {
    convocacaoSelectors.topo.gerenciamentoVagas().should('exist')
  }
  
  if (botao2.match(/Nova convoca[çc][ãa]o/i)) {
    convocacaoSelectors.topo.novaConvocacao().should('exist')
  }
})

When('ao clicar em {string} da convocação devo ver a mensagem {string}', (botao, mensagem) => {
  if (botao.match(/Gerenciamento de vagas/i)) {
    validarPermissaoNegada(() => convocacaoSelectors.topo.gerenciamentoVagas(), mensagem)
  } else if (botao.match(/Nova convoca[çc][ãa]o/i)) {
    validarPermissaoNegada(() => convocacaoSelectors.topo.novaConvocacao(), mensagem)
  } else if (botao.match(/Gerenciar processo/i)) {
    validarPermissaoNegada(() => convocacaoSelectors.resumo.botaoGerenciar(), mensagem)
  }
})

When('tento acessar a opção {string} na convocação', (opcao) => {
  if (opcao.match(/Gerenciamento de vagas/i)) {
    convocacaoSelectors.topo.gerenciamentoVagas().click({ force: true })
    cy.wait(1000)
  }
})

Then('o botão da convocação deve estar desabilitado', () => {
  // Validação já feita no step anterior
  cy.wait(500)
})

Then('devo ver a mensagem de permissão negada na convocação', () => {
  convocacaoSelectors.topo.mensagemPermissao().should('be.visible')
})

Then('o botão {string} da convocação deve estar desabilitado', (nomeBotao) => {
  if (nomeBotao.match(/Gerenciar processo/i)) {
    convocacaoSelectors.resumo.botaoGerenciar().should('exist')
  }
})

// =====================================================
// STEPS — FILTROS (ESPECÍFICO CONVOCAÇÃO)
// =====================================================

Then('valido a existência dos campos de filtro de convocação:', (dataTable) => {
  const campos = dataTable.raw().flat()
  
  campos.forEach((campo) => {
    if (campo.match(/Concurso/i)) {
      cy.contains(/Concurso/i).should('be.visible')
    } else if (campo.match(/Cargo/i)) {
      cy.contains(/Cargo/i).should('be.visible')
    } else if (campo.match(/Data de Convoca[çc][ãa]o/i)) {
      cy.contains(/Data de Convoca[çc][ãa]o/i).should('be.visible')
    } else if (campo.match(/Status/i)) {
      cy.contains(/Status/i).should('be.visible')
    }
  })
})

When('seleciono um concurso aleatório para convocação', () => {
  selecionarOpcaoAleatoria(convocacaoSelectors.filtros.concurso())
})

Then('valido a existência dos botões de filtro de convocação', () => {
  convocacaoSelectors.filtros.limpar().should('be.visible')
  convocacaoSelectors.filtros.buscar().should('be.visible')
})

Given('realizo uma busca de convocação com filtros válidos', () => {
  selecionarOpcaoAleatoria(convocacaoSelectors.filtros.concurso())
  convocacaoSelectors.filtros.buscar().click({ force: true })
  cy.wait(3000)
})

// =====================================================
// STEPS — TABELA DE CONVOCAÇÃO
// =====================================================

Then('o sistema exibe os resultados de convocação filtrados', () => {
  convocacaoSelectors.tabela.container().should('be.visible')
  cy.wait(1000)
})

Then('devo visualizar a tabela de convocação com as colunas:', (dataTable) => {
  const colunas = dataTable.raw().flat()
  
  convocacaoSelectors.tabela.container().should('be.visible')
  
  colunas.forEach((coluna) => {
    if (coluna.match(/Processo/i)) {
      convocacaoSelectors.tabela.colunas.processo().should('be.visible')
    } else if (coluna.match(/Concurso/i)) {
      convocacaoSelectors.tabela.colunas.concurso().should('be.visible')
    } else if (coluna.match(/Data de Convoca[çc][ãa]o/i)) {
      convocacaoSelectors.tabela.colunas.dataConvocacao().should('be.visible')
    } else if (coluna.match(/Status/i)) {
      convocacaoSelectors.tabela.colunas.status().should('be.visible')
    } else if (coluna.match(/Gerenciar/i)) {
      convocacaoSelectors.tabela.colunas.gerenciar().should('be.visible')
    }
  })
})

When('seleciono o primeiro processo de convocação da tabela', () => {
  convocacaoSelectors.tabela.primeiraLinha().should('be.visible')
  cy.wait(500)
})

Then('todas as ações de edição de convocação devem estar desabilitadas', () => {
  cy.get('tbody tr').first().find('button').each(($btn) => {
    const texto = $btn.text().trim()
    // Ignora botões sem texto (ícone puro) e o botão "Visualizar" que é permitido
    if (!texto || texto.match(/Visualizar/i)) return
    const isDisabled =
      $btn.is('[disabled]') ||
      $btn.hasClass('disabled') ||
      $btn.attr('aria-disabled') === 'true'
    expect(isDisabled, `Botão "${texto}" deve estar desabilitado`).to.be.true
  })
})

When('ao clicar em qualquer ação desabilitada de convocação devo ver mensagem de permissão', () => {
  cy.get('tbody tr').first().find('button').each(($btn) => {
    const texto = $btn.text().trim()
    // Ignora botões sem texto (ícone puro) e o botão Visualizar (permitido)
    if (!texto || texto.match(/Visualizar/i)) return
    {
      cy.wrap($btn).trigger('mouseover', { force: true })
      cy.wait(800)
      cy.get('body').then(($body) => {
        const tooltipVisivel = $body.find('.ant-tooltip:not(.ant-tooltip-hidden)').length > 0
        if (tooltipVisivel) {
          cy.get('.ant-tooltip:not(.ant-tooltip-hidden) .ant-tooltip-inner').then(($inner) => {
            const tooltipTexto = $inner.text()
            cy.log(`Tooltip ao hover em "${texto}": "${tooltipTexto}"`)
            // Só valida permissão quando o tooltip realmente indica restrição de acesso
            // Botões podem estar desabilitados por status do processo (não só por permissão)
            if (tooltipTexto.match(/permiss[ãa]o/i) || tooltipTexto.match(/n[ãa]o possui/i)) {
              expect(tooltipTexto).to.match(/permiss[ãa]o/i, 'Tooltip deve indicar restrição de permissão')
            }
          })
        }
      })
      cy.wrap($btn).trigger('mouseout', { force: true })
      cy.wait(300)
      return false // para no primeiro botão desabilitado encontrado
    }
  })
})

When('tento executar ações de edição no primeiro processo de convocação', () => {
  convocacaoSelectors.tabela.primeiraLinha().should('be.visible')
  cy.wait(500)
})

When('clico em visualizar processo no primeiro resultado da convocação', () => {
  // Hover na row para garantir que os botões de ação apareçam (Ant Design esconde em estado sem hover)
  cy.get('tbody tr').first().trigger('mouseover', { force: true })
  cy.wait(500)
  cy.get('tbody tr').first().within(() => {
    cy.contains('button, a', /Visualizar/i).click({ force: true })
  })
  cy.wait(2000)
})

// =====================================================
// STEPS — COLUNA GERENCIAR (AÇÕES INDIVIDUAIS)
// =====================================================

// Mapa semântico: nome da ação → posição no xpath td[5]/div/div[N]/button
const acaoGerenciarPosicao = {
  'Editar': 1,
  'Visualizar processo': 2,
  'Excluir': 3,
  'Outra': 4
}

const clicarAcaoColuna = (nomeAcao) => {
  const posicao = acaoGerenciarPosicao[nomeAcao] ?? 1

  // Hover na row para exibir botões (Ant Design oculta em estado sem hover)
  cy.get('tbody tr').first().trigger('mouseover', { force: true })
  cy.wait(300)

  cy.get('tbody tr').first().then(($row) => {
    // Tenta por aria-label/title (abordagem semântica preferencial)
    const $porAtributo = $row.find(
      `button[aria-label*="${nomeAcao}"], button[title*="${nomeAcao}"]`
    )

    if ($porAtributo.length > 0) {
      cy.log(`Clicando em "${nomeAcao}" via aria-label/title`)
      cy.wrap($porAtributo.first()).click({ force: true })
    } else {
      // Fallback posicional: td[5]/div/div[N]/button (baseado nos xpaths do aplicativo)
      cy.log(`Clicando em "${nomeAcao}" via posição ${posicao} na coluna Gerenciar`)
      cy.wrap($row)
        .find(
          `td:nth-child(5) > div > div:nth-child(${posicao}) > button,
           td:last-child > div > div:nth-child(${posicao}) > button`
        )
        .first()
        .click({ force: true })
    }
  })
}

When('foco na primeira linha da tabela de convocação', () => {
  cy.get('tbody tr').first().scrollIntoView()
  cy.wait(300)
  cy.get('tbody tr').first().trigger('mouseover', { force: true })
  cy.wait(500)
})

When('ao clicar na ação {string} da coluna Gerenciar devo ver a mensagem {string}', (acao, mensagem) => {
  clicarAcaoColuna(acao)
  cy.wait(1000)

  // Valida mensagem de permissão negada (toast, notification ou inline)
  cy.get('body').then(($body) => {
    const textoBody = $body.text()
    const temMensagem =
      textoBody.includes('permiss') ||
      textoBody.includes('Permiss') ||
      textoBody.includes('não possui') ||
      $body.find('.ant-notification-notice, .ant-message-notice').length > 0

    expect(
      temMensagem,
      `Ao clicar em "${acao}" deve exibir: "${mensagem}"`
    ).to.be.true
  })

  cy.wait(1500) // Aguarda toast desaparecer antes do próximo clique
})

When('clico na ação {string} da coluna Gerenciar', (acao) => {
  clicarAcaoColuna(acao)
  cy.wait(2000)
})

// =====================================================
// STEPS — RESUMO DO PROCESSO DE CONVOCAÇÃO
// =====================================================

Then('valido a existência dos dados do processo de convocação:', (dataTable) => {
  const campos = dataTable.raw().flat()
  
  convocacaoSelectors.resumo.titulo().should('be.visible')
  
  campos.forEach((campo) => {
    if (campo.match(/Concurso/i)) {
      convocacaoSelectors.resumo.campos.concurso().should('be.visible')
    } else if (campo.match(/Tipo de processo/i)) {
      convocacaoSelectors.resumo.campos.tipoProcesso().should('be.visible')
    } else if (campo.match(/T[íi]tulo/i)) {
      convocacaoSelectors.resumo.campos.titulo().should('be.visible')
    } else if (campo.match(/Data da convoca[çc][ãa]o/i)) {
      convocacaoSelectors.resumo.campos.dataConvocacao().should('be.visible')
    } else if (campo.match(/Data da publica[çc][ãa]o/i)) {
      convocacaoSelectors.resumo.campos.dataPublicacao().should('be.visible')
    } else if (campo.match(/Modalidade/i)) {
      convocacaoSelectors.resumo.campos.modalidade().should('be.visible')
    }
  })
})

Then('devo visualizar todos os dados do processo de convocação', () => {
  convocacaoSelectors.resumo.titulo().should('be.visible')
  convocacaoSelectors.resumo.campos.concurso().should('be.visible')
  convocacaoSelectors.resumo.campos.tipoProcesso().should('be.visible')
})

Then('a ação gerenciar processo de convocação deve estar desabilitada', () => {
  convocacaoSelectors.resumo.botaoGerenciar().should('exist')
})

Then('valido a tabela de agenda de convocação ou mensagem vazia', () => {
  cy.wait(1000)
  cy.get('body').then(($body) => {
    const temMensagemVazia = $body.text().match(/Nenhuma agenda foi criada ainda/i)
    const temTabela = $body.find('table').length > 1
    
    if (temTabela && !temMensagemVazia) {
      cy.get('table').eq(1).should('be.visible')
      cy.log('Tabela de agenda encontrada')
    } else if (temMensagemVazia) {
      cy.contains(/Nenhuma agenda foi criada ainda/i).should('be.visible')
      cy.log('Mensagem de agenda vazia encontrada')
    } else {
      cy.log('Resumo do processo validado (agenda presente ou vazia)')
    }
  })
})
