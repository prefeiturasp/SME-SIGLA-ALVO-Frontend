#language: pt
@api @sigla @importa_arquivo_sigla
Funcionalidade: API Importação de Arquivo SIGLA
  Como sistema integrado SME
  Quero validar os endpoints do microsserviço de Importação de Arquivo
  Para garantir que o processo de importação e exportação de arquivos funciona corretamente

  # ============================================================================
  # BASE URL: https://qa-api-sigla.sme.prefeitura.sp.gov.br
  # Microsserviço: ms-importa-arquivos
  # ============================================================================

  Contexto:
    Dado que a API de Importação de Arquivo SIGLA está acessível

  # ============================================================================
  # GET/POST /ms-importa-arquivos/api/v1/exportacao/cabecalho-lote/
  # ============================================================================

  @negativo @cabecalho_lote_listar_pagina_invalida
  Cenário: Requisitar página inexistente de cabeçalhos retorna 404
    Quando eu faço uma requisição IMPORTA GET para "/exportacao/cabecalho-lote/?page=999999"
    Então o status IMPORTA deve ser 404

  @negativo @cabecalho_lote_uuid_invalido
  Cenário: Buscar cabeçalho com UUID inexistente retorna 404
    Quando eu busco o cabeçalho de lote com UUID inexistente
    Então o status IMPORTA deve ser 404

  # @negativo @cabecalho_lote_sem_tipo
  # Cenário: Criar cabeçalho sem tipo retorna 400
  #   Quando eu crio um cabeçalho de lote com payload "cabecalhoLoteSemTipo"
  #   Então o status IMPORTA deve ser 400

  # @negativo @cabecalho_lote_sem_campos
  # Cenário: Criar cabeçalho sem campos retorna 400
  #   Quando eu crio um cabeçalho de lote com payload "cabecalhoLoteSemCampos"
  #   Então o status IMPORTA deve ser 400

  # ============================================================================
  # GET/POST /ms-importa-arquivos/api/v1/exportacao/candidatos-processo/
  # ============================================================================

  @negativo @candidatos_processo_pagina_invalida
  Cenário: Requisitar página inexistente de candidatos retorna 404
    Quando eu faço uma requisição IMPORTA GET para "/exportacao/candidatos-processo/?page=999999"
    Então o status IMPORTA deve ser 404

  @negativo @candidatos_processo_sem_processo
  Cenário: Exportar candidatos sem processo_uuid retorna 400
    Quando eu faço exportação de candidatos com payload "exportacaoCandidatosSemProcesso"
    Então o status IMPORTA deve ser 400

  @negativo @candidatos_processo_sem_cargo
  Cenário: Exportar candidatos sem cargo_uuid retorna 400
    Quando eu faço exportação de candidatos com payload "exportacaoCandidatosSemCargo"
    Então o status IMPORTA deve ser 400

  # ============================================================================
  # GET/POST /ms-importa-arquivos/api/v1/exportacao/lote/
  # ============================================================================

  @negativo @lote_pagina_invalida
  Cenário: Requisitar página inexistente de lotes retorna 404
    Quando eu faço uma requisição IMPORTA GET para "/exportacao/lote/?page=999999"
    Então o status IMPORTA deve ser 404

  @negativo @lote_download_uuid_invalido
  Cenário: Download de lote com UUID inexistente retorna 404
    Quando eu faço download de lote com UUID inexistente
    Então o status IMPORTA deve ser 404

  @negativo @lote_sem_concurso
  Cenário: Exportar lote sem concurso_uuid retorna 400
    Quando eu faço exportação de lote com payload "exportacaoLoteSemConcurso"
    Então o status IMPORTA deve ser 400

  @negativo @lote_sem_lote_uuid
  Cenário: Exportar lote sem lote_uuid retorna 400
    Quando eu faço exportação de lote com payload "exportacaoLoteSemLoteUuid"
    Então o status IMPORTA deve ser 400

  # ============================================================================
  # GET/POST /ms-importa-arquivos/api/v1/exportacao/vagas-processo/
  # ============================================================================

  @negativo @vagas_processo_pagina_invalida
  Cenário: Requisitar página inexistente de vagas processo retorna 404
    Quando eu faço uma requisição IMPORTA GET para "/exportacao/vagas-processo/?page=999999"
    Então o status IMPORTA deve ser 404

  @negativo @vagas_processo_sem_processo
  Cenário: Exportar vagas processo sem processo_uuid retorna 400
    Quando eu faço exportação de vagas processo com payload "exportacaoVagasProcessoSemProcesso"
    Então o status IMPORTA deve ser 400

  # ============================================================================
  # GET/POST /ms-importa-arquivos/api/v1/exportacao/vagas-sigpec/
  # ============================================================================

  @negativo @vagas_sigpec_pagina_invalida
  Cenário: Requisitar página inexistente de vagas SIGPEC retorna 404
    Quando eu faço uma requisição IMPORTA GET para "/exportacao/vagas-sigpec/?page=999999"
    Então o status IMPORTA deve ser 404

  @negativo @vagas_sigpec_sem_processo
  Cenário: Exportar vagas SIGPEC sem processo_uuid retorna 400
    Quando eu faço exportação de vagas SIGPEC com payload "exportacaoVagasSigpecSemProcesso"
    Então o status IMPORTA deve ser 400

  # ============================================================================
  # GET/POST /ms-importa-arquivos/api/v1/importacao-arquivo/habilitados/
  # ============================================================================

  # @negativo @habilitados_pagina_invalida
  # Cenário: Requisitar página inexistente de habilitados retorna 404
  #   Quando eu faço uma requisição IMPORTA GET para "/importacao-arquivo/habilitados/?page=999999"
  #   Então o status IMPORTA deve ser 404

  @negativo @habilitados_id_invalido
  Cenário: Buscar importação habilitados com ID inexistente retorna 404
    Quando eu busco importação de habilitados com ID inexistente
    Então o status IMPORTA deve ser 404

  @negativo @habilitados_sem_arquivo
  Cenário: Importar habilitados sem arquivo retorna 400
    Quando eu faço importação de habilitados com payload "importacaoHabilitadosSemArquivo"
    Então o status IMPORTA deve ser 400

  @negativo @habilitados_sem_concurso
  Cenário: Importar habilitados sem concurso_uuid retorna 400
    Quando eu faço importação de habilitados com payload "importacaoHabilitadosSemConcurso"
    Então o status IMPORTA deve ser 400

  # ============================================================================
  # GET/POST /ms-importa-arquivos/api/v1/importacao-arquivo/vagas/
  # ============================================================================

  @negativo @vagas_pagina_invalida
  Cenário: Requisitar página inexistente de vagas retorna 404
    Quando eu faço uma requisição IMPORTA GET para "/importacao-arquivo/vagas/?page=999999"
    Então o status IMPORTA deve ser 404

  @negativo @vagas_id_invalido
  Cenário: Buscar importação vagas com ID inexistente retorna 404
    Quando eu busco importação de vagas com ID inexistente
    Então o status IMPORTA deve ser 404

  @negativo @vagas_sem_arquivo
  Cenário: Importar vagas sem arquivo retorna 400
    Quando eu faço importação de vagas com payload "importacaoVagasSemArquivo"
    Então o status IMPORTA deve ser 400

  @negativo @vagas_sem_processo
  Cenário: Importar vagas sem processo_uuid retorna 400
    Quando eu faço importação de vagas com payload "importacaoVagasSemProcesso"
    Então o status IMPORTA deve ser 400

  # ============================================================================
  # GET/POST /ms-importa-arquivos/api/v1/importacao-escolhas/
  # ============================================================================

  @negativo @escolhas_pagina_invalida
  Cenário: Requisitar página inexistente de escolhas retorna 404
    Quando eu faço uma requisição IMPORTA GET para "/importacao-escolhas/?page=999999"
    Então o status IMPORTA deve ser 404

  @negativo @escolhas_sem_processo
  Cenário: Importar escolhas sem processo_uuid retorna 400
    Quando eu faço importação de escolhas com payload "importacaoEscolhasSemProcesso"
    Então o status IMPORTA deve ser 400

  @negativo @escolhas_sem_lote
  Cenário: Importar escolhas sem lote_uuid retorna 400
    Quando eu faço importação de escolhas com payload "importacaoEscolhasSemLote"
    Então o status IMPORTA deve ser 400

