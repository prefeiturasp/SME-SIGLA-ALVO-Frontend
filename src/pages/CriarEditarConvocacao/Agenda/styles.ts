import styled from 'styled-components';
import { Card } from 'antd';
import { createGlobalStyle } from 'styled-components';

// ========================================
// STYLED COMPONENTS PARA AGENDA
// ========================================

// Estilos dos cards com layout específico
export const BaseStyledCard = styled(Card)`
  width: 12.5rem;
  height: 5rem;
  min-width: 12.5rem;
  opacity: 1;
  padding: 0.5rem 1rem;
  gap: 0.25rem;
  border-radius: 0.9375rem;
  border: none;
  margin: 0;
`;

export const StyledCardAmpla = styled(BaseStyledCard)`
  background-color: #FFF1B8;
`;

export const StyledCardNNA = styled(BaseStyledCard)`
  background-color: #EDEEFC;
`;

export const StyledCardPCD = styled(BaseStyledCard)`
  background-color: #F9F0FF;
`;

// ========================================
// OBJETOS DE ESTILOS REUTILIZÁVEIS
// ========================================

// Estilos comuns para AgendaTela
export const commonStyles = {
  // Estilos dos cards
  cardContainer: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.25rem",
    minHeight: "4.0625rem"
  },
  cardIcon: {
    color: "#000000E0",
    fontSize: "1.25rem",
    width: "2.5rem",
    height: "1.25rem",
    opacity: 1
  },
  cardNumber: {
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "2.1875rem",
    lineHeight: "1.25rem",
    color: "#000000E0"
  },
  cardLabel: {
    fontFamily: "Open Sans",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    color: "#000000E0",
    textAlign: "right" as const
  },
  // Estilos da tabela
  tableHeader: {
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "0.875rem",
    lineHeight: "1.375rem",
    letterSpacing: "0%",
    verticalAlign: "middle" as const,
    color: "#000000E0",
    textAlign: "center" as const
  },
  actionIcon: {
    width: '0.9765625rem',
    height: '0.9765625rem',
    color: '#0F59C8',
    fontSize: '0.9765625rem'
  },
  deleteIcon: {
    width: '1.07125rem',
    height: '1.11625rem',
    color: '#FF4D4F',
    fontSize: '1.07125rem'
  },
  // Estilos do botão Agendar
  agendarButton: {
    width: 'auto',
    height: '2rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid var(--Success-colorSuccessActive, #389E0D)',
    background: '#FFFFFF',
    color: 'var(--Success-colorSuccessActive, #389E0D)',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem'
  }
};

// ========================================
// ESTILOS INLINE IDENTIFICADOS
// ========================================

// Estilos para AgendaTela
export const inlineStyles = {
  // Estilos de navegação
  breadcrumbItem: {
    cursor: "pointer"
  },
  // Estilos de texto
  titleText: {
    width: 1221,
    height: 22,
    opacity: 1
  },
  cardTitle: {
    width: 164,
    height: 25,
    opacity: 1
  },
  tableTitle: {
    width: 312,
    height: 25,
    opacity: 1
  },
  // Estilos de containers
  marginTop: {
    marginTop: "1.25rem"
  },
  // Estilos de cards
  cardsContainer: {
    display: "flex",
    gap: 8
  },
  // Estilos de tabela
  tableActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8
  },
  // Estilos de divisores
  dividerMargin: {
    margin: "0.5rem 0",
    width: "100%",
    maxWidth: "100%"
  },
  dividerBottomMargin: {
    margin: "1.5rem 0 5.3125rem 0",
    width: "100%",
    height: "0px",
    opacity: 1,
    borderWidth: "1px",
    border: "1px solid #F0F0F0"
  },
  // Estilos de colunas
  colNoPadding: {
    paddingLeft: 0,
    paddingRight: 0
  },
  // Estilos de texto específicos
  titleTextWithFont: {
    width: 1221,
    height: 22,
    opacity: 1,
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: 18,
    lineHeight: '1.125rem',
    letterSpacing: '0%',
    color: '#515151'
  },
  cardTitleWithFont: {
    width: 164,
    height: 25,
    opacity: 1,
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: 18,
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#515151'
  },
  tableTitleWithFont: {
    width: 312,
    height: 25,
    opacity: 1,
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: 18,
    lineHeight: '100%',
    letterSpacing: '0%',
    paddingTop: 8,
    color: '#515151'
  },
  // Estilos de container com marginTop
  containerWithMarginTop: {
    marginTop: 0
  },
  // Estilos do título principal
  titleMain: {
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: 24,
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#515151'
  },
  // Estilos da tabela
  tableHeaderCell: {
    height: '2.375rem',
    padding: '0.5rem 1rem'
  },
  // Estilos inline adicionais
  cardHeaderStyles: {
    header: { borderBottom: 'none' },
    body: { paddingTop: 8 }
  },
  cardHeaderStylesSimple: {
    header: { borderBottom: 'none' }
  },
  titleCombinedStyles: {
    width: 203,
    height: 33,
    opacity: 1,
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: 24,
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#515151'
  },
  // Estilos para mensagem placeholder
  placeholderMessage: {
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontSize: '0.875rem',
    color: '#8C8C8C',
    fontStyle: 'italic',
    textAlign: 'center' as const,
    padding: '1.25rem',
    backgroundColor: '#F5F5F5',
    borderRadius: '0.375rem',
    border: '1px dashed #D9D9D9',
    margin: '1rem 0'
  }
};

// Estilos para informações do processo
export const processInfoStyles = {
  container: {
    marginBottom: '1rem',
  },
  label: {
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    letterSpacing: '0%',
    color: '#515151CC',
    marginBottom: '0.125rem',
    display: 'block',
  },
  value: {
    color: '#838383',
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    letterSpacing: '0%',
    display: 'block',
  },
};

// ========================================
// ESTILOS CENTRALIZADOS PARA COMPONENTES
// ========================================

// Estilos para AgendaForm
export const agendaFormStyles = {
  // Card principal do formulário
  agendaCard: {
    marginBottom: '1rem'
  },
  
  // Header do card
  agendaCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  
  agendaCardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  agendaCardIcon: {
    color: '#0F59C8',
    fontSize: '1.5625rem'
  },
  
  agendaCardTitle: {
    color: '#0F59C8',
    fontSize: '1.25rem'
  },
  
  agendaCardCloseButton: {
    color: '#666'
  },
  
  // Formulário
  agendaForm: {
    maxWidth: '100%'
  },
  
  // Linhas do formulário
  formRowFirst: {
    marginBottom: '1rem'
  },
  
  formRowSecond: {
    marginBottom: '1rem'
  },
  
  // Cargo info
  cargoInfoLabel: {
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: '#515151CC',
    marginBottom: '0.125rem',
    display: 'block'
  },
  
  cargoInfoValue: {
    color: '#838383',
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontSize: '0.875rem',
    display: 'block'
  },
  
  // Form items
  formItemNoMargin: {
    marginBottom: '0'
  },
  
  // Mensagens de erro
  errorMessage: {
    color: "#ff4d4f",
    fontSize: "0.75rem",
    marginTop: 4
  },
  
  errorMessageBlock: {
    color: "#ff4d4f",
    fontSize: "0.75rem",
    display: 'block'
  },
  
  // Checkbox retardatário
  retardatarioCheckbox: {
    fontSize: '0.875rem',
    fontFamily: 'inherit'
  },
  
  // TimePicker range
  timePickerRange: {
    width: '100%',
    height: '2.8125rem'
  },
  
  // Informação de candidatos disponíveis
  candidatosDisponiveis: {
    color: "#666",
    fontSize: "0.75rem",
    marginTop: "0.25rem",
    display: 'block'
  },
  
  // Botão adicionar período
  addPeriodButtonCol: {
    textAlign: 'right' as const
  },
  
  addPeriodButtonIcon: (isDisabled: boolean) => ({
    color: isDisabled ? '#BFBFBF' : undefined
  })
};

// Estilos para AgendaTabela
export const agendaTabelaStyles = {
  // Ícone de expansão
  expandIcon: (isExpanded: boolean) => ({
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease',
    fontSize: '0.75rem',
    color: '#666',
    cursor: 'pointer'
  }),
  
  // Container de edição inline
  editContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center'
  },
  
  // Input de edição
  editInput: {
    width: 80,
    textAlign: 'center' as const,
    border: '1px solid #d9d9d9',
    borderRadius: '0.25rem',
    padding: '0.25rem 0.5rem'
  },
  
  // Texto de candidatos
  candidatosText: {
    fontSize: '0.75rem'
  },
  
  // TimePicker de edição
  editTimePicker: {
    width: 80
  },
  
  // Texto "às"
  timeSeparator: {
    fontSize: '0.75rem'
  },
  
  // Texto de conflito
  conflictText: {
    fontSize: '0.625rem'
  },
  
  // Texto online
  onlineText: {
    fontSize: '0.75rem',
    color: '#666'
  },
  
  // Container de ações
  actionsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 4
  },
  
  // Ícones de ação
  saveIcon: {
    color: "#05409A"
  },
  
  cancelIcon: {
    color: "#ff4d4f"
  },
  
  // Mensagem de vazio
  emptyMessage: {
    padding: '1rem',
    textAlign: 'center' as const,
    color: '#666'
  },
  
  // Container principal da tabela expandida
  expandedTableContainer: {
    marginTop: 0
  },
  
  // Wrapper da tabela expandida
  expandedTableWrapper: {
    paddingLeft: '7rem',
    paddingRight: '6.875rem',
    marginBottom: '1.5625rem'
  },
  
  // Título da tabela expandida
  expandedTableTitle: {
    marginBottom: '0.75rem'
  },
  
  expandedTableTitleText: {
    fontSize: '0.875rem',
    color: '#262626',
    fontFamily: 'Open Sans, sans-serif'
  },
  
  // Estilos da tabela expandida
  expandedTable: {
    backgroundColor: '#fafafa',
    width: '100%',
    maxWidth: '100%'
  },
  
  // Header da tabela expandida
  expandedTableHeader: {
    backgroundColor: '##FFFFFF',
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    letterSpacing: '0%',
    verticalAlign: 'middle',
    textAlign: 'center',
    color: '##FFFFFF',
    border: 'none',
    padding: '0.6875rem 1rem',
    height: '2.375rem'
  },
  
  // Row da tabela expandida
  expandedTableRow: (isDark: boolean) => ({
    backgroundColor: isDark ? '#f5f5f5' : '#fff'
  }),
  
  // Cell da tabela expandida
  expandedTableCell: {
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    letterSpacing: '0%',
    verticalAlign: 'middle',
    textAlign: 'center',
    color: 'var(--Text-colorText, #000000E0)',
    padding: '0.6875rem 1rem',
    height: '2.375rem',
    border: 'none'
  },
  
  // Contador de candidatos
  candidatosCounter: {
    marginTop: '0.75rem',
    textAlign: 'left' as const
  },
  
  candidatosCounterText: {
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '0.75rem',
    lineHeight: '1.375rem',
    letterSpacing: '0%',
    verticalAlign: 'middle',
    color: '#6C757D',
    whiteSpace: 'nowrap'
  }
};

// Estilos para AgendaTela
export const agendaTelaStyles = {
  // Content style
  contentStyle: {
    lineHeight: "normal",
    textAlign: "left" as const,
    borderRadius: "0.5rem", // token.borderRadiusLG
    marginTop: 20
  }
};

// ========================================
// GLOBAL STYLES PARA AGENDA
// ========================================

export const GlobalStyles = createGlobalStyle`
  /* Botão Gerenciamento de vagas - igual ao da Lista de Convocações */
  .gerenciamento-vagas-btn {
    width: 15.5625rem;
    height: 2.8125rem;
    gap: 0.5rem;
    opacity: 1;
    border-radius: 0.5rem;
    padding-right: 1rem;
    padding-left: 1rem;
    border-width: 0.0625rem;
    border: 0.0625rem solid #0F59C8;
    background-color: transparent;
    font-family: 'Open Sans';
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: 0%;
    vertical-align: middle;
    color: #0F59C8;
    box-shadow: none;
  }

  .gerenciamento-vagas-btn .anticon {
    width: 0.944375rem;
    height: 1.0675rem;
    opacity: 1;
    color: #0F59C8;
  }

  .gerenciamento-vagas-btn:hover,
  .gerenciamento-vagas-btn:focus {
    background-color: #0F59C8 !important;
    border-color: #0F59C8 !important;
    color: #FFFFFF !important;
  }

  .gerenciamento-vagas-btn:hover .anticon,
  .gerenciamento-vagas-btn:focus .anticon {
    color: #FFFFFF !important;
  }

  /* Estilos específicos para o botão Adicionar período */
  .gerenciamento-vagas-btn.adicionar-periodo-btn {
    width: 11.875rem !important;
    font-family: 'Open Sans' !important;
    font-weight: 400 !important;
    font-style: normal !important;
    font-size: 1rem !important;
    line-height: 1.5rem !important;
    letter-spacing: 0% !important;
    vertical-align: middle !important;
  }

         /* Botão Agendar - estilos específicos */
         .agendar-btn {
           width: auto !important;
           height: 2rem !important;
           padding: 0.25rem 0.75rem !important;
           border-radius: 0.375rem !important;
           border: 1px solid #0F59C8 !important;
           background: #FFFFFF !important;
           color: #0F59C8 !important;
           font-family: 'Open Sans' !important;
           font-weight: 600 !important;
           font-size: 0.875rem !important;
           line-height: 1.375rem !important;
           cursor: pointer !important;
           display: inline-flex !important;
           align-items: center !important;
           justify-content: center !important;
           gap: 0.25rem !important;
           box-shadow: none !important;
         }

         .agendar-btn:hover,
         .agendar-btn:focus {
           background-color: #0F59C8 !important;
           border-color: #0F59C8 !important;
           color: #FFFFFF !important;
         }

         .agendar-btn:hover .anticon,
         .agendar-btn:focus .anticon {
           color: #FFFFFF !important;
         }

  /* Estilos do Collapse Agenda */
  .ant-collapse {
    border: 1px solid #F0F0F0 !important;
    border-radius: 0.5rem !important;
    background: #FFFFFF !important;
  }
  
  .ant-collapse-item {
    border-bottom: none !important;
  }
  
  .ant-collapse-header {
    background: #F9F9F9 !important;
    border-radius: 0.5rem !important;
    padding: 0.75rem 1rem !important;
    font-weight: 600 !important;
  }
  
  .ant-collapse-content {
    background: #FFFFFF !important;
    border-radius: 0 0 0.5rem 0.5rem !important;
  }
  
  .ant-collapse-content-box {
    padding: 1rem !important;
  }

  /* Estilos do formulário dentro do Collapse */
  .ant-form-item-label > label {
    font-family: 'Open Sans' !important;
    font-weight: 600 !important;
    font-size: 0.875rem !important;
    color: #515151 !important;
  }

  .ant-input,
  .ant-select-selector,
  .ant-picker,
  .ant-time-picker {
    border-radius: 0.375rem !important;
    border: 1px solid #D9D9D9 !important;
    height: 2.5rem !important;
  }

         .ant-input:focus,
         .ant-select-focused .ant-select-selector,
         .ant-picker-focused {
           border-color: #0F59C8 !important;
           box-shadow: 0 0 0 0.125rem rgba(15, 89, 200, 0.2) !important;
         }

  .ant-radio-wrapper {
    font-family: 'Open Sans' !important;
    font-size: 0.875rem !important;
    color: #515151 !important;
  }

  .ant-radio-checked .ant-radio-inner {
    border-color: #0F59C8 !important;
    background-color: #0F59C8 !important;
  }

  .ant-radio-checked .ant-radio-inner::after {
    background-color: #FFFFFF !important;
  }

  /* Estilos do Checkbox */
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #0F59C8 !important;
    border-color: #0F59C8 !important;
  }

  .ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: #FFFFFF !important;
  }

  .ant-checkbox:hover .ant-checkbox-inner {
    border-color: #0F59C8 !important;
  }

  /* Estilos específicos para inputs de agenda */
  .agenda-input {
    width: 100% !important;
    height: 2.8125rem !important;
    opacity: 1 !important;
    border-radius: 0.375rem !important;
    border-width: 1px !important;
    padding-right: var(--padding-sm) !important;
    padding-left: 0.625rem !important;
    border-style: solid !important;
    background: var(--Background-colorBgContainer, #FFFFFF) !important;
    border: 1px solid #D9D9D9 !important;
    font-size: 0.875rem !important;
    line-height: 2.8125rem !important;
    text-align: left !important;
  }

  .agenda-input::placeholder {
    text-align: left !important;
    color: #BFBFBF !important;
  }

  /* Estilos para campos desabilitados quando retardatário está marcado */
  .agenda-input.ant-input-number-disabled,
  .agenda-input.ant-input-number-disabled:hover {
    background-color: #F5F5F5 !important;
    border-color: #D9D9D9 !important;
    color: #BFBFBF !important;
    cursor: not-allowed !important;
    opacity: 0.6 !important;
  }

  /* Estilo para ícone do botão Adicionar período quando desabilitado */
  .adicionar-periodo-btn.ant-btn-disabled .anticon,
  .adicionar-periodo-btn.ant-btn-disabled .anticon-plus,
  .adicionar-periodo-btn.ant-btn-disabled svg {
    color: #BFBFBF !important;
    fill: #BFBFBF !important;
  }

  .agenda-select .ant-select-selector {
    width: 100% !important;
    height: 2.8125rem !important;
    opacity: 1 !important;
    border-radius: 0.375rem !important;
    border-width: 1px !important;
    padding-right: var(--padding-sm) !important;
    padding-left: 0.5625rem !important;
    border-style: solid !important;
    background: var(--Background-colorBgContainer, #FFFFFF) !important;
    border: 1px solid #D9D9D9 !important;
  }

  .agenda-select .ant-select-selection-item,
  .agenda-select .ant-select-selection-placeholder {
    line-height: 2.8125rem !important;
  }

  .agenda-select .ant-select-selection-search {
    line-height: 2.8125rem !important;
  }

  .agenda-select .ant-select-selection-search-input {
    line-height: 2.8125rem !important;
  }

  /* Estilos mais específicos para garantir que funcionem */
  .agenda-select {
    width: 17.5rem !important;
  }

  .agenda-select .ant-select-selector {
    min-height: 2.8125rem !important;
    height: 2.8125rem !important;
  }

  .agenda-select .ant-select-selection-item {
    height: 2.8125rem !important;
    line-height: 2.8125rem !important;
    display: flex !important;
    align-items: center !important;
  }

  .agenda-select .ant-select-selection-placeholder {
    height: 2.8125rem !important;
    line-height: 2.8125rem !important;
    display: flex !important;
    align-items: center !important;
  }

  .agenda-picker {
    width: 100% !important;
    height: 2.8125rem !important;
    opacity: 1 !important;
    border-radius: 0.375rem !important;
    border-width: 1px !important;
    padding-right: 0.5rem !important;
    padding-left: 0.3125rem !important;
    border-style: solid !important;
    background: var(--Background-colorBgContainer, #FFFFFF) !important;
    border: 1px solid #D9D9D9 !important;
  }

  .agenda-picker .ant-picker-input > input {
    height: 2.8125rem !important;
    line-height: 2.8125rem !important;
    text-align: left !important;
    padding-left: 0.625rem !important;
  }

         .agenda-picker .ant-picker-input > input::placeholder {
           text-align: left !important;
           color: #BFBFBF !important;
         }

         /* Estilos de focus específicos para campos de agenda */
         .agenda-input:focus {
           border-color: #0F59C8 !important;
           box-shadow: 0 0 0 0.125rem rgba(15, 89, 200, 0.2) !important;
         }

         .agenda-picker:focus,
         .agenda-picker.ant-picker-focused {
           border-color: #0F59C8 !important;
           box-shadow: 0 0 0 0.125rem rgba(15, 89, 200, 0.2) !important;
         }

  /* Estilos da tabela de cargos adicionados */
  .ant-table-thead > tr > th .ant-table-column-sorter {
    width: 0.5rem !important;
    height: 0.75rem !important;
    opacity: 1 !important;
  }
  .ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-up,
  .ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-down {
    width: 0.5rem !important;
    height: 0.75rem !important;
    opacity: 1 !important;
    font-size: 0.75rem !important;
  }

  /* Divider alinhado com a tabela */
  .ant-divider {
    margin: 0.5rem 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }
`;
