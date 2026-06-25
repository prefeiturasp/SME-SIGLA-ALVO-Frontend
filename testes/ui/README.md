# Testes Automatizados SME-SIGLA

Automação de testes E2E e API para o sistema SIGLA utilizando Cypress e Cucumber BDD.

## Estrutura do Projeto

```
cypress/
├── e2e/
│   ├── api/                    # Features de testes de API
│   └── ui/                     # Features de testes de interface
├── fixtures/
│   └── api/                    # Payloads de teste
├── support/
│   ├── api/                    # Comandos customizados para API
│   ├── step_definitions/
│   │   ├── api/                # Steps de testes de API
│   │   └── ui/                 # Steps de testes de UI
│   ├── commands.js             # Comandos globais
│   └── e2e.js                  # Configuração principal
└── screenshots/                # Capturas em caso de falha
```

## Pré-requisitos

- Node.js v22+
- npm ou yarn

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente necessárias:

```env
SIGLA_UI_BASE_URL=https://hom-sigla.sme.prefeitura.sp.gov.br
SIGLA_LOGIN_RF=seu_rf_aqui
SIGLA_LOGIN_SENHA=sua_senha_aqui
CONCURSO_BASE_URL=https://qa-api-sigla.sme.prefeitura.sp.gov.br
SIGLA_BASE_URL=https://qa-api-sigla.sme.prefeitura.sp.gov.br
```

**IMPORTANTE:** O arquivo `.env` contém credenciais sensíveis e nunca deve ser commitado.

## Execução dos Testes

### Todos os testes
```bash
npm run cy:run
```

### Interface gráfica
```bash
npm run cy:open
```

### Testes específicos
```bash
# Apenas testes de API
npm run cy:run:api

# Feature específica
npx cypress run --spec "cypress/e2e/ui/login.feature"

# Chrome
npm run cy:run:chrome

# Firefox
npm run cy:run:firefox
```

## Features Implementadas

### API
- api_candidatos_sigla.feature (34 cenários)
- api_agenda_sigla.feature (15 cenários)
- api_processos_convocacao_reduzido.feature (39 cenários)
- api_concurso_sigla.feature (21 cenários)

### UI
- login.feature (3 cenários)
- esqueci_senha.feature (2 cenários)

## Padrões de Código

- BDD com Gherkin em português (pt-br)
- Steps organizados por tipo (api/ e ui/)
- Credenciais gerenciadas via .env
- Seletores flexíveis para maior estabilidade
- Logs apenas essenciais (sem emojis)

## Progresso

- **129 cenários** implementados (45h)
- **56.6%** do projeto completo
- **109 testes API** + **20 testes UI**

Veja [ESTIMATIVA_HORAS_TESTES.md](ESTIMATIVA_HORAS_TESTES.md) para detalhes.

## Boas Práticas

1. Nunca commitar arquivos `.env` ou credenciais
2. Usar payloads de fixtures para manter consistência
3. Validações flexíveis para maior resiliência
4. Screenshots automáticos em caso de falha
5. Vídeos desabilitados por padrão para performance

## Suporte

Para dúvidas ou problemas, consulte a documentação do Cypress:
- [Cypress Docs](https://docs.cypress.io)
- [Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)
