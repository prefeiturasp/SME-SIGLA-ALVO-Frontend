// Arquivo principal de suporte do Cypress — SME SIGLA ALVO

// Comandos principais
import './commands'

// Comandos de API SIGLA
import './api/commands'

// Ignorar erros não capturados de terceiros
Cypress.on('uncaught:exception', () => false)

// Before hook global
beforeEach(() => {
  cy.viewport(1920, 1080)
})
