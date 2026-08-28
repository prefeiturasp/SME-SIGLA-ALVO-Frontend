#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gera relatorio consolidado (HTML + PDF + PNG) a partir dos JSONs do
cypress-mochawesome-reporter. Nao depende do hook after:run funcionar --
roda o merge manualmente sempre, de forma deterministica.

mochawesome-merge, marge e o Chrome/Edge headless continuam sendo invocados
como processos externos (nao ha equivalente em stdlib Python para eles) --
mesmo padrao ja usado pelo gerador do dashboard ao chamar processos
externos quando nao ha alternativa razoavel em Python puro.

Uso:
  python scripts/gerar_relatorio.py                        -> mescla tudo em .jsons/
  python scripts/gerar_relatorio.py --spec nova_convocacao  -> filtra por 1 feature
    (substring no caminho do arquivo, ex.: "nova_convocacao" casa com
    cypress/e2e/ui/nova_convocacao.feature)
"""

import json
import re
import subprocess
import sys
from pathlib import Path

REPORT_DIR = Path('cypress') / 'reports' / 'mochawesome'
JSON_DIR = REPORT_DIR / '.jsons'

CANDIDATOS_CHROME = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]


def obter_spec_file(dado):
    resultados = dado.get('results') or []
    # Specs sem nenhum teste registrado (0 suites) gravam "results": [false]
    # em vez de um objeto -- trata como "desconhecido", igual ao comportamento
    # original (optional chaining tolerava o valor nao-objeto).
    primeiro = resultados[0] if resultados and isinstance(resultados[0], dict) else None
    return (primeiro.get('file') if primeiro else None) or 'desconhecido'


# 1. Deduplicar: manter so o JSON mais recente por spec (remove os demais do disco).
def dedup_jsons():
    if not JSON_DIR.exists():
        raise RuntimeError(f'Pasta {JSON_DIR} nao existe -- rode a suite com cypress run antes.')

    arquivos = sorted(p for p in JSON_DIR.iterdir() if p.suffix == '.json')
    mais_recente_por_spec = {}

    for caminho in arquivos:
        dado = json.loads(caminho.read_text(encoding='utf-8'))
        spec_file = obter_spec_file(dado)
        mtime = caminho.stat().st_mtime
        existente = mais_recente_por_spec.get(spec_file)
        if existente is None or mtime > existente[0]:
            mais_recente_por_spec[spec_file] = (mtime, caminho)

    manter = {caminho for _, caminho in mais_recente_por_spec.values()}
    removidos = 0
    for caminho in arquivos:
        if caminho not in manter:
            caminho.unlink()
            removidos += 1

    print(f'Deduplicacao: {removidos} JSON(s) antigo(s) removido(s), {len(manter)} mantido(s).')
    return list(manter)


# 2. Filtrar por spec (opcional).
def filtrar_por_spec(caminhos, filtro):
    if not filtro:
        return caminhos
    filtrados = []
    for caminho in caminhos:
        dado = json.loads(caminho.read_text(encoding='utf-8'))
        if filtro in obter_spec_file(dado):
            filtrados.append(caminho)
    if not filtrados:
        raise RuntimeError(f'Nenhum JSON encontrado contendo "{filtro}" no caminho do spec.')
    return filtrados


def rodar(comando_args, **kwargs):
    comando = subprocess.list2cmdline(comando_args)
    return subprocess.run(comando, shell=True, **kwargs)


def localizar_chrome():
    for candidato in CANDIDATOS_CHROME:
        if Path(candidato).exists():
            return candidato
    return None


# 3. Merge + geracao de HTML/PDF/PNG.
def gerar(spec_filter):
    todos = dedup_jsons()
    alvo = filtrar_por_spec(todos, spec_filter)

    # Sufixo usado no nome do arquivo precisa ser seguro em qualquer SO -- o
    # filtro pode conter separadores de caminho (ex.: "--ui" passa "\ui\" no
    # Windows), que nao podem aparecer em nome de arquivo/pasta.
    sufixo = f'-{re.sub(r"[\\/]", "", spec_filter)}' if spec_filter else '-consolidado'
    merged_path = REPORT_DIR / f'merged{sufixo}.json'
    html_name = f'relatorio{sufixo}'

    # mochawesome-merge trata os caminhos como glob pattern; no Windows a
    # barra invertida quebra o casamento, entao normalizamos para "/".
    alvo_glob = [str(p).replace('\\', '/') for p in alvo]
    # encoding explicito: a saida do mochawesome-merge pode conter acentuacao
    # (titulos de feature em PT-BR) fora do codepage padrao do console (cp1252
    # no Windows), o que quebraria o decode automatico do subprocess.
    resultado_merge = rodar(['npx', 'mochawesome-merge'] + alvo_glob, capture_output=True, text=True, encoding='utf-8')
    if resultado_merge.returncode != 0:
        sys.stderr.write(resultado_merge.stderr or '')
        raise RuntimeError('Falha ao rodar mochawesome-merge.')
    merged_path.write_text(resultado_merge.stdout, encoding='utf-8')

    rodar([
        'npx', 'marge', str(merged_path),
        '--reportDir', str(REPORT_DIR),
        '--reportFilename', html_name,
        '--reportTitle', 'Relatorio de Testes - SME SIGLA ALVO',
        '--reportPageTitle', 'Relatorio de Testes',
        '--inline', '--charts',
    ])

    html_path = (REPORT_DIR / f'{html_name}.html').resolve()
    pdf_path = (REPORT_DIR / f'{html_name}.pdf').resolve()
    png_path = (REPORT_DIR / f'evidencia-completa{sufixo}.png').resolve()
    file_url = 'file:///' + str(html_path).replace('\\', '/')

    chrome = localizar_chrome()
    if chrome:
        subprocess.run([
            chrome, '--headless', '--disable-gpu', f'--print-to-pdf={pdf_path}',
            '--print-to-pdf-no-header', '--virtual-time-budget=5000', file_url,
        ])
        subprocess.run([
            chrome, '--headless', '--disable-gpu', '--window-size=1600,11000',
            '--virtual-time-budget=5000', f'--screenshot={png_path}', file_url,
        ])
        print(f'\nGerados:\n  {html_path}\n  {pdf_path}\n  {png_path}')
    else:
        print(f'\nChrome/Edge nao encontrado — gerado apenas:\n  {html_path}')
        print('Instale Chrome ou Edge para habilitar geracao automatica de PDF/PNG.')


def main():
    args = sys.argv[1:]
    spec_filter = None
    if '--spec' in args:
        idx = args.index('--spec')
        if idx + 1 < len(args):
            spec_filter = args[idx + 1]
    gerar(spec_filter)


if __name__ == '__main__':
    main()
