#language: pt
@api @sigla @cobertura_complementar_sigla
Funcionalidade: API SIGLA - Cobertura Complementar dos Microsserviços
  Como sistema integrado SME
  Quero ampliar a cobertura automatizada dos microsserviços do SIGLA
  Para garantir que regras de negócio, contratos e validações permaneçam corretos entre versões

  # BASE URL: https://qa-api-sigla.sme.prefeitura.sp.gov.br
  # Reúne os cenários que ampliam a cobertura das demais features de API.
  # Cada cenário leva a tag do microsserviço que exercita (ex.: @concurso_sigla),
  # o que permite executar um recorte com --env tags=@concurso_sigla.
  # Concursos e autorizações criados pelos steps "de teste" são excluídos ao fim
  # de cada cenário, mesmo em caso de falha (After em
  # api_cobertura_complementar_steps.js).
  #
  # Microsserviços cobertos:
  #   ms-processos-concursos (@concurso_sigla) — complementa
  #   api_concurso_sigla.feature com PUT/PATCH/DELETE de concurso e de
  #   autorização, atualizar-situacao, cargos/{uuid},
  #   cargos/autorizacoes-publicadas e filtros de situação/status.
  #
  # Cenários @bug_conhecido descrevem o comportamento ESPERADO e ficam com @skip
  # (aparecem como pendentes no relatório). O comportamento atual da QA, medido
  # em 13/10/2026, está no comentário de cada um. Remover o @skip quando o
  # backend corrigir.
  #
  # Entrega em duas partes. A entrega 1 cobre o ciclo de vida do concurso. A
  # entrega 2 (@entrega_2) cobre cargos, autorizações publicadas e a listagem
  # avançada de concursos (múltiplas situações, ordenação e performance). Ambas
  # estão ativas; a tag @entrega_2 permite executar só esse recorte com
  # --env tags=@entrega_2.

  Contexto:
    Dado que as APIs do SIGLA estão acessíveis

  # ms-processos-concursos (@concurso_sigla)

  # GET /ms-processos-concursos/api/v1/concursos/{uuid}/

  # CENÁRIO 1 — Buscar concurso por UUID válido retorna 200
  @concurso_sigla @smoke @concursos_buscar_uuid
  Cenário: Buscar concurso por UUID válido retorna 200
    Quando eu crio um concurso CONCURSO com payload "concursoValido"
    Então o status CONCURSO deve ser 201
    Quando eu busco o concurso CONCURSO pelo UUID criado
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "uuid"
    E a resposta CONCURSO deve conter "nome"

  # CENÁRIO 2 — Buscar concurso com UUID inexistente retorna 404
  @concurso_sigla @negativo @concursos_buscar_uuid_invalido
  Cenário: Buscar concurso com UUID inexistente retorna 404
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/00000000-0000-0000-0000-000000000000/"
    Então o status CONCURSO deve ser 404

  # CENÁRIO 3 — Fluxo completo: criar concurso, buscar por UUID e localizar na listagem geral
  @concurso_sigla @valor @concursos_fluxo_completo
  Cenário: Fluxo completo — criar concurso, buscar por UUID e localizar na listagem geral
    Quando eu crio um concurso CONCURSO com payload "concursoValido"
    Então o status CONCURSO deve ser 201
    E a resposta CONCURSO deve conter "uuid"

    Quando eu busco o concurso CONCURSO pelo UUID criado
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "nome"
    E o concurso criado deve aparecer na listagem geral de concursos

  # CENÁRIO 4 — Concurso recém-criado expõe o contrato completo e nasce ATIVO/INCOMPLETO
  @concurso_sigla @contrato @concursos_contrato_detalhe
  Cenário: Concurso recém-criado expõe o contrato completo e nasce ATIVO e INCOMPLETO
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu busco o concurso CONCURSO pelo UUID criado
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve ter os campos:
      | campo              |
      | uuid               |
      | nome               |
      | cargos             |
      | numero_processo    |
      | codigo             |
      | banca_responsavel  |
      | status             |
      | situacao           |
      | data_autorizacao   |
      | link_edital        |
      | habilitados_geral  |
      | vigencia_inicio    |
      | vigencia_fim       |
      | criado_em          |
      | atualizado_em      |
    E o campo "uuid" da resposta CONCURSO deve ser um UUID válido
    E a resposta CONCURSO deve ter o campo "status" igual a "ATIVO"
    E a resposta CONCURSO deve ter o campo "situacao" igual a "INCOMPLETO"

  # CENÁRIO 5 — Buscar concurso com UUID em formato inválido retorna 404
  @concurso_sigla @negativo @concursos_uuid_formato_invalido
  Cenário: Buscar concurso com UUID em formato inválido retorna 404
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/nao-e-uuid/"
    Então o status CONCURSO deve ser 404

  # GET /ms-processos-concursos/api/v1/concursos/ — paginação, filtros e ordenação

  # CENÁRIO 6 — Listagem de concursos segue o contrato de paginação
  @concurso_sigla @contrato @paginacao @concursos_paginacao_contrato
  Cenário: Listagem de concursos segue o contrato de paginação
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/?page_size=2"
    Então o status CONCURSO deve ser 200
    E a listagem CONCURSO deve seguir o contrato de paginação com 2 itens por página
    E cada registro CONCURSO retornado deve ter os campos:
      | campo            |
      | uuid             |
      | nome             |
      | cargos           |
      | cargos_descricao |
      | numero_processo  |
      | status           |
      | situacao         |

  # CENÁRIO 7 — Página não numérica retorna 404
  @concurso_sigla @negativo @paginacao @concursos_pagina_nao_numerica
  Cenário: Requisitar página não numérica de concursos retorna 404
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/?page=abc"
    Então o status CONCURSO deve ser 404
    E a resposta CONCURSO deve ter o campo "detail" igual a "Página inválida."

  # CENÁRIO 8 — Filtro por status ATIVO retorna apenas concursos ativos
  @concurso_sigla @filtro @concursos_filtro_status
  Cenário: Filtrar concursos por status ATIVO retorna apenas concursos ativos
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/?status=ATIVO&page_size=50"
    Então o status CONCURSO deve ser 200
    E a lista de resultados CONCURSO não deve estar vazia
    E todos os registros CONCURSO retornados devem ter o campo "status" igual a "ATIVO"

  # CENÁRIO 9 — Filtro por situação retorna apenas a situação pedida
  @concurso_sigla @filtro @concursos_filtro_situacao
  Cenário: Filtrar concursos por situação EM_ANDAMENTO retorna apenas essa situação
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/?situacao=EM_ANDAMENTO&page_size=50"
    Então o status CONCURSO deve ser 200
    E todos os registros CONCURSO retornados devem ter o campo "situacao" igual a "EM_ANDAMENTO"

  # CENÁRIO 10 — Filtro por múltiplas situações (situacao__in)
  @concurso_sigla @filtro @entrega_2 @concursos_filtro_situacao_in
  Cenário: Filtrar concursos por múltiplas situações retorna apenas as situações pedidas
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/?situacao__in=COMPLETO,INCOMPLETO&page_size=50"
    Então o status CONCURSO deve ser 200
    E a lista de resultados CONCURSO não deve estar vazia
    E todos os registros CONCURSO retornados devem ter o campo "situacao" entre "COMPLETO,INCOMPLETO"

  # CENÁRIO 11 — Filtro com situação fora do enum retorna 400
  @concurso_sigla @negativo @filtro @concursos_filtro_situacao_invalida
  Cenário: Filtrar concursos por situação inexistente retorna 400
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/?situacao=XYZ"
    Então o status CONCURSO deve ser 400
    E a mensagem de erro CONCURSO do campo "situacao" deve ser "Faça uma escolha válida. XYZ não é uma das escolhas disponíveis."

  # CENÁRIO 12 — Filtro com status fora do enum retorna 400
  @concurso_sigla @negativo @filtro @concursos_filtro_status_invalido
  Cenário: Filtrar concursos por status inexistente retorna 400
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/?status=XYZ"
    Então o status CONCURSO deve ser 400
    E a mensagem de erro CONCURSO do campo "status" deve ser "Faça uma escolha válida. XYZ não é uma das escolhas disponíveis."

  # CENÁRIO 13 — Ordenação crescente por nome é respeitada
  @concurso_sigla @ordenacao @entrega_2 @concursos_ordenacao_crescente
  Cenário: Ordenar concursos por nome crescente retorna a lista ordenada
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/?ordering=nome&page_size=50"
    Então o status CONCURSO deve ser 200
    E os registros CONCURSO devem estar ordenados por "nome" em ordem "crescente"

  # CENÁRIO 14 — Ordenação decrescente por nome é respeitada
  @concurso_sigla @ordenacao @entrega_2 @concursos_ordenacao_decrescente
  Cenário: Ordenar concursos por nome decrescente retorna a lista ordenada
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/?ordering=-nome&page_size=50"
    Então o status CONCURSO deve ser 200
    E os registros CONCURSO devem estar ordenados por "nome" em ordem "decrescente"

  # CENÁRIO 15 — Listagem de concursos responde em tempo aceitável
  @concurso_sigla @performance @entrega_2 @concursos_tempo_resposta
  Cenário: Listagem de concursos responde em menos de 5 segundos
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/"
    Então o status CONCURSO deve ser 200
    E o tempo de resposta CONCURSO deve ser menor que 5000 milissegundos

  # POST /ms-processos-concursos/api/v1/concursos/ — regras de criação

  # CENÁRIO 16 — Número de processo duplicado é rejeitado
  @concurso_sigla @negativo @concursos_numero_processo_duplicado
  Cenário: Criar concurso com número de processo já cadastrado retorna 400
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu crio um concurso CONCURSO com o mesmo número de processo do concurso criado
    Então o status CONCURSO deve ser 400
    E a mensagem de erro CONCURSO do campo "numero_processo" deve ser "Este número de processo já está cadastrado."

  # CENÁRIO 17 — Número de processo é obrigatório
  @concurso_sigla @negativo @concursos_sem_numero_processo
  Cenário: Criar concurso sem número de processo retorna 400
    Quando eu crio um concurso CONCURSO sem número de processo
    Então o status CONCURSO deve ser 400
    E a mensagem de erro CONCURSO do campo "numero_processo" deve ser "Este campo é obrigatório."

  # CENÁRIO 18 — Cargo inexistente deveria ser rejeitado
  # BUG: hoje a QA retorna 201 e cria o concurso com "cargos": [] — o UUID de
  # cargo inexistente é descartado em silêncio, gerando concurso sem cargo.
  @concurso_sigla @negativo @bug_conhecido @skip @concursos_cargo_inexistente
  Cenário: Criar concurso com cargo inexistente retorna 400
    Quando eu crio um concurso CONCURSO com cargo inexistente
    Então o status CONCURSO deve ser 400

  # PATCH /ms-processos-concursos/api/v1/concursos/{uuid}/

  # CENÁRIO 19 — PATCH altera o campo, persiste e atualiza atualizado_em
  @concurso_sigla @smoke @concursos_patch
  Cenário: Atualizar parcialmente concurso persiste a alteração
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu atualizo parcialmente o concurso CONCURSO criado com:
      | campo             | valor           |
      | banca_responsavel | BANCA AUTOMACAO |
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve ter o campo "banca_responsavel" igual a "BANCA AUTOMACAO"
    E o campo atualizado_em do concurso CONCURSO deve ser posterior ao da criação
    E ao consultar o concurso CONCURSO criado o campo "banca_responsavel" deve ser "BANCA AUTOMACAO"

  # CENÁRIO 20 — Situação alterada via PATCH reflete no filtro da listagem
  @concurso_sigla @valor @concursos_patch_situacao
  Cenário: Concurso com situação alterada passa a ser encontrado pelo filtro de situação
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu atualizo parcialmente o concurso CONCURSO criado com:
      | campo    | valor        |
      | situacao | EM_ANDAMENTO |
    Então o status CONCURSO deve ser 200
    E ao consultar o concurso CONCURSO criado o campo "situacao" deve ser "EM_ANDAMENTO"
    E o concurso CONCURSO criado deve ser localizado pela situação "EM_ANDAMENTO"

  # CENÁRIO 21 — PATCH com status fora do enum retorna 400
  @concurso_sigla @negativo @concursos_patch_status_invalido
  Cenário: Atualizar concurso com status inexistente retorna 400
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu atualizo parcialmente o concurso CONCURSO criado com:
      | campo  | valor |
      | status | XYZ   |
    Então o status CONCURSO deve ser 400
    E a mensagem de erro CONCURSO do campo "status" deve ser '"XYZ" não é um escolha válido.'

  # CENÁRIO 22 — PATCH com link de edital inválido retorna 400
  @concurso_sigla @negativo @concursos_patch_link_invalido
  Cenário: Atualizar concurso com link de edital inválido retorna 400
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu atualizo parcialmente o concurso CONCURSO criado com:
      | campo       | valor     |
      | link_edital | nao-e-url |
    Então o status CONCURSO deve ser 400
    E a mensagem de erro CONCURSO do campo "link_edital" deve ser "Entrar um URL válido."

  # CENÁRIO 23 — Quantidade de habilitados negativa deveria ser rejeitada
  # BUG: hoje a QA aceita habilitados_geral = -3 e retorna 200.
  @concurso_sigla @negativo @bug_conhecido @skip @concursos_habilitados_negativo
  Cenário: Atualizar concurso com quantidade de habilitados negativa retorna 400
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu atualizo parcialmente o concurso CONCURSO criado com:
      | campo             | valor |
      | habilitados_geral | -3    |
    Então o status CONCURSO deve ser 400

  # CENÁRIO 24 — Vigência com início após o fim deveria ser rejeitada
  # BUG: hoje a QA aceita vigencia_inicio 2028-01-01 com vigencia_fim
  # 2026-01-01 e retorna 200.
  @concurso_sigla @negativo @bug_conhecido @skip @concursos_vigencia_invertida
  Cenário: Atualizar concurso com início de vigência após o fim retorna 400
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu atualizo parcialmente o concurso CONCURSO criado com:
      | campo           | valor      |
      | vigencia_inicio | 2028-01-01 |
      | vigencia_fim    | 2026-01-01 |
    Então o status CONCURSO deve ser 400

  # CENÁRIO 25 — PATCH em concurso inexistente retorna 404
  @concurso_sigla @negativo @concursos_patch_inexistente
  Cenário: Atualizar parcialmente concurso inexistente retorna 404
    Quando eu faço uma requisição CONCURSO de método "PATCH" para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/00000000-0000-0000-0000-000000000000/"
    Então o status CONCURSO deve ser 404

  # PUT /ms-processos-concursos/api/v1/concursos/{uuid}/

  # CENÁRIO 26 — PUT substitui o nome e o novo nome é encontrado na busca
  @concurso_sigla @smoke @valor @concursos_put
  Cenário: Atualizar concurso via PUT persiste o novo nome e ele é encontrado na busca
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu atualizo o concurso CONCURSO criado via PUT com o nome "CONCURSO TESTE AUTOMACAO RENOMEADO"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve ter o campo "nome" igual a "CONCURSO TESTE AUTOMACAO RENOMEADO"
    E ao consultar o concurso CONCURSO criado o campo "nome" deve ser "CONCURSO TESTE AUTOMACAO RENOMEADO"
    E o concurso CONCURSO criado deve ser localizado pelo filtro "numero_processo"

  # CENÁRIO 27 — PUT com body vazio aponta os campos obrigatórios
  @concurso_sigla @negativo @concursos_put_body_vazio
  Cenário: Atualizar concurso via PUT com body vazio retorna 400 com campos obrigatórios
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu atualizo o concurso CONCURSO criado via PUT com body vazio
    Então o status CONCURSO deve ser 400
    E a mensagem de erro CONCURSO do campo "nome" deve ser "Este campo é obrigatório."
    E a mensagem de erro CONCURSO do campo "numero_processo" deve ser "Este campo é obrigatório."

  # PATCH /ms-processos-concursos/api/v1/concursos/{uuid}/atualizar-situacao/

  # CENÁRIO 28 — atualizar-situacao deveria aplicar a situação enviada
  # BUG: hoje a QA responde 200 mas mantém a situação anterior, tanto de
  # INCOMPLETO para EM_ANDAMENTO quanto de EM_ANDAMENTO para CANCELADO. O
  # PATCH comum no próprio concurso altera a situação normalmente (cenário 20).
  @concurso_sigla @bug_conhecido @skip @concursos_atualizar_situacao
  Cenário: Atualizar situação do concurso persiste a nova situação
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu atualizo a situação do concurso CONCURSO criado para "EM_ANDAMENTO"
    Então o status CONCURSO deve ser 200
    E ao consultar o concurso CONCURSO criado o campo "situacao" deve ser "EM_ANDAMENTO"

  # CENÁRIO 29 — atualizar-situacao com valor fora do enum retorna 400
  @concurso_sigla @negativo @concursos_atualizar_situacao_invalida
  Cenário: Atualizar situação do concurso com valor inexistente retorna 400
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu atualizo a situação do concurso CONCURSO criado para "XYZ"
    Então o status CONCURSO deve ser 400
    E a mensagem de erro CONCURSO do campo "situacao" deve ser '"XYZ" não é um escolha válido.'

  # CENÁRIO 30 — atualizar-situacao sem o campo situacao retorna 400
  @concurso_sigla @negativo @concursos_atualizar_situacao_sem_campo
  Cenário: Atualizar situação do concurso sem informar a situação retorna 400
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu atualizo a situação do concurso CONCURSO criado sem informar a situação
    Então o status CONCURSO deve ser 400
    E a mensagem de erro CONCURSO do campo "situacao" deve ser "Este campo é obrigatório."

  # CENÁRIO 31 — atualizar-situacao em concurso inexistente retorna 404
  @concurso_sigla @negativo @concursos_atualizar_situacao_inexistente
  Cenário: Atualizar situação de concurso inexistente retorna 404
    Quando eu faço uma requisição CONCURSO de método "PATCH" para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/00000000-0000-0000-0000-000000000000/atualizar-situacao/"
    Então o status CONCURSO deve ser 404

  # DELETE /ms-processos-concursos/api/v1/concursos/{uuid}/

  # CENÁRIO 32 — Excluir concurso remove o registro e a segunda exclusão retorna 404
  @concurso_sigla @smoke @concursos_delete
  Cenário: Excluir concurso remove o registro definitivamente
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu excluo o concurso CONCURSO criado
    Então o status CONCURSO deve ser 204
    E o concurso CONCURSO criado não deve mais existir
    Quando eu excluo o concurso CONCURSO criado
    Então o status CONCURSO deve ser 404

  # CENÁRIO 33 — Excluir concurso inexistente retorna 404
  @concurso_sigla @negativo @concursos_delete_inexistente
  Cenário: Excluir concurso inexistente retorna 404
    Quando eu faço uma requisição CONCURSO de método "DELETE" para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/00000000-0000-0000-0000-000000000000/"
    Então o status CONCURSO deve ser 404

  # CENÁRIO 34 — Ciclo de vida completo do concurso
  @concurso_sigla @valor @concursos_ciclo_de_vida
  Cenário: Ciclo de vida completo — criar, atualizar, localizar e excluir concurso
    Dado que tenho um concurso CONCURSO de teste criado
    Quando eu atualizo parcialmente o concurso CONCURSO criado com:
      | campo             | valor           |
      | banca_responsavel | BANCA AUTOMACAO |
    Então o status CONCURSO deve ser 200
    Quando eu atualizo o concurso CONCURSO criado via PUT com o nome "CONCURSO TESTE AUTOMACAO CICLO"
    Então o status CONCURSO deve ser 200
    E o concurso CONCURSO criado deve ser localizado pelo filtro "numero_processo"
    Quando eu excluo o concurso CONCURSO criado
    Então o status CONCURSO deve ser 204
    E o concurso CONCURSO criado não deve mais existir

  # GET /ms-processos-concursos/api/v1/cargos/{uuid}/ e filtros de cargos

  # CENÁRIO 35 — Buscar cargo por UUID retorna o cargo correto
  @concurso_sigla @smoke @entrega_2 @cargos_buscar_uuid
  Cenário: Buscar cargo por UUID válido retorna o cargo correto
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/cargos/7c74d239-bdf4-4d83-a457-7cfb3920c34c/"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve ter o campo "nome" igual a "DIRETOR DE ESCOLA"
    E a resposta CONCURSO deve ter o campo "codigo" igual a "3360"
    E o campo "criado_em" da resposta CONCURSO deve ser uma data válida

  # CENÁRIO 36 — Buscar cargo com UUID inexistente retorna 404
  @concurso_sigla @negativo @entrega_2 @cargos_buscar_uuid_inexistente
  Cenário: Buscar cargo com UUID inexistente retorna 404
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/cargos/00000000-0000-0000-0000-000000000000/"
    Então o status CONCURSO deve ser 404

  # CENÁRIO 37 — Filtro de cargos por código retorna apenas o cargo pedido
  @concurso_sigla @filtro @entrega_2 @cargos_filtro_codigo
  Cenário: Filtrar cargos por código retorna apenas o cargo com esse código
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/cargos/?codigo=3360"
    Então o status CONCURSO deve ser 200
    E a lista de resultados CONCURSO não deve estar vazia
    E todos os registros CONCURSO retornados devem ter o campo "codigo" igual a "3360"

  # CENÁRIO 38 — Ordenação de cargos por nome deveria ser respeitada
  # BUG: o parâmetro ordering consta no schema, mas hoje a QA o ignora e
  # devolve os 266 cargos na ordem de cadastro.
  @concurso_sigla @ordenacao @bug_conhecido @skip @cargos_ordenacao
  Cenário: Ordenar cargos por nome retorna a lista ordenada
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/cargos/?ordering=nome"
    Então o status CONCURSO deve ser 200
    E os registros CONCURSO devem estar ordenados por "nome" em ordem "crescente"

  # CENÁRIO 39 — Alterar ou excluir cargo sem autenticação é bloqueado
  # Usa UUID inexistente de propósito: a permissão é checada antes da busca do
  # registro, então o 403 é garantido sem risco de alterar um cargo real.
  @concurso_sigla @negativo @seguranca @entrega_2 @cargos_escrita_sem_autenticacao
  Esquema do Cenário: <metodo> em cargo sem autenticação retorna 403
    Quando eu faço uma requisição CONCURSO de método "<metodo>" para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/cargos/00000000-0000-0000-0000-000000000000/"
    Então o status CONCURSO deve ser 403
    E a resposta CONCURSO deve ter o campo "detail" igual a "As credenciais de autenticação não foram fornecidas."

    Exemplos:
      | metodo |
      | PUT    |
      | PATCH  |
      | DELETE |

  # GET /ms-processos-concursos/api/v1/cargos/autorizacoes-publicadas/

  # CENÁRIO 40 — Resumo de autorizações por cargo expõe o contrato esperado
  @concurso_sigla @contrato @entrega_2 @cargos_autorizacoes_resumo
  Cenário: Listar resumo de autorizações por cargo retorna o contrato esperado
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/cargos/autorizacoes-publicadas/"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve ser uma lista
    E cada registro CONCURSO retornado deve ter os campos:
      | campo                         |
      | uuid                          |
      | nome                          |
      | codigo                        |
      | autorizacoes                  |
      | data_autorizacao_mais_recente |
      | total_escolhas                |

  # /ms-processos-concursos/api/v1/autorizacoes-publicadas/ — filtros e ciclo de vida

  # CENÁRIO 41 — Filtro de autorizações por cargo retorna apenas aquele cargo
  @concurso_sigla @filtro @entrega_2 @autorizacoes_filtro_cargo
  Cenário: Filtrar autorizações por UUID do cargo retorna apenas autorizações desse cargo
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/autorizacoes-publicadas/?cargo__uuid=7c74d239-bdf4-4d83-a457-7cfb3920c34c"
    Então o status CONCURSO deve ser 200
    E a lista de resultados CONCURSO não deve estar vazia
    E todos os registros CONCURSO retornados devem ter o campo "cargo" igual a "7c74d239-bdf4-4d83-a457-7cfb3920c34c"

  # CENÁRIO 42 — Filtro por código de cargo inexistente retorna lista vazia
  @concurso_sigla @filtro @entrega_2 @autorizacoes_filtro_cargo_inexistente
  Cenário: Filtrar autorizações por código de cargo inexistente retorna lista vazia
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/autorizacoes-publicadas/?cargo__codigo=999999999"
    Então o status CONCURSO deve ser 200
    E a lista de resultados CONCURSO deve estar vazia

  # CENÁRIO 43 — Criar autorização sem cargo retorna 400
  @concurso_sigla @negativo @entrega_2 @autorizacoes_criar_sem_cargo
  Cenário: Criar autorização sem cargo retorna 400
    Quando eu crio uma autorização CONCURSO sem cargo
    Então o status CONCURSO deve ser 400
    E a mensagem de erro CONCURSO do campo "cargo" deve ser "Este campo é obrigatório."

  # CENÁRIO 44 — PATCH na autorização persiste a nova quantidade
  @concurso_sigla @smoke @entrega_2 @autorizacoes_patch
  Cenário: Atualizar parcialmente autorização persiste a nova quantidade
    Dado que tenho uma autorização CONCURSO de teste criada
    Quando eu atualizo parcialmente a autorização CONCURSO criada com:
      | campo        | valor |
      | autorizacoes | 150   |
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve ter o campo "autorizacoes" igual a "150"
    E ao consultar a autorização CONCURSO criada o campo "autorizacoes" deve ser "150"

  # CENÁRIO 45 — PUT na autorização substitui todos os campos
  @concurso_sigla @smoke @entrega_2 @autorizacoes_put
  Cenário: Atualizar autorização via PUT persiste todos os campos enviados
    Dado que tenho uma autorização CONCURSO de teste criada
    Quando eu atualizo a autorização CONCURSO criada via PUT com:
      | campo            | valor                             |
      | autorizacoes     | 200                               |
      | data_autorizacao | 2026-07-01                        |
      | observacao       | Autorização atualizada via PUT    |
    Então o status CONCURSO deve ser 200
    E ao consultar a autorização CONCURSO criada o campo "autorizacoes" deve ser "200"
    E ao consultar a autorização CONCURSO criada o campo "data_autorizacao" deve ser "2026-07-01"
    E ao consultar a autorização CONCURSO criada o campo "observacao" deve ser "Autorização atualizada via PUT"

  # CENÁRIO 46 — Quantidade não numérica é rejeitada
  @concurso_sigla @negativo @entrega_2 @autorizacoes_patch_quantidade_invalida
  Cenário: Atualizar autorização com quantidade não numérica retorna 400
    Dado que tenho uma autorização CONCURSO de teste criada
    Quando eu atualizo parcialmente a autorização CONCURSO criada com:
      | campo        | valor |
      | autorizacoes | abc   |
    Então o status CONCURSO deve ser 400
    E a mensagem de erro CONCURSO do campo "autorizacoes" deve ser "Um número inteiro válido é exigido."

  # CENÁRIO 47 — Data fora do formato ISO é rejeitada
  @concurso_sigla @negativo @entrega_2 @autorizacoes_patch_data_invalida
  Cenário: Atualizar autorização com data fora do formato ISO retorna 400
    Dado que tenho uma autorização CONCURSO de teste criada
    Quando eu atualizo parcialmente a autorização CONCURSO criada com:
      | campo            | valor      |
      | data_autorizacao | 31-12-2026 |
    Então o status CONCURSO deve ser 400
    E a mensagem de erro CONCURSO do campo "data_autorizacao" deve ser "Formato inválido para data. Use um dos formatos a seguir: YYYY-MM-DD."

  # CENÁRIO 48 — Quantidade negativa de autorizações deveria ser rejeitada
  # BUG: hoje a QA aceita autorizacoes = -5 e retorna 200.
  @concurso_sigla @negativo @bug_conhecido @skip @autorizacoes_patch_negativo
  Cenário: Atualizar autorização com quantidade negativa retorna 400
    Dado que tenho uma autorização CONCURSO de teste criada
    Quando eu atualizo parcialmente a autorização CONCURSO criada com:
      | campo        | valor |
      | autorizacoes | -5    |
    Então o status CONCURSO deve ser 400

  # CENÁRIO 49 — Excluir autorização remove o registro
  @concurso_sigla @smoke @entrega_2 @autorizacoes_delete
  Cenário: Excluir autorização remove o registro definitivamente
    Dado que tenho uma autorização CONCURSO de teste criada
    Quando eu excluo a autorização CONCURSO criada
    Então o status CONCURSO deve ser 204
    E a autorização CONCURSO criada não deve mais existir

  # CENÁRIO 50 — Alterar ou excluir autorização inexistente retorna 404
  @concurso_sigla @negativo @entrega_2 @autorizacoes_inexistente
  Esquema do Cenário: <metodo> em autorização inexistente retorna 404
    Quando eu faço uma requisição CONCURSO de método "<metodo>" para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/autorizacoes-publicadas/00000000-0000-0000-0000-000000000000/"
    Então o status CONCURSO deve ser 404

    Exemplos:
      | metodo |
      | PATCH  |
      | DELETE |
