#language: pt
@ui @sigla @esqueci-senha
Funcionalidade: Recuperação de Senha no Sistema SIGLA
  Como usuário do sistema SME
  Quero recuperar minha senha através do fluxo de recuperação
  Para poder acessar o sistema quando esquecer minha senha

  # ============================================================================
  # BASE URL : https://qa-sigla.sme.prefeitura.sp.gov.br
  # CREDENCIAIS : definidas em .env (SIGLA_LOGIN_RF / SIGLA_LOGIN_SENHA)
  # ============================================================================

  Contexto:
    Dado que eu acesso o sistema SIGLA
    E valido a existência do link "Esqueci minha senha"

  # ============================================================================
  # CENÁRIOS ESSENCIAIS — RECUPERAÇÃO DE SENHA
  # ============================================================================

  @recuperacao-sucesso @critico
  Cenário: Fluxo esqueci a senha com RF válido
    Quando clico na opção "Esqueci minha senha"
    E valido que estou na página de recuperação de senha
    E preencho o campo RF do perfil administrador
    E clico no botão continuar
    E valido que estou na página de confirmação
    E valido a existência do texto de confirmação
    E valido a existência do botão continuar para voltar
    E clico no botão continuar para voltar ao login
    Então devo estar na página de login

  @recuperacao-falha @validacao
  Cenário: Fluxo esqueci a senha com RF inválido
    Quando clico na opção "Esqueci minha senha"
    E valido que estou na página de recuperação de senha
    E preencho o campo RF com "0000000"
    E clico no botão continuar
    Então o sistema deve exibir mensagem de erro na página
