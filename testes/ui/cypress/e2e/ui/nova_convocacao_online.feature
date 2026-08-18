#language: pt
@ui @sigla @processos @convocacao
Funcionalidade: Processos — Convocação de Candidatos

  Contexto:
    Dado que estou logado no SIGLA com perfil administrador

  # ============================================================
  # BASE URL   : https://qa-sigla.sme.prefeitura.sp.gov.br
  # CREDENCIAIS: definidas em .env (SIGLA_LOGIN_RF / SIGLA_LOGIN_SENHA)
  # CONCURSO   : Test Judicial
  # CARGO      : Analista de Sistemas (Reconvocação usa Engenheiro de Software)
  # ============================================================

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1 — Criar convocação completa com agendamento (Nova Autorização)
  # ════════════════════════════════════════════════════════════════
  @nova-convocacao @e2e @critico
  Cenário: Criar convocação completa com agendamento (Nova Autorização)

    # =====================================================
    # ETAPA 1 — DADOS DO PROCESSO
    # =====================================================
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    E clico em "Nova convocação" na lista de convocações
    Então o sistema exibe a tela "Nova convocação"

    Quando seleciono o concurso "Test Judicial"
    E seleciono o tipo de escolha "Nova Autorização"
    E preencho o campo "Descrição" com "Processo de convocação"
    E seleciono a data da convocação como sendo "ontem"
    E seleciono a data corte de vagas como sendo "amanhã"
    E clico no botão "Salvar e avançar"

    # =====================================================
    # ETAPA 2 — CONFIGURAÇÃO DE CARGOS
    # =====================================================
    Então o sistema exibe a etapa "Seleção e configuração do(s) cargo(s)"
    E o sistema exibe o resumo dos dados do processo

    Quando seleciono o cargo "Analista de Sistemas"
    E clico no botão "Buscar candidatos"
    Então o sistema exibe o modal "Buscar candidatos"

    Quando preencho o campo "Autorizações Digitadas" com "6"
    E clico no botão "Buscar"
    Então o sistema exibe "Lista de Convocados por autorizações calculadas"

    Quando clico no botão "Adicionar ao cargo"
    Então o sistema exibe a tabela de cargos adicionados

    Quando clico no botão "Salvar e avançar"

    # =====================================================
    # ETAPA 3 — AGENDAR
    # =====================================================
    Então o sistema exibe a etapa "Agendar"

    Quando clico em "Agendar" na linha do cargo
    Então o sistema exibe o formulário de agendamento

    Quando seleciono a modalidade "Online"
    E seleciono o período de escolha
    E preencho a data de nomeação
    E adiciono um novo período
    E clico no botão "Salvar e avançar"

    # =====================================================
    # ETAPA 4 — RESUMO
    # =====================================================
    Então o sistema exibe a etapa "Resumo"

    Quando clico no botão "Finalizar"
    Então o sistema retorna para a lista de convocações

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 2 — Criar convocação completa com agendamento (Reposição)
  # ════════════════════════════════════════════════════════════════
  @nova-convocacao @e2e @critico
  Cenário: Criar convocação completa com agendamento (Reposição)

    # =====================================================
    # ETAPA 1 — DADOS DO PROCESSO
    # =====================================================
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    E clico em "Nova convocação" na lista de convocações
    Então o sistema exibe a tela "Nova convocação"

    Quando seleciono o concurso "Test Judicial"
    E seleciono o tipo de escolha "Reposição"
    E preencho o campo "Descrição" com "Processo de convocação reposição"
    E seleciono a data da convocação como sendo "ontem"
    E seleciono a data corte de vagas como sendo "amanhã"
    E clico no botão "Salvar e avançar"

    # =====================================================
    # ETAPA 2 — CONFIGURAÇÃO DE CARGOS
    # =====================================================
    Então o sistema exibe a etapa "Seleção e configuração do(s) cargo(s)"
    E o sistema exibe o resumo dos dados do processo

    Quando seleciono o cargo "Analista de Sistemas"
    E clico no botão "Buscar candidatos"
    Então o sistema exibe o modal "Buscar candidatos"

    Quando preencho o campo "Autorizações Digitadas" com "6"
    E clico no botão "Buscar"
    Então o sistema exibe "Lista de Convocados por autorizações digitadas"

    Quando clico no botão "Adicionar ao cargo"
    Então o sistema exibe a tabela de cargos adicionados

    Quando clico no botão "Salvar e avançar"

    # =====================================================
    # ETAPA 3 — AGENDAR
    # =====================================================
    Então o sistema exibe a etapa "Agendar"

    Quando clico em "Agendar" na linha do cargo
    Então o sistema exibe o formulário de agendamento

    Quando seleciono a modalidade "Online"
    E seleciono o período de escolha
    E preencho a data de nomeação
    E adiciono um novo período
    E clico no botão "Salvar e avançar"

    # =====================================================
    # ETAPA 4 — RESUMO
    # =====================================================
    Então o sistema exibe a etapa "Resumo"

    Quando clico no botão "Finalizar"
    Então o sistema retorna para a lista de convocações

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 3 — Criar convocação completa com agendamento (Reconvocação)
  # ════════════════════════════════════════════════════════════════
  @nova-convocacao2 @e2e @critico
  Cenário: Criar convocação completa com agendamento (Reconvocação)

    # =====================================================
    # ETAPA 1 — DADOS DO PROCESSO
    # =====================================================
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    E clico em "Nova convocação" na lista de convocações
    Então o sistema exibe a tela "Nova convocação"

    Quando seleciono o concurso "Test Judicial"
    E seleciono o tipo de escolha "Reconvocação"
    E preencho o campo "Descrição" com "Processo de convocação Reconvocação"
    E seleciono a data da convocação como sendo "ontem"
    E seleciono a data corte de vagas como sendo "amanhã"
    E clico no botão "Salvar e avançar"

    # =====================================================
    # ETAPA 2 — CONFIGURAÇÃO DE CARGOS
    # =====================================================
    Então o sistema exibe a etapa "Seleção e configuração do(s) cargo(s)"
    E o sistema exibe o resumo dos dados do processo

    Quando seleciono o cargo "Engenheiro de Software"
    E clico no botão "Buscar candidatos"
    Então o sistema exibe o modal "Buscar candidatos"

    Quando preencho o campo "Autorizações Digitadas" com "2"
    E clico no botão "Buscar"
    Então o sistema exibe "Lista de Convocados por autorizações digitadas"

    Quando clico no botão "Adicionar ao cargo"
    Então o sistema exibe a tabela de cargos adicionados

    Quando clico no botão "Salvar e avançar"

    # =====================================================
    # ETAPA 3 — AGENDAR
    # =====================================================
    Então o sistema exibe a etapa "Agendar"

    Quando clico em "Agendar" na linha do cargo
    Então o sistema exibe o formulário de agendamento

    Quando seleciono a modalidade "Online"
    E seleciono o período de escolha
    E preencho a data de nomeação
    E adiciono um novo período
    E clico no botão "Salvar e avançar"

    # =====================================================
    # ETAPA 4 — RESUMO
    # =====================================================
    Então o sistema exibe a etapa "Resumo"

    Quando clico no botão "Finalizar"
    Então o sistema retorna para a lista de convocações

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 4 — Validar bloqueio ao tentar avançar sem preencher campos obrigatórios
  # ════════════════════════════════════════════════════════════════
  @validacao @negativo @critico
  Cenário: Validar bloqueio ao tentar avançar sem preencher campos obrigatórios

    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    E clico em "Nova convocação" na lista de convocações
    Então o sistema exibe a tela "Nova convocação"

    Quando clico no botão "Salvar e avançar"
    Então o sistema exibe mensagens de erro nos campos obrigatórios
    E o sistema exibe a tela "Nova convocação"

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 5 — Navegar até a lista de convocações pelo menu Processos
  # ════════════════════════════════════════════════════════════════
  @navegacao @smoke
  Cenário: Navegar até a lista de convocações pelo menu Processos
    Dado que estou na página inicial do SIGLA
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"
    E a lista de convocações exibe o botão "Nova convocação"

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 6 — Validar estrutura do formulário de nova convocação
  # ════════════════════════════════════════════════════════════════
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

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 7 — Validar filtros de busca na lista de convocações
  # ════════════════════════════════════════════════════════════════
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

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 8 — Fluxo completo — da página inicial à etapa 2 de configuração de cargos
  # ════════════════════════════════════════════════════════════════
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
    Quando seleciono "Test Judicial" no campo Concurso
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
