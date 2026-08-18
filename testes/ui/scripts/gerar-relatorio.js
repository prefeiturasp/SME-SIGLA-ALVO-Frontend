#!/usr/bin/env node
// Gera relatório consolidado (HTML + PDF + PNG) a partir dos JSONs do
// cypress-mochawesome-reporter. Não depende do hook after:run funcionar —
// roda o merge manualmente sempre, de forma determinística.
//
// Uso:
//   node scripts/gerar-relatorio.js                  → mescla tudo em .jsons/
//   node scripts/gerar-relatorio.js --spec nova_convocacao → filtra por 1 feature
//     (substring no caminho do arquivo, ex.: "nova_convocacao" casa com
//     cypress/e2e/ui/nova_convocacao.feature)

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const REPORT_DIR = path.join('cypress', 'reports', 'mochawesome')
const JSON_DIR = path.join(REPORT_DIR, '.jsons')

const args = process.argv.slice(2)
const specFilterIndex = args.indexOf('--spec')
const specFilter = specFilterIndex >= 0 ? args[specFilterIndex + 1] : null

// ── 1. Deduplicar: manter só o JSON mais recente por spec ──────────────────
function dedupJsons() {
  if (!fs.existsSync(JSON_DIR)) {
    throw new Error(`Pasta ${JSON_DIR} não existe — rode a suíte com cypress run antes.`)
  }
  const files = fs.readdirSync(JSON_DIR).filter((f) => f.endsWith('.json'))
  const maisRecentePorSpec = {}

  for (const f of files) {
    const full = path.join(JSON_DIR, f)
    const data = JSON.parse(fs.readFileSync(full, 'utf8'))
    const specFile = data.results?.[0]?.file || 'desconhecido'
    const mtime = fs.statSync(full).mtimeMs
    if (!maisRecentePorSpec[specFile] || mtime > maisRecentePorSpec[specFile].mtime) {
      maisRecentePorSpec[specFile] = { path: full, mtime }
    }
  }

  const manter = new Set(Object.values(maisRecentePorSpec).map((v) => v.path))
  let removidos = 0
  for (const f of files) {
    const full = path.join(JSON_DIR, f)
    if (!manter.has(full)) {
      fs.unlinkSync(full)
      removidos++
    }
  }
  console.log(`Deduplicação: ${removidos} JSON(s) antigo(s) removido(s), ${manter.size} mantido(s).`)
  return [...manter]
}

// ── 2. Filtrar por spec (opcional) ──────────────────────────────────────────
function filtrarPorSpec(caminhos, filtro) {
  if (!filtro) return caminhos
  const filtrados = caminhos.filter((p) => {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'))
    return (data.results?.[0]?.file || '').includes(filtro)
  })
  if (filtrados.length === 0) {
    throw new Error(`Nenhum JSON encontrado contendo "${filtro}" no caminho do spec.`)
  }
  return filtrados
}

// ── 3. Merge + geração de HTML/PDF/PNG ──────────────────────────────────────
function gerar() {
  const todos = dedupJsons()
  const alvo = filtrarPorSpec(todos, specFilter)

  // Sufixo usado no nome do arquivo precisa ser seguro em qualquer SO — o
  // filtro pode conter separadores de caminho (ex.: "--ui" passa "\ui\" no
  // Windows), que não podem aparecer em nome de arquivo/pasta.
  const sufixo = specFilter ? `-${specFilter.replace(/[\\/]/g, '')}` : '-consolidado'
  const mergedPath = path.join(REPORT_DIR, `merged${sufixo}.json`)
  const htmlName = `relatorio${sufixo}`

  // mochawesome-merge trata os caminhos como glob pattern; no Windows a
  // barra invertida quebra o casamento, então normalizamos para "/".
  const alvoGlob = alvo.map((p) => p.replace(/\\/g, '/'))
  execSync(
    `npx mochawesome-merge ${alvoGlob.map((p) => `"${p}"`).join(' ')} > "${mergedPath}"`,
    { stdio: 'inherit', shell: true }
  )

  execSync(
    `npx marge "${mergedPath}" --reportDir "${REPORT_DIR}" --reportFilename "${htmlName}" ` +
      `--reportTitle "Relatorio de Testes - SME SIGLA ALVO" --reportPageTitle "Relatorio de Testes" --inline --charts`,
    { stdio: 'inherit', shell: true }
  )

  const htmlPath = path.resolve(REPORT_DIR, `${htmlName}.html`)
  const pdfPath = path.resolve(REPORT_DIR, `${htmlName}.pdf`)
  const pngPath = path.resolve(REPORT_DIR, `evidencia-completa${sufixo}.png`)

  const chrome = localizarChrome()
  if (chrome) {
    execSync(
      `"${chrome}" --headless --disable-gpu --print-to-pdf="${pdfPath}" --print-to-pdf-no-header ` +
        `--virtual-time-budget=5000 "file:///${htmlPath.replace(/\\/g, '/')}"`,
      { stdio: 'inherit' }
    )
    execSync(
      `"${chrome}" --headless --disable-gpu --window-size=1600,11000 --virtual-time-budget=5000 ` +
        `--screenshot="${pngPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`,
      { stdio: 'inherit' }
    )
    console.log(`\nGerados:\n  ${htmlPath}\n  ${pdfPath}\n  ${pngPath}`)
  } else {
    console.log(`\nChrome/Edge não encontrado — gerado apenas:\n  ${htmlPath}`)
    console.log('Instale Chrome ou Edge para habilitar geração automática de PDF/PNG.')
  }
}

function localizarChrome() {
  const candidatos = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ]
  return candidatos.find((c) => fs.existsSync(c)) || null
}

gerar()
