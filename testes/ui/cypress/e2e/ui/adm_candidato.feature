#language: pt
@ui @sigla @eliminacao-reclassificacao @consulta
Funcionalidade: Consulta de candidatos para eliminação e reclassificação
  Como usuário do sistema
  Quero consultar candidatos
  Para verificar informações de classificação e situação

  # ============================================================
  # BASE URL   : https://qa-sigla.sme.prefeitura.sp.gov.br
  # CREDENCIAIS: definidas em .env (SIGLA_LOGIN_RF / SIGLA_LOGIN_SENHA)
  # MENU       : Gerenciar > Eliminação e Reclassificação de Candidato
  # DADOS QA   : Concurso "Test Judicial" + Cargo "Analista de Sistemas" possui
  #              candidato eliminado (RF134393 / CPF 96728566287) — usado como
  #              massa de dados válida para as consultas abaixo.
  # ============================================================

  Contexto:
    Dado que estou logado no SIGLA com perfil administrador
    Quando acesso a tela de eliminação e reclassificação de candidato
    Então o sistema exibe a tela "Eliminação e Reclassificação de Candidato"

    E o sistema exibe os filtros de eliminação e reclassificação:
      | Concurso |
      | Cargo    |
      | Nome     |
      | RF       |
      | RG       |
      | CPF      |
    E exibe os botões "Limpar" e "Filtrar" da eliminação e reclassificação

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1 — Consulta por CPF
  # ════════════════════════════════════════════════════════════════
  @consulta-cpf @critico
  Cenário: Consultar candidato por CPF
    Quando seleciono o concurso "Test Judicial" na eliminação e reclassificação
    E seleciono o cargo "Analista de Sistemas" na eliminação e reclassificação
    E preencho o CPF "96728566287" na eliminação e reclassificação
    E clico em "Filtrar" na eliminação e reclassificação

    Então o sistema exibe o candidato correspondente na eliminação e reclassificação
    E a tabela de eliminação e reclassificação exibe as colunas:
      | Nome do candidato |
      | RF |
      | RG |
      | CPF |
      | Tipo de classificação |
      | Classificação geral |
      | Situação |

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 2 — Consulta por RF
  # ════════════════════════════════════════════════════════════════
  @consulta-rf
  Cenário: Consultar candidato por RF
    Quando seleciono o concurso "Test Judicial" na eliminação e reclassificação
    E seleciono o cargo "Analista de Sistemas" na eliminação e reclassificação
    E preencho o RF "RF134393" na eliminação e reclassificação
    E clico em "Filtrar" na eliminação e reclassificação

    Então o sistema exibe o candidato correspondente na eliminação e reclassificação

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 3 — Consulta por Nome
  # ════════════════════════════════════════════════════════════════
  # ATENÇÃO: falhou em execução real — a API de detalhe do concurso
  # (GET /ms-processos-concursos/.../concursos/{uuid}/) retornou 502, o que
  # deixou o select de Cargo sem opções (ant-select-dropdown-empty). Erro de
  # instabilidade do backend/ambiente QA, não do teste — reavaliar o skip
  # após confirmar estabilidade do endpoint.
  @consulta-nome
  Cenário: Consultar candidato por nome
    Quando seleciono o concurso "Test Judicial" na eliminação e reclassificação
    E seleciono o cargo "Analista de Sistemas" na eliminação e reclassificação
    E informo o nome "Candidato" na eliminação e reclassificação
    E clico em "Filtrar" na eliminação e reclassificação

    Então a busca por nome é executada na eliminação e reclassificação

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 4 — Limpar filtros
  # ════════════════════════════════════════════════════════════════
  @limpar-filtros
  Cenário: Limpar filtros da consulta
    Dado que preenchi os filtros da eliminação e reclassificação
    Quando clico em "Limpar" na eliminação e reclassificação

    Então os filtros da eliminação e reclassificação retornam para o estado inicial

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 5 — Validar resultado da consulta
  # ════════════════════════════════════════════════════════════════
  @resultado-consulta @critico
  Cenário: Validar informações exibidas na tabela
    Quando realizo uma consulta válida na eliminação e reclassificação

    Então a tabela de eliminação e reclassificação exibe as colunas:
      | Nome do candidato |
      | RF |
      | RG |
      | CPF |
      | Tipo de classificação |
      | Classificação geral |
      | Classificação deficiente |
      | Classificação NNA |
      | Situação |
      | Alterar |

    E a tabela de eliminação e reclassificação apresenta pelo menos um registro

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 6 — Ação de alteração em candidato eliminado
  # ════════════════════════════════════════════════════════════════
  @reclassificacao
  Cenário: Consultar ação de alteração para candidato eliminado
    Quando realizo uma consulta válida na eliminação e reclassificação
    E clico no ícone de alteração do primeiro candidato na eliminação e reclassificação

    Então o sistema exibe um aviso informando a situação do candidato
