const API_ESCOLHA_CONFIG = {
  BASE_URL: 'https://qa-api-sigla.sme.prefeitura.sp.gov.br',
  BASE_PATH: '/ms-escolha-vagas/api/v1',
  TIMEOUT: 30000,
}

Cypress.Commands.add('escolha_request', (method, path, options = {}) => {
  const baseUrl = Cypress.env('ESCOLHA_BASE_URL') || API_ESCOLHA_CONFIG.BASE_URL
  const basePath = Cypress.env('ESCOLHA_BASE_PATH') || API_ESCOLHA_CONFIG.BASE_PATH
  const url = path.startsWith('http') ? path : `${baseUrl}${basePath}${path}`

  // Verifica se há um mock configurado para esta requisição
  const mockKey = `mock_${method}_${url.replace(/[^a-zA-Z0-9]/g, '_')}`
  const mock = Cypress.env(mockKey)
  
  if (mock) {
    Cypress.log({ name: `${method} (MOCK)`, message: `ESCOLHA → ${path}` })
    return cy.wrap({
      status: mock.statusCode,
      body: mock.body,
      headers: mock.headers || {},
      duration: Math.floor(Math.random() * 100) + 50
    })
  }

  Cypress.log({ name: method, message: `ESCOLHA → ${path}` })

  return cy.request({
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    failOnStatusCode: false,
    timeout: API_ESCOLHA_CONFIG.TIMEOUT,
    ...options,
  })
})

Cypress.Commands.add('escolha_get', (path, options = {}) => {
  return cy.escolha_request('GET', path, options)
})

Cypress.Commands.add('escolha_post', (path, body = {}, options = {}) => {
  return cy.escolha_request('POST', path, { ...options, body })
})

Cypress.Commands.add('escolha_put', (path, body = {}, options = {}) => {
  return cy.escolha_request('PUT', path, { ...options, body })
})

Cypress.Commands.add('escolha_patch', (path, body = {}, options = {}) => {
  return cy.escolha_request('PATCH', path, { ...options, body })
})

Cypress.Commands.add('escolha_delete', (path, options = {}) => {
  return cy.escolha_request('DELETE', path, options)
})

module.exports = { API_ESCOLHA_CONFIG }
