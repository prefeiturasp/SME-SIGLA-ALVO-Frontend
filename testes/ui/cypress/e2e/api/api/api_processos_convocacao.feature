#language: pt
@api @sigla @processos_convocacao
Funcionalidade: API Processos Convocação SIGLA
  Como sistema integrado SME
  Quero validar os endpoints do microsserviço de Processos Convocação
  Para garantir que o ciclo de vida de convocações funciona corretamente

  # ============================================================================
  # BASE URL: https://hom-api-sigla.sme.prefeitura.sp.gov.br
  # PREFIX:   /ms-processos-convocacao/api/v1
  # AUTH:     não requerida
  #
  # Endpoints cobertos:
  #   GET    /carta-convocacao/
  #   POST   /carta-convocacao/
  #   GET    /carta-convocacao/{uuid}/
  #   GET    /processos-convocacao/
  #   POST   /processos-convocacao/
  #   GET    /processos-convocacao/{uuid}/
  #   PATCH  /processos-convocacao/{uuid}/
  #   DELETE /processos-convocacao/{uuid}/
  #   POST   /processos-convocacao/{uuid}/finalizar/
  #   PATCH  /processos-convocacao/{uuid}/passo/
  #   GET    /processos-convocacao/{processo_pk}/cargos/
  #   POST   /processos-convocacao/{processo_pk}/cargos/
  #   DELETE /processos-convocacao/{processo_pk}/cargos/{cargo_uuid}/
  #   GET    /processos-convocacao/filtros/
  # ============================================================================

  Contexto:
    Dado que a API de Processos Convocação está acessível

  # ══════════════════════════════════════════════════════════════════════════
  # GET /carta-convocacao/
  # ══════════════════════════════════════════════════════════════════════════

  # GET /carta-convocacao/ — validação
  @validacao @estrutura @carta_convocacao
  Cenário: Validar campos obrigatórios na listagem de cartas de convocação
    Quando eu faço uma requisição SIGLA GET para "/carta-convocacao/"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser uma lista
    E cada carta de convocação deve ter os campos obrigatórios:
      | campo |
      | uuid  |

  # GET /carta-convocacao/ — positivos
  @smoke @listagem_cartas
  Cenário: Listar cartas de convocação retorna 200
    Quando eu faço uma requisição SIGLA GET para "/carta-convocacao/"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser uma lista

  @validacao @header_carta
  Cenário: Validar Content-Type da listagem de cartas de convocação
    Quando eu faço uma requisição SIGLA GET para "/carta-convocacao/"
    Então o status SIGLA deve ser 200
    E o header Content-Type SIGLA deve conter "application/json"

  @performance @carta_listagem_tempo
  Cenário: Validar tempo de resposta da listagem de cartas de convocação
    Quando eu faço uma requisição SIGLA GET para "/carta-convocacao/"
    Então o status SIGLA deve ser 200
    E o tempo de resposta SIGLA deve ser menor que 5000 milissegundos

  # GET /carta-convocacao/ — negativos
  @negativo @carta_metodo_invalido
  Cenário: Acessar cartas com método não permitido retorna 405
    Quando eu faço uma requisição SIGLA de método "PUT" para "/carta-convocacao/" sem body
    Então o status SIGLA deve ser 405

  @negativo @carta_uuid_invalido
  Cenário: Buscar carta com UUID em formato incorreto retorna erro
    Quando eu faço uma requisição SIGLA GET para "/carta-convocacao/nao-e-um-uuid/"
    Então o status SIGLA deve ser 404 ou 400

  # ══════════════════════════════════════════════════════════════════════════
  # POST /carta-convocacao/
  # ══════════════════════════════════════════════════════════════════════════

  # POST /carta-convocacao/ — validação
  @validacao @post_carta_campos
  Cenário: Validar campos retornados ao criar carta de convocação
    Quando eu crio uma carta de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E a resposta deve conter o campo "historico_uuid"

  # POST /carta-convocacao/ — positivos
  @smoke @criar_carta
  Cenário: Criar carta de convocação com dados válidos retorna sucesso
    Quando eu crio uma carta de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201

  @validacao @post_carta_uuid_gerado
  Cenário: Criar carta de convocação gera UUID único
    Quando eu crio uma carta de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E o campo "historico_uuid" da resposta deve ser um UUID válido

  @performance @post_carta_tempo
  Cenário: Validar tempo de resposta ao criar carta de convocação
    Quando eu crio uma carta de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E o tempo de resposta SIGLA deve ser menor que 5000 milissegundos

  # POST /carta-convocacao/ — negativos
  @negativo @post_carta_body_vazio
  Cenário: Criar carta com body vazio retorna erro de validação
    Quando eu faço um POST SIGLA para "/carta-convocacao/" com body vazio
    Então o status SIGLA deve ser 400

  @negativo @post_carta_campos_invalidos
  Cenário: Criar carta com campos inválidos retorna erro
    Quando eu faço um POST SIGLA para "/carta-convocacao/" com body:
      | campo    | valor |
      | invalido | teste |
    Então o status SIGLA deve ser 400

  # ══════════════════════════════════════════════════════════════════════════
  # GET /carta-convocacao/{uuid}/
  # ══════════════════════════════════════════════════════════════════════════

  # GET /carta-convocacao/{uuid}/ — validação
  @validacao @get_carta_uuid_campos
  Cenário: Validar campos ao buscar carta por UUID
    Dado que tenho uma carta de convocação criada
    Quando eu busco a carta de convocação pelo UUID criado
    Então o status SIGLA deve ser 200
    E a resposta deve conter o campo "uuid" igual ao UUID da carta criada

  # GET /carta-convocacao/{uuid}/ — positivos
  @smoke @get_carta_uuid
  Cenário: Buscar carta de convocação por UUID retorna 200
    Dado que tenho uma carta de convocação criada
    Quando eu busco a carta de convocação pelo UUID criado
    Então o status SIGLA deve ser 200

  @validacao @get_carta_uuid_objeto
  Cenário: Carta retornada por UUID é um objeto
    Dado que tenho uma carta de convocação criada
    Quando eu busco a carta de convocação pelo UUID criado
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser um objeto

  @performance @get_carta_uuid_tempo
  Cenário: Validar tempo de resposta ao buscar carta por UUID
    Dado que tenho uma carta de convocação criada
    Quando eu busco a carta de convocação pelo UUID criado
    Então o status SIGLA deve ser 200
    E o tempo de resposta SIGLA deve ser menor que 3000 milissegundos

  # GET /carta-convocacao/{uuid}/ — negativos
  @negativo @get_carta_uuid_inexistente
  Cenário: Buscar carta com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA GET para "/carta-convocacao/00000000-0000-0000-0000-000000000000/"
    Então o status SIGLA deve ser 404

  @negativo @get_carta_uuid_formato_invalido
  Cenário: Buscar carta com formato de UUID inválido retorna erro
    Quando eu faço uma requisição SIGLA GET para "/carta-convocacao/uuid-invalido-abc/"
    Então o status SIGLA deve ser 404 ou 400

  # ══════════════════════════════════════════════════════════════════════════
  # GET /processos-convocacao/
  # ══════════════════════════════════════════════════════════════════════════

  # GET /processos-convocacao/ — validação
  @validacao @estrutura_processo
  Cenário: Validar campos obrigatórios na listagem de processos de convocação
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser uma lista ou paginada
    E cada processo deve ter os campos obrigatórios:
      | campo |
      | uuid  |

  # GET /processos-convocacao/ — positivos
  @smoke @listagem_processos
  Cenário: Listar processos de convocação retorna 200
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/"
    Então o status SIGLA deve ser 200

  @validacao @header_processo_listagem
  Cenário: Validar Content-Type da listagem de processos
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/"
    Então o status SIGLA deve ser 200
    E o header Content-Type SIGLA deve conter "application/json"

  @performance @processos_listagem_tempo
  Cenário: Validar tempo de resposta da listagem de processos
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/"
    Então o status SIGLA deve ser 200
    E o tempo de resposta SIGLA deve ser menor que 5000 milissegundos

  # GET /processos-convocacao/ — negativos
  @negativo @processos_metodo_invalido
  Cenário: Acessar processos com método não permitido retorna 405
    Quando eu faço uma requisição SIGLA de método "PUT" para "/processos-convocacao/" sem body
    Então o status SIGLA deve ser 405

  @negativo @processos_filtro_invalido
  Cenário: Listar processos com status inexistente não retorna erro crítico
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/?status=INEXISTENTE"
    Então o status SIGLA deve ser 200 ou 400

  # ══════════════════════════════════════════════════════════════════════════
  # POST /processos-convocacao/
  # ══════════════════════════════════════════════════════════════════════════

  # POST /processos-convocacao/ — validação
  @validacao @post_processo_campos
  Cenário: Validar campos retornados ao criar processo de convocação
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E a resposta deve conter o campo "uuid"

  # POST /processos-convocacao/ — positivos
  @smoke @criar_processo
  Cenário: Criar processo de convocação com dados válidos retorna sucesso
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201

  @validacao @post_processo_uuid_gerado
  Cenário: Criar processo de convocação gera UUID único
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E o campo "uuid" da resposta deve ser um UUID válido

  @performance @post_processo_tempo
  Cenário: Validar tempo de resposta ao criar processo de convocação
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E o tempo de resposta SIGLA deve ser menor que 5000 milissegundos

  # POST /processos-convocacao/ — negativos
  @negativo @post_processo_body_vazio
  Cenário: Criar processo com body vazio retorna erro de validação
    Quando eu faço um POST SIGLA para "/processos-convocacao/" com body vazio
    Então o status SIGLA deve ser 400

  @negativo @post_processo_campos_invalidos
  Cenário: Criar processo com campos inválidos retorna erro
    Quando eu faço um POST SIGLA para "/processos-convocacao/" com body:
      | campo    | valor |
      | invalido | teste |
    Então o status SIGLA deve ser 400

  # ══════════════════════════════════════════════════════════════════════════
  # GET /processos-convocacao/{uuid}/
  # ══════════════════════════════════════════════════════════════════════════

  # GET /processos-convocacao/{uuid}/ — validação
  @validacao @get_processo_uuid_campos
  Cenário: Validar campos ao buscar processo por UUID
    Dado que tenho um processo de convocação existente
    Quando eu busco o processo de convocação pelo UUID criado
    Então o status SIGLA deve ser 200
    E a resposta deve conter o campo "uuid" igual ao UUID do processo criado

  # GET /processos-convocacao/{uuid}/ — positivos
  @smoke @get_processo_uuid
  Cenário: Buscar processo de convocação por UUID retorna 200
    Dado que tenho um processo de convocação existente
    Quando eu busco o processo de convocação pelo UUID criado
    Então o status SIGLA deve ser 200

  @validacao @get_processo_uuid_objeto
  Cenário: Processo retornado por UUID é um objeto com dados
    Dado que tenho um processo de convocação existente
    Quando eu busco o processo de convocação pelo UUID criado
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser um objeto

  @performance @get_processo_uuid_tempo
  Cenário: Validar tempo de resposta ao buscar processo por UUID
    Dado que tenho um processo de convocação existente
    Quando eu busco o processo de convocação pelo UUID criado
    Então o status SIGLA deve ser 200
    E o tempo de resposta SIGLA deve ser menor que 3000 milissegundos

  # GET /processos-convocacao/{uuid}/ — negativos
  @negativo @get_processo_uuid_inexistente
  Cenário: Buscar processo com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/00000000-0000-0000-0000-000000000000/"
    Então o status SIGLA deve ser 404

  @negativo @get_processo_uuid_invalido
  Cenário: Buscar processo com UUID em formato inválido retorna erro
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/nao-e-uuid/"
    Então o status SIGLA deve ser 404 ou 400

  # ══════════════════════════════════════════════════════════════════════════
  # PATCH /processos-convocacao/{uuid}/
  # ══════════════════════════════════════════════════════════════════════════

  # PATCH /processos-convocacao/{uuid}/ — validação
  @validacao @patch_processo_campos
  Cenário: Validar campos retornados após atualização parcial de processo
    Dado que tenho um processo de convocação existente
    Quando eu faço um PATCH no processo de convocação criado com dados parciais
    Então o status SIGLA deve ser 200
    E a resposta deve conter o campo "descricao"

  # PATCH /processos-convocacao/{uuid}/ — positivos
  @smoke @patch_processo
  Cenário: Atualização parcial de processo retorna 200
    Dado que tenho um processo de convocação existente
    Quando eu faço um PATCH no processo de convocação criado com dados parciais
    Então o status SIGLA deve ser 200

  @validacao @patch_processo_objeto
  Cenário: PATCH no processo retorna objeto
    Dado que tenho um processo de convocação existente
    Quando eu faço um PATCH no processo de convocação criado com dados parciais
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser um objeto

  @performance @patch_processo_tempo
  Cenário: Validar tempo de resposta ao atualizar processo via PATCH
    Dado que tenho um processo de convocação existente
    Quando eu faço um PATCH no processo de convocação criado com dados parciais
    Então o status SIGLA deve ser 200
    E o tempo de resposta SIGLA deve ser menor que 5000 milissegundos

  # PATCH /processos-convocacao/{uuid}/ — negativos
  @negativo @patch_processo_inexistente
  Cenário: PATCH em processo inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "PATCH" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/" sem body
    Então o status SIGLA deve ser 404

  @negativo @patch_processo_campo_invalido
  Cenário: PATCH no processo com campo inválido retorna erro
    Dado que tenho um processo de convocação existente
    Quando eu faço um PATCH no processo de convocação criado com campo inválido
    Então o status SIGLA deve ser 200 ou 400

  # ══════════════════════════════════════════════════════════════════════════
  # DELETE /processos-convocacao/{uuid}/
  # ══════════════════════════════════════════════════════════════════════════

  # DELETE /processos-convocacao/{uuid}/ — validação
  @validacao @delete_processo_status
  Cenário: Validar status correto ao deletar processo
    Dado que tenho um processo de convocação existente
    Quando eu deleto o processo de convocação criado
    Então o status SIGLA deve ser 204 ou 200

  # DELETE /processos-convocacao/{uuid}/ — positivos
  @smoke @delete_processo
  Cenário: Deletar processo de convocação existente retorna sucesso
    Dado que tenho um processo de convocação existente
    Quando eu deleto o processo de convocação criado
    Então o status SIGLA deve ser 204 ou 200

  @validacao @delete_processo_verificar
  Cenário: Processo deletado não pode ser recuperado
    Dado que tenho um processo de convocação existente
    Quando eu deleto o processo de convocação criado
    Então o status SIGLA deve ser 204 ou 200
    E o processo deletado não deve mais existir

  @performance @delete_processo_tempo
  Cenário: Validar tempo de resposta ao deletar processo
    Dado que tenho um processo de convocação existente
    Quando eu deleto o processo de convocação criado
    Então o status SIGLA deve ser 204 ou 200
    E o tempo de resposta SIGLA deve ser menor que 5000 milissegundos

  # DELETE /processos-convocacao/{uuid}/ — negativos
  @negativo @delete_processo_inexistente
  Cenário: Deletar processo com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "DELETE" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/" sem body
    Então o status SIGLA deve ser 404

  @negativo @delete_processo_duplo
  Cenário: Deletar processo já excluído retorna 404
    Dado que tenho um processo de convocação existente
    Quando eu deleto o processo de convocação criado
    E eu tento deletar o mesmo processo novamente
    Então o status SIGLA deve ser 404

  # ══════════════════════════════════════════════════════════════════════════
  # POST /processos-convocacao/{uuid}/finalizar/
  # ══════════════════════════════════════════════════════════════════════════

  # POST /processos-convocacao/{uuid}/finalizar/ — validação
  @validacao @finalizar_status
  Cenário: Validar status ao finalizar processo
    Dado que tenho um processo de convocação existente
    Quando eu finalizo o processo de convocação criado
    Então o status SIGLA deve ser 200 ou 400

  # POST /processos-convocacao/{uuid}/finalizar/ — positivos
  @smoke @finalizar_processo
  Cenário: Finalizar processo não retorna erro de servidor
    Dado que tenho um processo de convocação existente
    Quando eu finalizo o processo de convocação criado
    Então o status SIGLA não deve ser 500

  @validacao @finalizar_resposta_formato
  Cenário: Finalizar processo retorna resposta no formato esperado
    Dado que tenho um processo de convocação existente
    Quando eu finalizo o processo de convocação criado
    Então o status SIGLA deve ser 200 ou 400
    E a resposta SIGLA deve ser um objeto ou lista

  @performance @finalizar_tempo
  Cenário: Validar tempo de resposta ao finalizar processo
    Dado que tenho um processo de convocação existente
    Quando eu finalizo o processo de convocação criado
    Então o status SIGLA não deve ser 500
    E o tempo de resposta SIGLA deve ser menor que 5000 milissegundos

  # POST /processos-convocacao/{uuid}/finalizar/ — negativos
  @negativo @finalizar_processo_inexistente
  Cenário: Finalizar processo com UUID inexistente retorna 404
    Quando eu faço um POST SIGLA para "/processos-convocacao/00000000-0000-0000-0000-000000000000/finalizar/" sem body
    Então o status SIGLA deve ser 404

  @negativo @finalizar_uuid_invalido
  Cenário: Finalizar processo com UUID inválido retorna erro
    Quando eu faço um POST SIGLA para "/processos-convocacao/uuid-invalido/finalizar/" sem body
    Então o status SIGLA deve ser 404 ou 400

  # ══════════════════════════════════════════════════════════════════════════
  # PATCH /processos-convocacao/{uuid}/passo/
  # ══════════════════════════════════════════════════════════════════════════

  # PATCH /processos-convocacao/{uuid}/passo/ — validação
  @validacao @passo_status
  Cenário: Validar status ao avançar passo do processo
    Dado que tenho um processo de convocação existente
    Quando eu avanço o passo do processo de convocação criado
    Então o status SIGLA deve ser 200 ou 400

  # PATCH /processos-convocacao/{uuid}/passo/ — positivos
  @smoke @passo_processo
  Cenário: Avançar passo de processo não retorna erro de servidor
    Dado que tenho um processo de convocação existente
    Quando eu avanço o passo do processo de convocação criado
    Então o status SIGLA não deve ser 500

  @validacao @passo_resposta_formato
  Cenário: Avançar passo retorna resposta no formato esperado
    Dado que tenho um processo de convocação existente
    Quando eu avanço o passo do processo de convocação criado
    Então o status SIGLA deve ser 200 ou 400
    E a resposta SIGLA deve ser um objeto ou lista

  @performance @passo_tempo
  Cenário: Validar tempo de resposta ao avançar passo
    Dado que tenho um processo de convocação existente
    Quando eu avanço o passo do processo de convocação criado
    Então o status SIGLA não deve ser 500
    E o tempo de resposta SIGLA deve ser menor que 5000 milissegundos

  # PATCH /processos-convocacao/{uuid}/passo/ — negativos
  @negativo @passo_processo_inexistente
  Cenário: Avançar passo de processo com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "PATCH" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/passo/" sem body
    Então o status SIGLA deve ser 404

  @negativo @passo_body_invalido
  Cenário: Avançar passo com body inválido retorna erro ou ignora campos extras
    Dado que tenho um processo de convocação existente
    Quando eu faço um PATCH no passo do processo com body inválido
    Então o status SIGLA deve ser 400 ou 200

  # ══════════════════════════════════════════════════════════════════════════
  # GET /processos-convocacao/{processo_pk}/cargos/
  # ══════════════════════════════════════════════════════════════════════════

  # GET /processos-convocacao/{processo_pk}/cargos/ — validação
  @validacao @get_cargos_campos
  Cenário: Validar campos na listagem de cargos do processo
    Dado que tenho um processo de convocação existente
    Quando eu listo os cargos do processo de convocação criado
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser uma lista

  # GET /processos-convocacao/{processo_pk}/cargos/ — positivos
  @smoke @get_cargos_processo
  Cenário: Listar cargos do processo retorna 200
    Dado que tenho um processo de convocação existente
    Quando eu listo os cargos do processo de convocação criado
    Então o status SIGLA deve ser 200

  @validacao @get_cargos_header
  Cenário: Validar Content-Type da listagem de cargos
    Dado que tenho um processo de convocação existente
    Quando eu listo os cargos do processo de convocação criado
    Então o status SIGLA deve ser 200
    E o header Content-Type SIGLA deve conter "application/json"

  @performance @get_cargos_tempo
  Cenário: Validar tempo de resposta da listagem de cargos
    Dado que tenho um processo de convocação existente
    Quando eu listo os cargos do processo de convocação criado
    Então o status SIGLA deve ser 200
    E o tempo de resposta SIGLA deve ser menor que 5000 milissegundos

  # GET /processos-convocacao/{processo_pk}/cargos/ — negativos
  @negativo @get_cargos_processo_inexistente
  Cenário: Listar cargos de processo inexistente retorna 404 ou vazio
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/00000000-0000-0000-0000-000000000000/cargos/"
    Então o status SIGLA deve ser 404 ou 200

  @negativo @get_cargos_uuid_invalido
  Cenário: Listar cargos de processo com UUID inválido retorna erro
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/uuid-invalido/cargos/"
    Então o status SIGLA deve ser 404 ou 400 ou 500

  # ══════════════════════════════════════════════════════════════════════════
  # POST /processos-convocacao/{processo_pk}/cargos/
  # ══════════════════════════════════════════════════════════════════════════

  # POST /processos-convocacao/{processo_pk}/cargos/ — validação
  @validacao @post_cargo_campos
  Cenário: Validar campos retornados ao adicionar cargo ao processo
    Dado que tenho um processo de convocação existente
    Quando eu adiciono um cargo ao processo de convocação criado
    Então o status SIGLA deve ser 200 ou 201
    E a resposta deve conter o campo "uuid"

  # POST /processos-convocacao/{processo_pk}/cargos/ — positivos
  @smoke @post_cargo
  Cenário: Adicionar cargo ao processo retorna sucesso
    Dado que tenho um processo de convocação existente
    Quando eu adiciono um cargo ao processo de convocação criado
    Então o status SIGLA deve ser 200 ou 201

  @validacao @post_cargo_uuid
  Cenário: Cargo adicionado ao processo gera UUID único
    Dado que tenho um processo de convocação existente
    Quando eu adiciono um cargo ao processo de convocação criado
    Então o status SIGLA deve ser 200 ou 201
    E o campo "uuid" da resposta deve ser um UUID válido

  @performance @post_cargo_tempo
  Cenário: Validar tempo de resposta ao adicionar cargo
    Dado que tenho um processo de convocação existente
    Quando eu adiciono um cargo ao processo de convocação criado
    Então o status SIGLA deve ser 200 ou 201
    E o tempo de resposta SIGLA deve ser menor que 5000 milissegundos

  # POST /processos-convocacao/{processo_pk}/cargos/ — negativos
  @negativo @post_cargo_processo_inexistente
  Cenário: Adicionar cargo em processo inexistente retorna 404
    Quando eu faço um POST SIGLA para "/processos-convocacao/00000000-0000-0000-0000-000000000000/cargos/" sem body
    Então o status SIGLA deve ser 404 ou 400

  @negativo @post_cargo_body_vazio
  Cenário: Adicionar cargo com body vazio retorna erro de validação
    Dado que tenho um processo de convocação existente
    Quando eu adiciono um cargo sem dados ao processo de convocação criado
    Então o status SIGLA deve ser 400

  # ══════════════════════════════════════════════════════════════════════════
  # DELETE /processos-convocacao/{processo_pk}/cargos/{cargo_uuid}/
  # ══════════════════════════════════════════════════════════════════════════

  # DELETE /processos-convocacao/{processo_pk}/cargos/{cargo_uuid}/ — validação
  @validacao @delete_cargo_status
  Cenário: Validar status ao deletar cargo do processo
    Dado que tenho um cargo adicionado ao processo de convocação
    Quando eu deleto o cargo criado do processo
    Então o status SIGLA deve ser 204 ou 200

  # DELETE /processos-convocacao/{processo_pk}/cargos/{cargo_uuid}/ — positivos
  @smoke @delete_cargo
  Cenário: Deletar cargo do processo retorna sucesso
    Dado que tenho um cargo adicionado ao processo de convocação
    Quando eu deleto o cargo criado do processo
    Então o status SIGLA deve ser 204 ou 200

  @validacao @delete_cargo_verificar
  Cenário: Cargo deletado não pode ser recuperado
    Dado que tenho um cargo adicionado ao processo de convocação
    Quando eu deleto o cargo criado do processo
    Então o status SIGLA deve ser 204 ou 200
    E o cargo deletado não deve mais existir no processo

  @performance @delete_cargo_tempo
  Cenário: Validar tempo de resposta ao deletar cargo
    Dado que tenho um cargo adicionado ao processo de convocação
    Quando eu deleto o cargo criado do processo
    Então o status SIGLA deve ser 204 ou 200
    E o tempo de resposta SIGLA deve ser menor que 5000 milissegundos

  # DELETE /processos-convocacao/{processo_pk}/cargos/{cargo_uuid}/ — negativos
  @negativo @delete_cargo_inexistente
  Cenário: Deletar cargo com UUID inexistente retorna 404
    Quando eu faço uma requisição SIGLA de método "DELETE" para "/processos-convocacao/00000000-0000-0000-0000-000000000000/cargos/00000000-0000-0000-0000-000000000000/" sem body
    Então o status SIGLA deve ser 404 ou 400

  @negativo @delete_cargo_duplo
  Cenário: Deletar cargo já excluído retorna 404
    Dado que tenho um cargo adicionado ao processo de convocação
    Quando eu deleto o cargo criado do processo
    E eu tento deletar o mesmo cargo novamente no processo
    Então o status SIGLA deve ser 404

  # ══════════════════════════════════════════════════════════════════════════
  # GET /processos-convocacao/filtros/
  # ══════════════════════════════════════════════════════════════════════════

  # GET /processos-convocacao/filtros/ — validação
  @validacao @get_filtros_estrutura
  Cenário: Validar estrutura da resposta dos filtros disponíveis
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/filtros/"
    Então o status SIGLA deve ser 200
    E a resposta SIGLA deve ser um objeto ou lista

  # GET /processos-convocacao/filtros/ — positivos
  @smoke @get_filtros
  Cenário: Obter filtros disponíveis retorna 200
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/filtros/"
    Então o status SIGLA deve ser 200

  @validacao @get_filtros_header
  Cenário: Validar Content-Type da resposta de filtros
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/filtros/"
    Então o status SIGLA deve ser 200
    E o header Content-Type SIGLA deve conter "application/json"

  @performance @get_filtros_tempo
  Cenário: Validar tempo de resposta do endpoint de filtros
    Quando eu faço uma requisição SIGLA GET para "/processos-convocacao/filtros/"
    Então o status SIGLA deve ser 200
    E o tempo de resposta SIGLA deve ser menor que 3000 milissegundos

  # GET /processos-convocacao/filtros/ — negativos
  @negativo @get_filtros_metodo_invalido
  Cenário: Acessar filtros com método DELETE retorna erro
    Quando eu faço uma requisição SIGLA de método "DELETE" para "/processos-convocacao/filtros/" sem body
    Então o status SIGLA deve ser 405 ou 400

  @negativo @post_filtros_invalido
  Cenário: POST no endpoint de filtros retorna erro esperado
    Quando eu faço um POST SIGLA para "/processos-convocacao/filtros/" sem body
    Então o status SIGLA deve ser 405 ou 400

  # ══════════════════════════════════════════════════════════════════════════
  # CENÁRIOS DE VALOR — FLUXOS E CONSISTÊNCIA
  # ══════════════════════════════════════════════════════════════════════════

  @valor @fluxo_completo
  Cenário: Fluxo completo — criar processo, adicionar cargo e deletar tudo
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    Quando eu adiciono um cargo ao processo criado no fluxo completo
    Então o status SIGLA deve ser 200 ou 201
    Quando eu deleto o cargo criado no fluxo completo
    Então o status SIGLA deve ser 204 ou 200
    Quando eu deleto o processo criado no fluxo completo
    Então o status SIGLA deve ser 204 ou 200

  @valor @consistencia_criacao_listagem
  Cenário: Processo criado aparece na listagem geral
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E o processo criado deve aparecer na listagem de processos

  @valor @idempotencia_get
  Cenário: Múltiplos GETs no mesmo processo retornam dados consistentes
    Dado que tenho um processo de convocação existente
    Quando eu busco o processo de convocação pelo UUID criado
    Então o status SIGLA deve ser 200
    E ao buscar novamente o mesmo processo o resultado deve ser idêntico

  @valor @patch_e_verificacao
  Cenário: Dados atualizados via PATCH são refletidos no GET subsequente
    Dado que tenho um processo de convocação existente
    Quando eu faço um PATCH no processo de convocação criado com dados parciais
    Então o status SIGLA deve ser 200
    E ao buscar o processo atualizado o campo modificado deve refletir a mudança

  @valor @cargos_lista_processo_novo
  Cenário: Processo recém-criado tem lista de cargos válida
    Quando eu crio um processo de convocação com dados válidos
    Então o status SIGLA deve ser 200 ou 201
    E a lista de cargos do processo criado deve ser uma lista válida
