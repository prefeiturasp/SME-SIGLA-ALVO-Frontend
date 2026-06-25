#language: pt
@ui @sigla @login
Funcionalidade: Login no Sistema SIGLA
  Como usuário do sistema SME
  Quero realizar login na plataforma SIGLA
  Para acessar as funcionalidades do sistema

  # ============================================================================
  # BASE URL: https://qa-sigla.sme.prefeitura.sp.gov.br
  # CREDENCIAIS: Carregadas do arquivo .env
  #   - SIGLA_LOGIN_RF
  #   - SIGLA_LOGIN_SENHA
  # ============================================================================

  Contexto:
    Dado que estou na página de login do SIGLA

  # ============================================================================
  # CENÁRIOS ESSENCIAIS — LOGIN
  # ============================================================================

  @login-sucesso @critico
  Cenário: Login com credenciais válidas
    Quando eu insiro credenciais válidas
    E clico no botão de acessar
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema

  @validacao-campo @obrigatoriedade
  Cenário: Validação de campo senha obrigatório
    Quando eu preencho o campo RF com "123456"
    E eu clico no botão de acessar
    Então devo ver mensagem "Campo Obrigatório" ou botão desabilitado

  @validacao-campo @obrigatoriedade
  Cenário: Validação de campo RF obrigatório
    Quando eu preencho o campo Senha com "SenhaTeste123"
    E eu clico no botão de acessar
    Então devo ver mensagem "Campo Obrigatório" ou botão desabilitado
