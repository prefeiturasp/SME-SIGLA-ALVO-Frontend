/// <reference types="cypress" />

import { Before, After } from '@badeball/cypress-cucumber-preprocessor'
import 'cypress-mochawesome-reporter/cucumberSupport'

// Timeout estendido para cenários E2E de rastreabilidade (consulta_filtros.feature)
// Esses cenários encadeiam múltiplos logins, navegações e carregamentos de dados via API
Before({ tags: '@rastreabilidade' }, () => {
  Cypress.config('defaultCommandTimeout', 60000)
  Cypress.config('pageLoadTimeout', 180000)
  Cypress.config('requestTimeout', 60000)
  Cypress.config('responseTimeout', 120000)
})

After({ tags: '@rastreabilidade' }, () => {
  Cypress.config('defaultCommandTimeout', 20000)
  Cypress.config('pageLoadTimeout', 90000)
  Cypress.config('requestTimeout', 30000)
  Cypress.config('responseTimeout', 60000)
})
