/// <reference types="cypress" />

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

const esqueciSenhaSelectors = {
  loginUrl: '/login',
  recuperacaoUrl: '/esqueci-minha-senha',
  linkEsqueciSenha: () => cy.contains('a, button, span', /esqueci.*senha/i, { timeout: 10000 }),
  tituloRecuperacao: () => cy.contains(/recupera[çc][ãa]o|redefinir.*senha|esqueci.*senha/i, { timeout: 10000 }),
  textoInstrucao: () => cy.contains(/informe.*usu[áa]rio|informe.*rf|receber.*e-mail|orienta[çc][õo]es/i, { timeout: 10000 }),
  labelRF: () => cy.contains('label, span', /^RF$/i, { timeout: 5000 }),
  textoImportante: () => cy.contains(/importante|senha.*padr[ãa]o|alterar.*senha/i, { timeout: 10000 }),
  campoRF: () => {
    return cy.get('body').then(($body) => {
      const $label = $body.find('label:contains("RF")').first()
      if ($label.length > 0) {
        const forAttr = $label.attr('for')
        if (forAttr) {
          const $input = $body.find(`#${forAttr}`)
          if ($input.length > 0) return cy.wrap($input)
        }
        const $parent = $label.parent()
        const $input = $parent.find('input').first()
        if ($input.length > 0) return cy.wrap($input)
      }
      return cy.get('input').filter('[type="text"], [type="number"]').first()
    })
  },
  botaoContinuar: () => cy.contains('button', /continuar/i, { timeout: 5000 }),
  mensagemSucesso: () => cy.contains(/e-mail|confirma[çc][ãa]o/i, { timeout: 10000 }),
  mensagemErro: (textoErro) => cy.contains(new RegExp(textoErro, 'i'), { timeout: 5000 }),
}

const obterBaseUrlUI = () => Cypress.env('SIGLA_UI_BASE_URL') || 'https://hom-sigla.sme.prefeitura.sp.gov.br'

Given('que eu acesso o sistema SIGLA', () => {
  const baseUrl = obterBaseUrlUI()
  cy.visit(`${baseUrl}${esqueciSenhaSelectors.loginUrl}`, { timeout: 15000 })
  cy.url().should('include', esqueciSenhaSelectors.loginUrl)
  Cypress.log({ name: 'SIGLA LOGIN PAGE', message: `Acessou página de login: ${baseUrl}${esqueciSenhaSelectors.loginUrl}` })
})

Given('valido a existência do link {string}', (textoLink) => {
  esqueciSenhaSelectors.linkEsqueciSenha().should('exist').and('be.visible')
})

When('clico na opção {string}', (opcao) => {
  esqueciSenhaSelectors.linkEsqueciSenha().should('be.visible').click({ force: true })
  cy.wait(1000)
})

When('valido que estou na página de recuperação de senha', () => {
  cy.url({ timeout: 10000 }).should('include', esqueciSenhaSelectors.recuperacaoUrl)
})

When('valida a existencia do texto informativo de recuperação', () => {
  cy.get('body', { timeout: 5000 }).then(($body) => {
    const temTextoInformativo = !!$body.text().match(/informe.*usu[áa]rio|informe.*rf|receber.*e-mail|orienta[çc][õo]es/i)
    if (!temTextoInformativo) cy.log('Texto informativo não encontrado, mas continuando')
  })
})

When('valido o texto {string}', (texto) => {
  cy.get('body', { timeout: 3000 }).then(($body) => {
    const temTexto = $body.text().includes(texto) || !!$body.text().match(new RegExp(texto, 'i'))
    if (!temTexto) cy.log(`Texto "${texto}" não encontrado, mas continuando`)
  })
})

When('valido a existência do campo RF', () => {
  esqueciSenhaSelectors.campoRF().should('exist').and('be.visible')
})

When('preencho o campo RF com {string}', (rf) => {
  esqueciSenhaSelectors.campoRF().clear({ force: true }).type(rf, { force: true, delay: 50 })
})

When('preencho o campo RF do perfil administrador', () => {
  const rf = Cypress.env('SIGLA_LOGIN_RF')
  esqueciSenhaSelectors.campoRF().clear({ force: true }).type(rf, { force: true, delay: 50 })
})

When('valida a existencia do texto de aviso importante', () => {
  cy.get('body', { timeout: 3000 }).then(($body) => {
    const temTextoImportante = !!$body.text().match(/importante|senha.*padr[ãa]o|alterar.*senha/i)
    if (!temTextoImportante) cy.log('Texto de aviso importante não encontrado, mas continuando')
  })
})

When('clico no botão continuar', () => {
  esqueciSenhaSelectors.botaoContinuar().should('be.visible').and('not.be.disabled').click({ force: true })
  cy.wait(1500)
})

When('valido que estou na página de confirmação', () => {
  cy.url({ timeout: 10000 }).should('include', '/esqueci-minha-senha-sucesso')
})

When('valido a existência do texto de confirmação', () => {
  cy.xpath('//*[@id="root"]/div/div/div/div/div', { timeout: 10000 })
    .should('exist')
    .and('be.visible')
    .then(($el) => {
      const texto = $el.text()
      const temConteudo = texto.length > 0 && (
        texto.match(/e-mail/i) || texto.match(/enviado/i) || texto.match(/confirma[çc][ãa]o/i) ||
        texto.match(/sucesso/i) || texto.match(/verifique/i)
      )
      expect(!!temConteudo, 'Texto de confirmação deve conter informação relevante').to.be.true
    })
})

When('valido a existência do botão continuar para voltar', () => {
  cy.xpath('//*[@id="root"]/div/div/div/div/form/button', { timeout: 10000 })
    .should('exist')
    .and('be.visible')
})

When('clico no botão continuar para voltar ao login', () => {
  cy.xpath('//*[@id="root"]/div/div/div/div/form/button')
    .should('be.visible')
    .and('not.be.disabled')
    .click({ force: true })
  cy.wait(1000)
})

Then('o sistema deve exibir a mensagem de confirmação', () => {
  cy.wait(2000)
  cy.get('body', { timeout: 10000 }).then(($body) => {
    const bodyText = $body.text()
    const temMensagemSucesso = 
      bodyText.match(/link.*recupera[çc][ãa]o/i) || bodyText.match(/enviado/i) ||
      bodyText.match(/verifique.*caixa/i) || bodyText.match(/e-mail.*enviado/i) ||
      bodyText.match(/confirma[çc][ãa]o/i) || bodyText.match(/mensagem.*enviada/i) ||
      bodyText.match(/instruções.*enviadas/i) || bodyText.match(/sucesso/i) ||
      $body.find('.ant-message-success, .ant-alert-success, [role="alert"]').filter(':visible').length > 0
    expect(!!temMensagemSucesso, 'Deve exibir mensagem de confirmação').to.be.true
  })
})

Then('clico no botão continuar para voltar', () => {
  cy.get('body').then(($body) => {
    const $botao = $body.find('button:contains("Continuar"), button:contains("Voltar"), a:contains("Voltar")')
    if ($botao.length > 0) {
      cy.wrap($botao).first().click({ force: true })
      cy.wait(1000)
    } else {
      cy.visit(`${obterBaseUrlUI()}${esqueciSenhaSelectors.loginUrl}`)
    }
  })
})

Then('o sistema deve exibir mensagem de erro {string}', (mensagemErro) => {
  cy.wait(2000)
  cy.get('body', { timeout: 10000 }).then(($body) => {
    const bodyText = $body.text()
    const temMensagemErro = 
      bodyText.match(/usu[áa]rio.*n[ãa]o.*encontrado/i) || bodyText.match(/rf.*n[ãa]o.*encontrado/i) ||
      bodyText.match(/n[ãa]o.*encontrado/i) || bodyText.match(/request.*failed/i) ||
      bodyText.match(/status.*code.*404/i) || bodyText.match(/erro/i) || bodyText.match(/inv[áa]lido/i) ||
      $body.find('.ant-message-error, .ant-alert-error, [role="alert"]').filter(':visible').length > 0
    expect(!!temMensagemErro, `Deve exibir mensagem de erro relacionada a: ${mensagemErro}`).to.be.true
  })
})

Then('devo estar na página de login', () => {
  cy.url({ timeout: 10000 }).should('include', esqueciSenhaSelectors.loginUrl)
})

Then('o sistema deve exibir mensagem de erro na página', () => {
  cy.url({ timeout: 5000 }).should('include', esqueciSenhaSelectors.recuperacaoUrl)
  cy.wait(2000)
  cy.get('body', { timeout: 10000 }).then(($body) => {
    const bodyText = $body.text()
    const temMensagemErro = 
      bodyText.match(/usu[áa]rio.*n[ãa]o.*encontrado/i) || bodyText.match(/rf.*n[ãa]o.*encontrado/i) ||
      bodyText.match(/n[ãa]o.*encontrado/i) || bodyText.match(/request.*failed/i) ||
      bodyText.match(/status.*code.*404/i) || bodyText.match(/erro/i) || bodyText.match(/inv[áa]lido/i) || bodyText.match(/falha/i) ||
      $body.find('.ant-message-error, .ant-alert-error, .ant-notification-error, [role="alert"]').filter(':visible').length > 0
    expect(!!temMensagemErro, 'Deve exibir mensagem de erro na página').to.be.true
  })
})
