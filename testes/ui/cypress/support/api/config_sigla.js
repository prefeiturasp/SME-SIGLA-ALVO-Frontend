// ============================================================================
// CONFIGURAÇÕES DA API SIGLA — Base compartilhada entre todos os microsserviços
// ============================================================================
// NÃO usar process.env aqui — os valores vêm de Cypress.env() em runtime.
// Valores carregados pelo cypress.config.js via dotenv.
//
// Esta API não requer autenticação. Requisições diretas sem API key.
// ============================================================================

const API_SIGLA_CONFIG = {
  BASE_URL: 'https://hom-api-sigla.sme.prefeitura.sp.gov.br',
  BASE_PATH: '/ms-processos-convocacao/api/v1',
  TIMEOUT: 30000,
}

module.exports = { API_SIGLA_CONFIG }
