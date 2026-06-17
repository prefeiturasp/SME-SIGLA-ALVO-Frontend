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

  @gerenciamento @validacao @critico
  Cenário: Validar botões disponíveis na lista de convocações
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"
    E a lista de convocações exibe o botão "Gerenciamento de vagas"
    E a lista de convocações exibe o botão "Nova convocação"

  @gerenciamento @navegacao @smoke
  Cenário: Navegar até gerenciamento de vagas pelo menu Processos
    Dado que estou na página inicial do SIGLA
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"
    Quando clico em "Gerenciamento de vagas" na lista de convocações
    Então o sistema exibe a tela de gerenciamento de vagas
    E o campo Processo está visível na tela de gerenciamento de vagas

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
