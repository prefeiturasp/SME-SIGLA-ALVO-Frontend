const { API_SIGLA_CONFIG } = require('./config_sigla')

Cypress.Commands.add('sigla_request', (method, path, options = {}) => {
  const baseUrl = Cypress.env('SIGLA_BASE_URL') || API_SIGLA_CONFIG.BASE_URL
  const basePath = Cypress.env('SIGLA_BASE_PATH') || API_SIGLA_CONFIG.BASE_PATH
  const url = path.startsWith('http') ? path : `${baseUrl}${basePath}${path}`

  Cypress.log({ name: method, message: `SIGLA → ${path}` })

  return cy.request({
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    failOnStatusCode: false,
    timeout: API_SIGLA_CONFIG.TIMEOUT,
    ...options,
  })
})

Cypress.Commands.add('sigla_get', (path, options = {}) => {
  return cy.sigla_request('GET', path, options)
})

Cypress.Commands.add('sigla_post', (path, body = {}, options = {}) => {
  return cy.sigla_request('POST', path, { ...options, body })
})

Cypress.Commands.add('sigla_put', (path, body = {}, options = {}) => {
  return cy.sigla_request('PUT', path, { ...options, body })
})

Cypress.Commands.add('sigla_patch', (path, body = {}, options = {}) => {
  return cy.sigla_request('PATCH', path, { ...options, body })
})

Cypress.Commands.add('sigla_delete', (path, options = {}) => {
  return cy.sigla_request('DELETE', path, options)
})
