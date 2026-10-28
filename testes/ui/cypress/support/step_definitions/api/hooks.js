/// <reference types="cypress" />

import { AfterStep } from '@badeball/cypress-cucumber-preprocessor'

// Pausa após cada passo dos cenários de API no modo interativo (cypress open),
// para dar tempo de acompanhar no runner a requisição e a resposta exibidas
// pelo cypress-plugin-api. As APIs respondem em milissegundos e, sem a pausa,
// o cenário termina antes de ser possível ler o que aconteceu.
// No modo headless (cypress run / Jenkins) não há pausa. O tempo é configurado
// em API_STEP_DELAY_MS (cypress.config.js); 0 desativa.
AfterStep({ tags: '@api' }, () => {
  const pausaMs = Number(Cypress.env('API_STEP_DELAY_MS')) || 0
  if (Cypress.config('isInteractive') && pausaMs > 0) {
    cy.wait(pausaMs, { log: false })
  }
})
