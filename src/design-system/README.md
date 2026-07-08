# Design System

## Estrutura

```
src/design-system/          → tokens.ts, antdTheme.ts
src/components/ui/          → AppButton, AppInput, AppFormItem, AppTabs, ícones
src/components/ui/layout/   → styled-components por domínio (tabelas, modais, filtros, etc.)
```

**Import padrão:**

```tsx
import { AppButton, CardTitle, PageTitle, FilterSelect } from "@/components/ui";
```

**Import direto** (apenas módulos grandes ou com conflito de nomes):

```tsx
import { agendaTabelaStyles } from "@/components/ui/layout/agenda";
```

---

## Parte 1 — Botões e Inputs

```tsx
import { AppButton, AppInput } from "@/components/ui";

<AppButton variant="primary">Salvar</AppButton>
<AppButton variant="secondary">Cancelar</AppButton>
<AppInput placeholder="..." />
```

| Variante | Normal | Hover |
|----------|--------|-------|
| `primary` | Fundo `#002C8C`, texto branco | Fundo `#0F59C8`, texto branco |
| `secondary` | Fundo branco, texto/borda `#0F59C8` | Texto `#002C8C` |

Altura: **40px**. Tooltips só em `AppIconButton` (ações só-ícone).

---

## Parte 2 — Tipografia

Cor base: **`#1C1D22`**

| Elemento | Tamanho | Peso | Componente |
|----------|---------|------|------------|
| Label de formulário | 14px | 700 | `AppFormItem` / `FormLabel` |
| Título de card | 20px | 600 | `CardTitle` |
| Título de página | 24px | 700 | `PageTitle` |

```tsx
import { PageTitle, CardTitle, FormLabel, AppFormItem } from "@/components/ui";
```

| Legado | Novo |
|--------|------|
| `CustomFormItem` (FormStyle / Base) | `AppFormItem` |
| `CustomTitle` | `CardTitle` |
| `FieldLabel` / `TituloPagina` (Convocação) | `FormLabel` / `CardTitle` |

---

## Parte 3 — Ícones de ação

```tsx
import { EditActionIcon, ViewActionIcon, DeleteActionIcon } from "@/components/ui";
```

| Ação | Habilitada | Desabilitada |
|------|------------|--------------|
| Editar | `#0F59C8` | `#838383` |
| Visualizar | `#16a34a` | — |
| Excluir | `#ff4d4f` | `#838383` |

Em tabelas legadas, use `EditActionIcon` / `ViewActionIcon` / `DeleteActionIcon` de `@/components/ui`.

---

## Parte 4 — Layout (`components/ui/layout/`)

### No barrel `@/components/ui`

| Módulo | Conteúdo |
|--------|----------|
| `forms` | `AppFormItem`, inputs padronizados |
| `table` | `StyledTable`, `StyledCandidatosTable` |
| `typography` | `PageTitle`, `CardTitle`, `FormLabel` |
| `filters` | `FilterSelect`, `FiltersCard`, `FilterButton`, `FilterInlineRow`, `FilterFieldCol`, `FilterActionCol`, `FilterActionsGroup`, `FilterActionSlot`, `InlineInfoItem` |
| `modal` | `ModalContainer`, `ModalTable*`, wizard de modal |
| `modalInfo` | `ModalInfoCard`, `ModalInfoLabel`, `ModalInfoValue` |
| `results` | `ResultsCard`, `ResultsContent` |
| `pageHeader` | `TitleContainer`, `OrangeAccentBar` |
| `statCard` | Cards Ampla/NNA/PCD |
| `wizardSection` | Cards de etapas do wizard; `ConvocacaoStepsGlobalStyle` |
| `dashboard` | Indicadores e gráficos (Extração de Dados) |
| `shell` | Sidebar, header, breadcrumb; `AppPageTitle` |
| `errorModal` | `ErrorModalTitle`, `ErrorModalRow`, etc. |
| `containers` | `LayoutContainer`, `TableContainer`, `ButtonContainer` |
| `convocacaoCards` | Cards de seleção de cargos |
| `buscarCandidatosModal` | Estilos do modal Buscar Candidatos |
| `searchPage` | Página de busca/filtro (convocação, permissões, escolha) |
| `home` | Landing (`HomeAlvoLogo`) |
| `forbidden` | Tela 403 |
| `dashboardPlaceholder` | Placeholder temporário do dashboard |
| `convocacaoTable` | Estilos da tabela de processos |
| `resumo` | Resumo do processo de convocação |
| `novaConvocacao` | Formulário legado Nova Convocação |
| `novaConvocacaoAgendaTable` | Tabela da agenda legada Nova Convocação |
| `novaConvocacaoCargo` | Tela Cargo legada Nova Convocação |
| `novaConvocacaoSelecionarCandidatos` | Modal Selecionar Candidatos |
| `quillEditor` | Wrapper do Quill (`QuillEditorWrapper`) |
| `login` | Fluxo de autenticação (`LoginFieldLabel`, `LoginText`, etc.) |
| `meusDados` | Modais de perfil (`MeusDadosFieldLabel`, etc.) |
| `parametros` | Abas de parametrização (`ParametrosButtonContainer`) |
| `escolhaCandidatos` | Toolbar de filtros da Escolha |
| `EmptyState` | Ilustração + texto de estado vazio |

### Import direto (fora do barrel)

| Módulo | Motivo |
|--------|--------|
| `agenda` | Grande (~900 linhas); nomes conflitam com `convocacaoCards` |

### Componentes compartilhados (`src/components/`)

| Componente | Uso |
|------------|-----|
| `QuillEditor` | Editor rich text (Parametros, Relatórios, EnvioEmails) |
| `CropImageModal` | Recorte de imagem |
| `UserAvatar` | Avatar do header (usa estilos de `shell`) |

### `searchPage` — nomes sem conflito

`TableContainer` e `ButtonContainer` de `containers.ts` **não** são reexportados por `searchPage`. Use os nomes prefixados:

| Export | Uso |
|--------|-----|
| `SearchTableContainer` | Área da tabela em páginas de busca |
| `SearchButtonContainer` | @deprecated — use `FilterActionsGroup` + `FilterActionSlot` |
| `SearchFieldButtonContainer` | @deprecated — use `FilterActionCol` |
| `PageContainer`, `CustomSelect`, `ClearButton`, `SearchButton` | Layout da página de busca |

### Filtro inline (campo + botão na mesma linha)

```tsx
import {
  FilterInlineRow,
  FilterFieldCol,
  FilterActionCol,
  FilterActionsGroup,
  FilterActionSlot,
  AppFormItem,
} from "@/components/ui";

<FilterInlineRow gutter={16}>
  <FilterFieldCol xs={24} md={10}>
    <AppFormItem label="Processo" labelCol={{ span: 24 }}>
      <FilterSelect ... />
    </AppFormItem>
  </FilterFieldCol>
  <FilterActionCol xs={24} md={4}>
    <FilterActionSlot>
      <FilterActionsGroup>
        <AppButton variant="secondary">Limpar</AppButton>
        <AppButton variant="primary">Buscar</AppButton>
      </FilterActionsGroup>
    </FilterActionSlot>
  </FilterActionCol>
</FilterInlineRow>
```

`FilterActionSlot` reserva o espaço do label para alinhar botões à base do input (40px).

Alias local quando necessário:

```tsx
import { SearchTableContainer as TableContainer } from "@/components/ui";
```

---

## Parte 5 — Abas (Tabs)

```tsx
import { AppTabs } from "@/components/ui";
```

| Estado | Cor | Peso |
|--------|-----|------|
| Ativa | `#0F59C8` | 600 |
| Inativa | `#515151` | 400 |
| Hover | `#002C8C` | 400 |
| Desabilitada | `#B1B2B7` | 400 |

---

## Migração — regras

1. **Não criar** `styles.ts` em `pages/` para botões, ícones, títulos ou tabs — use `@/components/ui`.
2. **Pontes removidas:** `Base/styles`, `ConvocacaoCandidatos/style`, `ExtracaoDados/styles`, `AdicionarUsuario/styles`, e demais arquivos listados acima.
3. **Exceção intencional:** Login mantém estilo roxo em `layout/login.ts`.
4. Estilos muito específicos de uma tela (~30 linhas) podem ficar em `layout/<feature>.ts`, não em `pages/`.

### Checklist para nova tela

```tsx
import {
  AppButton,
  AppFormItem,
  CardTitle,
  FilterSelect,
  SearchTableContainer,
  mainCardStyle,
} from "@/components/ui";
```
