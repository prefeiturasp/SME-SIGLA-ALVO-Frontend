const API_IMPORTA_CONFIG = {
  BASE_URL: 'https://qa-api-sigla.sme.prefeitura.sp.gov.br',
  BASE_PATH: '/ms-importa-arquivos/api/v1',
  TIMEOUT: 30000,
}

Cypress.Commands.add('importa_request', (method, path, options = {}) => {
  const baseUrl = Cypress.env('IMPORTA_BASE_URL') || API_IMPORTA_CONFIG.BASE_URL
  const basePath = Cypress.env('IMPORTA_BASE_PATH') || API_IMPORTA_CONFIG.BASE_PATH
  const url = path.startsWith('http') ? path : `${baseUrl}${basePath}${path}`

  Cypress.log({ name: method, message: `IMPORTA → ${path}` })

  return cy.request({
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    failOnStatusCode: false,
    timeout: API_IMPORTA_CONFIG.TIMEOUT,
    ...options,
  })
})

Cypress.Commands.add('importa_get', (path, options = {}) => {
  return cy.importa_request('GET', path, options)
})

Cypress.Commands.add('importa_post', (path, body = {}, options = {}) => {
  return cy.importa_request('POST', path, { ...options, body })
})

Cypress.Commands.add('importa_put', (path, body = {}, options = {}) => {
  return cy.importa_request('PUT', path, { ...options, body })
})

Cypress.Commands.add('importa_patch', (path, body = {}, options = {}) => {
  return cy.importa_request('PATCH', path, { ...options, body })
})

Cypress.Commands.add('importa_delete', (path, options = {}) => {
  return cy.importa_request('DELETE', path, options)
})

module.exports = { API_IMPORTA_CONFIG }
