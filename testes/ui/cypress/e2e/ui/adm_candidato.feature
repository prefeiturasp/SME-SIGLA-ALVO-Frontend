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
  # DADOS QA   : mesma combinação Concurso/Cargo possui um pool de candidatos
  #              "Ativo" reservado para o cenário de eliminação (CENÁRIO 7):
  #              37411874027, 04292797447, 87432197300, 04888328617. Cada
  #              execução real elimina um candidato do pool (ação não
  #              reversível pela tela) — o step escolhe o primeiro ainda
  #              "Ativo", então o pool dura 4 execuções antes de esgotar.
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
  @consulta-nome @skip
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
  # ATENÇÃO: falhou em execução real — ao abrir o select de Concurso, o
  # dropdown veio vazio (ant-select-dropdown-empty). A chamada
  # GET /ms-processos-concursos/.../concursos/?formato=select... ainda não
  # tinha respondido nesse momento (sem status de conclusão no log). Mesma
  # classe de instabilidade/lentidão do backend dos outros cenários com
  # @skip — reavaliar após confirmar estabilidade do endpoint.
  @reclassificacao @skip
  Cenário: Consultar ação de alteração para candidato eliminado
    Quando realizo uma consulta válida na eliminação e reclassificação
    E clico no ícone de alteração do primeiro candidato na eliminação e reclassificação

    Então o sistema exibe um aviso informando a situação do candidato

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 7 — Eliminar candidato e confirmar a situação atualizada
  # ════════════════════════════════════════════════════════════════
  # ATENÇÃO: falhou em execução real — pool de CPFs (cpfsPoolEliminacao)
  # esgotado (nenhum candidato "Ativo" encontrado) e o último CPF testado
  # recebeu 502 da API de habilitados. Repor massa de dados de QA com novos
  # CPFs "Ativo" para este Concurso/Cargo antes de reativar o cenário.
  @eliminar-candidato @critico @skip
  Cenário: Eliminar candidato e confirmar a situação atualizada
    Quando seleciono o concurso "Test Judicial" na eliminação e reclassificação
    E seleciono o cargo "Analista de Sistemas" na eliminação e reclassificação
    E busco um candidato ativo da massa de eliminação e reclassificação
    E clico em Alterar no candidato ativo da eliminação e reclassificação
    E seleciono a situação "Eliminar" no modal de alteração
    E preencho o motivo "Eliminação via teste automatizado - QA" no modal de alteração
    E clico em "Salvar" no modal de alteração

    Então a situação do candidato é atualizada para "Eliminado"

    Quando consulto novamente o mesmo CPF na eliminação e reclassificação
    Então o sistema exibe o candidato com situação "Eliminado"

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 8 — Desclassificar candidato por NNA
  # ════════════════════════════════════════════════════════════════
  # ATENÇÃO: rótulo exato da opção no select ("Desclassificar NNA") e o texto
  # resultante na coluna Situação ("Desclassificado NNA"?) ainda não foram
  # confirmados ao vivo — validar na tela antes de implementar os steps.
  @desclassificar-nna @skip
  Cenário: Desclassificar candidato por NNA
    Quando seleciono o concurso "Test Judicial" na eliminação e reclassificação
    E seleciono o cargo "Analista de Sistemas" na eliminação e reclassificação
    E busco um candidato ativo da massa de eliminação e reclassificação
    E clico em Alterar no candidato ativo da eliminação e reclassificação
    E seleciono a situação "Desclassificar NNA" no modal de alteração
    E preencho o motivo "Desclassificação NNA via teste automatizado - QA" no modal de alteração
    E clico em "Salvar" no modal de alteração

    Então a situação do candidato é atualizada para "Desclassificado NNA"

    Quando consulto novamente o mesmo CPF na eliminação e reclassificação
    Então o sistema exibe o candidato com situação "Desclassificado NNA"

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 9 — Desclassificar candidato por PCD
  # ════════════════════════════════════════════════════════════════
  # ATENÇÃO: rótulo exato da opção no select ("Desclassificar PCD") e o texto
  # resultante na coluna Situação ("Desclassificado PCD"?) ainda não foram
  # confirmados ao vivo — validar na tela antes de implementar os steps.
  @desclassificar-pcd @skip
  Cenário: Desclassificar candidato por PCD
    Quando seleciono o concurso "Test Judicial" na eliminação e reclassificação
    E seleciono o cargo "Analista de Sistemas" na eliminação e reclassificação
    E busco um candidato ativo da massa de eliminação e reclassificação
    E clico em Alterar no candidato ativo da eliminação e reclassificação
    E seleciono a situação "Desclassificar PCD" no modal de alteração
    E preencho o motivo "Desclassificação PCD via teste automatizado - QA" no modal de alteração
    E clico em "Salvar" no modal de alteração

    Então a situação do candidato é atualizada para "Desclassificado PCD"

    Quando consulto novamente o mesmo CPF na eliminação e reclassificação
    Então o sistema exibe o candidato com situação "Desclassificado PCD"

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 10 — Reclassificar candidato eliminado de volta para Ativo
  # ════════════════════════════════════════════════════════════════
  # ATENÇÃO: cenário especulativo — CONTRADIZ o comportamento confirmado ao
  # vivo no CENÁRIO 6 (o ícone Alterar de um candidato "Eliminado" só exibe
  # um tooltip informativo, não abre o modal editável). Antes de implementar
  # os steps, confirmar na tela real se existe algum caminho de UI para
  # reverter a situação de um candidato Eliminado/Desclassificado de volta
  # para "Ativo" (pode ser outra tela, uma ação em lote, ou pode não existir).
  @reclassificar-ativo @skip
  Cenário: Reclassificar candidato eliminado de volta para Ativo
    Dado que existe um candidato com situação "Eliminado" na eliminação e reclassificação

    Quando busco o candidato eliminado na eliminação e reclassificação
    E clico em Alterar no candidato eliminado da eliminação e reclassificação
    E seleciono a situação "Ativo" no modal de alteração
    E preencho o motivo "Reclassificação via teste automatizado - QA" no modal de alteração
    E clico em "Salvar" no modal de alteração

    Então a situação do candidato é atualizada para "Ativo"

    Quando consulto novamente o mesmo CPF na eliminação e reclassificação
    Então o sistema exibe o candidato com situação "Ativo"
