#language: pt
@api @sigla @escolha_sigla
Funcionalidade: API Escolha de Vagas SIGLA
  Como sistema integrado SME
  Quero validar os endpoints do microsserviço de Escolha de Vagas
  Para garantir que o ciclo de vida de escolhas funciona corretamente

  # ============================================================================
  # BASE URL: https://qa-api-sigla.sme.prefeitura.sp.gov.br
  # Microsserviços: ms-escolha-vagas (vagas) e ms-escolha (escolha, inclusão)
  # NOTA: Microsserviço não disponível no ambiente QA - usando MOCK nos cenários principais
  # ============================================================================

  Contexto:
    Dado que a API de Escolha de Vagas SIGLA está acessível

  # ============================================================================
  # GET /ms-escolha-vagas/api/schema/
  # ============================================================================

  # @smoke @escolha_schema @mock
  # Cenário: Listar schema OpenAPI retorna estrutura válida (MOCK)
  #   Dado que eu configuro mock para schema OpenAPI
  #   Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/schema/?format=json"
  #   Então o status ESCOLHA deve ser 200
  #   E a resposta ESCOLHA deve conter "paths"
  #   E a resposta ESCOLHA deve conter "ms-escolha-vagas"

  # ============================================================================
  # GET /ms-escolha-vagas/api/v1/vagas/
  # ============================================================================

  # @smoke @vagas_listagem @mock
  # Cenário: Listar vagas disponíveis retorna estrutura paginada (MOCK)
  #   Dado que eu configuro mock para listagem de vagas
  #   Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/vagas/"
  #   Então o status ESCOLHA deve ser 200
  #   E a resposta ESCOLHA deve conter "count"
  #   E a resposta ESCOLHA deve conter "results"

  @negativo @vagas_pagina_invalida
  Cenário: Requisitar página inexistente de vagas retorna 404
    Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/vagas/?page=999999"
    Então o status ESCOLHA deve ser 404

  # ============================================================================
  # GET /ms-escolha-vagas/api/v1/vagas/{uuid}/
  # ============================================================================

  @negativo @vagas_uuid_invalido
  Cenário: Buscar vaga com UUID inexistente retorna 404
    Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/vagas/00000000-0000-0000-0000-000000000000/"
    Então o status ESCOLHA deve ser 404

  @negativo @vagas_uuid_formato_invalido
  Cenário: Buscar vaga com UUID em formato inválido retorna 404
    Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/vagas/uuid-invalido/"
    Então o status ESCOLHA deve ser 404

  # ============================================================================
  # GET /ms-escolha-vagas/api/v1/escolha/
  # ============================================================================

  # @smoke @escolha_listagem
  # Cenário: Listar escolhas retorna estrutura paginada
  #   Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/escolha/"
  #   Então o status ESCOLHA deve ser 200
  #   E a resposta ESCOLHA deve conter "count"
  #   E a resposta ESCOLHA deve conter "results"

  @negativo @escolha_pagina_invalida
  Cenário: Requisitar página inexistente retorna 404
    Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/escolha/?page=999999"
    Então o status ESCOLHA deve ser 404

  # ============================================================================
  # POST /ms-escolha-vagas/api/v1/escolha/
  # ============================================================================

  # @smoke @escolha_criar @mock
  # Cenário: Criar escolha com dados válidos retorna 201 (MOCK)
  #   Dado que eu configuro mock para criar escolha
  #   Quando eu crio uma escolha ESCOLHA com payload "escolhaValida"
  #   Então o status ESCOLHA deve ser 201
  #   E a resposta ESCOLHA deve conter "uuid"
  #   E o campo "uuid" da resposta ESCOLHA deve ser um UUID válido

  # @negativo @escolha_criar_sem_processo
  # Cenário: Criar escolha sem processo_uuid retorna 400
  #   Quando eu crio uma escolha ESCOLHA com payload "escolhaSemProcesso"
  #   Então o status ESCOLHA deve ser 400

  # @negativo @escolha_criar_body_vazio
  # Cenário: Criar escolha com body vazio retorna 400
  #   Quando eu faço um POST ESCOLHA para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/escolha/" com body vazio
  #   Então o status ESCOLHA deve ser 400

  # @negativo @escolha_criar_sem_candidato
  # Cenário: Criar escolha sem candidato_uuid retorna 400
  #   Quando eu crio uma escolha ESCOLHA com payload "escolhaSemCandidato"
  #   Então o status ESCOLHA deve ser 400

  # @negativo @escolha_criar_sem_vaga
  # Cenário: Criar escolha sem vaga_uuid retorna 400
  #   Quando eu crio uma escolha ESCOLHA com payload "escolhaSemVaga"
  #   Então o status ESCOLHA deve ser 400

  # ============================================================================
  # GET /ms-escolha-vagas/api/v1/escolha/{uuid}/
  # ============================================================================

  # @smoke @escolha_buscar_uuid @mock
  # Cenário: Buscar escolha por UUID retorna dados completos (MOCK)
  #   Dado que eu configuro mock para buscar escolha por UUID
  #   Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/escolha/12345678-1234-1234-1234-123456789abc/"
  #   Então o status ESCOLHA deve ser 200
  #   E a resposta ESCOLHA deve conter "uuid"
  #   E a resposta ESCOLHA deve conter "processo_uuid"

  @negativo @escolha_uuid_invalido
  Cenário: Buscar escolha com UUID inexistente retorna 404
    Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/escolha/00000000-0000-0000-0000-000000000000/"
    Então o status ESCOLHA deve ser 404

  # ============================================================================
  # PUT /ms-escolha-vagas/api/v1/escolha/{uuid}/
  # ============================================================================

  # @smoke @escolha_atualizar
  # Cenário: Atualizar escolha com PUT retorna 200
  #   Dado que tenho uma escolha criada
  #   Quando eu atualizo a escolha pelo UUID criado com payload "escolhaAtualizada"
  #   Então o status ESCOLHA deve ser 200
  #   E a resposta ESCOLHA deve conter "uuid"

  @negativo @escolha_put_uuid_invalido
  Cenário: Atualizar escolha inexistente via PUT retorna 404
    Quando eu atualizo uma escolha inexistente via PUT com payload "escolhaAtualizada"
    Então o status ESCOLHA deve ser 404

  # ============================================================================
  # PATCH /ms-escolha-vagas/api/v1/escolha/{uuid}/
  # ============================================================================

  # @smoke @escolha_patch
  # Cenário: Atualizar parcialmente escolha com PATCH retorna 200
  #   Dado que tenho uma escolha criada
  #   Quando eu atualizo parcialmente a escolha pelo UUID criado com payload "escolhaPatch"
  #   Então o status ESCOLHA deve ser 200

  @negativo @escolha_patch_uuid_invalido
  Cenário: Atualizar escolha inexistente via PATCH retorna 404
    Quando eu atualizo parcialmente uma escolha inexistente via PATCH com payload "escolhaPatch"
    Então o status ESCOLHA deve ser 404

  # ============================================================================
  # DELETE /ms-escolha-vagas/api/v1/escolha/{uuid}/
  # ============================================================================

  # @smoke @escolha_deletar
  # Cenário: Deletar escolha retorna 204
  #   Dado que tenho uma escolha criada
  #   Quando eu deleto a escolha pelo UUID criado
  #   Então o status ESCOLHA deve ser 204

  @negativo @escolha_delete_uuid_invalido
  Cenário: Deletar escolha inexistente retorna 404
    Quando eu deleto uma escolha por UUID inexistente
    Então o status ESCOLHA deve ser 404

  # ============================================================================
  # POST /ms-escolha-vagas/api/v1/escolha/{uuid}/confirmar/
  # ============================================================================

  # @smoke @escolha_confirmar
  # Cenário: Confirmar escolha retorna sucesso
  #   Dado que tenho uma escolha criada
  #   Quando eu confirmo a escolha pelo UUID criado
  #   Então o status ESCOLHA deve ser 200 ou 400

  @negativo @escolha_confirmar_uuid_invalido
  Cenário: Confirmar escolha inexistente retorna 404
    Quando eu faço uma requisição ESCOLHA POST de ação "confirmar" para UUID inexistente
    Então o status ESCOLHA deve ser 404

  # ============================================================================
  # POST /ms-escolha-vagas/api/v1/escolha/{uuid}/cancelar/
  # ============================================================================

  # @smoke @escolha_cancelar
  # Cenário: Cancelar escolha retorna sucesso
  #   Dado que tenho uma escolha criada
  #   Quando eu cancelo a escolha pelo UUID criado
  #   Então o status ESCOLHA deve ser 200 ou 400

  @negativo @escolha_cancelar_uuid_invalido
  Cenário: Cancelar escolha inexistente retorna 404
    Quando eu faço uma requisição ESCOLHA POST de ação "cancelar" para UUID inexistente
    Então o status ESCOLHA deve ser 404

  # ============================================================================
  # GET /ms-escolha-vagas/api/v1/vagas-disponiveis/
  # ============================================================================

  # @smoke @vagas_disponiveis
  # Cenário: Listar vagas disponíveis para escolha retorna 200
  #   Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/vagas-disponiveis/"
  #   Então o status ESCOLHA deve ser 200

  # ============================================================================
  # POST /ms-escolha/api/v1/vagas-escolas/inclusao/
  # ============================================================================

  # @smoke @vagas_escolas_inclusao @mock
  # Cenário: Incluir vagas em lote existente retorna sucesso (MOCK)
  #   Dado que eu configuro mock para inclusão de vagas em lote
  #   Quando eu faço inclusão de vagas em lote com payload "vagasEscolasInclusaoValida"
  #   Então o status ESCOLHA deve ser 200 ou 201
  #   E a resposta ESCOLHA deve conter "uuid"
  #   E a resposta ESCOLHA deve conter "lote_uuid"
  #   E a resposta ESCOLHA deve conter "cargo_codigo"
  #   E o campo "uuid" da resposta ESCOLHA deve ser um UUID válido

  @negativo @vagas_inclusao_sem_processo
  Cenário: Incluir vagas sem processo_uuid retorna 400
    Quando eu faço inclusão de vagas em lote com payload "vagasEscolasInclusaoSemProcesso"
    Então o status ESCOLHA deve ser 400
    E a resposta ESCOLHA deve conter "processo_uuid"

  @negativo @vagas_inclusao_sem_vagas
  Cenário: Incluir vagas sem array de vagas retorna 400
    Quando eu faço inclusão de vagas em lote com payload "vagasEscolasInclusaoSemVagas"
    Então o status ESCOLHA deve ser 400
    E a resposta ESCOLHA deve conter "vagas"

  @negativo @vagas_inclusao_vagas_vazio
  Cenário: Incluir vagas com array vazio retorna 400
    Quando eu faço inclusão de vagas em lote com payload "vagasEscolasInclusaoVagasVazio"
    Então o status ESCOLHA deve ser 400

  @negativo @vagas_inclusao_processo_inexistente
  Cenário: Incluir vagas com processo_uuid inexistente retorna 400
    Quando eu faço inclusão de vagas em lote com payload "vagasEscolasInclusaoProcessoInexistente"
    Então o status ESCOLHA deve ser 400

  @negativo @vagas_inclusao_cargo_invalido
  Cenário: Incluir vagas com cargo inválido retorna 400
    Quando eu faço inclusão de vagas em lote com payload "vagasEscolasInclusaoCargoInvalido"
    Então o status ESCOLHA deve ser 400

  @negativo @vagas_inclusao_sem_escola_codigo
  Cenário: Incluir vagas sem código EOL da escola retorna 400
    Quando eu faço inclusão de vagas em lote com payload "vagasEscolasInclusaoSemEscolaCodigo"
    Então o status ESCOLHA deve ser 400

  @negativo @vagas_inclusao_data_fechamento_invalida
  Cenário: Incluir vagas com data de fechamento inválida retorna 400
    Quando eu faço inclusão de vagas em lote com payload "vagasEscolasInclusaoDataInvalida"
    Então o status ESCOLHA deve ser 400

  # ============================================================================
  # Cenários adicionais - Validações de campos obrigatórios
  # ============================================================================

  # @negativo @escolha_criar_uuid_invalido
  # Cenário: Criar escolha com UUIDs em formato inválido retorna 400
  #   Quando eu crio uma escolha ESCOLHA com payload "escolhaUuidInvalido"
  #   Então o status ESCOLHA deve ser 400

  # @negativo @escolha_criar_status_invalido
  # Cenário: Criar escolha com status inválido retorna 400
  #   Quando eu crio uma escolha ESCOLHA com payload "escolhaStatusInvalido"
  #   Então o status ESCOLHA deve ser 400

  # @negativo @vagas_filtro_status_invalido
  # Cenário: Filtrar vagas com status inválido retorna 400
  #   Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/vagas/?status=INVALIDO"
  #   Então o status ESCOLHA deve ser 400

  # @negativo @escolha_filtro_data_invalida
  # Cenário: Filtrar escolhas com formato de data inválido retorna 400
  #   Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/escolha/?created_at=data-invalida"
  #   Então o status ESCOLHA deve ser 400

  @negativo @vagas_inclusao_valores_negativos
  Cenário: Incluir vagas com valores negativos retorna 400
    Quando eu faço inclusão de vagas em lote com payload "vagasEscolasInclusaoValoresNegativos"
    Então o status ESCOLHA deve ser 400

  # ============================================================================
  # Performance
  # ============================================================================

  # @performance @escolha_tempo_resposta
  # Cenário: Listagem de escolhas responde em tempo aceitável
  #   Quando eu faço uma requisição ESCOLHA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-escolha-vagas/api/v1/escolha/"
  #   Então o status ESCOLHA deve ser 200
    E o tempo de resposta ESCOLHA deve ser menor que 5000 milissegundos
