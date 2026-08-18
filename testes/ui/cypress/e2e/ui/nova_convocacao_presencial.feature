#language: pt
@ui @sigla @processos @convocacao @presencial
Funcionalidade: Processos — Convocação de Candidatos (Modalidade Presencial)

  Contexto:
    Dado que estou logado no SIGLA com perfil administrador

  # ============================================================
  # BASE URL   : https://qa-sigla.sme.prefeitura.sp.gov.br
  # CREDENCIAIS: definidas em .env (SIGLA_LOGIN_RF / SIGLA_LOGIN_SENHA)
  # CONCURSO   : Test Judicial
  # CARGO      : Analista de Sistemas
  # ============================================================

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1 — Criar convocação completa com agendamento (Nova Autorização) - Presencial
  # ════════════════════════════════════════════════════════════════
  @nova-convocacao-presencial @e2e @critico
  Cenário: Criar convocação completa com agendamento (Nova Autorização) - Presencial

    # =====================================================
    # ETAPA 1 — DADOS DO PROCESSO
    # =====================================================
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    E clico em "Nova convocação" na lista de convocações
    Então o sistema exibe a tela "Nova convocação"

    Quando seleciono o concurso "Test Judicial"
    E seleciono o tipo de escolha "Nova Autorização"
    E preencho o campo "Descrição" com "Processo de convocação Presencial"
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

    Quando preencho o campo "Autorizações Digitadas" com "11"
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

    Quando seleciono a modalidade "Presencial"
    E seleciono o período de escolha
    E preencho a data de nomeação
    Então o sistema exibe "Candidatos"
    Quando clica e preencho o campo "Candidatos" com "4"
    Então o sistema exibe "Sessão"
    Quando clica e preencho o campo "Sessão" com "4"
    Então o sistema exibe "Hora da convocação"
    Quando clica e preencho o período de horas de "10:00" a "11:00"
    E adiciono um novo período
    E clico no botão "Salvar e avançar"

    # =====================================================
    # ETAPA 4 — RESUMO
    # =====================================================
    Então o sistema exibe a etapa "Resumo"

    Quando clico no botão "Finalizar"
    Então o sistema retorna para a lista de convocações

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 2 — Criar convocação completa com agendamento (Reposição) - Presencial
  # ════════════════════════════════════════════════════════════════
  @nova-convocacao-presencial @e2e @critico
  Cenário: Criar convocação completa com agendamento (Reposição) - Presencial

    # =====================================================
    # ETAPA 1 — DADOS DO PROCESSO
    # =====================================================
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    E clico em "Nova convocação" na lista de convocações
    Então o sistema exibe a tela "Nova convocação"

    Quando seleciono o concurso "Test Judicial"
    E seleciono o tipo de escolha "Reposição"
    E preencho o campo "Descrição" com "Processo de convocação Reposição Presencial"
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

    Quando seleciono a modalidade "Presencial"
    E seleciono o período de escolha
    E preencho a data de nomeação
    Então o sistema exibe "Candidatos"
    Quando clica e preencho o campo "Candidatos" com "6"
    Então o sistema exibe "Sessão"
    Quando clica e preencho o campo "Sessão" com "6"
    Então o sistema exibe "Hora da convocação"
    Quando clica e preencho o período de horas de "10:00" a "11:00"
    E adiciono um novo período
    E clico no botão "Salvar e avançar"

    # =====================================================
    # ETAPA 4 — RESUMO
    # =====================================================
    Então o sistema exibe a etapa "Resumo"

    Quando clico no botão "Finalizar"
    Então o sistema retorna para a lista de convocações

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 3 — Criar convocação completa com agendamento (Reconvocação) - Presencial
  # ════════════════════════════════════════════════════════════════
  @nova-convocacao-presencial @e2e @critico
  Cenário: Criar convocação completa com agendamento (Reconvocação) - Presencial

    # =====================================================
    # ETAPA 1 — DADOS DO PROCESSO
    # =====================================================
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    E clico em "Nova convocação" na lista de convocações
    Então o sistema exibe a tela "Nova convocação"

    Quando seleciono o concurso "Concurso de Exemplo 3"
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

    Quando seleciono o cargo "Analista de Sistemas"
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

    Quando seleciono a modalidade "Presencial"
    E seleciono o período de escolha
    E preencho a data de nomeação
    Então o sistema exibe "Candidatos"
    Quando clica e preencho o campo "Candidatos" com "10"
    Então o sistema exibe "Sessão"
    Quando clica e preencho o campo "Sessão" com "10"
    Então o sistema exibe "Hora da convocação"
    Quando clica e preencho o período de horas de "07:00" a "17:00"
    E adiciono um novo período
    E clico no botão "Salvar e avançar"

    # =====================================================
    # ETAPA 4 — RESUMO
    # =====================================================
    Então o sistema exibe a etapa "Resumo"

    Quando clico no botão "Finalizar"
    Então o sistema retorna para a lista de convocações
