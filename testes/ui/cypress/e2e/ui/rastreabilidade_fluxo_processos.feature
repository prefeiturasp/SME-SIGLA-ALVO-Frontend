#language: pt
@ui @sigla @rastreabilidade @e2e
Funcionalidade: Rastreabilidade de Fluxo de Processos - Jornadas E2E
  Como auditor de qualidade do sistema SME-SIGLA
  Quero validar os fluxos completos de ponta a ponta nos módulos de Processos
  Para garantir consistência de navegação, dados e controle de acesso em toda a jornada do usuário

  Contexto:
    Dado que estou na página de login do SIGLA
    Quando eu insiro credenciais válidas
    E clico no botão de acessar
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema

  @contraste-perfis @critico @comparacao
  Cenário: Contraste direto entre perfis — visualização bloqueado vs admin com acesso pleno ao Gerenciamento de Vagas
    Dado que estou logado no sistema com perfil de visualização
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

    E devo ver os botões "Gerenciamento de vagas" e "Nova convocação" desabilitados
    E ao clicar em "Gerenciamento de vagas" da convocação devo ver a mensagem "Você não possui permissão para essa ação"
    E ao clicar em "Nova convocação" da convocação devo ver a mensagem "Você não possui permissão para essa ação"

    Dado que estou logado no SIGLA com perfil administrador
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

  @e2e-completo @critico
  Cenário: Jornada E2E de consulta por concurso, visualização do processo e retorno à lista
    Dado que estou no dashboard
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

    E valido a existência dos campos de filtro de convocação:
      | Concurso           |
      | Cargo              |
      | Data de Convocação |
      | Status             |
    E valido a existência dos botões de filtro de convocação

    Quando seleciono um concurso aleatório para convocação
    E clico no botão "Buscar"
    Então o sistema exibe os resultados de convocação filtrados

    E devo visualizar a tabela de convocação com as colunas:
      | Processo           |
      | Concurso           |
      | Data de Convocação |
      | Status             |
      | Gerenciar          |

    Quando foco na primeira linha da tabela de convocação
    E clico na ação "Visualizar processo" da coluna Gerenciar
    Então o sistema exibe a tela "Resumo do processo"

    E valido a existência dos dados do processo de convocação:
      | Concurso           |
      | Tipo de processo   |
      | Titulo             |
      | Data da convocação |
      | Data da publicação |
      | Modalidade         |
    E valido a tabela de agenda de convocação ou mensagem vazia

    Quando clico no botão "Voltar"
    Então o sistema exibe a tela "Lista de Convocações"

  @busca-cargo @permissoes-tabela @critico @perfil-visualizacao
  Cenário: Busca por cargo e validação de restrições de permissão em todas as ações da tabela
    Dado que estou logado no sistema com perfil de visualização
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

    Quando clica e seleciono um Cargo de forma aleatória
    E clico no botão "Buscar"
    Então o sistema exibe os resultados de convocação filtrados

    E devo visualizar a tabela de convocação com as colunas:
      | Processo           |
      | Concurso           |
      | Data de Convocação |
      | Status             |
      | Gerenciar          |

    Quando foco na primeira linha da tabela de convocação
    E ao clicar na ação "Editar" da coluna Gerenciar devo ver a mensagem "Você não possui permissão para essa ação"
    E ao clicar na ação "Excluir" da coluna Gerenciar devo ver a mensagem "Você não possui permissão para essa ação"
    E ao clicar na ação "Outra" da coluna Gerenciar devo ver a mensagem "Você não possui permissão para essa ação"

    Quando clico na ação "Visualizar processo" da coluna Gerenciar
    Então o sistema exibe a tela "Resumo do processo"
    E valido a existência dos dados do processo de convocação:
      | Concurso           |
      | Tipo de processo   |
      | Titulo             |
      | Data da convocação |
      | Data da publicação |
      | Modalidade         |

    Quando clico no botão "Voltar"
    Então o sistema exibe a tela "Lista de Convocações"

  @auditoria-permissoes @critico @perfil-visualizacao @skip
  Cenário: Auditoria completa de restrições de acesso em todos os módulos de processos em sessão única
    Dado que estou logado no sistema com perfil de visualização
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

    E devo ver os botões "Gerenciamento de vagas" e "Nova convocação" desabilitados
    E ao clicar em "Gerenciamento de vagas" da convocação devo ver a mensagem "Você não possui permissão para essa ação"
    E ao clicar em "Nova convocação" da convocação devo ver a mensagem "Você não possui permissão para essa ação"

    Quando seleciono um concurso aleatório para convocação
    E clico no botão "Buscar"
    Então o sistema exibe os resultados de convocação filtrados

    Quando foco na primeira linha da tabela de convocação
    E ao clicar na ação "Editar" da coluna Gerenciar devo ver a mensagem "Você não possui permissão para essa ação"
    E ao clicar na ação "Excluir" da coluna Gerenciar devo ver a mensagem "Você não possui permissão para essa ação"

    Quando navego até a opção "Processos"
    E seleciono a opção "Escolha de Candidatos"
    Então o sistema exibe a tela "Escolha de Candidatos"

    E valido a existência do campo "Processo" na escolha de candidatos
    Quando seleciono uma opção aleatória no campo "Processo" da escolha de candidatos
    Então valido a existência do campo "Período da agenda" na escolha de candidatos
    Quando seleciono uma opção aleatória no campo "Período da agenda" da escolha de candidatos
    Então valido que o botão de ação da escolha de candidatos está desabilitado

    Quando navego até a opção "Processos"
    E seleciono a opção "Importação de Dados"
    Então o sistema exibe a tela "Importação de Dados"

    E valido a existência das abas de importação de dados:
      | Vagas Escolas |
      | Habilitados   |
      | Escolhas      |
      | Lotes SIGPEC  |

    Quando clico na aba "Vagas Escolas" da importação de dados
    E ao clicar no botão "Selecionar" da importação devo ver "Você não possui permissão para essa ação"
    E ao clicar no botão "Importar" da importação devo ver "Você não possui permissão para essa ação"

    Quando clico na aba "Habilitados" da importação de dados
    E ao clicar no botão "Selecionar" da importação devo ver "Você não possui permissão para essa ação"
    E ao clicar no botão "Importar" da importação devo ver "Você não possui permissão para essa ação"

  @filtros @reconsulta @funcional
  Cenário: Limpeza de filtros após busca por concurso e reconsulta por cargo
    Dado que estou no dashboard
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

    Quando seleciono um concurso aleatório para convocação
    E clico no botão "Buscar"
    Então o sistema exibe os resultados de convocação filtrados

    E devo visualizar a tabela de convocação com as colunas:
      | Processo           |
      | Concurso           |
      | Data de Convocação |
      | Status             |
      | Gerenciar          |

    Quando clico em "Limpar Filtros"
    Então os filtros devem ser resetados

    Quando clica e seleciono um Cargo de forma aleatória
    E clico no botão "Buscar"
    Então o sistema exibe os resultados de convocação filtrados

    E devo visualizar a tabela de convocação com as colunas:
      | Processo           |
      | Concurso           |
      | Data de Convocação |
      | Status             |
      | Gerenciar          |

  @historico-importacao @rastreio @funcional
  Cenário: Rastreio de histórico de importação com navegação entre abas e retorno consistente
    Dado que estou no dashboard
    Quando navego até a opção "Processos"
    E seleciono a opção "Importação de Dados"
    Então o sistema exibe a tela "Importação de Dados"

    E valido a existência das abas de importação de dados:
      | Vagas Escolas |
      | Habilitados   |
      | Escolhas      |
      | Lotes SIGPEC  |

    Quando clico na aba "Vagas Escolas" da importação de dados
    E o sistema exibe o texto de instrução "Selecione abaixo o tipo de arquivo que deseja carregar"
    E clico no botão "Histórico" da aba vagas escolas
    Então o sistema exibe o título de histórico "Importação de dados - Vagas"
    E valido o texto "Últimas importações" no histórico de importação
    E valido a tabela de histórico de importação com as colunas:
      | Nome do arquivo |
      | Processo        |
      | Data            |
      | Status          |
      | Ações           |

    Quando clico em "Voltar" na tela de histórico de importação
    Então o sistema retorna para a tela de importação de dados

    Quando clico na aba "Habilitados" da importação de dados
    E o sistema exibe o campo "Concurso" na aba de importação
    E clico no botão "Histórico" da aba habilitados
    Então o sistema exibe o título de histórico "Importação de dados - Habilitados"
    E valido o texto "Últimas importações" no histórico de importação
    E valido a tabela de histórico de importação com as colunas:
      | Data     |
      | Concurso |
      | Arquivo  |
      | Status   |
      | Ações    |

    Quando clico em "Voltar" na tela de histórico de importação
    Então o sistema retorna para a tela de importação de dados

    Quando clico na aba "Escolhas" da importação de dados
    Então o sistema exibe o campo "Processo de convocação" na aba de importação

    Quando clico na aba "Lotes SIGPEC" da importação de dados
    Então o sistema exibe o campo "Concurso" na aba de importação

  @escolha-candidatos @e2e @perfil-visualizacao
  Cenário: Jornada completa de preenchimento sequencial da escolha de candidatos com perfil de visualização
    Dado que estou logado no sistema com perfil de visualização
    Quando navego até a opção "Processos"
    E seleciono a opção "Escolha de Candidatos"
    Então o sistema exibe a tela "Escolha de Candidatos"

    Então valido a existência do campo "Processo" na escolha de candidatos
    Quando seleciono uma opção aleatória no campo "Processo" da escolha de candidatos

    Então valido a existência do campo "Período da agenda" na escolha de candidatos
    Quando seleciono uma opção aleatória no campo "Período da agenda" da escolha de candidatos

    Então valido que o botão de ação da escolha de candidatos está desabilitado

  @admin-acesso @gerenciamento-vagas @critico
  Cenário: Admin (007001) acessa Gerenciamento de Vagas e carrega dados de processo
    Dado que estou logado no SIGLA com perfil administrador
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

  @admin-acesso @nova-convocacao @estrutura
  Cenário: Admin (007001) acessa Nova Convocação, valida estrutura do formulário e cancela
    Dado que estou logado no SIGLA com perfil administrador
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

    E a lista de convocações exibe o botão "Nova convocação"
    Quando clico em "Nova convocação" na lista de convocações
    Então o sistema exibe o formulário de nova convocação

    E o formulário exibe as etapas do processo:
      | Dados do processo                  |
      | Seleção e configuração dos cargos  |
      | Agendar                            |
      | Resumo                             |

    E o formulário exibe os campos da etapa 1:
      | Concurso            |
      | Tipo de Escolha     |
      | Descrição           |
      | Data da convocação  |
      | Data corte de vagas |

    E o formulário exibe os botões "Cancelar" e "Salvar e avançar" na etapa 1

    Quando clico em "Cancelar" no formulário de convocação
    Então o sistema exibe a tela "Lista de Convocações"
