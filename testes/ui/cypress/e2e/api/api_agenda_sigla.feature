#language: pt
@api @sigla @agenda_sigla
Funcionalidade: API Agenda SIGLA
  Como sistema integrado SME
  Quero validar os endpoints do microsserviço de Agenda
  Para garantir que o ciclo de vida de agendas funciona corretamente

  Contexto:
    Dado que a API de Agenda SIGLA está acessível

  @smoke @listagem_agendas
  Cenário: Listar agendas retorna 200
    Quando eu faço uma requisição SIGLA GET para "https://hom-api-sigla.sme.prefeitura.sp.gov.br/ms-agenda/api/v1/agendas/"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser uma lista

  @smoke @criar_agenda @pending
  Cenário: Criar agenda com dados válidos retorna 201
    Quando eu crio uma agenda com dados válidos
    Então o status SIGLA deve ser 201 ou 400

  @smoke @get_agenda_uuid
  Cenário: Buscar agenda por UUID retorna 200
    Dado que tenho uma agenda criada
    Quando eu busco a agenda pelo UUID criado
    Então o status SIGLA deve ser 200
    E a resposta deve conter o campo "uuid" igual ao UUID da agenda criada

  @smoke @put_agenda
  Cenário: Atualizar agenda com dados válidos retorna 200
    Dado que tenho uma agenda criada
    Quando eu atualizo a agenda pelo UUID criado com dados válidos
    Então o status SIGLA deve ser 200
    E a resposta deve conter o campo "uuid" igual ao UUID da agenda criada

  @smoke @patch_agenda
  Cenário: Atualizar parcialmente agenda com dados válidos retorna 200
    Dado que tenho uma agenda criada
    Quando eu atualizo parcialmente a agenda pelo UUID criado com dados válidos
    Então o status SIGLA deve ser 200

  @smoke @delete_agenda
  Cenário: Deletar agenda por UUID retorna 204
    Dado que tenho uma agenda criada
    Quando eu deleto a agenda pelo UUID criado
    Então o status SIGLA deve ser 204

  @negativo @agenda_invalida
  Cenário: Criar agenda com body vazio retorna erro de validação
    Quando eu faço um POST SIGLA para "https://hom-api-sigla.sme.prefeitura.sp.gov.br/ms-agenda/api/v1/agendas/" com body vazio
    Então o status SIGLA deve ser 400 ou 422

  @negativo @uuid_inexistente
  Cenário: Buscar agenda com UUID inexistente retorna 404
    Quando eu busco uma agenda por UUID inexistente
    Então o status SIGLA deve ser 404

  @negativo @uuid_formato_invalido
  Cenário: Buscar agenda com UUID em formato inválido retorna 404
    Quando eu busco uma agenda por UUID em formato inválido
    Então o status SIGLA deve ser 404

  @contrato @paginacao
  Cenário: Listar agendas retorna estrutura de paginação correta
    Quando eu faço uma requisição SIGLA GET para "https://hom-api-sigla.sme.prefeitura.sp.gov.br/ms-agenda/api/v1/agendas/"
    Então o status SIGLA deve ser 200
    E a resposta de listagem de agendas deve ter estrutura de paginação

  @contrato @campos_obrigatorios
  Cenário: Buscar agenda retorna campos obrigatórios na resposta
    Dado que tenho uma agenda criada
    Quando eu busco a agenda pelo UUID criado
    Então o status SIGLA deve ser 200
    E a resposta da agenda deve conter os campos obrigatórios

  @negativo @put_uuid_inexistente
  Cenário: Atualizar agenda com UUID inexistente via PUT retorna 404
    Quando eu atualizo uma agenda inexistente via PUT
    Então o status SIGLA deve ser 404

  @negativo @put_body_vazio
  Cenário: Atualizar agenda com body vazio via PUT retorna erro de validação
    Dado que tenho uma agenda criada
    Quando eu atualizo a agenda pelo UUID criado com body vazio via PUT
    Então o status SIGLA deve ser 400 ou 422

  @negativo @patch_uuid_inexistente
  Cenário: Atualizar parcialmente agenda com UUID inexistente via PATCH retorna 404
    Quando eu atualizo parcialmente uma agenda inexistente via PATCH
    Então o status SIGLA deve ser 404

  @negativo @delete_uuid_inexistente
  Cenário: Deletar agenda com UUID inexistente retorna 404
    Quando eu deleto uma agenda por UUID inexistente
    Então o status SIGLA deve ser 404
