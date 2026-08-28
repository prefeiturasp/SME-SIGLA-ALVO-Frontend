#language: pt
@ui @sigla @concursos @cadastro @critico
Funcionalidade: Cadastro de Concursos

  Como usuário administrador
  Quero cadastrar concursos
  Para disponibilizar concursos para futuras candidaturas

  Contexto:
    Dado que estou logado no SIGLA com perfil administrador

  # ============================================================
  # BASE URL   : https://qa-sigla.sme.prefeitura.sp.gov.br
  # CREDENCIAIS: definidas em .env (SIGLA_LOGIN_RF / SIGLA_LOGIN_SENHA)
  # CÓDIGO DO CARGO: 8040 (MASCARA PROF.ED.INFANTIL)
  # Tela real: menu "Gerenciar" > "Cadastro de concursos" > "Adicionar concurso"
  # (wizard de 3 passos: Identificação do concurso / Publicações e resultados / Vigência)
  # ============================================================

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1 — Cadastrar concurso com sucesso
  # ════════════════════════════════════════════════════════════════
  @cadastro-concurso @e2e
  Cenário: Cadastrar concurso com sucesso

    Quando acesso a tela de cadastro de concursos
    Então o sistema exibe a listagem de concursos
    E exibe o botão "Adicionar concurso" no cadastro de concursos

    Quando clico em "Adicionar concurso" no cadastro de concurso
    Então o sistema exibe a etapa "Identificação do concurso" do cadastro de concurso
    E valida a existência dos campos do concurso:
      | Código do cargo |
      | Nome do concurso |
      | Status do concurso |
      | Banca responsável |
      | Processo SEI |

    Quando seleciono o código do cargo "8040"
    E preencho o Nome do concurso com um nome aleatório da lista
    E seleciono o status do concurso "Ativo"
    E preencho o campo "Banca responsável" do concurso com "INSBA"
    E preencho o Processo SEI do concurso com um número único gerado automaticamente
    E clico em "Próximo" no cadastro de concurso

    Então o sistema exibe a etapa "Publicações e resultados" do cadastro de concurso
    E valida a existência dos campos do concurso:
      | Data de autorização do concurso |
      | Data de abertura do concurso |
      | Classificação final |
      | Link do edital |
      | Quantidade de habilitados (Geral) |
      | Quantidade de habilitados (NNA) |
      | Quantidade de habilitados (PcD) |
      | Retificações |

    Quando preencho os campos do concurso:
      | Data de autorização do concurso   | 12/08/2026 |
      | Data de abertura do concurso      | 20/08/2026 |
      | Classificação final                | 11/08/2026 |
      | Link do edital                     | https://prefeitura.sp.gov.br/novo-rumo |
      | Quantidade de habilitados (Geral)  | 150 |
      | Quantidade de habilitados (NNA)    | 30 |
      | Quantidade de habilitados (PcD)    | 20 |
      | Retificações                       | Sem retificações |
    E clico em "Próximo" no cadastro de concurso

    Então o sistema exibe a etapa "Vigência" do cadastro de concurso
    E valida a existência dos campos do concurso:
      | Data da homologação |
      | Data da prorrogação |
      | Vigência do concurso |

    Quando preencho os campos do concurso:
      | Data da homologação | 01/09/2026 |
      | Data da prorrogação | 01/09/2028 |
    E seleciono a vigência do concurso de "01/09/2026" a "01/09/2028"
    E clico em "Adicionar concurso" no cadastro de concurso

    Então o sistema exibe uma mensagem de sucesso no cadastro de concurso
    E apresenta o concurso cadastrado na listagem de concursos

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 2 — Cancelar o cadastro de concurso e retornar à listagem
  # ════════════════════════════════════════════════════════════════
  @cadastro-concurso @cancelamento
  Cenário: Cancelar o cadastro de concurso e retornar à listagem

    Quando acesso a tela de cadastro de concursos
    E clico em "Adicionar concurso" no cadastro de concurso
    Então o sistema exibe a etapa "Identificação do concurso" do cadastro de concurso

    Quando clico em "Cancelar" no cadastro de concurso
    Então o sistema exibe a listagem de concursos

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 3 — Validar bloqueio ao avançar sem preencher os campos obrigatórios
  # ════════════════════════════════════════════════════════════════
  @validacao @negativo
  Cenário: Validar bloqueio ao avançar sem preencher os campos obrigatórios

    Quando acesso a tela de cadastro de concursos
    E clico em "Adicionar concurso" no cadastro de concurso
    Então o sistema exibe a etapa "Identificação do concurso" do cadastro de concurso
    E o botão "Próximo" permanece desabilitado no cadastro de concurso

    Quando seleciono o código do cargo "8040"
    E preencho o Nome do concurso com um nome aleatório da lista
    Então o botão "Próximo" permanece desabilitado no cadastro de concurso

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 4 — Validar bloqueio ao cadastrar concurso com Processo SEI já utilizado
  # ════════════════════════════════════════════════════════════════
  @validacao @negativo @unicidade
  Cenário: Validar bloqueio ao cadastrar concurso com Processo SEI já utilizado

    Quando acesso a tela de cadastro de concursos
    E clico em "Adicionar concurso" no cadastro de concurso
    Então o sistema exibe a etapa "Identificação do concurso" do cadastro de concurso

    Quando seleciono o código do cargo "8040"
    E preencho o Nome do concurso com um nome aleatório da lista
    E seleciono o status do concurso "Ativo"
    E preencho o campo "Banca responsável" do concurso com "INSBA"
    E preencho o Processo SEI do concurso com um número único gerado automaticamente
    E clico em "Próximo" no cadastro de concurso
    Então o sistema exibe a etapa "Publicações e resultados" do cadastro de concurso

    Quando acesso a tela de cadastro de concursos
    E clico em "Adicionar concurso" no cadastro de concurso
    Então o sistema exibe a etapa "Identificação do concurso" do cadastro de concurso

    Quando seleciono o código do cargo "8040"
    E preencho o Nome do concurso com um nome aleatório da lista
    E seleciono o status do concurso "Ativo"
    E preencho o campo "Banca responsável" do concurso com "INSBA"
    E preencho o Processo SEI do concurso com o mesmo número já utilizado nesta execução
    E clico em "Próximo" no cadastro de concurso

    Então o sistema exibe uma mensagem de erro de Processo SEI já cadastrado
    E o sistema exibe a etapa "Identificação do concurso" do cadastro de concurso
