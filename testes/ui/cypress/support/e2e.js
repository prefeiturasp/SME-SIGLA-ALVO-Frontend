// Arquivo principal de suporte do Cypress — SME SIGLA ALVO

// Comandos principais
import './commands'

// Plugin XPath
import 'cypress-xpath'

// Comandos de API SIGLA
import './api/commands'
import './api/commands_concurso'
import './api/commands_escolha'
import './api/commands_importa'

// Ignorar erros não capturados de terceiros
Cypress.on('uncaught:exception', () => false)

// Before hook global
beforeEach(() => {
  cy.viewport(1920, 1080)
})
