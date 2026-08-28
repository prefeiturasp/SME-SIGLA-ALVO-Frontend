#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Roda a suite Cypress e, ao final, gera o relatorio (HTML + PDF + PNG)
independentemente de ter havido falha nos testes -- evidencia de regressao
precisa existir principalmente quando algo quebra.

Uso:
  python scripts/rodar_tudo.py                    -> roda tudo (npm run cy:run)
  python scripts/rodar_tudo.py --spec nome_feature -> roda cy:run:ui filtrado e
    ja passa o mesmo filtro pro relatorio (report:spec)
  python scripts/rodar_tudo.py --ui                -> roda somente cypress/e2e/ui
    (cy:run:ui) e gera o relatorio ja filtrado para essa pasta

O dashboard local (scripts/gerar_dashboard.py) nao precisa ser chamado aqui:
ja e atualizado automaticamente pelo hook after:run do cypress.config.js toda
vez que a suite roda localmente (fora de CI).
"""

import os
import subprocess
import sys


def rodar(comando_args):
    # list2cmdline aplica a mesma citacao/escaping que o Node usa
    # internamente quando spawnSync roda com shell:true no Windows.
    comando = subprocess.list2cmdline(comando_args)
    return subprocess.run(comando, shell=True)


def main():
    args = sys.argv[1:]
    ui_only = '--ui' in args
    spec_filter = None
    if '--spec' in args:
        idx = args.index('--spec')
        if idx + 1 < len(args):
            spec_filter = args[idx + 1]

    cypress_script = 'cy:run:ui' if ui_only else 'cy:run'
    if spec_filter:
        cypress_args = ['run', cypress_script, '--', '--spec', f'cypress/e2e/**/*{spec_filter}*.feature']
    else:
        cypress_args = ['run', cypress_script]

    print(f'\n▶ Rodando testes: npm {" ".join(cypress_args)}\n')
    testes = rodar(['npm'] + cypress_args)

    # Filtro do relatorio: --spec tem prioridade explicita; --ui filtra pela
    # pasta. No Windows o caminho gravado no JSON do mochawesome usa "\" (ex.:
    # "cypress\e2e\ui\foo.feature"), nao "/" -- por isso o separador do SO.
    report_filter = spec_filter or (f'{os.sep}ui{os.sep}' if ui_only else None)
    report_args = ['run', 'report:spec', report_filter] if report_filter else ['run', 'report']
    print(f'\n▶ Gerando relatorio: npm {" ".join(report_args)}\n')
    relatorio = rodar(['npm'] + report_args)

    if relatorio.returncode != 0:
        print('\nFalha ao gerar o relatorio — verifique o log acima.', file=sys.stderr)
        sys.exit(relatorio.returncode or 1)

    sys.exit(testes.returncode or 0)


if __name__ == '__main__':
    main()
