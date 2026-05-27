#language: pt
@api @sigla @concurso_sigla
Funcionalidade: API Concurso SIGLA
  Como sistema integrado SME
  Quero validar os endpoints do microsserviço de Concurso
  Para garantir que o gerenciamento de concursos funciona corretamente

  # ============================================================================
  # BASE URL: https://qa-api-sigla.sme.prefeitura.sp.gov.br
  # Microsserviço: ms-processos-concursos
  # ============================================================================

  Contexto:
    Dado que a API de Concursos SIGLA está acessível

  # ============================================================================
  # GET /ms-processos-concursos/api/v1/autorizacoes-publicadas/
  # ============================================================================

  @smoke @autorizacoes_listagem
  Cenário: Listar autorizações publicadas sem filtros retorna 200
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/autorizacoes-publicadas/"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "count"
    E a resposta CONCURSO deve conter "results"

  @filtro @autorizacoes_ordenacao
  Cenário: Ordenar autorizações por cargo retorna 200
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/autorizacoes-publicadas/?ordering=cargo"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "results"

  @validacao @autorizacoes_schema
  Cenário: Validar schema completo da resposta de autorizações publicadas
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/autorizacoes-publicadas/"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve ser um objeto
    E a resposta CONCURSO deve conter "count"
    E a resposta CONCURSO deve conter "next"
    E a resposta CONCURSO deve conter "previous"
    E a resposta CONCURSO deve conter "results"
    E a lista de resultados CONCURSO não deve estar vazia

  @paginacao @autorizacoes_page_size
  Cenário: Listar autorizações com page_size customizado retorna 200
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/autorizacoes-publicadas/?page_size=5"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "results"
    E a contagem total CONCURSO deve ser maior que zero

  # ============================================================================
  # POST /ms-processos-concursos/api/v1/autorizacoes-publicadas/
  # ============================================================================

  @smoke @autorizacoes_criar
  Cenário: Criar autorização publicada com dados válidos retorna 201
    Quando eu crio uma autorização CONCURSO com payload "autorizacaoPublicadaValida"
    Então o status CONCURSO deve ser 201
    E a resposta CONCURSO deve conter "uuid"
    E a resposta CONCURSO deve conter "cargo"
    E a resposta CONCURSO deve conter "autorizacoes"

  @validacao @autorizacoes_campos_obrigatorios
  Cenário: Validar campos obrigatórios da autorização criada
    Quando eu crio uma autorização CONCURSO com payload "autorizacaoPublicadaValida"
    Então o status CONCURSO deve ser 201
    E o campo "uuid" da resposta CONCURSO deve ser um UUID válido
    E a resposta CONCURSO deve conter "cargo"
    E a resposta CONCURSO deve conter "autorizacoes"
    E a resposta CONCURSO deve conter "data_autorizacao"
    E o campo "data_autorizacao" da resposta CONCURSO deve ser uma data válida

  @negativo @autorizacoes_criar_cargo_invalido
  Cenário: Criar autorização com cargo inexistente retorna 400
    Quando eu crio uma autorização CONCURSO com payload "autorizacaoPublicadaCargoInvalido"
    Então o status CONCURSO deve ser 400
    E a resposta CONCURSO deve conter "Cargo não encontrado"

  # ============================================================================
  # GET /ms-processos-concursos/api/v1/autorizacoes-publicadas/{uuid}/
  # ============================================================================

  @smoke @autorizacoes_buscar_uuid
  Cenário: Buscar autorização por UUID válido retorna 200
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/autorizacoes-publicadas/299f830c-5e8a-42d4-83d1-d36d98912397/"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "uuid"
    E a resposta CONCURSO deve conter "cargo"

  @negativo @autorizacoes_buscar_uuid_invalido
  Cenário: Buscar autorização com UUID inexistente retorna 404
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/autorizacoes-publicadas/00000000-0000-0000-0000-000000000000/"
    Então o status CONCURSO deve ser 404

  # ============================================================================
  # GET /ms-processos-concursos/api/v1/cargos/
  # ============================================================================

  @smoke @cargos_listagem
  Cenário: Listar cargos sem filtros retorna 200
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/cargos/"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "count"
    E a resposta CONCURSO deve conter "results"

  @filtro @cargos_busca
  Cenário: Buscar cargos por termo retorna 200
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/cargos/?search=DIRETOR"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "results"

  @validacao @cargos_busca_case_insensitive
  Cenário: Buscar cargos com termo em lowercase retorna resultados
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/cargos/?search=professor"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "results"
    E a lista de resultados CONCURSO não deve estar vazia

  @negativo @cargos_pagina_invalida
  Cenário: Requisitar página inválida de cargos retorna 404
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/cargos/?page=999999"
    Então o status CONCURSO deve ser 404

  # ============================================================================
  # POST /ms-processos-concursos/api/v1/cargos/ - REQUER AUTENTICAÇÃO
  # ============================================================================

  @negativo @cargos_criar_sem_autenticacao
  Cenário: Tentar criar cargo sem autenticação retorna 403
    Quando eu crio um cargo CONCURSO com payload "cargoValido"
    Então o status CONCURSO deve ser 403

  # ============================================================================
  # GET /ms-processos-concursos/api/v1/concursos/
  # ============================================================================

  @smoke @concursos_listagem
  Cenário: Listar concursos sem filtros retorna 200
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "count"
    E a resposta CONCURSO deve conter "results"

  @filtro @concursos_busca
  Cenário: Buscar concursos por nome retorna 200
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/?search=DIRETOR"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "results"

  @validacao @concursos_campos_obrigatorios
  Cenário: Validar estrutura da resposta de listagem de concursos
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "count"
    E a resposta CONCURSO deve conter "results"
    E a contagem total CONCURSO deve ser maior que zero

  @filtro @concursos_ordenacao_descendente
  Cenário: Ordenar concursos por nome decrescente retorna 200
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/?ordering=-nome"
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "results"

  @negativo @concursos_pagina_invalida
  Cenário: Requisitar página inválida de concursos retorna 404
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/?page=999999"
    Então o status CONCURSO deve ser 404

  # ============================================================================
  # POST /ms-processos-concursos/api/v1/concursos/
  # ============================================================================

  @smoke @concursos_criar
  Cenário: Criar concurso com dados válidos retorna 201
    Quando eu crio um concurso CONCURSO com payload "concursoValido"
    Então o status CONCURSO deve ser 201
    E a resposta CONCURSO deve conter "uuid"
    E a resposta CONCURSO deve conter "nome"
    E a resposta CONCURSO deve conter "codigo"

  @negativo @concursos_criar_sem_nome
  Cenário: Criar concurso sem nome retorna 400
    Quando eu crio um concurso CONCURSO com payload "concursoSemNome"
    Então o status CONCURSO deve ser 400
