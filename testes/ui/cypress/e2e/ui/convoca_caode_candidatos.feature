#language: pt
@ui @sigla @processos @convocacao
Funcionalidade: Processos — Convocação de Candidatos

  Contexto:
    Dado que estou logado no SIGLA com perfil administrador

  # ============================================================
  # BASE URL   : https://qa-sigla.sme.prefeitura.sp.gov.br
  # CREDENCIAIS: definidas em .env (SIGLA_LOGIN_RF / SIGLA_LOGIN_SENHA)
  # CONCURSO   : CONCURSO TESTE AUTOMACAO CYPRESS 2026
  # ============================================================

  @nova-convocacao @preenchimento @critico
  Cenário: Preencher dados do processo e avançar para etapa 2
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    E clico em "Nova convocação" na lista de convocações
    Então o sistema exibe o formulário de nova convocação
    Quando seleciono "CONCURSO TESTE AUTOMACAO CYPRESS 2026" no campo Concurso
    E seleciono "Nova Autorização" no campo Tipo de Escolha
    E preencho o campo Descrição com "Processo de convocação de candidatos" no formulário de convocação
    E preencho a Data da convocação com a data de ontem
    E preencho a Data corte de vagas com a data de amanhã
    Quando clico em "Salvar e avançar" no formulário de convocação
    Então o sistema avança para a etapa 2 de configuração de cargos
    E a etapa 2 exibe o resumo dos dados preenchidos:
      | Dados do processo    |
      | Concurso:            |
      | Data da convocação:  |
      | Tipo de Escolha:     |
      | Data corte de vagas: |
      | Descrição:           |

  @navegacao @smoke
  Cenário: Navegar até a lista de convocações pelo menu Processos
    Dado que estou na página inicial do SIGLA
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"
    E a lista de convocações exibe o botão "Nova convocação"

  @nova-convocacao @validacao @critico
  Cenário: Validar estrutura do formulário de nova convocação
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"
    Quando clico em "Nova convocação" na lista de convocações
    Então o sistema exibe o formulário de nova convocação
    E o formulário exibe as etapas do processo:
      | Dados do processo                   |
      | Seleção e configuração dos cargos |
      | Agendar                           |
      | Resumo                            |
    E o formulário exibe os campos da etapa 1:
      | Concurso            |
      | Tipo de Escolha     |
      | Descrição           |
      | Data da convocação  |
      | Data corte de vagas |
    E o formulário exibe os botões "Cancelar" e "Salvar e avançar" na etapa 1

  @filtros @validacao
  Cenário: Validar filtros de busca na lista de convocações
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"
    E a lista de convocações exibe os textos:
      | Busca processos    |
      | Concurso           |
      | Cargo              |
      | Data de Convocação |
      | Status             |
      | Todos              |
      | Andamento          |
      | Finalizado         |
    E a lista de convocações exibe os botões de filtro:
      | Limpar filtros |
      | Buscar         |

  @fluxo-completo @critico
  Cenário: Fluxo completo — da página inicial à etapa 2 de configuração de cargos
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
    Quando clico em "Nova convocação" na lista de convocações
    Então o sistema exibe o formulário de nova convocação
    E o formulário exibe as etapas do processo:
      | Dados do processo                   |
      | Seleção e configuração dos cargos |
      | Agendar                           |
      | Resumo                            |
    Quando seleciono "CONCURSO TESTE AUTOMACAO CYPRESS 2026" no campo Concurso
    E seleciono "Nova Autorização" no campo Tipo de Escolha
    E preencho o campo Descrição com "Processo de convocação de candidatos" no formulário de convocação
    E preencho a Data da convocação com a data de ontem
    E preencho a Data corte de vagas com a data de amanhã
    Quando clico em "Salvar e avançar" no formulário de convocação
    Então o sistema avança para a etapa 2 de configuração de cargos
    E a etapa 2 exibe o resumo dos dados preenchidos:
      | Dados do processo    |
      | Concurso:            |
      | Data da convocação:  |
      | Tipo de Escolha:     |
      | Data corte de vagas: |
      | Descrição:           |
