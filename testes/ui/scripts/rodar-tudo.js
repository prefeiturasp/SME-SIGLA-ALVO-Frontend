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

const { spawnSync } = require('child_process')

const args = process.argv.slice(2)
const specFilterIndex = args.indexOf('--spec')
const specFilter = specFilterIndex >= 0 ? args[specFilterIndex + 1] : null

const cypressArgs = specFilter
  ? ['run', 'cy:run', '--', '--spec', `cypress/e2e/**/*${specFilter}*.feature`]
  : ['run', 'cy:run']

console.log(`\n▶ Rodando testes: npm ${cypressArgs.join(' ')}\n`)
const testes = spawnSync('npm', cypressArgs, { stdio: 'inherit', shell: true })

const reportArgs = specFilter ? ['run', 'report:spec', specFilter] : ['run', 'report']
console.log(`\n▶ Gerando relatório: npm ${reportArgs.join(' ')}\n`)
const relatorio = spawnSync('npm', reportArgs, { stdio: 'inherit', shell: true })

if (relatorio.status !== 0) {
  console.error('\nFalha ao gerar o relatório — verifique o log acima.')
  process.exit(relatorio.status || 1)
}

process.exit(testes.status || 0)
