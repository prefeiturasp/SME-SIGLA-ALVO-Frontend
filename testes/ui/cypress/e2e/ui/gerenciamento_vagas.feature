#language: pt
@ui @sigla @processos @gerenciamento-vagas
Funcionalidade: Processos — Gerenciamento de Vagas

  Contexto:
    Dado que estou logado no SIGLA com perfil administrador

  # ============================================================
  # BASE URL   : https://qa-sigla.sme.prefeitura.sp.gov.br
  # CREDENCIAIS: definidas em .env (SIGLA_LOGIN_RF / SIGLA_LOGIN_SENHA)
  # URL DIRETA : /processos/gerenciamento-vagas
  # ============================================================

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1 — Acessar gerenciamento de vagas e selecionar um processo
  # ════════════════════════════════════════════════════════════════
  @gerenciamento @acesso @critico
  Cenário: Acessar gerenciamento de vagas e selecionar um processo
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"
    E a lista de convocações exibe o botão "Gerenciamento de vagas"
    Quando clico em "Gerenciamento de vagas" na lista de convocações
    Então o sistema exibe a tela de gerenciamento de vagas
    E o campo Processo está visível na tela de gerenciamento de vagas
    Quando seleciono uma opção aleatória no campo Processo do gerenciamento de vagas
    Então o sistema carrega os dados do processo selecionado no gerenciamento de vagas

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1B — Selecionar cargo carrega a tabela de vagas por unidade escolar
  # ════════════════════════════════════════════════════════════════
  # Tela real (confirmada ao vivo): depois de selecionar o Processo, um campo
  # "Cargo" aparece. Ao selecionar o Cargo, a tabela "Vagas por unidade
  # escolar" é carregada com as colunas Código EOL, DRE, Unidade Escolar,
  # Vagas definitivas, Vagas precárias e Editar — os campos de vaga começam
  # somente leitura (spinbutton desabilitado).
  @gerenciamento @vagas-cargo @critico
  Cenário: Selecionar cargo carrega a tabela de vagas por unidade escolar
    Quando navego até a opção "Processos"
    E seleciono a opção "Gerenciamento de Vagas"
    Então o sistema exibe a tela de gerenciamento de vagas

    Quando seleciono um processo com cargo disponível no filtro do gerenciamento de vagas
    E seleciono uma opção aleatória no campo Cargo do gerenciamento de vagas

    Então a tabela de vagas por unidade escolar é exibida
    E a tabela de vagas por unidade escolar exibe as colunas:
      | Código EOL        |
      | DRE                |
      | Unidade Escolar    |
      | Vagas definitivas  |
      | Vagas precárias    |
      | Editar             |

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1C — Habilitar edição de vagas de uma unidade escolar
  # ════════════════════════════════════════════════════════════════
  # Tela real (confirmada ao vivo): o ícone de editar (lápis) da linha troca
  # os campos "Vagas definitivas"/"Vagas precárias" de somente leitura para
  # editáveis e substitui o ícone por dois botões — confirmar (check) e
  # cancelar (close) — só para aquela linha.
  # @skip: o clique no ícone de editar funciona (confirmado em vídeo — a
  # célula "Editar" passa a exibir ✓/✗), mas não foi possível confirmar a
  # estrutura real do DOM do campo que substitui o valor somente leitura
  # (atributos do input, se usa disabled/readonly) sem acesso a DevTools ao
  # vivo — os steps "os campos de vagas ficam editáveis" e "voltam a ficar
  # somente leitura" seguem baseados em suposição. Reativar após inspecionar
  # o HTML real da célula em edição.
  @gerenciamento @editar-vaga @critico @skip
  Cenário: Habilitar edição de vagas de uma unidade escolar
    Quando navego até a opção "Processos"
    E seleciono a opção "Gerenciamento de Vagas"
    Então o sistema exibe a tela de gerenciamento de vagas

    Quando seleciono um processo com cargo disponível no filtro do gerenciamento de vagas
    E seleciono uma opção aleatória no campo Cargo do gerenciamento de vagas
    Então a tabela de vagas por unidade escolar é exibida

    Quando clico no ícone de editar da primeira linha da tabela de vagas

    Então os campos de vagas da primeira linha ficam editáveis
    E a primeira linha exibe os botões de confirmar e cancelar edição

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1D — Cancelar edição de vagas mantém os valores originais
  # ════════════════════════════════════════════════════════════════
  # @skip: mesmo motivo do Cenário 1C acima — estrutura real do DOM do
  # campo em edição (e do botão de cancelar dentro da célula "Editar") não
  # confirmada ao vivo. Reativar junto com 1C.
  @gerenciamento @editar-vaga @cancelamento @skip
  Cenário: Cancelar edição de vagas de uma unidade escolar mantém os valores originais
    Quando navego até a opção "Processos"
    E seleciono a opção "Gerenciamento de Vagas"
    Então o sistema exibe a tela de gerenciamento de vagas

    Quando seleciono um processo com cargo disponível no filtro do gerenciamento de vagas
    E seleciono uma opção aleatória no campo Cargo do gerenciamento de vagas
    Então a tabela de vagas por unidade escolar é exibida

    Dado que anoto os valores de vagas da primeira linha da tabela
    Quando clico no ícone de editar da primeira linha da tabela de vagas
    E clico no botão de cancelar edição da primeira linha

    Então os campos de vagas da primeira linha voltam a ficar somente leitura
    E os valores de vagas da primeira linha permanecem os mesmos anotados

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 2 — Validar botões disponíveis na lista de convocações
  # ════════════════════════════════════════════════════════════════
  @gerenciamento @validacao @critico
  Cenário: Validar botões disponíveis na lista de convocações
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"
    E a lista de convocações exibe o botão "Gerenciamento de vagas"
    E a lista de convocações exibe o botão "Nova convocação"

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 3 — Navegar até gerenciamento de vagas pelo menu Processos
  # ════════════════════════════════════════════════════════════════
  @gerenciamento @navegacao @smoke
  Cenário: Navegar até gerenciamento de vagas pelo menu Processos
    Dado que estou na página inicial do SIGLA
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"
    Quando clico em "Gerenciamento de vagas" na lista de convocações
    Então o sistema exibe a tela de gerenciamento de vagas
    E o campo Processo está visível na tela de gerenciamento de vagas

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 4 — Fluxo completo — da página inicial ao gerenciamento de vagas com seleção de processo
  # ════════════════════════════════════════════════════════════════
  @fluxo-completo @critico
  Cenário: Fluxo completo — da página inicial ao gerenciamento de vagas com seleção de processo
    Dado que estou na página inicial do SIGLA
    Então o sistema exibe o título "ALOCAÇÃO DE VAGAS ONLINE"
    E o sistema exibe os benefícios da plataforma:
      | Convocação de candidatos.      |
      | Processo de escolha de vagas.  |
      | Relatórios detalhados.         |
      | Acompanhamento em tempo real.  |
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"
    E a lista de convocações exibe o botão "Gerenciamento de vagas"
    E a lista de convocações exibe o botão "Nova convocação"
    Quando clico em "Gerenciamento de vagas" na lista de convocações
    Então o sistema exibe a tela de gerenciamento de vagas
    E o campo Processo está visível na tela de gerenciamento de vagas
    Quando seleciono uma opção aleatória no campo Processo do gerenciamento de vagas
    Então o sistema carrega os dados do processo selecionado no gerenciamento de vagas
