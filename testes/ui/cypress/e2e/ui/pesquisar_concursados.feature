#language: pt
@ui @sigla @pesquisar-concursados @consulta
Funcionalidade: Pesquisar Concursados
  Como usuário administrador do sistema SIGLA
  Quero pesquisar candidatos já concursados
  Para consultar seus dados, alterar contato e ver o histórico de escolhas

  # ============================================================
  # BASE URL   : https://qa-sigla.sme.prefeitura.sp.gov.br
  # URL DIRETA : /processo/pesquisar-concursado
  # ============================================================

  Contexto:
    Dado que estou logado no SIGLA com perfil administrador
    Quando navego até a opção "Processos"
    E seleciono a opção "Pesquisar Concursados"
    Então o sistema exibe a tela "Pesquisar Concursados"

    E o sistema exibe os filtros de pesquisa de concursados:
      | Nome |
      | RF   |
      | RG   |
      | CPF  |
    E exibe os botões "Limpar" e "Filtrar" da pesquisa de concursados

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1 — Consulta por CPF
  # ════════════════════════════════════════════════════════════════
  @busca-cpf @critico
  Cenário: Consultar concursado por CPF
    Quando preencho o CPF "96728566287" na pesquisa de concursados
    E clico em "Filtrar" na pesquisa de concursados

    Então o sistema exibe o concursado correspondente na pesquisa de concursados
    E a tabela de concursados exibe as colunas:
      | Concurso        |
      | Cargo            |
      | Candidato        |
      | RF               |
      | RG               |
      | CPF              |
      | Telefone         |
      | Class. Geral     |
      | Class. NNA       |
      | Class Def.       |
      | Alterar          |
      | Histórico        |

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 2 — Consulta por RF
  # ════════════════════════════════════════════════════════════════
  @busca-rf
  Cenário: Consultar concursado por RF
    Quando preencho o RF "RF134393" na pesquisa de concursados
    E clico em "Filtrar" na pesquisa de concursados

    Então o sistema exibe o concursado correspondente na pesquisa de concursados

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 3 — Consulta sem resultado
  # ════════════════════════════════════════════════════════════════
  @busca-sem-resultado @negativo
  Cenário: Consultar concursado com CPF inexistente não retorna registros
    Quando preencho o CPF "00000000000" na pesquisa de concursados
    E clico em "Filtrar" na pesquisa de concursados

    Então o sistema exibe a mensagem "Nenhum candidato encontrado" na pesquisa de concursados

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 4 — Limpar filtros
  # ════════════════════════════════════════════════════════════════
  @limpar-filtros
  Cenário: Limpar filtros da pesquisa de concursados
    Dado que preenchi os filtros da pesquisa de concursados
    Quando clico em "Limpar" na pesquisa de concursados

    Então os filtros da pesquisa de concursados retornam para o estado inicial

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 5 — Alterar dados de contato do concursado
  # ════════════════════════════════════════════════════════════════
  @alterar-candidato @critico
  Cenário: Alterar telefone e e-mail de um concursado
    Quando realizo uma consulta válida na pesquisa de concursados
    E clico no ícone de alterar do primeiro concursado

    Então o modal "Alterar candidato" é exibido
    E o modal de alterar candidato exibe os campos:
      | Candidato |
      | Concurso  |
      | Cargo     |
      | Telefone  |
      | E-mail    |

    Quando altero o telefone para "(11) 9 8888-7777" no modal de alterar candidato
    E clico em "Salvar" no modal de alterar candidato

    Então o modal de alterar candidato é fechado

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 6 — Cancelar alteração
  # ════════════════════════════════════════════════════════════════
  @alterar-candidato @cancelamento
  Cenário: Cancelar alteração de concursado fecha o modal sem salvar
    Quando realizo uma consulta válida na pesquisa de concursados
    E clico no ícone de alterar do primeiro concursado

    Então o modal "Alterar candidato" é exibido

    Quando clico em "Cancelar" no modal de alterar candidato

    Então o modal de alterar candidato é fechado

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 7 — Histórico de alterações
  # ════════════════════════════════════════════════════════════════
  @historico @funcional
  Cenário: Visualizar histórico de alterações de um concursado
    Quando realizo uma consulta válida na pesquisa de concursados
    E clico no ícone de histórico do primeiro concursado

    Então o modal "Histórico de alterações" é exibido
    E o modal de histórico exibe a seção "Histórico de reclassificação/eliminação"
    E o modal de histórico exibe a seção "Histórico de escolhas"

    Quando clico em "Fechar" no modal de histórico de alterações

    Então o modal de histórico de alterações é fechado
