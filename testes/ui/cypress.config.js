const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const preprocessor = require('@badeball/cypress-cucumber-preprocessor')
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '.env') })

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://hom-api-sigla.sme.prefeitura.sp.gov.br',

    specPattern: 'cypress/e2e/**/*.feature',

    supportFile: 'cypress/support/e2e.js',

    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    video: false,
    videoCompression: false,
    screenshotOnRunFailure: true,

    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 15000,
    responseTimeout: 30000,

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
      SIGLA_BASE_URL: process.env.SIGLA_BASE_URL || 'https://hom-api-sigla.sme.prefeitura.sp.gov.br',
      SIGLA_BASE_PATH: '/ms-processos-convocacao/api/v1',
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
