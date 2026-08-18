const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const preprocessor = require('@badeball/cypress-cucumber-preprocessor')
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '.env') })

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome',
    reportFilename: '[status]_[datetime]-relatorio',
    reportPageTitle: 'Relatório de Testes — SME SIGLA ALVO',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    overwrite: false,
  },

  e2e: {
    // Base URL configurável: usa API para testes de API, UI para testes de UI
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://qa-sigla.sme.prefeitura.sp.gov.br',

    specPattern: 'cypress/e2e/**/*.feature',

    supportFile: 'cypress/support/e2e.js',

    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    // Gravação ativa localmente para permitir revisar a execução;
    // desativada no Jenkins (CI=true) para não gerar/arquivar vídeo na esteira.
    video: !process.env.CI,
    videoCompression: false,
    screenshotOnRunFailure: true,

    // Por padrão o Cypress apaga TODA a pasta de vídeos/screenshots no início
    // de cada "cypress run", mesmo quando a execução é filtrada por --spec.
    // Desativado para preservar evidências de execuções anteriores.
    trashAssetsBeforeRuns: false,

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
      // MOCHAWESOME REPORTER + DASHBOARD LOCAL PÓS-EXECUÇÃO
      // =========================
      // Cypress só mantém UM handler por evento de ciclo de vida ('after:run'
      // incluso): registrar on('after:run', ...) mais de uma vez faz o último
      // registro substituir o anterior EM SILÊNCIO (sem erro/aviso). O antigo
      // require('cypress-mochawesome-reporter/plugin')(on) registra o próprio
      // 'after:run' dele — chamado depois do nosso, ele vencia e o dashboard
      // local nunca rodava (era esse o motivo do dashboard.html ficar
      // desatualizado). A solução é importar os hooks do reporter direto de
      // 'cypress-mochawesome-reporter/lib' e compor um único handler por
      // evento, chamando o hook do reporter e, na sequência, o dashboard. Ele
      // só roda localmente: nunca em CI (Jenkins seta CI=true), e uma falha
      // nele é só um aviso — nunca derruba a execução dos testes nem altera
      // o exit code.
      const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib')

      on('before:run', async (details) => {
        await beforeRunHook(details)
      })

      on('after:run', async (results) => {
        await afterRunHook(results)
        if (process.env.CI) return
        try {
          require('./scripts/gerar-dashboard.js').gerar()
        } catch (e) {
          console.warn('Aviso: falha ao gerar dashboard local (ignorado):', e.message)
        }
      })

      // =========================
      // CUCUMBER
      // =========================
      await preprocessor.addCucumberPreprocessorPlugin(on, config)

      // No modo interativo (cypress open) mantém os snapshots de cada ação
      // para permitir navegar/"viajar no tempo" pelos passos após a execução.
      // No modo headless (cypress run / CI) mantém 0 para economizar memória.
      config.numTestsKeptInMemory = config.isInteractive ? 50 : 0

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
        // Task para leitura segura de arquivos (não falha se não existir)
        lerArquivoSeguro(caminho) {
          try {
            const fs = require('fs')
            const path = require('path')
            const caminhoAbsoluto = path.isAbsolute(caminho)
              ? caminho
              : path.join(process.cwd(), caminho)
            if (fs.existsSync(caminhoAbsoluto)) {
              return fs.readFileSync(caminhoAbsoluto, 'utf8')
            }
            return null
          } catch (e) {
            console.error('Erro ao ler arquivo:', e.message)
            return null
          }
        }
      })

      return config
    },
  },
})
