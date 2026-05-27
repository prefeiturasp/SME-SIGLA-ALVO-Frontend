# Estimativa de Horas - Testes SIGLA

**Data:** 22/05/2026  
**Projeto:** SME-SIGLA-ALVO-Frontend  
**Framework:** Cypress + Cucumber (BDD)

---

## Escopo Atual do Projeto

### CONCLUÍDO

| Arquivo | Tipo | Cenários | Status |
|---------|------|----------|--------|
| api_candidatos_sigla.feature | API | 34 | 100% |
| api_agenda_sigla.feature | API | 15 | 100% |
| api_processos_convocacao_reduzido.feature | API | 39 | 100% |
| api_concurso_sigla.feature | API | 21 | 100% |
| pf_convocacao.feature | UI | 17 | 100% |
| login.feature | UI | 3 | 100% |
| **SUBTOTAL CONCLUÍDO** | | **129** | |

### PENDENTE

| Arquivo | Tipo | Cenários | Status |
|---------|------|----------|--------|
| api_escolha_sigla.feature | API | 0 | Não iniciado |
| api_importa_arquivo_sigla.feature | API | 0 | Não iniciado |
| api_relatorios_sigla.feature | API | 0 | Não iniciado |
| api_usuario_sigla.feature | API | 0 | Não iniciado |
| pf_visualiza.feature | UI | 0 | Não iniciado |
| **SUBTOTAL PENDENTE** | | **~110-150** | |

---

## ESTIMATIVA DE HORAS POR ATIVIDADE

### 1. TESTES DE API (Já Concluídos)

#### api_candidatos_sigla.feature - 34 cenários
- **Análise da API e documentação:** 1.5h
- **Criação de payloads (fixtures):** 1h
- **Implementação de cenários:** 4h
- **Step definitions customizados:** 0.5h
- **Debug e correções (erros 400/500):** 2h
- **Execução e validação:** 0.5h
- **SUBTOTAL:** **9.5h**

#### api_agenda_sigla.feature - 15 cenários
- **Análise da API:** 0.5h
- **Criação de payloads:** 0.5h
- **Implementação de cenários:** 2h
- **Debug e ajustes:** 1h
- **Validação:** 0.5h
- **SUBTOTAL:** **4.5h**

#### api_processos_convocacao_reduzido.feature - 39 cenários
- **Análise da API (complexa - CRUD completo):** 2h
- **Criação de payloads (múltiplos relacionamentos):** 2h
- **Implementação de cenários:** 5h
- **Step definitions:** 1h
- **Debug e correções:** 2.5h
- **Validação:** 0.5h
- **SUBTOTAL:** **13h**

#### api_concurso_sigla.feature - 21 cenários
- **Análise da API (endpoints de concursos):** 0.5h
- **Criação de payloads (autorizações, cargos, concursos):** 0.5h
- **Implementação de cenários (15 iniciais):** 1.5h
- **Step definitions customizados:** 0.5h
- **Criação de commands (commands_concurso.js):** 0.5h
- **Implementação de 6 cenários adicionais profissionais:** 1h
- **Execução e validação:** 0.5h
- **SUBTOTAL:** **5h**

**TOTAL API CONCLUÍDO:** **32 horas**

---

### 2. TESTES DE API (Pendentes)

#### api_escolha_sigla.feature - Estimado ~20 cenários
- **Análise da API (processo de escolha):** 1h
- **Criação de payloads:** 1h
- **Implementação de cenários:** 2.5h
- **Debug e ajustes:** 1.5h
- **Validação:** 0.5h
- **SUBTOTAL:** **6.5h**

#### api_importa_arquivo_sigla.feature - Estimado ~15 cenários
- **Análise da API (upload de arquivos):** 1h
- **Criação de arquivos de teste (fixtures):** 1.5h
- **Implementação de cenários:** 2h
- **Step definitions (upload):** 1h
- **Debug (tratamento de arquivos):** 2h
- **Validação:** 0.5h
- **SUBTOTAL:** **8h**

#### api_relatorios_sigla.feature - Estimado ~20 cenários
- **Análise da API (geração de relatórios):** 1h
- **Criação de payloads:** 0.5h
- **Implementação de cenários:** 2.5h
- **Debug e ajustes:** 1.5h
- **Validação:** 0.5h
- **SUBTOTAL:** **6h**

#### api_usuario_sigla.feature - Estimado ~25 cenários
- **Análise da API (CRUD usuários + autenticação):** 1.5h
- **Criação de payloads:** 1h
- **Implementação de cenários:** 3h
- **Step definitions (auth):** 1h
- **Debug (tokens, permissões):** 2h
- **Validação:** 0.5h
- **SUBTOTAL:** **9h**

**TOTAL API PENDENTE:** **29.5 horas**

---

### 3. TESTES DE UI (Já Concluídos)

#### pf_convocacao.feature - 17 cenários
- **Análise da interface:** 1h
- **Criação de seletores e page objects:** 1.5h
- **Implementação de cenários:** 3h
- **Step definitions de UI:** 1.5h
- **Debug (sincronização, elementos):** 2h
- **Validação visual:** 0.5h
- **SUBTOTAL:** **9.5h**

#### login.feature - 3 cenários
- **Análise de seletores e comportamento:** 0.5h
- **Criação de locators e steps:** 1h
- **Implementação de cenários (3 essenciais):** 0.5h
- **Configuração de .env e credenciais:** 0.5h
- **Debug e ajustes de validação:** 0.5h
- **Execução e validação:** 0.5h
- **SUBTOTAL:** **3.5h**

**TOTAL UI CONCLUÍDO:** **13 horas**

---

### 4. TESTES DE UI (Pendentes)

#### pf_visualiza.feature - Estimado ~20 cenários
- **Análise da interface (visualização de dados):** 1.5h
- **Criação de seletores:** 1h
- **Implementação de cenários:** 3h
- **Step definitions:** 1.5h
- **Debug (carregamento, filtros):** 2h
- **Validação visual:** 0.5h
- **SUBTOTAL:** **9.5h**

**TOTAL UI PENDENTE:** **9.5 horas**

---

## RESUMO EXECUTIVO

### TRABALHO CONCLUÍDO

| Tipo | Cenários | Horas | Status |
|------|----------|-------|--------|
| **Testes API** | 109 | 32h | Concluído |
| **Testes UI** | 20 | 13h | Concluído |
| **TOTAL CONCLUÍDO** | **129** | **45h** | |

### TRABALHO PENDENTE

| Tipo | Cenários Estimados | Horas | Status |
|------|-------------------|-------|--------|
| **Testes API** | ~84 | 28.5h | Pendente |
| **Testes UI** | ~17 | 6h | Pendente |
| **TOTAL PENDENTE** | **~101** | **34.5h** | |

---

## TOTAL GERAL DO PROJETO

| Categoria | Cenários | Horas |
|-----------|----------|-------|
| **Testes API** | ~193 | **60.5h** |
| **Testes UI** | ~37 | **19h** |
| **TOTAL PROJETO** | **~230** | **79.5h** |

---

## PROGRESSO ATUAL

```
Concluído: 129 cenários (45h)   - 56.1% do projeto
Pendente:  101 cenários (34.5h) - 43.9% do projeto
```

**Taxa de progresso:**
- **56.6% concluído** em horas de trabalho
- **43.4% pendente**

---

## OBSERVAÇÕES E CONSIDERAÇÕES

### Complexidade por Tipo de Teste

**Testes de API:**
- **Simples (GET):** ~15-20 min/cenário
- **Médio (POST/PUT):** ~20-30 min/cenário  
- **Complexo (relacionamentos, validações):** ~30-45 min/cenário
- **Debug e ajustes:** +30-50% do tempo de implementação

**Testes de UI:**
- **Simples (navegação, visualização):** ~20-25 min/cenário
- **Médio (formulários, filtros):** ~25-35 min/cenário
- **Complexo (interações múltiplas, validações):** ~35-45 min/cenário
- **Debug (sincronização, seletores):** +40-60% do tempo de implementação

### Fatores que Impactam o Tempo

**Facilitadores:**
- Framework já configurado
- Steps genéricos reutilizáveis
- Payloads base criados
- Padrão de arquitetura estabelecido

**Desafios:**
- APIs sem documentação completa
- Necessidade de debug de erros da API (400, 500)
- Upload de arquivos (complexidade adicional)
- Autenticação e permissões (usuários)
- Sincronização em testes UI

---

## RECOMENDAÇÕES

### Para Finalização Eficiente:

1. **Priorizar APIs críticas** (Concurso, Usuário, Escolha)
2. **Paralelizar desenvolvimento** quando possível
3. **Criar steps genéricos** antes de implementar cenários
4. **Validar payloads** com a API antes de criar testes
5. **Documentar cases complexos** para manutenção futura

### Cronograma Sugerido (4 dias):

- **Dia 1:** api_usuario_sigla + api_escolha_sigla (15.5h)
- **Dia 2:** api_importa_arquivo_sigla + api_relatorios_sigla (14h)
- **Dia 3:** pf_visualiza (9.5h)
- **Buffer:** Ajustes finais, refatoração, documentação

---

**Gerado por:** GitHub Copilot  
**Última atualização:** 22/05/2026
