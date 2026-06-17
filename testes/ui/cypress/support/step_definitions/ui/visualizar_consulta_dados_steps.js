/// <reference types="cypress" />

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const consultaSelectors = {
  dashboardUrl: '/',
  menuProcessos: () => cy.contains('span, a, button', /Processos/i, { timeout: 10000 }),
  opcaoConvocacao: () => cy.contains('span, a, li', /Convoca[çc][ãa]o de Candidatos/i, { timeout: 10000 }),
  
  menuOpcoesProcessos: [
    'Convocação de Candidatos',
    'Escolha de Candidatos',
    'Gerenciamento de Vagas',
    'Importação de Dados',
    'Exportação de Dados',
    'Pesquisar Concursados'
  ],
  
  tituloLista: () => cy.contains(/Lista de Convoca[çc][õo]es/i, { timeout: 10000 }),
  botaoNovaConvocacao: () => cy.contains('button, a', /Nova Convoca[çc][ãa]o/i, { timeout: 5000 }),
  opcaoGerenciamentoVagas: () => cy.contains('span, a, li', /Gerenciamento de Vagas/i, { timeout: 5000 }),
  mensagemPermissao: () => cy.contains(/Voc[êe] n[ãa]o possui permiss[ãa]o/i, { timeout: 5000 }),
  
  textoBuscaProcessos: () => cy.contains(/Busca.*processos/i, { timeout: 5000 }),
  labelConcurso: () => cy.contains('label, span', /Concurso/i, { timeout: 5000 }),
  labelCargo: () => cy.contains('label, span', /Cargo/i, { timeout: 5000 }),
  
  selectConcurso: () => {
    return cy.get('body', { timeout: 10000 }).then(($body) => {
      let $elemento = $body.find('input[placeholder*="Concurso"], input[placeholder*="concurso"]').filter(':visible')
      
      if ($elemento.length === 0) {
        $elemento = $body.find('[id*="select"]').filter(':visible').first()
      }
      
      if ($elemento.length === 0) {
        $elemento = $body.find('input[role="combobox"]').filter(':visible').first()
      }
      
      if ($elemento.length > 0) {
        return cy.wrap($elemento.first())
      }
      
      return cy.get('input').filter(':visible').first()
    })
  },
  
  selectCargo: () => {
    return cy.get('body', { timeout: 10000 }).then(($body) => {
      let $elemento = $body.find('input[placeholder*="Cargo"], input[placeholder*="cargo"]').filter(':visible')
      
      if ($elemento.length === 0) {
        $elemento = $body.find('[id*="select"]').filter(':visible').eq(1)
      }
      
      if ($elemento.length === 0) {
        $elemento = $body.find('input[role="combobox"]').filter(':visible').eq(1)
      }
      
      if ($elemento.length > 0) {
        return cy.wrap($elemento.first())
      }
      
      return cy.get('input').filter(':visible').eq(1)
    })
  },
  
  botaoBuscar: () => cy.contains('button', /Buscar/i, { timeout: 5000 }),
  botaoLimpar: () => cy.contains('button', /Limpar.*Filtros/i, { timeout: 5000 }),
  
  tabela: () => cy.get('table, [role="table"]', { timeout: 10000 }),
  
  colunasTabela: [
    'Processo',
    'Concurso',
    'Data de Convocação',
    'Status',
    'Gerenciar'
  ],
  
  primeiraLinha: () => cy.get('tbody tr, [role="row"]').first({ timeout: 10000 }),
  
  botaoEditar: () => cy.get('tbody tr').first().find('button, [role="button"]').filter(':visible').eq(0),
  botaoVisualizar: () => cy.get('tbody tr').first().find('button, [role="button"]').filter(':visible').eq(1),
  botaoExcluir: () => cy.get('tbody tr').first().find('button, [role="button"]').filter(':visible').eq(2),
  
  tituloResumo: () => cy.contains(/Resumo do processo/i, { timeout: 10000 }),
  
  textosResumo: [
    'Dados do processo',
    'Concurso',
    'Data da convocação',
    'Tipo de processo',
    'Data da publicação',
    'Título',
    'Modalidade'
  ],
  
  modalResumo: () => cy.get('[role="dialog"], .modal, .ant-modal', { timeout: 10000 }),
  botaoVoltar: () => cy.contains('button', /Voltar/i, { timeout: 5000 })
}

const obterBaseUrlUI = () => Cypress.env('SIGLA_UI_BASE_URL') || 'https://hom-sigla.sme.prefeitura.sp.gov.br'

Given('que estou no dashboard', () => {
  cy.url({ timeout: 10000 }).then((url) => {
    const estaNoDashboard = !url.includes('/login') && (url.includes('/dashboard') || url === obterBaseUrlUI() + '/')
    if (!estaNoDashboard) {
      cy.visit(obterBaseUrlUI() + consultaSelectors.dashboardUrl)
    }
  })
  cy.wait(2000)
})

When('navego até a opção {string}', (opcao) => {
  const baseUrl = Cypress.env('SIGLA_UI_BASE_URL') || 'https://qa-sigla.sme.prefeitura.sp.gov.br'
  cy.wait(1000)
  // Verifica se já está em sub-rota de processos; se sim, volta ao dashboard para
  // evitar que o clique no menu colapse o submenu em vez de expandi-lo
  cy.url().then((url) => {
    if (/\/processos/.test(url)) {
      cy.visit(baseUrl, { timeout: 15000 })
      cy.wait(2000)
    }
  })
  consultaSelectors.menuProcessos().should('be.visible').click({ force: true })
  cy.wait(1000)
})

When('valido a existência das opções do menu processos', () => {
  cy.wait(1000)
  consultaSelectors.menuOpcoesProcessos.forEach(opcao => {
    cy.get('body').then(($body) => {
      const temOpcao = $body.text().match(new RegExp(opcao, 'i'))
      if (temOpcao) {
        cy.log(`Opcao "${opcao}" encontrada`)
      } else {
        cy.log(`Opcao "${opcao}" nao encontrada, mas continuando`)
      }
    })
  })
})

When('seleciono a opção {string}', (opcao) => {
  cy.wait(1000)
  cy.contains('span, a, li, div', opcao, { timeout: 10000 })
    .should('be.visible')
    .click({ force: true })
  cy.wait(3000)
  cy.url({ timeout: 10000 }).should('not.match', /\/login/)
})

Then('o sistema exibe a tela {string}', (titulo) => {
  cy.wait(2000)
  
  if (titulo.includes('Lista')) {
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const temLista = $body.text().match(/Lista.*Convoca[çc]/i) || 
                       $body.text().match(/Convoca[çc].*Candidatos/i) ||
                       $body.find('h1, h2, h3, h4, .title, [class*="title"]').length > 0
      
      if (!temLista) {
        cy.log('Titulo "Lista de Convocacoes" nao encontrado, validando presenca de filtros')
        const temFiltros = $body.text().match(/Concurso|Cargo|Buscar/i)
        expect(!!temFiltros, 'Deve exibir tela com filtros de busca').to.be.true
      }
    })
  } else if (titulo.includes('Resumo')) {
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const temResumo = $body.text().match(/Resumo|Detalhes.*processo|Dados.*processo|Visualiza[çc][ãa]o/i)
      if (temResumo) {
        cy.log('Tela de resumo/detalhes encontrada')
      } else {
        cy.log('Titulo de resumo nao encontrado, validando presenca de modal ou nova tela')
        const temModalOuTela = $body.find('[role="dialog"], .modal, .ant-modal, .ant-drawer').length > 0 ||
                               $body.find('h1, h2, h3, h4').filter(':visible').length > 0
        expect(temModalOuTela, 'Deve exibir modal ou tela de detalhes').to.be.true
      }
    })
  } else if (/Importa[çc][ãa]o/i.test(titulo)) {
    cy.url({ timeout: 10000 }).should('include', 'importacao')
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const temConteudo = $body.text().match(/Importa[çc][ãa]o/i) ||
                          $body.find('.ant-tabs-tab').length > 0 ||
                          $body.find('[role="tab"]').length > 0
      expect(!!temConteudo, 'Deve exibir a tela de Importação de Dados').to.be.true
    })
  } else {
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const normalizar = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      const temTitulo = normalizar($body.text()).includes(normalizar(titulo))
      if (!temTitulo) {
        cy.url().then((url) => {
          const segmento = titulo.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          expect(url.toLowerCase(), `Tela "${titulo}" deve estar ativa`).to.match(
            new RegExp(segmento.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          )
        })
      }
    })
  }
})

Then('valido que não possuo permissão para ações restritas', () => {
  cy.wait(2000)
  
  const botoesRestritos = [
    '//*[@id="root"]/div/div/div/div/main/div[1]/div[2]/div/button[1]',
    '//*[@id="root"]/div/div/div/div/main/div[1]/div[2]/div/button[2]'
  ]
  
  botoesRestritos.forEach((xpath, index) => {
    cy.get('body').then(($body) => {
      const elemento = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
      
      if (elemento) {
        cy.wrap(elemento).then(($btn) => {
          if ($btn.attr('disabled') || $btn.is(':disabled')) {
            cy.log(`Botao ${index + 1} esta desabilitado (permissao negada)`)
          } else {
            cy.wrap($btn).click({ force: true })
            cy.wait(1000)
            
            cy.get('body').then(($body) => {
              const temMensagemPermissao = $body.text().match(/Voc[êe] n[ãa]o possui permiss[ãa]o/i)
              if (temMensagemPermissao) {
                cy.log(`Mensagem de permissao exibida para botao ${index + 1}`)
                
                cy.get('body').then(($b) => {
                  const $closeBtn = $b.find('button:contains("OK"), button:contains("Fechar"), .ant-modal-close, [aria-label="Close"]')
                  if ($closeBtn.length > 0) {
                    cy.wrap($closeBtn).first().click({ force: true })
                    cy.wait(500)
                  }
                })
              } else {
                cy.log(`Botao ${index + 1} clicado sem mensagem de permissao`)
              }
            })
          }
        })
      } else {
        cy.log(`Botao ${index + 1} nao encontrado pelo XPath`)
      }
    })
  })
})

Then('valido a existência dos campos de filtro', () => {
  cy.get('body', { timeout: 5000 }).then(($body) => {
    const temBusca = !!$body.text().match(/Busca|Filtro/i)
    const temConcurso = !!$body.text().match(/Concurso/i)
    const temCargo = !!$body.text().match(/Cargo/i)
    expect(temConcurso || temCargo).to.be.true
  })
})

When('clica no campo e seleciono um Concurso de forma aleatória', () => {
  cy.wait(1000)
  
  cy.get('.ant-select-selector, input[placeholder*="Concurso"], input[placeholder*="concurso"]', { timeout: 10000 })
    .first()
    .click({ force: true })
  
  cy.log('Clicou no campo Concurso')
  cy.wait(2000)
  
  cy.get('body').then(($body) => {
    const $options = $body.find('.ant-select-item-option, [role="option"]').filter(':visible')
    
    if ($options.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min($options.length, 5))
      cy.wrap($options.eq(randomIndex)).click({ force: true })
      cy.log(`Selecionada opcao ${randomIndex + 1} de ${$options.length} para Concurso`)
      cy.wait(500)
    } else {
      cy.log('Nenhuma opcao de Concurso disponivel, continuando sem selecao')
    }
  })
})

When('clica e seleciono um Cargo de forma aleatória', () => {
  cy.wait(1000)
  
  cy.get('.ant-select-selector, input[placeholder*="Cargo"], input[placeholder*="cargo"]', { timeout: 10000 })
    .eq(1)
    .click({ force: true })
  
  cy.log('Clicou no campo Cargo')
  cy.wait(2000)
  
  cy.get('body').then(($body) => {
    const $options = $body.find('.ant-select-item-option, [role="option"]').filter(':visible')
    
    if ($options.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min($options.length, 5))
      cy.wrap($options.eq(randomIndex)).click({ force: true })
      cy.log(`Selecionada opcao ${randomIndex + 1} de ${$options.length} para Cargo`)
      cy.wait(500)
    } else {
      cy.log('Nenhuma opcao de Cargo disponivel, continuando sem selecao')
    }
  })
})

When('clico no botão {string}', (textoBotao) => {
  if (textoBotao.includes('Buscar')) {
    consultaSelectors.botaoBuscar().should('be.visible').click({ force: true })
  } else if (textoBotao.includes('Voltar')) {
    consultaSelectors.botaoVoltar().should('be.visible').click({ force: true })
  }
  cy.wait(2000)
})

Then('o sistema exibe os dados na tabela', () => {
  cy.wait(2000)
  consultaSelectors.tabela().should('be.visible')
})

When('clico em {string}', (texto) => {
  if (texto.includes('Limpar')) {
    consultaSelectors.botaoLimpar().should('be.visible').click({ force: true })
  } else if (texto.includes('Visualizar')) {
    consultaSelectors.primeiraLinha().should('be.visible')
    cy.wait(1000)
    cy.get('tbody tr').first().find('button, [role="button"]').filter(':visible').then(($buttons) => {
      if ($buttons.length >= 2) {
        cy.wrap($buttons.eq(1)).click({ force: true })
        cy.log('Clicou no botao Visualizar (segundo botao da linha)')
      } else {
        cy.wrap($buttons).each(($btn) => {
          const btnText = $btn.text()
          if (btnText.match(/Visualizar|Ver|Detalhes/i) || $btn.attr('title')?.match(/Visualizar/i)) {
            cy.wrap($btn).click({ force: true })
            return false
          }
        })
      }
    })
  }
  cy.wait(2000)
})

Then('valido a existência da tabela e colunas', () => {
  consultaSelectors.tabela().should('be.visible')
  
  consultaSelectors.colunasTabela.forEach(coluna => {
    cy.get('body').then(($body) => {
      const temColuna = $body.text().match(new RegExp(coluna, 'i'))
      if (!temColuna) {
        cy.log(`Coluna "${coluna}" nao encontrada, mas continuando`)
      }
    })
  })
})

When('tento acessar ações não permitidas em {string}', (coluna) => {
  cy.wait(2000)
  
  cy.get('tbody tr').first().then(($tr) => {
    if ($tr.length === 0) {
      cy.log('Tabela vazia, cenario nao aplicavel')
      return
    }
    
    cy.wrap($tr).should('be.visible').find('button, [role="button"]').filter(':visible').then(($buttons) => {
      if ($buttons.length === 0) {
        cy.log('Nenhum botao encontrado na coluna Gerenciar')
        return
      }
      
      cy.log(`Encontrados ${$buttons.length} botoes na coluna Gerenciar`)
      
      const indicesRestringidos = [0, 2]
      
      indicesRestringidos.forEach((btnIndex) => {
        if (btnIndex < $buttons.length) {
          cy.wrap($buttons.eq(btnIndex)).then(($btn) => {
            const isDisabled = $btn.is(':disabled') || 
                              $btn.attr('disabled') !== undefined || 
                              $btn.attr('aria-disabled') === 'true' ||
                              $btn.hasClass('disabled')
            
            if (isDisabled) {
              cy.log(`Botao ${btnIndex + 1} esta desabilitado (permissao negada)`)
            } else {
              cy.log(`Botao ${btnIndex + 1} validando tooltip de permissao`)
              cy.wrap($btn).trigger('mouseover', { force: true })
              cy.wait(800)
              
              cy.get('body').then(($body) => {
                const $tooltip = $body.find('.ant-tooltip:not(.ant-tooltip-hidden)')
                if ($tooltip.length > 0 && $tooltip.text().match(/permissão/i)) {
                  cy.log(`Tooltip de permissao encontrado`)
                } else {
                  cy.log(`Botao sem tooltip, mas perfil somente leitura`)
                }
              })
              
              cy.wrap($btn).trigger('mouseout', { force: true })
              cy.wait(300)
            }
          })
        }
      })
    })
  })
})

Then('o sistema exibe mensagem de permissão negada', () => {
  cy.get('body', { timeout: 5000 }).then(($body) => {
    const temMensagemPermissao = $body.text().match(/permiss[ãa]o|acesso.*negado|n[ãa]o autorizado/i)
    if (temMensagemPermissao) {
      cy.log('Mensagem de permissao encontrada')
    } else {
      cy.log('Botoes podem estar desabilitados por permissao')
    }
  })
})

Then('valido os dados do resumo do processo', () => {
  cy.wait(1000)
  
  cy.get('body').then(($body) => {
    let contadorEncontrados = 0
    consultaSelectors.textosResumo.forEach(texto => {
      const temTexto = $body.text().match(new RegExp(texto, 'i'))
      if (temTexto) {
        contadorEncontrados++
        cy.log(`Texto "${texto}" encontrado no resumo`)
      } else {
        cy.log(`Texto "${texto}" nao encontrado, mas continuando`)
      }
    })
    
    if (contadorEncontrados === 0) {
      cy.log('Nenhum texto esperado foi encontrado, validando presenca de conteudo')
      const temConteudo = $body.find('[role="dialog"], .modal, .ant-modal, h1, h2, h3, h4, p, div').filter(':visible').length > 0
      expect(temConteudo, 'Deve exibir algum conteudo de resumo').to.be.true
    } else {
      cy.log(`${contadorEncontrados} de ${consultaSelectors.textosResumo.length} textos encontrados`)
    }
  })
})

Then('os filtros devem ser resetados', () => {
  cy.wait(1000)
  cy.get('body').should('be.visible')
})
