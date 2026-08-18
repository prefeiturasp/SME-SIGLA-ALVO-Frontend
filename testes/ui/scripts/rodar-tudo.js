#!/usr/bin/env node
// Roda a suíte Cypress e, ao final, gera o relatório (HTML + PDF + PNG)
// independentemente de ter havido falha nos testes — evidência de regressão
// precisa existir principalmente quando algo quebra.
//
// Uso:
//   node scripts/rodar-tudo.js                    → roda tudo (npm run cy:run)
//   node scripts/rodar-tudo.js -- --spec "..."     → repassa args pro cypress run
//   node scripts/rodar-tudo.js --spec nome_feature → roda cy:run:ui filtrado e já
//     passa o mesmo filtro pro relatório (report:spec)
//   node scripts/rodar-tudo.js --ui                → roda somente cypress/e2e/ui
//     (cy:run:ui) e gera o relatório já filtrado para essa pasta
//
// O dashboard local (scripts/gerar-dashboard.js) não precisa ser chamado aqui:
// já é atualizado automaticamente pelo hook after:run do cypress.config.js
// toda vez que a suíte roda localmente (fora de CI).

const { spawnSync } = require('child_process')
const path = require('path')

const args = process.argv.slice(2)
const uiOnly = args.includes('--ui')
const specFilterIndex = args.indexOf('--spec')
const specFilter = specFilterIndex >= 0 ? args[specFilterIndex + 1] : null

const cypressScript = uiOnly ? 'cy:run:ui' : 'cy:run'
const cypressArgs = specFilter
  ? ['run', cypressScript, '--', '--spec', `cypress/e2e/**/*${specFilter}*.feature`]
  : ['run', cypressScript]

console.log(`\n▶ Rodando testes: npm ${cypressArgs.join(' ')}\n`)
const testes = spawnSync('npm', cypressArgs, { stdio: 'inherit', shell: true })

// Filtro do relatório: --spec tem prioridade explícita; --ui filtra pela pasta.
// No Windows o caminho gravado no JSON do mochawesome usa "\" (ex.:
// "cypress\e2e\ui\foo.feature"), não "/" — por isso o separador do SO.
const reportFilter = specFilter || (uiOnly ? `${path.sep}ui${path.sep}` : null)
const reportArgs = reportFilter ? ['run', 'report:spec', reportFilter] : ['run', 'report']
console.log(`\n▶ Gerando relatório: npm ${reportArgs.join(' ')}\n`)
const relatorio = spawnSync('npm', reportArgs, { stdio: 'inherit', shell: true })

if (relatorio.status !== 0) {
  console.error('\nFalha ao gerar o relatório — verifique o log acima.')
  process.exit(relatorio.status || 1)
}

process.exit(testes.status || 0)
