#language: pt
@api @sigla @processos_convocacao
Funcionalidade: API Processos Convocação SIGLA
  Como sistema integrado SME
  Quero validar os endpoints do microsserviço de Processos Convocação
  Para garantir que o ciclo de vida de convocações funciona corretamente

  Contexto:
    Dado que a API de Processos Convocação está acessível

  # GET /carta-convocacao/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1 — Listar cartas de convocação retorna 200
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Listar cartas de convocação retorna 200
    Quando eu faço uma requisição SIGLA GET para "/carta-convocacao/"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser uma lista

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 2 — Acessar cartas com método não permitido retorna 405
  # ════════════════════════════════════════════════════════════════
  @negativo
  Cenário: Acessar cartas com método não permitido retorna 405
    Quando eu faço uma requisição SIGLA de método "PUT" para "/carta-convocacao/" sem body
    Então o status SIGLA deve ser 405

  # POST /carta-convocacao/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 3 — Criar carta de convocação com dados válidos retorna sucesso
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Criar carta de convocação com dados válidos retorna sucesso
    Quando eu crio uma carta de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 4 — Criar carta com body vazio retorna erro de validação
  # ════════════════════════════════════════════════════════════════
  @negativo
  Cenário: Criar carta com body vazio retorna erro de validação
    Quando eu faço um POST SIGLA para "/carta-convocacao/" com body vazio
    Então o status SIGLA deve ser 400

  # GET /carta-convocacao/{uuid}/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 5 — Buscar carta de convocação por UUID retorna 200
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Buscar carta de convocação por UUID retorna 200
    Dado que tenho uma carta de convocação criada
    Quando eu busco a carta de convocação pelo UUID criado
    Então o status SIGLA deve ser 200

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 6 — Buscar carta com UUID inexistente retorna 404
  # ════════════════════════════════════════════════════════════════
  @negativo
  Cenário: Buscar carta com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA GET para "/carta-convocacao/00000000-0000-0000-0000-000000000000/"
    Então o status SIGLA deve ser 404

  # POST /processos-convocacao/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 7 — Criar processo de convocação com dados válidos retorna sucesso
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Criar processo de convocação com dados válidos retorna sucesso
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 8 — Criar processo de convocação gera UUID único
  # ════════════════════════════════════════════════════════════════
  @validacao
  Cenário: Criar processo de convocação gera UUID único
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E o campo "uuid" da resposta deve ser um UUID válido

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 9 — Criar processo com body vazio retorna erro de validação
  # ════════════════════════════════════════════════════════════════
  @negativo
  Cenário: Criar processo com body vazio retorna erro de validação
    Quando eu faço um POST SIGLA para "/processos-convocacao/" com body vazio
    Então o status SIGLA deve ser 400

  # GET /processos-convocacao/{uuid}/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 10 — Buscar processo de convocação por UUID retorna 200
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Buscar processo de convocação por UUID retorna 200
    Dado que tenho um processo de convocação existente
    Quando eu busco o processo de convocação pelo UUID criado
    Então o status SIGLA deve ser 200

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 11 — Processo retornado por UUID é um objeto com dados
  # ════════════════════════════════════════════════════════════════
  @validacao
  Cenário: Processo retornado por UUID é um objeto com dados
    Dado que tenho um processo de convocação existente
    Quando eu busco o processo de convocação pelo UUID criado
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser um objeto

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 12 — Buscar processo com UUID inexistente retorna 404
  # ════════════════════════════════════════════════════════════════
  @negativo
  Cenário: Buscar processo com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/00000000-0000-0000-0000-000000000000/"
    Então o status SIGLA deve ser 404

  # PUT /processos-convocacao/{uuid}/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 13 — Atualização completa de processo retorna 200
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Atualização completa de processo retorna 200
    Dado que tenho um processo de convocação existente
    Quando eu faço um PUT no processo de convocação criado com dados válidos
    Então o status SIGLA deve ser 200

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 14 — PUT em processo inexistente retorna 404
  # ════════════════════════════════════════════════════════════════
  @negativo
  Cenário: PUT em processo inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "PUT" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/" sem body
    Então o status SIGLA deve ser 404 ou 400

  # PATCH /processos-convocacao/{uuid}/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 15 — Atualização parcial de processo retorna 200
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Atualização parcial de processo retorna 200
    Dado que tenho um processo de convocação existente
    Quando eu faço um PATCH no processo de convocação criado com dados parciais
    Então o status SIGLA deve ser 200

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 16 — PATCH em processo inexistente retorna 404
  # ════════════════════════════════════════════════════════════════
  @negativo
  Cenário: PATCH em processo inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "PATCH" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/" sem body
    Então o status SIGLA deve ser 404

  # DELETE /processos-convocacao/{uuid}/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 17 — Deletar processo de convocação existente retorna sucesso
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Deletar processo de convocação existente retorna sucesso
    Dado que tenho um processo de convocação existente
    Quando eu deleto o processo de convocação criado
    Então o status SIGLA deve ser 204 ou 200

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 18 — Processo deletado não pode ser recuperado
  # ════════════════════════════════════════════════════════════════
  @validacao
  Cenário: Processo deletado não pode ser recuperado
    Dado que tenho um processo de convocação existente
    Quando eu deleto o processo de convocação criado
    Então o status SIGLA deve ser 204 ou 200
    E o processo deletado não deve mais existir

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 19 — Deletar processo com UUID inexistente retorna 404
  # ════════════════════════════════════════════════════════════════
  @negativo
  Cenário: Deletar processo com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "DELETE" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/" sem body
    Então o status SIGLA deve ser 404

  # POST /processos-convocacao/{uuid}/finalizar/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 20 — Finalizar processo não retorna erro de servidor
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Finalizar processo não retorna erro de servidor
    Dado que tenho um processo de convocação existente
    Quando eu finalizo o processo de convocação criado
    Então o status SIGLA não deve ser 500

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 21 — Finalizar processo retorna resposta no formato esperado
  # ════════════════════════════════════════════════════════════════
  @validacao
  Cenário: Finalizar processo retorna resposta no formato esperado
    Dado que tenho um processo de convocação existente
    Quando eu finalizo o processo de convocação criado
    Então o status SIGLA deve ser 200 ou 400
    E a resposta SIGLA deve ser um objeto ou lista

  # PATCH /processos-convocacao/{uuid}/passo/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 22 — Avançar passo de processo não retorna erro de servidor
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Avançar passo de processo não retorna erro de servidor
    Dado que tenho um processo de convocação existente
    Quando eu avanço o passo do processo de convocação criado
    Então o status SIGLA não deve ser 500

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 23 — Avançar passo retorna resposta no formato esperado
  # ════════════════════════════════════════════════════════════════
  @validacao
  Cenário: Avançar passo retorna resposta no formato esperado
    Dado que tenho um processo de convocação existente
    Quando eu avanço o passo do processo de convocação criado
    Então o status SIGLA deve ser 200 ou 400
    E a resposta SIGLA deve ser um objeto ou lista

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 24 — Avançar passo de processo com UUID inexistente retorna 404
  # ════════════════════════════════════════════════════════════════
  @negativo
  Cenário: Avançar passo de processo com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "PATCH" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/passo/" sem body
    Então o status SIGLA deve ser 404

  # GET /processos-convocacao/{processo_pk}/cargos/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 25 — Listar cargos do processo retorna 200
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Listar cargos do processo retorna 200
    Dado que tenho um processo de convocação existente
    Quando eu listo os cargos do processo de convocação criado
    Então o status SIGLA deve ser 200

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 26 — Validar Content-Type da listagem de cargos
  # ════════════════════════════════════════════════════════════════
  @validacao
  Cenário: Validar Content-Type da listagem de cargos
    Dado que tenho um processo de convocação existente
    Quando eu listo os cargos do processo de convocação criado
    Então o status SIGLA deve ser 200
    E o header Content-Type SIGLA deve conter "application/json"

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 27 — Listar cargos de processo inexistente retorna 404
  # ════════════════════════════════════════════════════════════════
  @negativo
  Cenário: Listar cargos de processo inexistente retorna 404
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/00000000-0000-0000-0000-000000000000/cargos/"
    Então o status SIGLA deve ser 404

  # POST /processos-convocacao/{processo_pk}/cargos/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 28 — Adicionar cargo ao processo retorna sucesso
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Adicionar cargo ao processo retorna sucesso
    Dado que tenho um processo de convocação existente
    Quando eu adiciono um cargo ao processo de convocação criado
    Então o status SIGLA deve ser 200 ou 201

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 29 — Cargo adicionado ao processo gera UUID único
  # ════════════════════════════════════════════════════════════════
  @validacao
  Cenário: Cargo adicionado ao processo gera UUID único
    Dado que tenho um processo de convocação existente
    Quando eu adiciono um cargo ao processo de convocação criado
    Então o status SIGLA deve ser 200 ou 201
    E o campo "uuid" da resposta deve ser um UUID válido

  # DELETE /processos-convocacao/{processo_pk}/cargos/{cargo_uuid}/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 30 — Deletar cargo do processo retorna sucesso
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Deletar cargo do processo retorna sucesso
    Dado que tenho um cargo adicionado ao processo de convocação
    Quando eu deleto o cargo criado do processo
    Então o status SIGLA deve ser 204 ou 200

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 31 — Cargo deletado não pode ser recuperado
  # ════════════════════════════════════════════════════════════════
  @validacao
  Cenário: Cargo deletado não pode ser recuperado
    Dado que tenho um cargo adicionado ao processo de convocação
    Quando eu deleto o cargo criado do processo
    Então o status SIGLA deve ser 204 ou 200
    E o cargo deletado não deve mais existir no processo

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 32 — Deletar cargo com UUID inexistente retorna 404
  # ════════════════════════════════════════════════════════════════
  @negativo
  Cenário: Deletar cargo com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "DELETE" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/cargos/00000000-0000-0000-0000-000000000000/" sem body
    Então o status SIGLA deve ser 404 ou 400

  # GET /processos-convocacao/filtros/
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 33 — Obter filtros disponíveis retorna 200
  # ════════════════════════════════════════════════════════════════
  @smoke
  Cenário: Obter filtros disponíveis retorna 200
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/filtros/"
    Então o status SIGLA deve ser 200


  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 34 — Acessar filtros com método DELETE retorna erro
  # ════════════════════════════════════════════════════════════════
  @negativo
  Cenário: Acessar filtros com método DELETE retorna erro
    Quando eu faço uma requisição SIGLA de método "DELETE" para "/processos-convocacao/filtros/" sem body
    Então o status SIGLA deve ser 405 ou 400

  # FLUXO DE VALOR
  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 35 — Fluxo completo — criar processo, adicionar cargo e deletar tudo
  # ════════════════════════════════════════════════════════════════
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

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 36 — Processo criado aparece na listagem geral
  # ════════════════════════════════════════════════════════════════
  @valor
  Cenário: Processo criado aparece na listagem geral
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E o processo criado deve aparecer na listagem de processos

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 37 — Múltiplos GETs no mesmo processo retornam dados consistentes
  # ════════════════════════════════════════════════════════════════
  @valor
  Cenário: Múltiplos GETs no mesmo processo retornam dados consistentes
    Dado que tenho um processo de convocação existente
    Quando eu busco o processo de convocação pelo UUID criado
    Então o status SIGLA deve ser 200
    E ao buscar novamente o mesmo processo o resultado deve ser idêntico

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 38 — Dados atualizados via PATCH são refletidos no GET subsequente
  # ════════════════════════════════════════════════════════════════
  @valor
  Cenário: Dados atualizados via PATCH são refletidos no GET subsequente
    Dado que tenho um processo de convocação existente
    Quando eu faço um PATCH no processo de convocação criado com dados parciais
    Então o status SIGLA deve ser 200
    E ao buscar o processo atualizado o campo modificado deve refletir a mudança

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 39 — Processo recém-criado tem lista de cargos válida
  # ════════════════════════════════════════════════════════════════
  @valor
  Cenário: Processo recém-criado tem lista de cargos válida
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E a lista de cargos do processo criado deve ser uma lista válida
