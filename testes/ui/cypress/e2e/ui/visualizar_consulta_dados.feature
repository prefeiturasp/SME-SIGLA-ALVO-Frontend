#language: pt
@ui @sigla @consulta-convocacao
Funcionalidade: Visualizar Consulta de Convocação de Candidatos
  Como usuário do sistema SME
  Quero consultar convocações de candidatos
  Para visualizar informações dos processos de convocação

  Contexto:
    Dado que estou na página de login do SIGLA
    Quando eu insiro credenciais válidas
    E clico no botão de acessar
    Então devo ser redirecionado para o dashboard
    E devo visualizar a página principal do sistema

  @consulta-sucesso @visualizar
  Cenário: Visualizar resumo do processo de convocação
    Dado que estou no dashboard
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    E clica no campo e seleciono um Concurso de forma aleatória
    E clico no botão "Buscar"
    E o sistema exibe os dados na tabela
    Quando clico em "Visualizar processo"
    Então o sistema exibe a tela "Resumo do processo"
    E valido os dados do resumo do processo
    Quando clico no botão "Voltar"
    Então o sistema exibe a tela "Lista de Convocações"

  @consulta-sucesso @critico
  Cenário: Consultar convocação de candidatos com filtro por Concurso
    Dado que estou no dashboard
    Quando navego até a opção "Processos"
    E valido a existência das opções do menu processos
    E seleciono a opção "Convocação de Candidatos"
    Então o sistema exibe a tela "Lista de Convocações"
    E valido que não possuo permissão para ações restritas
    E valido a existência dos campos de filtro
    Quando clica no campo e seleciono um Concurso de forma aleatória
    E clico no botão "Buscar"
    Então o sistema exibe os dados na tabela

  @consulta-sucesso @filtro
  Cenário: Consultar convocação de candidatos com filtro por Cargo
    Dado que estou no dashboard
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    E valido a existência dos campos de filtro
    Quando clica e seleciono um Cargo de forma aleatória
    E clico no botão "Buscar"
    Então o sistema exibe os dados na tabela
    E valido a existência da tabela e colunas

  @validacao-permissao @negativo
  Cenário: Validar permissões de acesso em ações restritas
    Dado que estou no dashboard
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    E valido que não possuo permissão para ações restritas
    Quando clica no campo e seleciono um Concurso de forma aleatória
    E clico no botão "Buscar"
    E tento acessar ações não permitidas em "Gerenciar"
    Então o sistema exibe mensagem de permissão negada

  @limpar-filtros @funcional
  Cenário: Limpar filtros de consulta
    Dado que estou no dashboard
    Quando navego até a opção "Processos"
    E seleciono a opção "Convocação de Candidatos"
    E clica no campo e seleciono um Concurso de forma aleatória
    E clico no botão "Buscar"
    Quando clico em "Limpar Filtros"
    Então os filtros devem ser resetados
