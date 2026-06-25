#language: pt
@api @sigla @candidatos_sigla
Funcionalidade: API Candidatos SIGLA
  Como sistema integrado SME
  Quero validar os endpoints do microsserviço de Candidatos
  Para garantir que o gerenciamento de candidatos funciona corretamente

  # ============================================================================
  # BASE URL: https://qa-api-sigla.sme.prefeitura.sp.gov.br
  # AUTH: Não requer autenticação (anônimo)
  #
  # Endpoints cobertos:
  #   GET /ms-candidatos/api/schema/
  # ============================================================================

  Contexto:
    Dado que a API de Candidatos SIGLA está acessível

  # GET /ms-candidatos/api/schema/ — listar schema
  @smoke @schema_listagem
  Cenário: Listar schema OpenAPI em formato JSON retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/schema/?format=json"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "paths"
    E a resposta SIGLA deve conter "components"

  @smoke @schema_listagem
  Cenário: Listar schema OpenAPI em formato YAML retorna 406 (Not Acceptable)
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/schema/?format=yaml"
    Então o status SIGLA deve ser 406

  @contrato @schema_contrato
  Cenário: Schema contém endpoints de candidatos
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/schema/?format=json"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "/ms-candidatos/api/v1/candidatos/"
    E a resposta SIGLA deve conter "/ms-candidatos/api/v1/habilitados/"

  @negativo @schema_linguagem_invalida
  Cenário: Requisitar schema com linguagem inválida retorna 200 (não valida parâmetro)
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/schema/?lang=xyz"
    Então o status SIGLA deve ser 200

  # ============================================================================
  # GET /ms-candidatos/api/v1/candidatos/ — listar candidatos
  # ============================================================================

  @smoke @candidatos_listagem
  Cenário: Listar candidatos sem parâmetros retorna 200 e estrutura paginada
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "count"
    E a resposta SIGLA deve conter "next"
    E a resposta SIGLA deve conter "previous"
    E a resposta SIGLA deve conter "results"

  @smoke @candidatos_listagem
  Cenário: Listar candidatos retorna campos obrigatórios nos resultados
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "uuid"
    E a resposta SIGLA deve conter "nome"
    E a resposta SIGLA deve conter "cpf"
    E a resposta SIGLA deve conter "email"
    E a resposta SIGLA deve conter "status"
    E a resposta SIGLA deve conter "genero"

  @paginacao @candidatos_paginacao
  Cenário: Listar candidatos com paginação retorna página 2
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?page=2"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "results"
    E a resposta SIGLA deve conter "previous"

  @filtro @candidatos_filtro_genero
  Cenário: Filtrar candidatos por gênero feminino retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?genero=F"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "results"

  @filtro @candidatos_filtro_genero
  Cenário: Filtrar candidatos por gênero masculino retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?genero=M"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "results"

  @filtro @candidatos_filtro_estado
  Cenário: Filtrar candidatos por estado SP retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?estado=SP"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "results"

  @filtro @candidatos_filtro_cidade
  Cenário: Filtrar candidatos por cidade SAO PAULO retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?cidade=SAO%20PAULO"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "results"

  @filtro @candidatos_filtro_status
  Cenário: Filtrar candidatos por status ativo retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?status=ativo"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "results"

  @filtro @candidatos_filtro_status
  Cenário: Filtrar candidatos por status inativo retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?status=inativo"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "results"

  @busca @candidatos_busca
  Cenário: Buscar candidatos por termo retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?search=Candidato"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "results"

  @busca @candidatos_busca_cpf
  Cenário: Buscar candidatos por CPF retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?search=00095811036"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "results"

  @ordenacao @candidatos_ordenacao
  Cenário: Ordenar candidatos por nome retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?ordering=nome"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "results"

  @ordenacao @candidatos_ordenacao
  Cenário: Ordenar candidatos por nome decrescente retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?ordering=-nome"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "results"

  @filtro @candidatos_filtro_multiplo
  Cenário: Filtrar candidatos com múltiplos parâmetros retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?genero=F&estado=SP&status=ativo"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "results"

  @negativo @candidatos_pagina_invalida
  Cenário: Requisitar página inválida retorna 404
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/?page=999999"
    Então o status SIGLA deve ser 404

  @contrato @candidatos_estrutura
  Cenário: Validar estrutura completa de candidato na resposta
    Quando eu faço uma requisição SIGLA GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "uuid"
    E a resposta SIGLA deve conter "nome"
    E a resposta SIGLA deve conter "cpf"
    E a resposta SIGLA deve conter "email"
    E a resposta SIGLA deve conter "celular"
    E a resposta SIGLA deve conter "rg"
    E a resposta SIGLA deve conter "data_nascimento"
    E a resposta SIGLA deve conter "genero"
    E a resposta SIGLA deve conter "endereco"
    E a resposta SIGLA deve conter "cidade"
    E a resposta SIGLA deve conter "estado"
    E a resposta SIGLA deve conter "cep"
    E a resposta SIGLA deve conter "status"
    E a resposta SIGLA deve conter "concursos"

  # ============================================================================
  # POST /ms-candidatos/api/v1/candidatos/ — vincular candidato a concurso
  # NOTA: Este endpoint requer concurso_uuid e candidatos (não cria candidatos individuais)
  # ============================================================================

  @negativo @candidatos_criar_sem_concurso
  Cenário: Tentar criar candidato sem concurso_uuid retorna 400
    Quando eu crio um candidato SIGLA com payload "candidatoValido"
    Então o status SIGLA deve ser 400
    E a resposta SIGLA deve conter "concurso_uuid"
    E a resposta SIGLA deve conter "Este campo é obrigatório"

  @negativo @candidatos_criar_campos_obrigatorios
  Cenário: Criar candidato sem nome retorna 400
    Quando eu crio um candidato SIGLA com payload "candidatoSemNome"
    Então o status SIGLA deve ser 400

  @negativo @candidatos_criar_campos_obrigatorios
  Cenário: Criar candidato sem CPF retorna 400
    Quando eu crio um candidato SIGLA com payload "candidatoSemCPF"
    Então o status SIGLA deve ser 400

  @negativo @candidatos_criar_validacao
  Cenário: Criar candidato com email inválido retorna 400
    Quando eu crio um candidato SIGLA com payload "candidatoEmailInvalido"
    Então o status SIGLA deve ser 400

  @negativo @candidatos_criar_validacao
  Cenário: Criar candidato com CPF inválido retorna 400
    Quando eu crio um candidato SIGLA com payload "candidatoCPFInvalido"
    Então o status SIGLA deve ser 400

  @negativo @candidatos_criar_body_vazio
  Cenário: Criar candidato com body vazio retorna 400
    Quando eu faço um POST SIGLA para "https://hom-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/candidatos/" com body vazio
    Então o status SIGLA deve ser 400

  # ============================================================================
  # GET /ms-candidatos/api/v1/habilitados/ — listar candidatos habilitados
  # ============================================================================

  @smoke @habilitados_listagem
  Cenário: Listar habilitados sem filtros retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://hom-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/habilitados/"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser uma lista

  @filtro @habilitados_filtro_classificacao
  Cenário: Filtrar habilitados por classificacao retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://hom-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/habilitados/?classificacao=1"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser uma lista

  # ============================================================================
  # POST /ms-candidatos/api/v1/habilitados/ — criar candidato habilitado
  # NOTA: Endpoint requer campos específicos e lote válido (relacionamento complexo)
  # ============================================================================

  @negativo @habilitados_criar_campos_obrigatorios
  Cenário: Criar habilitado sem campos obrigatórios retorna 400
    Quando eu faço um POST SIGLA para "https://hom-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/habilitados/" com body vazio
    Então o status SIGLA deve ser 400

  @negativo @habilitados_criar_lote_invalido
  Cenário: Criar habilitado com lote inválido retorna 400
    Quando eu crio um habilitado SIGLA com payload "habilitadoLoteInvalido"
    Então o status SIGLA deve ser 400
    E a resposta SIGLA deve conter "lote"

  # ============================================================================
  # GET /ms-candidatos/api/v1/habilitados/{id}/ — buscar habilitado por ID
  # ============================================================================

  @smoke @habilitados_buscar_id
  Cenário: Buscar habilitado por ID válido retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://hom-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/habilitados/3660/"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve conter "uuid"

  @negativo @habilitados_buscar_id_invalido
  Cenário: Buscar habilitado com ID inexistente retorna 404
    Quando eu faço uma requisição SIGLA GET para "https://hom-api-sigla.sme.prefeitura.sp.gov.br/ms-candidatos/api/v1/habilitados/999999999/"
    Então o status SIGLA deve ser 404

  # ============================================================================
  # POST /ms-candidatos/api/v1/habilitados/buscar-por-uuids/
  # ============================================================================

  @smoke @habilitados_buscar_uuids
  Cenário: Buscar habilitados por UUIDs válidos retorna 200
    Quando eu busco habilitados SIGLA por UUIDs com payload "buscarPorUuidsValido"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser uma lista

  @negativo @habilitados_buscar_uuids_sem_campo
  Cenário: Buscar habilitados sem campo uuids retorna 400
    Quando eu busco habilitados SIGLA por UUIDs com payload "buscarPorUuidsSemCampo"
    Então o status SIGLA deve ser 400
    E a resposta SIGLA deve conter "uuids"
