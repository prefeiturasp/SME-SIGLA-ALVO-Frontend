const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const preprocessor = require('@badeball/cypress-cucumber-preprocessor')
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '.env') })

module.exports = defineConfig({
  e2e: {
    // Base URL configurável: usa API para testes de API, UI para testes de UI
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://qa-sigla.sme.prefeitura.sp.gov.br',

    specPattern: 'cypress/e2e/**/*.feature',

    supportFile: 'cypress/support/e2e.js',

    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    video: false,
    videoCompression: false,
    screenshotOnRunFailure: true,

    chromeWebSecurity: false,
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 90000,
    requestTimeout: 30000,
    responseTimeout: 60000,
    
    // Desabilita verificação de baseUrl no startup
    baseUrlMatchesPrimaryHostname: false,

    viewportWidth: 1920,
    viewportHeight: 1080,

    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0,
    watchForFileChanges: false,

    retries: {
      runMode: 1,
      openMode: 0,
    },

    env: {
      // Detectar contexto de execução (CI=true na esteira Jenkins)
      CI: process.env.CI || false,

      // API SIGLA — Processos Convocação (sem autenticação)
      SIGLA_BASE_URL: process.env.SIGLA_BASE_URL || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br',
      SIGLA_BASE_PATH: '/ms-processos-convocacao/api/v1',

      // CONCURSO API — Processos Concursos
      CONCURSO_BASE_URL: process.env.CONCURSO_BASE_URL || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br',
      CONCURSO_BASE_PATH: '/ms-processos-concursos/api/v1',

      // ESCOLHA API — Escolha de Vagas
      ESCOLHA_BASE_URL: process.env.ESCOLHA_BASE_URL || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br',
      ESCOLHA_BASE_PATH: '/ms-escolha-vagas/api/v1',

      // IMPORTA API — Importação de Arquivos
      IMPORTA_BASE_URL: process.env.IMPORTA_BASE_URL || 'https://qa-api-sigla.sme.prefeitura.sp.gov.br',
      IMPORTA_BASE_PATH: '/ms-importa-arquivos/api/v1',

      // UI SIGLA — Frontend Base URL
      SIGLA_UI_BASE_URL: process.env.SIGLA_UI_BASE_URL || 'https://qa-sigla.sme.prefeitura.sp.gov.br',

      // CREDENCIAIS DE LOGIN — SIGLA UI (Perfil Administrador)
      SIGLA_LOGIN_RF: process.env.SIGLA_LOGIN_RF || '007001',
      SIGLA_LOGIN_SENHA: process.env.SIGLA_LOGIN_SENHA || 'Alvo123@',

      // CREDENCIAIS DE LOGIN — SIGLA UI (Perfil Visualização - Somente Leitura)
      SIGLA_LOGIN_RF_VISUALIZACAO: process.env.SIGLA_LOGIN_RF_VISUALIZACAO || '007005',
      SIGLA_LOGIN_SENHA_VISUALIZACAO: process.env.SIGLA_LOGIN_SENHA_VISUALIZACAO || 'Alvo123@',
    },

    async setupNodeEvents(on, config) {
      // =========================
      // CUCUMBER
      // =========================
      await preprocessor.addCucumberPreprocessorPlugin(on, config)

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin.default(config)],
        })
      )

      // =========================
      // TASKS
      // =========================
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        },
      })

      return config
    },
  },
})
