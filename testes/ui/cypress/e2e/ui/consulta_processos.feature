#language: pt
@ui @sigla @processos @permissoes
Funcionalidade: Consulta de Processos - Perfil Somente Leitura
  Como usuário com perfil de visualização (RF: 007005)
  Quero acessar as telas de processos do sistema
  Para validar que possuo apenas permissões de consulta

  Contexto:
    Dado que estou logado no sistema com perfil de visualização

  @consulta-completa @critico @permissoes-somente-leitura
  Cenário: Validar consulta de convocações com permissões restritas
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

    E devo ver os botões "Gerenciamento de vagas" e "Nova convocação" desabilitados
    E ao clicar em "Gerenciamento de vagas" da convocação devo ver a mensagem "Você não possui permissão para essa ação"
    E ao clicar em "Nova convocação" da convocação devo ver a mensagem "Você não possui permissão para essa ação"

    E valido a existência dos campos de filtro de convocação:
      | Concurso           |
      | Cargo              |
      | Data de Convocação |
      | Status             |
    E seleciono um concurso aleatório para convocação
    E valido a existência dos botões de filtro de convocação
    Quando clico no botão "Buscar"
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
    E valido a tabela de agenda de convocação ou mensagem vazia
    Quando clico em "Voltar"

  @consulta-completa @critico @permissoes-somente-leitura
  Cenário: Validar consulta de escolha de candidatos com permissões restritas
    Quando navego até a opção "Processos"
    E seleciono a opção "Escolha de Candidatos"
    Então o sistema exibe a tela "Escolha de Candidatos"

    E valido a existência do campo "Processo" na escolha de candidatos
    E seleciono uma opção aleatória no campo "Processo" da escolha de candidatos
    E valido a existência do campo "Período da agenda" na escolha de candidatos
    E seleciono uma opção aleatória no campo "Período da agenda" da escolha de candidatos

    Então valido que o botão de ação da escolha de candidatos está desabilitado

  @consulta-completa @critico @permissoes-somente-leitura
  Cenário: Validar consulta de importação de dados com permissões restritas
    Quando navego até a opção "Processos"
    E seleciono a opção "Importação de Dados"
    Então o sistema exibe a tela "Importação de Dados"

    E valido a existência das abas de importação de dados:
      | Vagas Escolas |
      | Habilitados   |
      | Escolhas      |
      | Lotes SIGPEC  |

    Quando clico na aba "Vagas Escolas" da importação de dados
    Então o sistema exibe o texto de instrução "Selecione abaixo o tipo de arquivo que deseja carregar"
    E o sistema exibe a descrição da aba vagas escolas
    E ao clicar no botão "Selecionar" da importação devo ver "Você não possui permissão para essa ação"
    E ao clicar no botão "Importar" da importação devo ver "Você não possui permissão para essa ação"

    Quando clico no botão "Histórico" da aba vagas escolas
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
    Então o sistema exibe o campo "Concurso" na aba de importação
    E ao clicar no botão "Selecionar" da importação devo ver "Você não possui permissão para essa ação"
    E ao clicar no botão "Importar" da importação devo ver "Você não possui permissão para essa ação"

    Quando clico no botão "Histórico" da aba habilitados
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
    E ao clicar no botão "Importar" da importação devo ver "Você não possui permissão para essa ação"
    E ao clicar no botão "Histórico" da importação devo ver "Você não possui permissão para essa ação"

    Quando clico na aba "Lotes SIGPEC" da importação de dados
    Então o sistema exibe o campo "Concurso" na aba de importação
    E ao clicar no botão "Selecionar" da importação devo ver "Você não possui permissão para essa ação"
    E ao clicar no botão "Importar" da importação devo ver "Você não possui permissão para essa ação"

    Quando clico no botão "Histórico" da aba lotes sigpec
    Então o sistema exibe o título de histórico "Importação de dados - Lotes SIGPEC"
    E valido o texto "Últimas importações" no histórico de importação
    E valido a tabela de histórico de importação com as colunas:
      | Data     |
      | Concurso |
      | Arquivo  |
      | Status   |
      | Ações    |
    Quando clico em "Voltar" na tela de histórico de importação
    Então o sistema retorna para a tela de importação de dados

  @navegacao-menu @critico
  Cenário: Validar navegação completa entre todas as opções do menu Processos
    Dado que estou no dashboard
    Quando navego até a opção "Processos"
    E valido a existência das opções do menu processos
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

    Dado que estou no dashboard
    Quando navego até a opção "Processos"
    E seleciono a opção "Escolha de Candidatos"
    Então o sistema exibe a tela "Escolha de Candidatos"

    Dado que estou no dashboard
    Quando navego até a opção "Processos"
    E seleciono a opção "Importação de Dados"
    Então o sistema exibe a tela "Importação de Dados"

  @filtros-busca @funcional
  Cenário: Validar aplicação de filtros e busca de convocações
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

    E valido a existência dos campos de filtro de convocação:
      | Concurso           |
      | Cargo              |
      | Data de Convocação |
      | Status             |

    Quando seleciono um concurso aleatório para convocação
    E clico no botão "Buscar"
    Então o sistema exibe os resultados de convocação filtrados

    E devo visualizar a tabela de convocação com as colunas:
      | Processo           |
      | Concurso           |
      | Data de Convocação |
      | Status             |
      | Gerenciar          |

  @visualizacao-processo @critico
  Cenário: Validar detalhes completos de um processo de convocação
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

    Quando seleciono um concurso aleatório para convocação
    E clico no botão "Buscar"
    Então o sistema exibe os resultados de convocação filtrados

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
    Quando clico em "Voltar"
    Então o sistema exibe a tela "Lista de Convocações"

  @navegacao-abas @funcional
  Cenário: Validar transição entre todas as abas de importação de dados
    Quando navego até a opção "Processos"
    E seleciono a opção "Importação de Dados"
    Então o sistema exibe a tela "Importação de Dados"

    E valido a existência das abas de importação de dados:
      | Vagas Escolas |
      | Habilitados   |
      | Escolhas      |
      | Lotes SIGPEC  |

    Quando clico na aba "Vagas Escolas" da importação de dados
    Então o sistema exibe o texto de instrução "Selecione abaixo o tipo de arquivo que deseja carregar"

    Quando clico na aba "Habilitados" da importação de dados
    Então o sistema exibe o campo "Concurso" na aba de importação

    Quando clico na aba "Escolhas" da importação de dados
    Então o sistema exibe o campo "Processo de convocação" na aba de importação

    Quando clico na aba "Lotes SIGPEC" da importação de dados
    Então o sistema exibe o campo "Concurso" na aba de importação

  @historico-importacao @funcional
  Cenário: Validar acesso ao histórico em múltiplas abas de importação
    Quando navego até a opção "Processos"
    E seleciono a opção "Importação de Dados"
    Então o sistema exibe a tela "Importação de Dados"

    Quando clico na aba "Vagas Escolas" da importação de dados
    E clico no botão "Histórico" da aba vagas escolas
    Então o sistema exibe o título de histórico "Importação de dados - Vagas"
    E valido o texto "Últimas importações" no histórico de importação

    Quando clico em "Voltar" na tela de histórico de importação
    Então o sistema retorna para a tela de importação de dados

    Quando clico na aba "Habilitados" da importação de dados
    E clico no botão "Histórico" da aba habilitados
    Então o sistema exibe o título de histórico "Importação de dados - Habilitados"

    Quando clico em "Voltar" na tela de histórico de importação
    Então o sistema retorna para a tela de importação de dados

  @escolha-campos @funcional
  Cenário: Validar preenchimento sequencial de campos na escolha de candidatos
    Quando navego até a opção "Processos"
    E seleciono a opção "Escolha de Candidatos"
    Então o sistema exibe a tela "Escolha de Candidatos"

    E valido a existência do campo "Processo" na escolha de candidatos
    Quando seleciono uma opção aleatória no campo "Processo" da escolha de candidatos

    Então valido a existência do campo "Período da agenda" na escolha de candidatos
    Quando seleciono uma opção aleatória no campo "Período da agenda" da escolha de candidatos

    Então valido que o botão de ação da escolha de candidatos está desabilitado

  @permissoes-bloqueio @critico
  Cenário: Validar bloqueios de permissão em ações de gerenciamento
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

    E devo ver os botões "Gerenciamento de vagas" e "Nova convocação" desabilitados
    E ao clicar em "Gerenciamento de vagas" da convocação devo ver a mensagem "Você não possui permissão para essa ação"
    E ao clicar em "Nova convocação" da convocação devo ver a mensagem "Você não possui permissão para essa ação"

  @permissoes-acoes-tabela @critico @permissoes-somente-leitura
  Cenário: Validar permissões nas ações da tabela de convocações
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"

    E seleciono um concurso aleatório para convocação
    Quando clico no botão "Buscar"
    Então o sistema exibe os resultados de convocação filtrados

    Quando foco na primeira linha da tabela de convocação
    E ao clicar na ação "Editar" da coluna Gerenciar devo ver a mensagem "Você não possui permissão para essa ação"
    E ao clicar na ação "Excluir" da coluna Gerenciar devo ver a mensagem "Você não possui permissão para essa ação"
    E ao clicar na ação "Outra" da coluna Gerenciar devo ver a mensagem "Você não possui permissão para essa ação"
