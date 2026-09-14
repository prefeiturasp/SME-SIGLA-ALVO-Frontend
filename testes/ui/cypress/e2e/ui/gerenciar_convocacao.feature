#language: pt
@ui @sigla @processos @gerenciar-convocacao
Funcionalidade: Processos — Editar e Excluir Convocação
  Como usuário administrador do sistema SIGLA
  Quero editar ou excluir uma convocação já cadastrada
  Para corrigir ou remover processos de convocação existentes

  # ============================================================
  # BASE URL   : https://qa-sigla.sme.prefeitura.sp.gov.br
  # MENU       : Processos > Convocação de Candidatos > coluna "Gerenciar"
  # CREDENCIAIS: definidas em .env (SIGLA_LOGIN_RF / SIGLA_LOGIN_SENHA)
  # DADOS QA   : a massa de dados de QA acumula registros descartáveis com
  #              Processo = "Processo de Teste Automacao" (gerados por
  #              execuções anteriores de nova_convocacao_online.feature /
  #              nova_convocacao_presencial.feature) — usados aqui como alvo
  #              seguro para as ações de editar/excluir, em vez de mexer em
  #              processos com nome de negócio real.
  # ============================================================

  Contexto:
    Dado que estou logado no SIGLA com perfil administrador
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1 — Editar convocação existente
  # ════════════════════════════════════════════════════════════════
  # Tela real (confirmada ao vivo): o ícone de editar reabre o mesmo
  # formulário de "Nova convocação", já na etapa "Seleção e configuração dos
  # cargos" — a etapa "Dados do processo" aparece concluída (ícone de check)
  # e exibe um resumo somente leitura do Concurso, Data da convocação, Tipo
  # de Escolha, Data corte de vagas e Descrição já cadastrados.
  @editar @critico
  Cenário: Editar uma convocação existente reabre o formulário na etapa de cargos
    Quando clico em "Editar" na convocação "Processo de Teste Automacao"

    Então o sistema exibe a tela "Nova Convocação"
    E a etapa "Dados do processo" aparece concluída no formulário de edição
    E a etapa "Seleção e configuração dos cargos" está ativa no formulário de edição
    E o resumo somente leitura dos dados do processo é exibido:
      | Concurso:            |
      | Data da convocação:  |
      | Tipo de Escolha:     |
      | Data corte de vagas: |
      | Descrição:           |

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 2 — Cancelar edição
  # ════════════════════════════════════════════════════════════════
  @editar @cancelamento
  Cenário: Cancelar edição de uma convocação retorna à lista sem alterações
    Quando clico em "Editar" na convocação "Processo de Teste Automacao"
    Então o sistema exibe a tela "Nova Convocação"

    Quando clico em "Cancelar" no formulário de edição de convocação

    Então o sistema exibe a tela "Lista de Convocações"

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 3 — Excluir convocação
  # ════════════════════════════════════════════════════════════════
  # Tela real (confirmada ao vivo): o ícone de excluir abre o diálogo
  # "Excluir processo" com o aviso "Tem certeza que deseja excluir o
  # processo? Essa ação é irreversível e removerá o processo
  # definitivamente." e os botões "Cancelar"/"Excluir". Confirmar remove a
  # linha da lista e decrementa a contagem total de registros.
  @excluir @critico
  Cenário: Excluir uma convocação solicita confirmação antes de remover
    Dado que anoto a quantidade total de convocações exibida na lista

    Quando clico em "Excluir" na convocação "Processo de Teste Automacao"

    Então o diálogo "Excluir processo" é exibido
    E o diálogo de exclusão exibe o aviso "Tem certeza que deseja excluir o processo?"

    Quando confirmo a exclusão da convocação

    Então o diálogo de exclusão é fechado
    E a quantidade total de convocações na lista diminui em 1

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 4 — Cancelar exclusão
  # ════════════════════════════════════════════════════════════════
  @excluir @cancelamento
  Cenário: Cancelar exclusão de uma convocação mantém o registro na lista
    Dado que anoto a quantidade total de convocações exibida na lista

    Quando clico em "Excluir" na convocação "Processo de Teste Automacao"
    Então o diálogo "Excluir processo" é exibido

    Quando cancelo a exclusão da convocação

    Então o diálogo de exclusão é fechado
    E a quantidade total de convocações na lista permanece a mesma
