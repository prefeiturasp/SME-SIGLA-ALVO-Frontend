#language: pt
@api @sigla @concurso_sigla @consulta
Funcionalidade: API Concurso SIGLA - Consulta por UUID
  Como sistema integrado SME
  Quero consultar um concurso específico pelo seu identificador
  Para garantir que os dados persistidos são recuperáveis e consistentes entre endpoints

  # BASE URL: https://qa-api-sigla.sme.prefeitura.sp.gov.br
  # Microsserviço: ms-processos-concursos
  # Complementa api_concurso_sigla.feature (CRUD isolado), fechando o par
  # GET por UUID que hoje só existe para autorizações-publicadas, e validando
  # o efeito de negócio: o concurso criado deve ser buscável e aparecer na
  # listagem geral, não apenas retornar 201 no momento da criação.

  Contexto:
    Dado que a API de Concursos SIGLA está acessível

  # GET /ms-processos-concursos/api/v1/concursos/{uuid}/

  # CENÁRIO 1 — Buscar concurso por UUID válido retorna 200
  @smoke @concursos_buscar_uuid
  Cenário: Buscar concurso por UUID válido retorna 200
    Quando eu crio um concurso CONCURSO com payload "concursoValido"
    Então o status CONCURSO deve ser 201
    Quando eu busco o concurso CONCURSO pelo UUID criado
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "uuid"
    E a resposta CONCURSO deve conter "nome"

  # CENÁRIO 2 — Buscar concurso com UUID inexistente retorna 404
  @negativo @concursos_buscar_uuid_invalido
  Cenário: Buscar concurso com UUID inexistente retorna 404
    Quando eu faço uma requisição CONCURSO GET para "https://qa-api-sigla.sme.prefeitura.sp.gov.br/ms-processos-concursos/api/v1/concursos/00000000-0000-0000-0000-000000000000/"
    Então o status CONCURSO deve ser 404

  # CENÁRIO 3 — Fluxo completo: criar concurso, buscar por UUID e localizar na listagem geral
  @valor @concursos_fluxo_completo
  Cenário: Fluxo completo — criar concurso, buscar por UUID e localizar na listagem geral
    Quando eu crio um concurso CONCURSO com payload "concursoValido"
    Então o status CONCURSO deve ser 201
    E a resposta CONCURSO deve conter "uuid"

    Quando eu busco o concurso CONCURSO pelo UUID criado
    Então o status CONCURSO deve ser 200
    E a resposta CONCURSO deve conter "nome"
    E o concurso criado deve aparecer na listagem geral de concursos
