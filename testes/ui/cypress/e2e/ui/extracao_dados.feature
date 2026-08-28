#language: pt
@ui @sigla @gerenciar @extracao-dados
Funcionalidade: Gerenciar — Extração de Dados
  Como usuário administrador
  Quero consultar o dashboard de indicadores e relatórios consolidados dos concursos
  Para acompanhar habilitados, convocações, escolhas e vagas por DRE

  # ============================================================
  # BASE URL   : https://qa-sigla.sme.prefeitura.sp.gov.br
  # CREDENCIAIS: definidas em .env (SIGLA_LOGIN_RF / SIGLA_LOGIN_SENHA)
  # MENU        : Gerenciar > Extração de dados
  # MASSA DE DADOS (QA, confirmada manualmente em 2026-08-24):
  #   - Filtro principal: Concurso "Concurso VHC 3" + Ano "2026"
  #   - Relatórios detalhados: Cargo "Todos" + DRE sorteada entre as disponíveis
  # ============================================================

  Contexto:
    Dado que estou logado no SIGLA com perfil administrador
    Quando acesso a tela de extração de dados

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1 (PRINCIPAL) — Fluxo de filtro por concurso e ano
  # ════════════════════════════════════════════════════════════════
  @smoke @critico
  Cenário: Validar estrutura da tela e fluxo principal de filtro por concurso e ano
    Então o sistema exibe o título "Extração de dados"
    E exibe o botão "Gerar relatório" na tela de extração de dados

    E o campo Ano do filtro principal de extração de dados está desabilitado
    E o botão Filtrar do filtro principal de extração de dados está desabilitado

    Quando seleciono o concurso "Concurso VHC 3" no filtro principal de extração de dados
    Então o campo Ano do filtro principal de extração de dados é habilitado

    Quando seleciono o ano "2026" no filtro principal de extração de dados
    Então o botão Filtrar do filtro principal de extração de dados é habilitado

    Quando clico no botão Filtrar do filtro principal de extração de dados
    Então o sistema atualiza os indicadores de extração de dados de acordo com o filtro aplicado

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 2 — Relatórios detalhados: cargo "Todos" + DRE sorteada
  # ════════════════════════════════════════════════════════════════
  @relatorios-detalhados @critico
  Cenário: Filtrar a tabela de Relatórios detalhados por cargo Todos e DRE sorteada
    Quando seleciono o cargo "Todos" nos relatórios detalhados de extração de dados
    E seleciono uma DRE aleatória nos relatórios detalhados de extração de dados
    E clico no botão Filtrar dos relatórios detalhados de extração de dados

    Então a tabela de relatórios detalhados de extração de dados exibe resultados para a DRE selecionada

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 3 — Geração de relatório
  # ════════════════════════════════════════════════════════════════
  @exportacao @funcional
  Cenário: Gerar relatório a partir do dashboard de Extração de Dados
    Quando clico no botão "Gerar relatório"
    Então o sistema realiza o download do relatório em PDF
