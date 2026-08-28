#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera um dashboard HTML unico e autocontido (sem CDN, sem internet) a partir
dos JSONs brutos por spec do cypress-mochawesome-reporter (cypress/reports/
mochawesome/.jsons). Nao depende do merge automatico do reporter -- le os
arquivos brutos diretamente, entao funciona mesmo que a suite tenha sido
interrompida no meio ou rodada spec a spec.

Escrito em Python (stdlib apenas), conforme o prompt-fonte
(dashboard-pos-execucao.md): comparacao com a execucao anterior (badge),
grafico de tendencia lendo o historico de commits do proprio dashboard.html
versionado, filtro por status combinado (AND) com o filtro de sistema, e
vinculo opcional com PR via API publica do GitHub.

Uso:
  python scripts/gerar_dashboard.py                  -> versao completa, com
    screenshots de falha embutidos em base64 (uso local/debug)
  python scripts/gerar_dashboard.py --sem-screenshots -> versao enxuta, sem
    evidencias embutidas -- e essa a pensada para subir ao repositorio via
    commit manual (ver .gitignore: so este arquivo e liberado dentro de
    cypress/reports/, o resto continua ignorado). Rodar antes do "git add"
    para nao acumular espaco no historico com base64 de imagem.

Saida: cypress/reports/mochawesome/dashboard.html
"""

import base64
import hashlib
import json
import math
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

REPORT_DIR = Path('cypress') / 'reports' / 'mochawesome'
JSON_DIR = REPORT_DIR / '.jsons'
SCREENSHOTS_DIR = Path('cypress') / 'screenshots'
OUT_PATH = REPORT_DIR / 'dashboard.html'
CONFIG_PATH = Path('dashboard.config.json')

# Rastreabilidade: exibida no rodape do HTML e gravada no snapshot embutido --
# incrementar a cada mudanca relevante no gerador.
VERSAO_SCRIPT = '1.1.0'

# Parametrizacao por projeto (titulo/branding do cabecalho). O script sempre
# funciona mesmo sem dashboard.config.json ou com JSON corrompido -- cai
# neste padrao em vez de quebrar a geracao.
CONFIG_PADRAO = {
    'titulo': 'Dashboard de Automacao - SIGLA',
    'projeto': 'SME SIGLA ALVO',
}


def carregar_config():
    try:
        dado = json.loads(CONFIG_PATH.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError):
        return dict(CONFIG_PADRAO)
    config = dict(CONFIG_PADRAO)
    if isinstance(dado, dict):
        config.update(dado)
    return config

COR_PASSOU = '#2E7D32'
COR_FALHOU = '#C62828'
COR_PENDENTE = '#F9A825'
COR_TAG = {'ui': '#274D9B', 'api': '#8B5E3C', 'outros': '#555'}
ROTULO_TIPO = {'ui': 'UI', 'api': 'API', 'outros': 'OUTROS'}
BADGE_ESTADO = {
    'passed': {'texto': 'Passou', 'cor': COR_PASSOU},
    'failed': {'texto': 'Falhou', 'cor': COR_FALHOU},
    'pending': {'texto': 'Pendente', 'cor': COR_PENDENTE},
}

PADRAO_SNAPSHOT = re.compile(
    r'<script type="application/json" id="dashboard-snapshot">(.*?)</script>', re.S
)
_ESCAPES = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}


def escape_html(s):
    return re.sub(r'[&<>"\']', lambda m: _ESCAPES[m.group(0)], str(s))


# Duracao vem em ms no proprio JSON bruto do reporter (campo "duration" de
# cada teste) -- nao precisa medir na mao, so formatar.
def formatar_duracao(duracao_ms):
    total_seg = round((duracao_ms or 0) / 1000)
    if total_seg < 60:
        return f'{total_seg}s'
    minutos, segundos = divmod(total_seg, 60)
    return f'{minutos}m {segundos}s'


TAMANHO_MAX_ERRO = 300


def truncar_erro(mensagem):
    if not mensagem:
        return None
    mensagem = str(mensagem).strip()
    if len(mensagem) > TAMANHO_MAX_ERRO:
        mensagem = mensagem[:TAMANHO_MAX_ERRO] + '...'
    return mensagem


def tipo_suite(spec_file):
    normalizado = (spec_file or '').replace('\\', '/')
    if '/e2e/api/' in normalizado:
        return 'api'
    if '/e2e/ui/' in normalizado:
        return 'ui'
    return 'outros'


def caminho_especifico_relativo(spec_file):
    normalizado = (spec_file or '').replace('\\', '/')
    return re.sub(r'^.*/e2e/', '', normalizado)


# Um mesmo spec pode ter sido rodado mais de uma vez (reruns, retomadas);
# mantem so o JSON bruto mais recente por spec.
def coletar_jsons_mais_recentes_por_spec(arquivos_json):
    mais_recente_por_spec = {}
    for caminho in arquivos_json:
        try:
            dado = json.loads(caminho.read_text(encoding='utf-8'))
        except (json.JSONDecodeError, OSError) as e:
            # Arquivo pode estar sendo escrito no exato momento (execucao em
            # andamento) -- pula e segue com os demais em vez de derrubar tudo.
            print(f'Aviso: ignorando {caminho.name} (JSON invalido/incompleto): {e}', file=sys.stderr)
            continue
        resultados = dado.get('results') or []
        # Specs sem nenhum teste registrado (0 suites) gravam "results": [false]
        # em vez de um objeto -- descarta antes de acessar .get().
        primeiro = resultados[0] if resultados and isinstance(resultados[0], dict) else None
        spec_file = primeiro.get('file') if primeiro else None
        if not spec_file:
            continue
        mtime = caminho.stat().st_mtime
        existente = mais_recente_por_spec.get(spec_file)
        if existente is None or mtime > existente[0]:
            mais_recente_por_spec[spec_file] = (mtime, dado)
    return [v[1] for v in mais_recente_por_spec.values()]


# Hash barato (nome + horario de modificacao, sem ler conteudo) usado para
# detectar regeneracao redundante -- ver decidir_bases_comparacao().
def calcular_hash_relatorios(arquivos_json):
    partes = sorted(f'{p.name}:{int(p.stat().st_mtime * 1000)}' for p in arquivos_json)
    return hashlib.sha256('|'.join(partes).encode('utf-8')).hexdigest()


# Mantem so os N relatorios brutos mais recentes POR SPEC em .jsons/ (retencao
# padrao: 3) -- sem isso a pasta cresce sem limite a cada execucao (cada
# rerun de uma feature grava um JSON novo, os antigos nunca eram removidos).
# Isso NAO alimenta a comparacao "anterior vs atual" do dashboard (essa usa o
# snapshot embutido no dashboard.html anterior, ver extrair_snapshot_anterior)
# -- e so uma trilha curta dos relatorios brutos por spec, para inspecao
# manual quando preciso. Roda DEPOIS do dashboard ser escrito com sucesso,
# para nunca apagar dado antes de confirmar que a geracao deu certo.
RETENCAO_JSONS_POR_SPEC = 3


def podar_jsons_antigos(arquivos_json, manter=RETENCAO_JSONS_POR_SPEC):
    por_spec = {}
    for caminho in arquivos_json:
        try:
            dado = json.loads(caminho.read_text(encoding='utf-8'))
        except (json.JSONDecodeError, OSError):
            continue
        resultados = dado.get('results') or []
        primeiro = resultados[0] if resultados and isinstance(resultados[0], dict) else None
        spec_file = primeiro.get('file') if primeiro else None
        if not spec_file:
            continue
        por_spec.setdefault(spec_file, []).append(caminho)

    removidos = 0
    for spec_file, caminhos in por_spec.items():
        caminhos.sort(key=lambda p: p.stat().st_mtime, reverse=True)
        for antigo in caminhos[manter:]:
            try:
                antigo.unlink()
                removidos += 1
            except OSError as e:
                print(f'Aviso: nao foi possivel remover {antigo.name}: {e}', file=sys.stderr)

    if removidos:
        print(f'Retencao: removidos {removidos} relatorio(s) bruto(s) antigo(s) '
              f'(mantendo os {manter} mais recentes por spec).')


def extrair_snapshot_anterior(caminho_saida):
    if not caminho_saida.exists():
        return None
    try:
        conteudo = caminho_saida.read_text(encoding='utf-8')
    except OSError:
        return None
    m = PADRAO_SNAPSHOT.search(conteudo)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return None


def ler_screenshot_base64(caminho_relativo):
    absoluto = SCREENSHOTS_DIR / caminho_relativo
    try:
        dados = absoluto.read_bytes()
        return f'data:image/png;base64,{base64.b64encode(dados).decode("ascii")}'
    except OSError as e:
        # Screenshot pode ter sido limpo/sobrescrito entre a execucao e a
        # geracao do dashboard -- nao e motivo para falhar a geracao inteira.
        print(f'Aviso: screenshot nao encontrado ({absoluto}): {e}', file=sys.stderr)
        return None


def extrair_screenshots(teste, sem_screenshots):
    contexto_raw = teste.get('context')
    if not contexto_raw:
        return []
    try:
        contexto = json.loads(contexto_raw)
    except json.JSONDecodeError:
        return []
    entrada = next((c for c in contexto if c.get('title') == 'cypress-mochawesome-reporter-screenshots'), None)
    if not entrada or not isinstance(entrada.get('value'), list):
        return []
    resultado = []
    for par in entrada['value']:
        if not par or not par[0]:
            continue
        caminho_relativo = str(par[0]).lstrip('\\/').replace('\\', '/')
        nome = Path(caminho_relativo).name
        if sem_screenshots:
            # Saida versionada: NAO embute base64 (evita inflar o historico
            # do Git) -- so guarda nome/caminho para listar no HTML.
            resultado.append({'nome': nome, 'caminho': caminho_relativo, 'src': None})
        else:
            src = ler_screenshot_base64(caminho_relativo)
            if src:
                resultado.append({'nome': nome, 'caminho': caminho_relativo, 'src': src})
    return resultado


# Agrega os JSONs brutos em uma lista de features (agrupadas por tipo de
# suite + nome legivel da Feature), cada uma com seus cenarios e evidencias.
def montar_features(jsons_brutos, sem_screenshots):
    features = []
    for dado in jsons_brutos:
        resultados = dado.get('results') or []
        if not resultados:
            continue
        resultado = resultados[0]
        tipo = tipo_suite(resultado.get('file', ''))
        caminho = caminho_especifico_relativo(resultado.get('file', ''))

        for suite in resultado.get('suites') or []:
            cenarios = []
            for t in suite.get('tests') or []:
                estado = t.get('state') or ('pending' if t.get('pending') else 'failed')
                screenshots = extrair_screenshots(t, sem_screenshots) if estado == 'failed' else []
                erro_msg = truncar_erro((t.get('err') or {}).get('message')) if estado == 'failed' else None
                cenarios.append({
                    'titulo': t.get('title'),
                    'estado': estado,
                    'screenshots': screenshots,
                    'duracao_ms': t.get('duration') or 0,
                    'erro_msg': erro_msg,
                })
            if not cenarios:
                continue

            passou = sum(1 for c in cenarios if c['estado'] == 'passed')
            falhou = sum(1 for c in cenarios if c['estado'] == 'failed')
            pendente = sum(1 for c in cenarios if c['estado'] == 'pending')
            duracao_ms = sum(c['duracao_ms'] for c in cenarios)

            features.append({
                'tipo': tipo,
                'nome': suite.get('title') or resultado.get('file'),
                'caminho': caminho,
                'cenarios': cenarios,
                'passou': passou,
                'falhou': falhou,
                'pendente': pendente,
                'duracao_ms': duracao_ms,
            })

    # Segue a mesma convencao observada no dashboard anterior: cards
    # agrupados por tipo de suite em ordem alfabetica (api antes de ui),
    # mantendo a ordem original dentro de cada grupo.
    features.sort(key=lambda f: f['tipo'])
    return features


def somar_totais(features):
    return {
        'passou': sum(f['passou'] for f in features),
        'falhou': sum(f['falhou'] for f in features),
        'pendente': sum(f['pendente'] for f in features),
    }


# % de sucesso considera so cenarios executados (passou/falhou) -- pendente
# (passo ainda nao implementado, por exemplo) nao e "executado".
def pct_sucesso(passou, falhou):
    executados = passou + falhou
    return round((passou / executados) * 100) if executados else 0


def construir_snapshot_atual(features, totais_gerais, por_tipo_totais):
    def stats(p, f):
        return {'passou': p, 'falhou': f, 'pct': pct_sucesso(p, f)}

    snapshot = {
        'geral': stats(totais_gerais['passou'], totais_gerais['falhou']),
        'por_tipo': {t: stats(v['passou'], v['falhou']) for t, v in por_tipo_totais.items()},
        'por_feature': {},
    }
    for f in features:
        chave = f"{f['tipo']}|{f['caminho']}|{f['nome']}"
        snapshot['por_feature'][chave] = stats(f['passou'], f['falhou'])
    return snapshot


# Trava contra regeneracao redundante: rodar o script de novo sem ter havido
# execucao de teste nova nao pode "consumir" silenciosamente a comparacao
# real ainda nao vista/commitada. Se o hash dos relatorios brutos nao mudou
# desde a ultima geracao, reaproveita a mesma base de comparacao de antes.
def decidir_base_comparacao(snapshot_antigo, hash_novo):
    if snapshot_antigo is None:
        return None
    if snapshot_antigo.get('hash_relatorios') == hash_novo:
        return snapshot_antigo.get('anterior')
    return snapshot_antigo.get('atual')


def donut_svg(passou, falhou, rotulo):
    cx = cy = 60.0
    r = 50.0
    largura_traco = 16
    circunferencia = 2 * math.pi * r
    executados = passou + falhou
    pct = pct_sucesso(passou, falhou)

    if executados == 0:
        return (
            f'<div class="donut-wrap"><svg width="120" height="120" viewBox="0 0 120 120" class="donut">'
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="none" stroke="#2a2a2a" stroke-width="{largura_traco}" />'
            f'<text x="{cx:.1f}" y="{cy:.1f}" class="donut-label" text-anchor="middle" dominant-baseline="central">{pct}%</text>'
            f'</svg><span>{rotulo}</span></div>'
        )

    comp_passou = (passou / executados) * circunferencia
    comp_falhou = (falhou / executados) * circunferencia
    return (
        f'<div class="donut-wrap"><svg width="120" height="120" viewBox="0 0 120 120" class="donut">'
        f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="none" stroke="#2a2a2a" stroke-width="{largura_traco}" />'
        f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="none" stroke="{COR_PASSOU}" stroke-width="{largura_traco}" '
        f'stroke-dasharray="{comp_passou:.2f} {circunferencia:.2f}" stroke-dashoffset="-0.00" transform="rotate(-90 {cx:.1f} {cy:.1f})" />'
        f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="none" stroke="{COR_FALHOU}" stroke-width="{largura_traco}" '
        f'stroke-dasharray="{comp_falhou:.2f} {circunferencia:.2f}" stroke-dashoffset="-{comp_passou:.2f}" transform="rotate(-90 {cx:.1f} {cy:.1f})" />'
        f'<text x="{cx:.1f}" y="{cy:.1f}" class="donut-label" text-anchor="middle" dominant-baseline="central">{pct}%</text>'
        f'</svg><span>{rotulo}</span></div>'
    )


# Badge global (linha de filtros): sempre visivel quando ha base de
# comparacao, incluindo o caso "sem mudanca" (cinza) -- so some quando o
# grafico de tendencia assume o lugar dele (ver renderizar_html).
def badge_comparacao_geral(pct_atual, pct_anterior, total_atual, total_anterior):
    delta = pct_atual - pct_anterior
    if delta > 0:
        seta, cor = '▲', COR_PASSOU
    elif delta < 0:
        seta, cor = '▼', COR_FALHOU
    else:
        seta, cor = '=', '#999'
    titulo = f'Execucao anterior: {pct_anterior}% ({total_anterior} cenarios) -> atual: {pct_atual}% ({total_atual} cenarios)'
    return (
        f'<span class="comparacao" title="{escape_html(titulo)}" '
        f'style="color:{cor};border-color:{cor}">{seta} {abs(round(delta))}%</span>'
    )


# Badge por feature: mais discreto, e some (nao mostra "=") quando a feature
# e nova ou a diferenca e insignificante (arredonda para 0 ponto percentual).
def badge_comparacao_feature(pct_atual, pct_anterior):
    if pct_anterior is None:
        return ''
    delta = pct_atual - pct_anterior
    if round(delta) == 0:
        return ''
    seta, cor = ('▲', COR_PASSOU) if delta > 0 else ('▼', COR_FALHOU)
    titulo = f'Execucao anterior: {pct_anterior}% -> atual: {pct_atual}%'
    return (
        f' <span class="comparacao comparacao-feature" title="{escape_html(titulo)}" '
        f'style="color:{cor};border-color:{cor}">{seta} {abs(round(delta))}%</span>'
    )


def grafico_tendencia_svg(pontos):
    largura, altura = 480, 130
    margem_esq, margem_dir, margem_topo, margem_baixo = 26, 10, 10, 10
    n = len(pontos)
    plot_w = largura - margem_esq - margem_dir
    plot_h = altura - margem_topo - margem_baixo

    def x_de(i):
        return margem_esq + (plot_w * i / (n - 1) if n > 1 else plot_w / 2)

    def y_de(pct):
        return margem_topo + plot_h * (1 - pct / 100)

    grade = ''.join(
        f'<line x1="{margem_esq}" y1="{y_de(v):.1f}" x2="{largura - margem_dir}" y2="{y_de(v):.1f}" stroke="#333" stroke-dasharray="2 3"/>'
        f'<text x="0" y="{y_de(v) + 3:.1f}" font-size="9" fill="#888">{v}</text>'
        for v in (0, 50, 100)
    )
    pontos_svg = ' '.join(f'{x_de(i):.1f},{y_de(p["pct"]):.1f}' for i, p in enumerate(pontos))
    cor = COR_PASSOU if pontos[-1]['pct'] >= pontos[0]['pct'] else COR_FALHOU
    circulos = ''.join(
        f'<circle cx="{x_de(i):.1f}" cy="{y_de(p["pct"]):.1f}" r="3.5" fill="{cor}">'
        f'<title>{escape_html(p["data"])} - {p["pct"]}% ({p["total"]} cenarios)</title></circle>'
        for i, p in enumerate(pontos)
    )
    return (
        f'<div class="stat tendencia"><svg width="{largura}" height="{altura}" viewBox="0 0 {largura} {altura}">'
        f'{grade}<polyline points="{pontos_svg}" fill="none" stroke="{cor}" stroke-width="2"/>{circulos}</svg>'
        f'<div class="tendencia-legenda">{pontos[0]["pct"]}% → {pontos[-1]["pct"]}%</div></div>'
    )


# Le o historico de commits do proprio dashboard.html versionado para
# reconstruir uma serie temporal real, sem precisar de arquivo/banco
# adicional -- cada commit anterior ja tem o snapshot embutido no seu HTML.
def obter_historico_git(caminho_saida, limite=20):
    caminho_rel = str(caminho_saida).replace('\\', '/')
    try:
        r = subprocess.run(
            ['git', 'log', '--format=%H|%aI', '--follow', '-n', str(limite), '--', caminho_rel],
            capture_output=True, text=True, timeout=15,
        )
    except (OSError, subprocess.SubprocessError):
        return []
    if r.returncode != 0 or not r.stdout.strip():
        return []

    pontos = []
    for linha in r.stdout.strip().splitlines():
        try:
            commit_hash, data_iso = linha.split('|', 1)
        except ValueError:
            continue
        try:
            # cwd do script fica em testes/ui, um subdiretorio da raiz do
            # repo -- "git show <rev>:<caminho>" sem o prefixo "./" resolve
            # relativo a RAIZ do repo e falha com "path exists, but not...".
            conteudo = subprocess.run(
                ['git', 'show', f'{commit_hash}:./{caminho_rel}'],
                capture_output=True, text=True, timeout=15,
            )
        except (OSError, subprocess.SubprocessError):
            continue
        if conteudo.returncode != 0:
            continue
        m = PADRAO_SNAPSHOT.search(conteudo.stdout)
        if not m:
            continue
        try:
            snap = json.loads(m.group(1))
        except json.JSONDecodeError:
            continue
        geral = (snap.get('atual') or {}).get('geral') or {}
        if 'pct' not in geral:
            continue
        pontos.append({
            'data': data_iso,
            'pct': geral['pct'],
            'total': geral.get('passou', 0) + geral.get('falhou', 0),
        })

    pontos.reverse()  # git log vem do mais novo para o mais antigo
    return pontos


def obter_remote_origin():
    try:
        r = subprocess.run(['git', 'remote', 'get-url', 'origin'], capture_output=True, text=True, timeout=5)
    except (OSError, subprocess.SubprocessError):
        return None
    return r.stdout.strip() if r.returncode == 0 else None


def obter_branch_atual():
    try:
        r = subprocess.run(['git', 'branch', '--show-current'], capture_output=True, text=True, timeout=5)
    except (OSError, subprocess.SubprocessError):
        return None
    branch = r.stdout.strip()
    return branch if r.returncode == 0 and branch else None


def parse_owner_repo(url):
    if not url:
        return None
    m = re.search(r'github\.com[:/]+([^/]+)/([^/.]+?)(?:\.git)?/?$', url)
    return (m.group(1), m.group(2)) if m else None


# Vinculo com PR (opcional, GitHub apenas): API REST publica sem
# autenticacao -- so funciona sem token se o repositorio for publico
# (confirmado em prefeiturasp/SME-SIGLA-ALVO-Frontend: GET /repos/... -> 200
# sem header de auth). Qualquer falha (sem internet, sem PR pra branch, repo
# privado) deixa essa secao do dashboard simplesmente ausente.
def obter_info_pr():
    import urllib.request
    import urllib.error

    owner_repo = parse_owner_repo(obter_remote_origin())
    branch = obter_branch_atual()
    if not owner_repo or not branch:
        return None
    owner, repo = owner_repo

    def chamar(url):
        req = urllib.request.Request(
            url, headers={'Accept': 'application/vnd.github+json', 'User-Agent': 'dashboard-sigla-script'}
        )
        with urllib.request.urlopen(req, timeout=6) as resp:
            return json.loads(resp.read().decode('utf-8'))

    try:
        dados = chamar(f'https://api.github.com/repos/{owner}/{repo}/pulls?head={owner}:{branch}&state=all')
    except (urllib.error.URLError, TimeoutError, OSError, json.JSONDecodeError):
        return None
    if not dados:
        return None
    pr = dados[0]

    decisao_revisao = None
    try:
        reviews = chamar(pr['url'] + '/reviews')
        if reviews:
            decisao_revisao = reviews[-1].get('state')
    except (urllib.error.URLError, TimeoutError, OSError, json.JSONDecodeError, KeyError):
        pass

    return {
        'numero': pr.get('number'),
        'titulo': pr.get('title') or '',
        'estado': 'draft' if pr.get('draft') else pr.get('state'),
        'decisao_revisao': decisao_revisao,
        'url': pr.get('html_url') or '',
        'owner': owner,
        'repo': repo,
        'branch': branch,
    }


def pr_badge_html(pr):
    if not pr:
        return ''
    detalhe = pr['estado'] + (f' - {pr["decisao_revisao"]}' if pr['decisao_revisao'] else '')
    texto = f'#{pr["numero"]} {pr["titulo"]} - {detalhe}'
    return (
        f'<div class="pr-container" id="pr-container" data-owner="{escape_html(pr["owner"])}" '
        f'data-repo="{escape_html(pr["repo"])}" data-branch="{escape_html(pr["branch"])}">'
        f'<a class="pr-info" id="pr-info" href="{escape_html(pr["url"])}" target="_blank" rel="noopener">{escape_html(texto)}</a>'
        f'<button class="pr-refresh" onclick="atualizarPR()" title="Atualizar status do PR">&#8635;</button>'
        f'</div>'
    )


def renderizar_card(f, indice, sem_screenshots, anterior_por_feature):
    executados = f['passou'] + f['falhou']
    pct = pct_sucesso(f['passou'], f['falhou'])
    cor_barra = COR_PASSOU if pct == 100 else COR_FALHOU
    tipo_label = ROTULO_TIPO.get(f['tipo'], f['tipo'].upper())

    def renderizar_item_cenario(c):
        badge = BADGE_ESTADO.get(c['estado'], BADGE_ESTADO['pending'])
        erro_html = (
            f'<div class="erro-msg">{escape_html(c["erro_msg"])}</div>' if c.get('erro_msg') else ''
        )
        return (
            f'<li data-estado="{c["estado"]}"><div class="cenario-linha">'
            f'<span class="badge" style="background:{badge["cor"]}">{badge["texto"]}</span>'
            f'{escape_html(c["titulo"])}</div>{erro_html}</li>'
        )

    itens_lista = '\n'.join(renderizar_item_cenario(c) for c in f['cenarios'])

    todas_evidencias = [ev for c in f['cenarios'] for ev in c['screenshots']]
    if todas_evidencias and not sem_screenshots:
        evidencias_html = '<div class="evidencias">' + ''.join(
            f'<figure><img src="{ev["src"]}"><figcaption>{escape_html(ev["nome"])}</figcaption></figure>'
            for ev in todas_evidencias
        ) + '</div>'
    elif todas_evidencias and sem_screenshots:
        itens = ''.join(f'<li>{escape_html(ev["nome"])}</li>' for ev in todas_evidencias)
        evidencias_html = (
            f'<ul class="lista-evidencias">{itens}</ul>'
            f'<p class="sem-evidencia">Evidencias nao embutidas nesta versao (versionada no Git). '
            f'Conferir em cypress/screenshots/{escape_html(f["caminho"])} apos rodar a suite localmente.</p>'
        )
    else:
        evidencias_html = '<p class="sem-evidencia">Sem evidencia de falha para a execucao mais recente.</p>'

    chave = f"{f['tipo']}|{f['caminho']}|{f['nome']}"
    pct_anterior = (anterior_por_feature or {}).get(chave, {}).get('pct')
    badge_feature = badge_comparacao_feature(pct, pct_anterior)

    pendente_txt = ''
    if f['pendente']:
        plural = 's' if f['pendente'] > 1 else ''
        pendente_txt = f' (+{f["pendente"]} pendente{plural})'

    return f'''    <article class="card" id="feature-{indice}" data-indice="{indice}" data-passou="{1 if f['passou'] else 0}" data-falhou="{1 if f['falhou'] else 0}" data-pendente="{1 if f['pendente'] else 0}">
      <header class="card-header" onclick="toggle({indice})">
        <div>
          <span class="tag tag-{f['tipo']}">{tipo_label}</span>
          <strong>{escape_html(f['nome'])}</strong>
          <span class="spec-path">{escape_html(f['caminho'])}</span>
        </div>
        <div class="card-resumo">
          <span>{f['passou']}/{executados} cenarios{pendente_txt}</span>
          <span class="duracao">{formatar_duracao(f['duracao_ms'])}</span>
          <div class="barra-fundo"><div class="barra-preenchida" style="width:{pct}%;background:{cor_barra}"></div></div>
          <span class="pct">{pct}%{badge_feature}</span>
        </div>
      </header>
      <div class="card-body" id="body-{indice}">
        <ul class="lista-cenarios">{itens_lista}</ul>
        <h4>Evidencias</h4>
        {evidencias_html}
      </div>
    </article>'''


ESTILO = '''
:root{color-scheme:dark light}
*{box-sizing:border-box}
body{font-family:system-ui,Segoe UI,Arial,sans-serif;margin:0;background:#121212;color:#e8e8e8}
header.topo{padding:24px 32px;border-bottom:1px solid #2a2a2a;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
h1{margin:0;font-size:22px}
.gerado-em{display:block;color:#999;font-size:13px;margin-top:4px}
.resumo{display:flex;gap:32px;padding:24px 32px;flex-wrap:wrap;align-items:center}
.resumo-cards{display:flex;gap:16px;flex-wrap:wrap}
.stat{background:#1c1c1c;border:1px solid #2a2a2a;border-radius:10px;padding:16px 20px;min-width:140px}
.stat .valor{font-size:26px;font-weight:700}
.stat .rotulo{color:#999;font-size:13px}
.stat-clicavel{cursor:pointer}
.stat-clicavel.ativo{outline:2px solid #274D9B}
.donuts{display:flex;gap:24px;align-items:center}
.donut-wrap{text-align:center}
.donut-wrap span{display:block;font-size:13px;color:#999;margin-top:4px}
.donut-label{fill:#e8e8e8;font-size:20px;font-weight:700}
main{padding:0 32px 48px}
.card{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;margin-bottom:12px;overflow:hidden}
.card-header{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;cursor:pointer;flex-wrap:wrap;gap:12px}
.card-header:hover{background:#222}
.tag{font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;margin-right:8px}
.tag-ui{background:#274D9B;color:#fff}
.tag-api{background:#8B5E3C;color:#fff}
.tag-outros{background:#555;color:#fff}
.spec-path{color:#777;font-size:12px;margin-left:10px}
.card-resumo{display:flex;align-items:center;gap:10px;font-size:13px;color:#ccc}
.barra-fundo{width:120px;height:8px;background:#2a2a2a;border-radius:4px;overflow:hidden}
.barra-preenchida{height:100%}
.pct{font-weight:700;min-width:38px;text-align:right}
.card-body{display:none;padding:0 18px 18px;border-top:1px solid #2a2a2a}
.card-body.aberto{display:block}
.lista-cenarios{list-style:none;padding:0;margin:14px 0}
.lista-cenarios li{padding:6px 0;font-size:14px}
.lista-cenarios li.destaque{background:rgba(39,77,155,.25);border-radius:6px;padding-left:6px}
.cenario-linha{display:flex;align-items:center;gap:10px}
.badge{font-size:11px;font-weight:700;color:#fff;padding:2px 8px;border-radius:20px;min-width:56px;text-align:center}
.erro-msg{margin:6px 0 0 66px;padding:6px 10px;font-family:Consolas,Menlo,monospace;font-size:12px;color:#f0a8a8;background:rgba(198,40,40,.12);border-left:3px solid #C62828;border-radius:2px;white-space:pre-wrap;word-break:break-word}
.duracao{color:#999;font-size:12px}
.evidencias{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px}
.evidencias figure{margin:0;width:220px}
.evidencias img{width:100%;border-radius:6px;border:1px solid #2a2a2a;cursor:zoom-in}
.evidencias figcaption{font-size:11px;color:#888;margin-top:4px;word-break:break-word}
.lista-evidencias{margin:6px 0 0;padding-left:18px;font-size:13px;color:#ccc}
.sem-evidencia{color:#666;font-size:13px;font-style:italic}
.filtros{padding:0 32px 16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.filtros button{background:#1c1c1c;border:1px solid #2a2a2a;color:#ccc;padding:8px 16px;border-radius:20px;cursor:pointer;font-size:13px}
.filtros button.ativo{background:#274D9B;border-color:#274D9B;color:#fff}
.filtros select{background:#1c1c1c;border:1px solid #2a2a2a;color:#ccc;padding:8px 16px;border-radius:20px;cursor:pointer;font-size:13px;font-family:inherit}
.filtros select.ativo{border-color:#274D9B;color:#fff}
.comparacao{font-size:12px;font-weight:700;padding:6px 14px;border-radius:20px;border:1px solid;background:transparent;margin-left:auto}
.comparacao-feature{font-size:11px;padding:1px 8px;margin-left:8px;border-radius:20px;border:1px solid;vertical-align:middle}
.tendencia{min-width:300px}
.tendencia-legenda{font-size:12px;color:#999;margin-top:4px;text-align:center}
.pr-container{display:flex;align-items:center;gap:6px}
.pr-info{background:#1c1c1c;border:1px solid #2a2a2a;padding:6px 14px;border-radius:20px;font-size:12px;color:#ccc;text-decoration:none;max-width:420px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pr-info:hover{background:#222}
.pr-refresh{width:24px;height:24px;border-radius:50%;border:1px solid #2a2a2a;background:#1c1c1c;color:#ccc;cursor:pointer;font-size:13px;line-height:1;padding:0}
.pr-refresh:hover{background:#222}
.rodape{padding:16px 32px 32px;color:#666;font-size:11px}
@media (prefers-color-scheme: light){
  body{background:#f5f5f5;color:#222}
  header.topo,.stat,.card,.filtros button,.filtros select,.pr-info,.pr-refresh{background:#fff;border-color:#ddd}
  .card-header:hover{background:#f0f0f0}
  .donut-label{fill:#222}
}
'''

JS = '''
var filtroSistema = 'todos';
var filtroStatus = null;
var filtroFeature = null;
function toggle(i){
  document.getElementById('body-' + i).classList.toggle('aberto');
}
function aplicarFiltros(){
  document.querySelectorAll('.card').forEach(function(card){
    var tag = card.querySelector('.tag').textContent;
    var mostraSistema = filtroSistema === 'todos' || tag === filtroSistema;
    var mostraStatus = !filtroStatus || card.dataset[filtroStatus] === '1';
    var mostraFeature = !filtroFeature || card.dataset.indice === filtroFeature;
    var mostra = mostraSistema && mostraStatus && mostraFeature;
    card.style.display = mostra ? '' : 'none';
    if (mostra && (filtroStatus || filtroFeature)) {
      document.getElementById('body-' + card.dataset.indice).classList.add('aberto');
    }
    var estadoAlvo = filtroStatus === 'passou' ? 'passed' : (filtroStatus === 'falhou' ? 'failed' : (filtroStatus === 'pendente' ? 'pending' : null));
    card.querySelectorAll('.lista-cenarios li').forEach(function(li){
      li.classList.toggle('destaque', Boolean(estadoAlvo) && li.dataset.estado === estadoAlvo);
    });
  });
}
function filtrar(sistema){
  filtroSistema = sistema;
  document.querySelectorAll('.filtros button[data-filtro]').forEach(function(b){
    b.classList.toggle('ativo', b.dataset.filtro === sistema);
  });
  aplicarFiltros();
}
function filtrarStatus(status){
  filtroStatus = (filtroStatus === status) ? null : status;
  document.querySelectorAll('.stat-clicavel').forEach(function(s){
    s.classList.toggle('ativo', s.dataset.status === filtroStatus);
  });
  aplicarFiltros();
}
function filtrarFeature(valor){
  filtroFeature = (valor === 'todos') ? null : valor;
  var select = document.getElementById('filtro-feature');
  if (select) select.classList.toggle('ativo', Boolean(filtroFeature));
  aplicarFiltros();
}
function atualizarPR(){
  var c = document.getElementById('pr-container');
  if (!c) return;
  var owner = c.dataset.owner, repo = c.dataset.repo, branch = c.dataset.branch;
  fetch('https://api.github.com/repos/' + owner + '/' + repo + '/pulls?head=' + owner + ':' + branch + '&state=all', {
    headers: { Accept: 'application/vnd.github+json' }
  })
    .then(function(r){ return r.json(); })
    .then(function(dados){
      if (!dados || !dados.length) return;
      var pr = dados[0];
      var estado = pr.draft ? 'draft' : pr.state;
      var info = document.getElementById('pr-info');
      info.textContent = '#' + pr.number + ' ' + pr.title + ' - ' + estado;
      info.href = pr.html_url;
    })
    .catch(function(){ /* falha silenciosa: mantem o badge anterior */ });
}
'''


def renderizar_html(features, sem_screenshots, snapshot_novo, historico, pr, config):
    geral = snapshot_novo['atual']['geral']
    pct_geral = geral['pct']
    passou_gerais = geral['passou']
    falhou_gerais = geral['falhou']
    executados_gerais = passou_gerais + falhou_gerais
    pendente_geral = sum(f['pendente'] for f in features)
    duracao_total_ms = sum(f['duracao_ms'] for f in features)

    por_tipo = {}
    for f in features:
        por_tipo.setdefault(f['tipo'], []).append(f)
    ordem_donuts = [t for t in ('ui', 'api', 'outros') if t in por_tipo]

    agora = datetime.now()
    data_formatada = agora.strftime('%d/%m/%Y %H:%M')
    contagem_por_tipo = ' / '.join(f'{len(por_tipo[t])} {ROTULO_TIPO[t]}' for t in ordem_donuts)

    donuts_html = donut_svg(passou_gerais, falhou_gerais, 'Geral') + '\n    ' + '\n    '.join(
        donut_svg(sum(x['passou'] for x in por_tipo[t]), sum(x['falhou'] for x in por_tipo[t]), ROTULO_TIPO[t])
        for t in ordem_donuts
    )

    anterior = snapshot_novo.get('anterior')
    total_pontos_tendencia = len(historico) + 1

    badge_geral_html = ''
    trend_html = ''
    if total_pontos_tendencia >= 3:
        pontos = historico + [{'data': snapshot_novo['gerado_em'], 'pct': pct_geral, 'total': executados_gerais}]
        trend_html = grafico_tendencia_svg(pontos)
    elif anterior:
        anterior_geral = anterior['geral']
        badge_geral_html = badge_comparacao_geral(
            pct_geral, anterior_geral['pct'], executados_gerais, anterior_geral['passou'] + anterior_geral['falhou']
        )

    pendente_stat = (
        f'<div class="stat stat-clicavel" data-status="pendente" onclick="filtrarStatus(\'pendente\')">'
        f'<div class="valor">{pendente_geral}</div><div class="rotulo">Pendentes</div></div>'
    ) if pendente_geral else ''
    stats_html = f'''
    <div class="stat"><div class="valor">{pct_geral}%</div><div class="rotulo">Sucesso geral</div></div>
    <div class="stat"><div class="valor">{executados_gerais}</div><div class="rotulo">Cenarios executados</div></div>
    <div class="stat stat-clicavel" data-status="passou" onclick="filtrarStatus('passou')"><div class="valor">{passou_gerais}</div><div class="rotulo">Passaram</div></div>
    <div class="stat stat-clicavel" data-status="falhou" onclick="filtrarStatus('falhou')"><div class="valor">{falhou_gerais}</div><div class="rotulo">Falharam</div></div>
    <div class="stat"><div class="valor">{formatar_duracao(duracao_total_ms)}</div><div class="rotulo">Tempo total</div></div>
    {pendente_stat}
    {trend_html}'''

    opcoes_feature = ''.join(
        f'<option value="{i}">{escape_html(ROTULO_TIPO.get(f["tipo"], f["tipo"].upper()))} — {escape_html(f["nome"])}</option>'
        for i, f in enumerate(features)
    )
    select_feature_html = (
        f'<select id="filtro-feature" onchange="filtrarFeature(this.value)">'
        f'<option value="todos">Todas as features</option>{opcoes_feature}</select>'
    )

    filtros_html = (
        f'<button data-filtro="todos" class="ativo" onclick="filtrar(\'todos\')">Todas ({len(features)})</button>'
        + ''.join(
            f'<button data-filtro="{ROTULO_TIPO[t]}" onclick="filtrar(\'{ROTULO_TIPO[t]}\')">{ROTULO_TIPO[t]} ({len(por_tipo[t])})</button>'
            for t in ordem_donuts
        )
        + select_feature_html
        + badge_geral_html
    )

    anterior_por_feature = anterior.get('por_feature') if anterior else None
    cards_html = '\n\n'.join(
        renderizar_card(f, i, sem_screenshots, anterior_por_feature) for i, f in enumerate(features)
    )

    pr_html = pr_badge_html(pr)
    snapshot_json = json.dumps(snapshot_novo, ensure_ascii=True)
    sufixo_versao = ' - versao sem screenshots' if sem_screenshots else ''
    titulo = config['titulo']

    return f'''<!doctype html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape_html(titulo)}</title>
<style>{ESTILO}</style>
</head>
<body>
<header class="topo">
  <div>
    <h1>{escape_html(titulo)}</h1>
    <span class="gerado-em">Gerado em {data_formatada} - {len(features)} features ({contagem_por_tipo}){sufixo_versao}</span>
  </div>
  {pr_html}
</header>

<section class="resumo">
  <div class="donuts">
    {donuts_html}
  </div>
  <div class="resumo-cards">{stats_html}
  </div>
</section>

<div class="filtros">
  {filtros_html}
</div>

<main>

{cards_html}

</main>

<div class="rodape">gerar_dashboard.py v{VERSAO_SCRIPT} — geracao sempre local, nunca roda no CI.</div>

<script>{JS}</script>
<script type="application/json" id="dashboard-snapshot">{snapshot_json}</script>
</body>
</html>'''


def gerar(sem_screenshots=False):
    if not JSON_DIR.exists():
        print(f'Aviso: pasta {JSON_DIR} nao existe -- rode a suite com cypress run antes.', file=sys.stderr)
        return

    arquivos_json = sorted(p for p in JSON_DIR.iterdir() if p.suffix == '.json')
    if not arquivos_json:
        print(f'Aviso: nenhum JSON bruto valido encontrado em {JSON_DIR} -- dashboard nao gerado.')
        return

    hash_novo = calcular_hash_relatorios(arquivos_json)
    snapshot_antigo = extrair_snapshot_anterior(OUT_PATH)  # le o HTML antigo ANTES de sobrescrever

    jsons_brutos = coletar_jsons_mais_recentes_por_spec(arquivos_json)
    features = montar_features(jsons_brutos, sem_screenshots)
    totais_gerais = somar_totais(features)

    por_tipo_totais = {}
    for f in features:
        acc = por_tipo_totais.setdefault(f['tipo'], {'passou': 0, 'falhou': 0})
        acc['passou'] += f['passou']
        acc['falhou'] += f['falhou']

    atual = construir_snapshot_atual(features, totais_gerais, por_tipo_totais)
    anterior = decidir_base_comparacao(snapshot_antigo, hash_novo)

    snapshot_novo = {
        'gerado_em': agora_iso(),
        'hash_relatorios': hash_novo,
        'versao_script': VERSAO_SCRIPT,
        'atual': atual,
        'anterior': anterior,
    }

    historico = obter_historico_git(OUT_PATH)
    pr = obter_info_pr()
    config = carregar_config()

    html = renderizar_html(features, sem_screenshots, snapshot_novo, historico, pr, config)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(html, encoding='utf-8')
    sufixo = ' (sem screenshots)' if sem_screenshots else ''
    print(f'Dashboard gerado: {OUT_PATH.resolve()}{sufixo}')

    podar_jsons_antigos(arquivos_json)


def agora_iso():
    return datetime.now().astimezone().isoformat(timespec='seconds')


if __name__ == '__main__':
    gerar(sem_screenshots='--sem-screenshots' in sys.argv)
