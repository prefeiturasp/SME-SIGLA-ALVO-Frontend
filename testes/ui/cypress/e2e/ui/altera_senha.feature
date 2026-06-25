#language: pt
@ui @sigla @meus-dados @alterar-senha
Funcionalidade: Meus Dados — Alteração de Senha
  Como usuário autenticado no sistema SIGLA
  Quero acessar meus dados cadastrais
  Para visualizar minhas informações pessoais e solicitar alteração de senha

  Contexto:
    Dado que estou logado no SIGLA com perfil administrador

  # ============================================================
  # BASE URL : https://qa-sigla.sme.prefeitura.sp.gov.br
  # CREDENCIAIS : definidas em .env (SIGLA_LOGIN_RF / SIGLA_LOGIN_SENHA)
  # ============================================================

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

  @alterar-senha @critico
  Cenário: Validar modal de alteração de senha
    Quando acesso o menu de perfil do usuário
    E seleciono "Dados do Usuário" no menu de perfil
    Então o sistema exibe a tela "Meus Dados"
    Quando clico em "Alterar senha" nos meus dados
    Então o modal de alterar senha é exibido
    E o modal de alterar senha exibe o campo "Nova senha"
    E o modal de alterar senha exibe o campo "Confirmação"
    E o modal de alterar senha exibe os botões "Cancelar" e "Salvar senha"

  @alterar-senha @cancelamento @critico
  Cenário: Cancelar alteração de senha fecha o modal
    Quando acesso o menu de perfil do usuário
    E seleciono "Dados do Usuário" no menu de perfil
    Então o sistema exibe a tela "Meus Dados"
    Quando clico em "Alterar senha" nos meus dados
    Então o modal de alterar senha é exibido
    Quando clico em "Cancelar" no modal de alterar senha
    Então o modal de alterar senha é fechado
    E permaneço na tela de meus dados

  # ============================================================
  # REGRAS DA NOVA SENHA:
  # ✅ Ao menos uma letra minúscula
  # ✅ Ao menos uma letra maiúscula
  # ✅ Entre 8 e 12 caracteres
  # ✅ Ao menos um caractere numérico
  # ✅ Ao menos um caractere especial (#$@!%&*?)
  # ❌ SEM espaço em branco
  # ❌ SEM caracteres acentuados
  # Senha usada nos testes: "Test@123" — valor de teste, nunca submetido (cancela sempre)
  # ============================================================

  @alterar-senha @preenchimento @cancelar @critico
  Cenário: Preencher campos com senha válida e cancelar alteração
    Quando acesso o menu de perfil do usuário
    E seleciono "Dados do Usuário" no menu de perfil
    Então o sistema exibe a tela "Meus Dados"
    Quando clico em "Alterar senha" nos meus dados
    Então o modal de alterar senha é exibido
    Quando preencho a senha atual no modal de alterar senha
    E preencho o campo "Nova senha" com "Test@123" no modal de alterar senha
    E preencho o campo "Confirmação" com "Test@123" no modal de alterar senha
    Quando clico em "Cancelar" no modal de alterar senha
    Então o modal de alterar senha é fechado
    E permaneço na tela de meus dados

  @alterar-senha @preenchimento @fechar-x @critico
  Cenário: Preencher campos com senha válida e fechar modal pelo botão X
    Quando acesso o menu de perfil do usuário
    E seleciono "Dados do Usuário" no menu de perfil
    Então o sistema exibe a tela "Meus Dados"
    Quando clico em "Alterar senha" nos meus dados
    Então o modal de alterar senha é exibido
    Quando preencho a senha atual no modal de alterar senha
    E preencho o campo "Nova senha" com "Test@123" no modal de alterar senha
    E preencho o campo "Confirmação" com "Test@123" no modal de alterar senha
    Quando fecho o modal de alterar senha pelo botão fechar
    Então o modal de alterar senha é fechado
    E permaneço na tela de meus dados

  @fluxo-completo @critico
  Cenário: Fluxo completo — da página inicial ao cancelamento de alteração de senha
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
    Quando clico em "Alterar senha" nos meus dados
    Então o modal de alterar senha é exibido
    E o modal de alterar senha exibe o campo "Nova senha"
    E o modal de alterar senha exibe o campo "Confirmação"
    E o modal de alterar senha exibe os botões "Cancelar" e "Salvar senha"
    Quando clico em "Cancelar" no modal de alterar senha
    Então o modal de alterar senha é fechado
    E permaneço na tela de meus dados
