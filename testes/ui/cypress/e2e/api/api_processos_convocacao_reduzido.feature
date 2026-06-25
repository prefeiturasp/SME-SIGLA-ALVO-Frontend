#language: pt
@api @sigla @processos_convocacao
Funcionalidade: API Processos Convocação SIGLA
  Como sistema integrado SME
  Quero validar os endpoints do microsserviço de Processos Convocação
  Para garantir que o ciclo de vida de convocações funciona corretamente

  Contexto:
    Dado que a API de Processos Convocação está acessível

  # GET /carta-convocacao/
  @smoke
  Cenário: Listar cartas de convocação retorna 200
    Quando eu faço uma requisição SIGLA GET para "/carta-convocacao/"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser uma lista

  @negativo
  Cenário: Acessar cartas com método não permitido retorna 405
    Quando eu faço uma requisição SIGLA de método "PUT" para "/carta-convocacao/" sem body
    Então o status SIGLA deve ser 405

  # POST /carta-convocacao/
  @smoke
  Cenário: Criar carta de convocação com dados válidos retorna sucesso
    Quando eu crio uma carta de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201

  @negativo
  Cenário: Criar carta com body vazio retorna erro de validação
    Quando eu faço um POST SIGLA para "/carta-convocacao/" com body vazio
    Então o status SIGLA deve ser 400

  # GET /carta-convocacao/{uuid}/
  @smoke
  Cenário: Buscar carta de convocação por UUID retorna 200
    Dado que tenho uma carta de convocação criada
    Quando eu busco a carta de convocação pelo UUID criado
    Então o status SIGLA deve ser 200

  @negativo
  Cenário: Buscar carta com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA GET para "/carta-convocacao/00000000-0000-0000-0000-000000000000/"
    Então o status SIGLA deve ser 404

  # POST /processos-convocacao/
  @smoke
  Cenário: Criar processo de convocação com dados válidos retorna sucesso
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201

  @validacao
  Cenário: Criar processo de convocação gera UUID único
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E o campo "uuid" da resposta deve ser um UUID válido

  @negativo
  Cenário: Criar processo com body vazio retorna erro de validação
    Quando eu faço um POST SIGLA para "/processos-convocacao/" com body vazio
    Então o status SIGLA deve ser 400

  # GET /processos-convocacao/{uuid}/
  @smoke
  Cenário: Buscar processo de convocação por UUID retorna 200
    Dado que tenho um processo de convocação existente
    Quando eu busco o processo de convocação pelo UUID criado
    Então o status SIGLA deve ser 200

  @validacao
  Cenário: Processo retornado por UUID é um objeto com dados
    Dado que tenho um processo de convocação existente
    Quando eu busco o processo de convocação pelo UUID criado
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser um objeto

  @negativo
  Cenário: Buscar processo com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/00000000-0000-0000-0000-000000000000/"
    Então o status SIGLA deve ser 404

  # PUT /processos-convocacao/{uuid}/
  @smoke
  Cenário: Atualização completa de processo retorna 200
    Dado que tenho um processo de convocação existente
    Quando eu faço um PUT no processo de convocação criado com dados válidos
    Então o status SIGLA deve ser 200

  @negativo
  Cenário: PUT em processo inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "PUT" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/" sem body
    Então o status SIGLA deve ser 404 ou 400

  # PATCH /processos-convocacao/{uuid}/
  @smoke
  Cenário: Atualização parcial de processo retorna 200
    Dado que tenho um processo de convocação existente
    Quando eu faço um PATCH no processo de convocação criado com dados parciais
    Então o status SIGLA deve ser 200

  @negativo
  Cenário: PATCH em processo inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "PATCH" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/" sem body
    Então o status SIGLA deve ser 404

  # DELETE /processos-convocacao/{uuid}/
  @smoke
  Cenário: Deletar processo de convocação existente retorna sucesso
    Dado que tenho um processo de convocação existente
    Quando eu deleto o processo de convocação criado
    Então o status SIGLA deve ser 204 ou 200

  @validacao
  Cenário: Processo deletado não pode ser recuperado
    Dado que tenho um processo de convocação existente
    Quando eu deleto o processo de convocação criado
    Então o status SIGLA deve ser 204 ou 200
    E o processo deletado não deve mais existir

  @negativo
  Cenário: Deletar processo com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "DELETE" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/" sem body
    Então o status SIGLA deve ser 404

  # POST /processos-convocacao/{uuid}/finalizar/
  @smoke
  Cenário: Finalizar processo não retorna erro de servidor
    Dado que tenho um processo de convocação existente
    Quando eu finalizo o processo de convocação criado
    Então o status SIGLA não deve ser 500

  @validacao
  Cenário: Finalizar processo retorna resposta no formato esperado
    Dado que tenho um processo de convocação existente
    Quando eu finalizo o processo de convocação criado
    Então o status SIGLA deve ser 200 ou 400
    E a resposta SIGLA deve ser um objeto ou lista

  # PATCH /processos-convocacao/{uuid}/passo/
  @smoke
  Cenário: Avançar passo de processo não retorna erro de servidor
    Dado que tenho um processo de convocação existente
    Quando eu avanço o passo do processo de convocação criado
    Então o status SIGLA não deve ser 500

  @validacao
  Cenário: Avançar passo retorna resposta no formato esperado
    Dado que tenho um processo de convocação existente
    Quando eu avanço o passo do processo de convocação criado
    Então o status SIGLA deve ser 200 ou 400
    E a resposta SIGLA deve ser um objeto ou lista

  @negativo
  Cenário: Avançar passo de processo com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "PATCH" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/passo/" sem body
    Então o status SIGLA deve ser 404

  # GET /processos-convocacao/{processo_pk}/cargos/
  @smoke
  Cenário: Listar cargos do processo retorna 200
    Dado que tenho um processo de convocação existente
    Quando eu listo os cargos do processo de convocação criado
    Então o status SIGLA deve ser 200

  @validacao
  Cenário: Validar Content-Type da listagem de cargos
    Dado que tenho um processo de convocação existente
    Quando eu listo os cargos do processo de convocação criado
    Então o status SIGLA deve ser 200
    E o header Content-Type SIGLA deve conter "application/json"

  @negativo
  Cenário: Listar cargos de processo inexistente retorna 404
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/00000000-0000-0000-0000-000000000000/cargos/"
    Então o status SIGLA deve ser 404

  # POST /processos-convocacao/{processo_pk}/cargos/
  @smoke
  Cenário: Adicionar cargo ao processo retorna sucesso
    Dado que tenho um processo de convocação existente
    Quando eu adiciono um cargo ao processo de convocação criado
    Então o status SIGLA deve ser 200 ou 201

  @validacao
  Cenário: Cargo adicionado ao processo gera UUID único
    Dado que tenho um processo de convocação existente
    Quando eu adiciono um cargo ao processo de convocação criado
    Então o status SIGLA deve ser 200 ou 201
    E o campo "uuid" da resposta deve ser um UUID válido

  # DELETE /processos-convocacao/{processo_pk}/cargos/{cargo_uuid}/
  @smoke
  Cenário: Deletar cargo do processo retorna sucesso
    Dado que tenho um cargo adicionado ao processo de convocação
    Quando eu deleto o cargo criado do processo
    Então o status SIGLA deve ser 204 ou 200

  @validacao
  Cenário: Cargo deletado não pode ser recuperado
    Dado que tenho um cargo adicionado ao processo de convocação
    Quando eu deleto o cargo criado do processo
    Então o status SIGLA deve ser 204 ou 200
    E o cargo deletado não deve mais existir no processo

  @negativo
  Cenário: Deletar cargo com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "DELETE" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/cargos/00000000-0000-0000-0000-000000000000/" sem body
    Então o status SIGLA deve ser 404 ou 400

  # GET /processos-convocacao/filtros/
  @smoke
  Cenário: Obter filtros disponíveis retorna 200
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/filtros/"
    Então o status SIGLA deve ser 200


  @negativo
  Cenário: Acessar filtros com método DELETE retorna erro
    Quando eu faço uma requisição SIGLA de método "DELETE" para "/processos-convocacao/filtros/" sem body
    Então o status SIGLA deve ser 405 ou 400

  # FLUXO DE VALOR
  @valor
  Cenário: Fluxo completo — criar processo, adicionar cargo e deletar tudo
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    Quando eu adiciono um cargo ao processo criado no fluxo completo
    Então o status SIGLA deve ser 200 ou 201
    Quando eu deleto o cargo criado no fluxo completo
    Então o status SIGLA deve ser 204 ou 200
    Quando eu deleto o processo criado no fluxo completo
    Então o status SIGLA deve ser 204 ou 200

  @valor
  Cenário: Processo criado aparece na listagem geral
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E o processo criado deve aparecer na listagem de processos

  @valor
  Cenário: Múltiplos GETs no mesmo processo retornam dados consistentes
    Dado que tenho um processo de convocação existente
    Quando eu busco o processo de convocação pelo UUID criado
    Então o status SIGLA deve ser 200
    E ao buscar novamente o mesmo processo o resultado deve ser idêntico

  @valor
  Cenário: Dados atualizados via PATCH são refletidos no GET subsequente
    Dado que tenho um processo de convocação existente
    Quando eu faço um PATCH no processo de convocação criado com dados parciais
    Então o status SIGLA deve ser 200
    E ao buscar o processo atualizado o campo modificado deve refletir a mudança

  @valor
  Cenário: Processo recém-criado tem lista de cargos válida
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E a lista de cargos do processo criado deve ser uma lista válida
