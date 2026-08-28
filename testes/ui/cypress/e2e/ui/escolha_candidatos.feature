#language: pt
@ui @sigla @processos
Funcionalidade: Escolha de Candidatos
  Como usuário do sistema SIGLA
  Quero consultar os processos de escolha de candidatos disponíveis
  Para acompanhar a situação de escolha dos candidatos por processo

  # ============================================================
  # BASE URL   : https://qa-sigla.sme.prefeitura.sp.gov.br
  # CREDENCIAIS: definidas em .env (SIGLA_LOGIN_RF / SIGLA_LOGIN_SENHA, RF: 007001)
  # ============================================================

  Contexto:
    Dado que estou logado no SIGLA com perfil administrador
    Quando navego até a opção "Processos"
    E seleciono a opção "Escolha de Candidatos"
    Então o sistema exibe a tela "Escolha de Candidatos"

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 1 — Consultar candidatos por situação
  # ════════════════════════════════════════════════════════════════
  @consulta-processo @critico
  Cenário: Consultar candidatos por situação
    Então o sistema exibe os campos:
      | Processo          |
      | Período da agenda |

    E valido a existência do campo "Processo" na escolha de candidatos
    Quando clico e seleciono o processo "Candidatura" na escolha de candidatos
    E valido a existência do campo "Período da agenda" na escolha de candidatos
    E clico no campo e seleciono uma opção aleatória no campo "Período da agenda" da escolha de candidatos
    E clico no botão "Carregar processo"

    Então o sistema exibe os resultados

    E a escolha de candidatos exibe as opções de situação:
      | Todos        |
      | Pendente     |
      | Escolha      |
      | Reconvocação |
      | Não escolha  |

    Quando filtro a escolha de candidatos pela situação "Reconvocação"
    E clico no botão "Buscar"

    Então a tabela de escolha de candidatos exibe registros da situação "Reconvocação"

    E clico no botão "Limpar Filtros"

    E a escolha de candidatos exibe as opções de situação:
      | Todos        |
      | Pendente     |
      | Escolha      |
      | Reconvocação |
      | Não escolha  |

    Quando filtro a escolha de candidatos pela situação "Pendente"
    E clico no botão "Buscar"

    Então a tabela de escolha de candidatos exibe registros da situação "Pendente"

    E clico no botão "Limpar Filtros"

    E a escolha de candidatos exibe as opções de situação:
      | Todos        |
      | Pendente     |
      | Escolha      |
      | Reconvocação |
      | Não escolha  |

    Quando filtro a escolha de candidatos pela situação "Não escolha"
    E clico no botão "Buscar"

    Então a tabela de escolha de candidatos exibe registros da situação "Não escolha"

  # ════════════════════════════════════════════════════════════════
  # CENÁRIO 2 — Visualizar escolha do candidato
  # ════════════════════════════════════════════════════════════════
  @visualizar-escolha @critico
  Cenário: Visualizar escolha do candidato
    E valido a existência do campo "Processo" na escolha de candidatos
    Quando clico e seleciono o processo "Candidatura" na escolha de candidatos
    E valido a existência do campo "Período da agenda" na escolha de candidatos
    E clico no campo e seleciono uma opção aleatória no campo "Período da agenda" da escolha de candidatos
    E clico no botão "Carregar processo"

    Então o sistema exibe a tabela de candidatos da escolha

    E a tabela de candidatos da escolha contém as colunas:
      | Candidato      |
      | Cargo          |
      | Tipo de Vaga   |
      | Classificação  |
      | Situação       |
      | Escolha        |

    Quando clico para visualizar a escolha do primeiro candidato

    Então o sistema exibe o modal "Visualizar escolha de candidato"

    E o modal de escolha do candidato exibe os campos:
      | Cargo             |
      | Candidato         |
      | Classificação     |
      | Vagas definitivas |
      | Vagas precárias   |
      | Vagas publicadas  |

    E o modal de escolha do candidato exibe as situações:
      | Escolha      |
      | Reconvocação |
      | Não escolha  |

    Quando clico no botão "Fechar"

    Então o sistema exibe a tela "Escolha de Candidatos"
