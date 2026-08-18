#!/usr/bin/env node
// Gera um dashboard HTML único e autocontido (sem CDN, sem internet) a partir
// dos JSONs brutos por spec do cypress-mochawesome-reporter (cypress/reports/
// mochawesome/.jsons). Não depende do merge automático do reporter (hook
// after:run dele) — lê os arquivos brutos diretamente, então funciona mesmo
// que a suíte tenha sido interrompida no meio ou rodada spec a spec.
//
// Layout/paleta seguem o mesmo padrão já usado no dashboard do projeto irmão
// SME-SIGNA-FrontEnd (ver .github/prompts/dashboard-pos-execucao.md — seção
// "Padrão de design a seguir"): header.topo -> section.resumo (donuts +
// stats) -> filtros -> main com um article.card por feature.
//
// Extensão não coberta pelo padrão original: cenários "pending" (ex.: passo
// ainda não implementado) ganham um badge amber próprio (#F9A825) e um card
// de stat "Pendentes", mas ficam fora do cálculo de "cenarios executados" e
// do % de sucesso — só passou/falhou contam como "executado".
//
// Uso:
//   node scripts/gerar-dashboard.js                  → versão completa, com
//     screenshots de falha embutidos em base64 (uso local/debug)
//   node scripts/gerar-dashboard.js --sem-screenshots → versão enxuta, sem
//     as evidências embutidas — é essa a pensada para subir ao repositório
//     via commit manual (ver .gitignore: só este arquivo é liberado dentro
//     de cypress/reports/, o resto continua ignorado). Rodar antes de dar
//     "git add" para não acumular espaço no histórico com base64 de imagem.
//
// Saída: cypress/reports/mochawesome/dashboard.html

const fs = require('fs')
const path = require('path')

const REPORT_DIR = path.join('cypress', 'reports', 'mochawesome')
const JSON_DIR = path.join(REPORT_DIR, '.jsons')
const SCREENSHOTS_DIR = 'cypress/screenshots'
const OUT_PATH = path.join(REPORT_DIR, 'dashboard.html')

const COR_PASSOU = '#2E7D32'
const COR_FALHOU = '#C62828'
const COR_PENDENTE = '#F9A825'
const COR_TAG = { ui: '#274D9B', api: '#8B5E3C', outros: '#555' }

function tipoSuite(specFile) {
  const normalizado = specFile.replace(/\\/g, '/')
  if (normalizado.includes('/e2e/api/')) return 'api'
  if (normalizado.includes('/e2e/ui/')) return 'ui'
  return 'outros'
}

function caminhoEspecRelativo(specFile) {
  return specFile.replace(/\\/g, '/').replace(/^.*\/e2e\//, '')
}

// Um mesmo spec pode ter sido rodado mais de uma vez (reruns, retomadas);
// mantém só o JSON bruto mais recente por spec.
function coletarJsonsMaisRecentesPorSpec() {
  if (!fs.existsSync(JSON_DIR)) {
    throw new Error(`Pasta ${JSON_DIR} não existe — rode a suíte com cypress run antes.`)
  }
  const arquivos = fs.readdirSync(JSON_DIR).filter((f) => f.endsWith('.json'))
  const maisRecentePorSpec = {}

  for (const f of arquivos) {
    const full = path.join(JSON_DIR, f)
    let dado
    try {
      dado = JSON.parse(fs.readFileSync(full, 'utf8'))
    } catch (e) {
      // Arquivo pode estar sendo escrito no exato momento (execução em
      // andamento) — pula e segue com os demais em vez de derrubar tudo.
      console.warn(`Aviso: ignorando ${f} (JSON inválido/incompleto): ${e.message}`)
      continue
    }
    const specFile = dado.results?.[0]?.file
    if (!specFile) continue
    const mtime = fs.statSync(full).mtimeMs
    if (!maisRecentePorSpec[specFile] || mtime > maisRecentePorSpec[specFile].mtime) {
      maisRecentePorSpec[specFile] = { mtime, dado }
    }
  }
  return Object.values(maisRecentePorSpec).map((v) => v.dado)
}

function lerScreenshotBase64(caminhoRelativo) {
  const relativo = caminhoRelativo.replace(/^\\|^\//, '')
  const absoluto = path.join(SCREENSHOTS_DIR, relativo)
  try {
    const buffer = fs.readFileSync(absoluto)
    return { nome: path.basename(absoluto), src: `data:image/png;base64,${buffer.toString('base64')}` }
  } catch (e) {
    // Screenshot pode ter sido limpo/sobrescrito entre a execução e a
    // geração do dashboard — não é motivo para falhar a geração inteira.
    console.warn(`Aviso: screenshot não encontrado (${absoluto}): ${e.message}`)
    return null
  }
}

function extrairScreenshots(test) {
  if (!test.context) return []
  let contexto
  try {
    contexto = JSON.parse(test.context)
  } catch (e) {
    return []
  }
  const entrada = contexto.find((c) => c.title === 'cypress-mochawesome-reporter-screenshots')
  if (!entrada || !Array.isArray(entrada.value)) return []
  return entrada.value
    .map((par) => par[0])
    .filter(Boolean)
    .map(lerScreenshotBase64)
    .filter(Boolean)
}

// Agrega os JSONs brutos em uma lista de features (agrupadas por tipo de
// suíte + nome legível da Feature), cada uma com seus cenários e evidências.
function montarFeatures(jsonsBrutos, semScreenshots) {
  const features = []

  for (const dado of jsonsBrutos) {
    const resultado = dado.results?.[0]
    if (!resultado) continue
    const tipo = tipoSuite(resultado.file || '')
    const caminho = caminhoEspecRelativo(resultado.file || '')

    for (const suite of resultado.suites || []) {
      const cenarios = (suite.tests || []).map((t) => ({
        titulo: t.title,
        estado: t.state || (t.pending ? 'pending' : 'failed'),
        screenshots: t.state === 'failed' && !semScreenshots ? extrairScreenshots(t) : [],
      }))
      if (cenarios.length === 0) continue

      const passou = cenarios.filter((c) => c.estado === 'passed').length
      const falhou = cenarios.filter((c) => c.estado === 'failed').length
      const pendente = cenarios.filter((c) => c.estado === 'pending').length

      features.push({
        tipo,
        nome: suite.title || resultado.file,
        caminho,
        cenarios,
        passou,
        falhou,
        pendente,
      })
    }
  }

  // Segue a mesma convenção observada no dashboard do SIGNA: cards
  // agrupados por tipo de suíte em ordem alfabética da pasta (api antes de
  // ui), mantendo a ordem original dentro de cada grupo.
  return features.sort((a, b) => a.tipo.localeCompare(b.tipo))
}

function somarTotais(features) {
  return features.reduce(
    (acc, f) => ({
      passou: acc.passou + f.passou,
      falhou: acc.falhou + f.falhou,
      pendente: acc.pendente + f.pendente,
    }),
    { passou: 0, falhou: 0, pendente: 0 }
  )
}

// % de sucesso considera só cenários executados (passou/falhou) — pendente
// (passo ainda não implementado, por exemplo) não é "executado".
function pctSucesso(passou, falhou) {
  const executados = passou + falhou
  return executados === 0 ? 0 : Math.round((passou / executados) * 100)
}

function donutSvg(passou, falhou, rotulo) {
  const cx = 60, cy = 60, r = 50, larguraTraco = 16
  const circunferencia = 2 * Math.PI * r
  const executados = passou + falhou
  const pct = pctSucesso(passou, falhou)

  if (executados === 0) {
    return `<div class="donut-wrap"><svg width="120" height="120" viewBox="0 0 120 120" class="donut">
    <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="#2a2a2a" stroke-width="${larguraTraco}" />
    <text x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" class="donut-label" text-anchor="middle" dominant-baseline="central">${pct}%</text>
    </svg><span>${rotulo}</span></div>`
  }

  const comprimentoPassou = (passou / executados) * circunferencia
  const comprimentoFalhou = (falhou / executados) * circunferencia

  return `<div class="donut-wrap"><svg width="120" height="120" viewBox="0 0 120 120" class="donut">
    <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="#2a2a2a" stroke-width="${larguraTraco}" />
    <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="${COR_PASSOU}" stroke-width="${larguraTraco}" stroke-dasharray="${comprimentoPassou.toFixed(2)} ${circunferencia.toFixed(2)}" stroke-dashoffset="-0.00" transform="rotate(-90 ${cx.toFixed(1)} ${cy.toFixed(1)})" /><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="${COR_FALHOU}" stroke-width="${larguraTraco}" stroke-dasharray="${comprimentoFalhou.toFixed(2)} ${circunferencia.toFixed(2)}" stroke-dashoffset="-${comprimentoPassou.toFixed(2)}" transform="rotate(-90 ${cx.toFixed(1)} ${cy.toFixed(1)})" />
    <text x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" class="donut-label" text-anchor="middle" dominant-baseline="central">${pct}%</text>
    </svg><span>${rotulo}</span></div>`
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

const ROTULO_TIPO = { ui: 'UI', api: 'API', outros: 'OUTROS' }
const BADGE_ESTADO = {
  passed: { texto: 'Passou', cor: COR_PASSOU },
  failed: { texto: 'Falhou', cor: COR_FALHOU },
  pending: { texto: 'Pendente', cor: COR_PENDENTE },
}

function renderizarCard(f, indice, semScreenshots) {
  const executados = f.passou + f.falhou
  const pct = pctSucesso(f.passou, f.falhou)
  const corBarra = pct === 100 ? COR_PASSOU : COR_FALHOU
  const tipoLabel = ROTULO_TIPO[f.tipo] || f.tipo.toUpperCase()

  const itensLista = f.cenarios
    .map((c) => {
      const badge = BADGE_ESTADO[c.estado] || BADGE_ESTADO.pending
      return `<li><span class="badge" style="background:${badge.cor}">${badge.texto}</span>${escapeHtml(c.titulo)}</li>`
    })
    .join('\n')

  const todasEvidencias = f.cenarios.flatMap((c) => c.screenshots)
  const evidenciasHtml = todasEvidencias.length
    ? `<div class="evidencias">${todasEvidencias
        .map((ev) => `<figure><img src="${ev.src}"><figcaption>${escapeHtml(ev.nome)}</figcaption></figure>`)
        .join('')}</div>`
    : semScreenshots && f.falhou > 0
    ? `<p class="sem-evidencia">Evidencias nao incluidas nesta versao (gerada com --sem-screenshots). Rode "npm run dashboard" localmente para visualizar.</p>`
    : `<p class="sem-evidencia">Sem evidencia de falha para a execucao mais recente.</p>`

  return `    <article class="card" id="feature-${indice}">
      <header class="card-header" onclick="toggle(${indice})">
        <div>
          <span class="tag tag-${f.tipo}">${tipoLabel}</span>
          <strong>${escapeHtml(f.nome)}</strong>
          <span class="spec-path">${escapeHtml(f.caminho)}</span>
        </div>
        <div class="card-resumo">
          <span>${f.passou}/${executados} cenarios${f.pendente ? ` (+${f.pendente} pendente${f.pendente > 1 ? 's' : ''})` : ''}</span>
          <div class="barra-fundo"><div class="barra-preenchida" style="width:${pct}%;background:${corBarra}"></div></div>
          <span class="pct">${pct}%</span>
        </div>
      </header>
      <div class="card-body" id="body-${indice}">
        <ul class="lista-cenarios">${itensLista}</ul>
        <h4>Evidencias</h4>
        ${evidenciasHtml}
      </div>
    </article>`
}

function renderizarHtml(features, semScreenshots) {
  const totaisGerais = somarTotais(features)
  const pctGeral = pctSucesso(totaisGerais.passou, totaisGerais.falhou)
  const executadosGerais = totaisGerais.passou + totaisGerais.falhou

  const porTipo = {}
  for (const f of features) {
    if (!porTipo[f.tipo]) porTipo[f.tipo] = []
    porTipo[f.tipo].push(f)
  }
  const tiposPresentes = Object.keys(porTipo)
  // Donuts/filtros seguem a ordem UI, API, outros; os cards no <main> seguem
  // a ordem alfabética do tipo (api antes de ui), replicando o dashboard do
  // SIGNA (ver montarFeatures).
  const ordemDonuts = ['ui', 'api', 'outros'].filter((t) => porTipo[t])

  const agora = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const dataFormatada = `${pad(agora.getDate())}/${pad(agora.getMonth() + 1)}/${agora.getFullYear()} ${pad(agora.getHours())}:${pad(agora.getMinutes())}`
  const contagemPorTipo = ordemDonuts.map((t) => `${porTipo[t].length} ${ROTULO_TIPO[t]}`).join(' / ')

  const donutsHtml = [donutSvg(totaisGerais.passou, totaisGerais.falhou, 'Geral')]
    .concat(ordemDonuts.map((t) => donutSvg(somarTotais(porTipo[t]).passou, somarTotais(porTipo[t]).falhou, ROTULO_TIPO[t])))
    .join('\n    ')

  const statsHtml = `
    <div class="stat"><div class="valor">${pctGeral}%</div><div class="rotulo">Sucesso geral</div></div>
    <div class="stat"><div class="valor">${executadosGerais}</div><div class="rotulo">Cenarios executados</div></div>
    <div class="stat"><div class="valor">${totaisGerais.passou}</div><div class="rotulo">Passaram</div></div>
    <div class="stat"><div class="valor">${totaisGerais.falhou}</div><div class="rotulo">Falharam</div></div>
    ${totaisGerais.pendente ? `<div class="stat"><div class="valor">${totaisGerais.pendente}</div><div class="rotulo">Pendentes</div></div>` : ''}`

  const filtrosHtml = `<button data-filtro="todos" class="ativo" onclick="filtrar('todos')">Todas (${features.length})</button>` +
    ordemDonuts.map((t) => `<button data-filtro="${ROTULO_TIPO[t]}" onclick="filtrar('${ROTULO_TIPO[t]}')">${ROTULO_TIPO[t]} (${porTipo[t].length})</button>`).join('')

  const cardsHtml = features.map((f, i) => renderizarCard(f, i, semScreenshots)).join('\n\n')

  return `<!doctype html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dashboard de Automacao - SIGLA</title>
<style>
:root{color-scheme:dark light}
*{box-sizing:border-box}
body{font-family:system-ui,Segoe UI,Arial,sans-serif;margin:0;background:#121212;color:#e8e8e8}
header.topo{padding:24px 32px;border-bottom:1px solid #2a2a2a;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
h1{margin:0;font-size:22px}
.gerado-em{color:#999;font-size:13px}
.resumo{display:flex;gap:32px;padding:24px 32px;flex-wrap:wrap;align-items:center}
.resumo-cards{display:flex;gap:16px;flex-wrap:wrap}
.stat{background:#1c1c1c;border:1px solid #2a2a2a;border-radius:10px;padding:16px 20px;min-width:140px}
.stat .valor{font-size:26px;font-weight:700}
.stat .rotulo{color:#999;font-size:13px}
.donuts{display:flex;gap:24px;align-items:center}
.donut-wrap{text-align:center}
.donut-wrap span{display:block;font-size:13px;color:#999;margin-top:4px}
.donut-label{fill:#e8e8e8;font-size:20px;font-weight:700}
main{padding:0 32px 48px}
.card{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;margin-bottom:12px;overflow:hidden}
.card-header{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;cursor:pointer;flex-wrap:wrap;gap:12px}
.card-header:hover{background:#222}
.tag{font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;margin-right:8px}
.tag-ui{background:${COR_TAG.ui};color:#fff}
.tag-api{background:${COR_TAG.api};color:#fff}
.tag-outros{background:${COR_TAG.outros};color:#fff}
.spec-path{color:#777;font-size:12px;margin-left:10px}
.card-resumo{display:flex;align-items:center;gap:10px;font-size:13px;color:#ccc}
.barra-fundo{width:120px;height:8px;background:#2a2a2a;border-radius:4px;overflow:hidden}
.barra-preenchida{height:100%}
.pct{font-weight:700;min-width:38px;text-align:right}
.card-body{display:none;padding:0 18px 18px;border-top:1px solid #2a2a2a}
.card-body.aberto{display:block}
.lista-cenarios{list-style:none;padding:0;margin:14px 0}
.lista-cenarios li{padding:6px 0;font-size:14px;display:flex;align-items:center;gap:10px}
.badge{font-size:11px;font-weight:700;color:#fff;padding:2px 8px;border-radius:20px;min-width:56px;text-align:center}
.evidencias{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px}
.evidencias figure{margin:0;width:220px}
.evidencias img{width:100%;border-radius:6px;border:1px solid #2a2a2a;cursor:zoom-in}
.evidencias figcaption{font-size:11px;color:#888;margin-top:4px;word-break:break-word}
.sem-evidencia{color:#666;font-size:13px;font-style:italic}
.filtros{padding:0 32px 16px;display:flex;gap:10px}
.filtros button{background:#1c1c1c;border:1px solid #2a2a2a;color:#ccc;padding:8px 16px;border-radius:20px;cursor:pointer;font-size:13px}
.filtros button.ativo{background:${COR_TAG.ui};border-color:${COR_TAG.ui};color:#fff}
@media (prefers-color-scheme: light){
  body{background:#f5f5f5;color:#222}
  header.topo,.stat,.card,.filtros button{background:#fff;border-color:#ddd}
  .card-header:hover{background:#f0f0f0}
  .donut-label{fill:#222}
}
</style>
</head>
<body>
<header class="topo">
  <h1>Dashboard de Automacao - SIGLA</h1>
  <span class="gerado-em">Gerado em ${dataFormatada} - ${features.length} features (${contagemPorTipo})${semScreenshots ? ' - versao sem screenshots' : ''}</span>
</header>

<section class="resumo">
  <div class="donuts">
    ${donutsHtml}
  </div>
  <div class="resumo-cards">${statsHtml}
  </div>
</section>

<div class="filtros">
  ${filtrosHtml}
</div>

<main>

${cardsHtml}

</main>

<script>
function toggle(i){
  document.getElementById('body-' + i).classList.toggle('aberto');
}
function filtrar(sistema){
  document.querySelectorAll('.card').forEach(function(card){
    var mostra = sistema === 'todos' || card.querySelector('.tag').textContent === sistema;
    card.style.display = mostra ? '' : 'none';
  });
  document.querySelectorAll('.filtros button').forEach(function(b){
    b.classList.toggle('ativo', b.dataset.filtro === sistema);
  });
}
</script>
</body>
</html>`
}

function gerar(opts = {}) {
  const semScreenshots = Boolean(opts.semScreenshots)
  const jsonsBrutos = coletarJsonsMaisRecentesPorSpec()
  if (jsonsBrutos.length === 0) {
    console.warn('Aviso: nenhum JSON bruto válido encontrado em ' + JSON_DIR + ' — dashboard não gerado.')
    return
  }
  const features = montarFeatures(jsonsBrutos, semScreenshots)
  const html = renderizarHtml(features, semScreenshots)
  fs.mkdirSync(REPORT_DIR, { recursive: true })
  fs.writeFileSync(OUT_PATH, html, 'utf8')
  console.log(`Dashboard gerado: ${path.resolve(OUT_PATH)}${semScreenshots ? ' (sem screenshots)' : ''}`)
}

if (require.main === module) {
  gerar({ semScreenshots: process.argv.includes('--sem-screenshots') })
}

module.exports = { gerar }
