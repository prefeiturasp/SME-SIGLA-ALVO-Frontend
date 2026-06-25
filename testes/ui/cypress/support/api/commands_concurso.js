const API_CONCURSO_CONFIG = {
  BASE_URL: 'https://qa-api-sigla.sme.prefeitura.sp.gov.br',
  BASE_PATH: '/ms-processos-concursos/api/v1',
  TIMEOUT: 30000,
}

Cypress.Commands.add('concurso_request', (method, path, options = {}) => {
  const baseUrl = Cypress.env('CONCURSO_BASE_URL') || API_CONCURSO_CONFIG.BASE_URL
  const basePath = Cypress.env('CONCURSO_BASE_PATH') || API_CONCURSO_CONFIG.BASE_PATH
  const url = path.startsWith('http') ? path : `${baseUrl}${basePath}${path}`

  Cypress.log({ name: method, message: `CONCURSO → ${path}` })

  return cy.request({
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    failOnStatusCode: false,
    timeout: API_CONCURSO_CONFIG.TIMEOUT,
    ...options,
  })
})

Cypress.Commands.add('concurso_get', (path, options = {}) => {
  return cy.concurso_request('GET', path, options)
})

Cypress.Commands.add('concurso_post', (path, body = {}, options = {}) => {
  return cy.concurso_request('POST', path, { ...options, body })
})

Cypress.Commands.add('concurso_put', (path, body = {}, options = {}) => {
  return cy.concurso_request('PUT', path, { ...options, body })
})

Cypress.Commands.add('concurso_patch', (path, body = {}, options = {}) => {
  return cy.concurso_request('PATCH', path, { ...options, body })
})

Cypress.Commands.add('concurso_delete', (path, options = {}) => {
  return cy.concurso_request('DELETE', path, options)
})

module.exports = { API_CONCURSO_CONFIG }
