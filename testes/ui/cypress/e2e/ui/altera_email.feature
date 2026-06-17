#language: pt
@ui @sigla @meus-dados @alterar-email
Funcionalidade: Meus Dados — Alteração de E-mail
  Como usuário autenticado no sistema SIGLA
  Quero acessar meus dados cadastrais
  Para visualizar minhas informações pessoais e solicitar alteração de e-mail

  Contexto:
    Dado que estou logado no SIGLA com perfil administrador

  # ============================================================
  # BASE URL : https://qa-sigla.sme.prefeitura.sp.gov.br
  # CREDENCIAIS : definidas em .env (SIGLA_LOGIN_RF / SIGLA_LOGIN_SENHA)
  # ============================================================

  @alterar-email @preenchimento @critico
  Cenário: Preencher campos do modal de alteração de e-mail e cancelar
    Quando acesso o menu de perfil do usuário
    E seleciono "Dados do Usuário" no menu de perfil
    Então o sistema exibe a tela "Meus Dados"
    Quando clico em "Alterar e-mail" nos meus dados
    Então o modal de alterar e-mail é exibido
    E o modal de alterar e-mail exibe o campo "Novo e-mail"
    E o modal de alterar e-mail exibe o campo "Confirmação do novo e-mail"
    Quando preencho o campo "Novo e-mail" no modal com "teste@email.com"
    E preencho o campo "Confirmação do novo e-mail" no modal com "teste@email.com"
    E clico em "Cancelar" no modal de alterar e-mail
    Então o modal de alterar e-mail é fechado
    E permaneço na tela de meus dados

  @pagina-inicial @smoke
  Cenário: Validar textos institucionais da página inicial
    Dado que estou na página inicial do SIGLA
    Então o sistema exibe o título "ALOCAÇÃO DE VAGAS ONLINE"
    E o sistema exibe a descrição institucional do sistema
    E o sistema exibe os benefícios da plataforma:
      | Convocação de candidatos.      |
      | Processo de escolha de vagas.  |
      | Relatórios detalhados.         |
      | Acompanhamento em tempo real.  |

  @meus-dados @critico
  Cenário: Validar campos exibidos na tela Meus Dados
    Quando acesso o menu de perfil do usuário
    E seleciono "Dados do Usuário" no menu de perfil
    Então o sistema exibe a tela "Meus Dados"
    E o sistema exibe os campos do perfil do usuário:
      | Nome completo    |
      | E-mail           |
      | Senha            |
      | RF               |
      | Perfil de acesso |

  @alterar-email @critico
  Cenário: Validar modal de alteração de e-mail
    Quando acesso o menu de perfil do usuário
    E seleciono "Dados do Usuário" no menu de perfil
    Então o sistema exibe a tela "Meus Dados"
    Quando clico em "Alterar e-mail" nos meus dados
    Então o modal de alterar e-mail é exibido
    E o modal de alterar e-mail exibe o campo "Novo e-mail"
    E o modal de alterar e-mail exibe o campo "Confirmação do novo e-mail"
    E o modal de alterar e-mail exibe os botões "Cancelar" e "Confirmar"

  @alterar-email @cancelamento @critico
  Cenário: Cancelar alteração de e-mail fecha o modal
    Quando acesso o menu de perfil do usuário
    E seleciono "Dados do Usuário" no menu de perfil
    Então o sistema exibe a tela "Meus Dados"
    Quando clico em "Alterar e-mail" nos meus dados
    Então o modal de alterar e-mail é exibido
    Quando clico em "Cancelar" no modal de alterar e-mail
    Então o modal de alterar e-mail é fechado
    E permaneço na tela de meus dados

  @fluxo-completo @critico
  Cenário: Fluxo completo — da página inicial ao cancelamento de alteração de e-mail
    Dado que estou na página inicial do SIGLA
    Então o sistema exibe o título "ALOCAÇÃO DE VAGAS ONLINE"
    E o sistema exibe os benefícios da plataforma:
      | Convocação de candidatos.      |
      | Processo de escolha de vagas.  |
      | Relatórios detalhados.         |
      | Acompanhamento em tempo real.  |
    Quando acesso o menu de perfil do usuário
    E seleciono "Dados do Usuário" no menu de perfil
    Então o sistema exibe a tela "Meus Dados"
    E o sistema exibe os campos do perfil do usuário:
      | Nome completo    |
      | E-mail           |
      | Senha            |
      | RF               |
      | Perfil de acesso |
    Quando clico em "Alterar e-mail" nos meus dados
    Então o modal de alterar e-mail é exibido
    E o modal de alterar e-mail exibe o campo "Novo e-mail"
    E o modal de alterar e-mail exibe o campo "Confirmação do novo e-mail"
    E o modal de alterar e-mail exibe os botões "Cancelar" e "Confirmar"
    Quando clico em "Cancelar" no modal de alterar e-mail
    Então o modal de alterar e-mail é fechado
    E permaneço na tela de meus dados
