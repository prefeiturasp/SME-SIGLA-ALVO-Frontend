import styled from 'styled-components';
import { Card } from 'antd';
import { createGlobalStyle } from 'styled-components';

// ========================================
// STYLED COMPONENTS PARA SELEÇÃO DE CARGOS
// ========================================

// Estilos dos cards com layout específico
export const BaseStyledCard = styled(Card)`
  width: 200px;
  height: 80px;
  min-width: 200px;
  opacity: 1;
  padding: 8px 16px;
  gap: 4px;
  border-radius: 15px;
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
// STYLED COMPONENTS PARA MODAL
// ========================================

// Container para os botões do modal
export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

// ========================================
// OBJETOS DE ESTILOS REUTILIZÁVEIS
// ========================================

// Estilos comuns para SelecaoCargosTela
export const commonStyles = {
  // Estilos dos cards
  cardContainer: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    minHeight: "65px"
  },
  cardIcon: {
    color: "#000000E0",
    fontSize: "20px",
    width: "40px",
    height: "20px",
    opacity: 1
  },
  cardNumber: {
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "35px",
    lineHeight: "20px",
    color: "#000000E0"
  },
  cardLabel: {
    fontFamily: "Open Sans",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "20px",
    color: "#000000E0",
    textAlign: "right" as const
  },
  // Estilos da tabela
  tableHeader: {
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    letterSpacing: "0%",
    verticalAlign: "middle" as const,
    color: "#000000E0",
    textAlign: "center" as const
  },
  actionIcon: {
    width: '0.9765625rem',
    height: '0.9765625rem',
    color: '#838383',
    fontSize: '0.9765625rem'
  },
  deleteIcon: {
    width: '1.07125rem',
    height: '1.11625rem',
    color: '#838383',
    fontSize: '1.07125rem'
  },
  // Estilos do texto de lista
  listTitle: {
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    letterSpacing: "0%",
    color: "#515151",
    marginBottom: '0.5rem',
    display: 'block'
  }
};

// ========================================
// ESTILOS INLINE IDENTIFICADOS
// ========================================

// Estilos para SelecaoCargosTela
export const inlineStyles = {
  // Estilos de navegação
  breadcrumbItem: {
    cursor: "pointer"
  },
  // Estilos de botões
  buttonPrimary: {
    width: 203,
    height: 33,
    opacity: 1
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
  // Estilos de seleção
  selectContainer: {
    display: 'flex',
    gap: '34px',
    alignItems: 'center'
  },
  selectWidth: {
    width: 665
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
    margin: "24px 0"
  },
  dividerBottomMargin: {
    margin: "24px 0 85px 0",
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
    lineHeight: '18px',
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
  // Estilos de botão específico
  buscarButton: {
    width: 195,
    height: 45,
    opacity: 1
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
  // Estilos adicionais do botão buscar
  buscarButtonAdditional: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  // Estilos da tabela
  tableHeaderCell: {
    height: '38px',
    padding: '8px 16px'
  },
  // Estilos inline adicionais
  cardHeaderStyles: {
    header: { borderBottom: 'none' },
    body: { paddingTop: 8 }
  },
  cardHeaderStylesSimple: {
    header: { borderBottom: 'none' }
  },
  buttonInlineStyles: {
    borderRadius: 'var(--border-radius-lg)',
    border: '1px solid #0F59C8',
    background: '#FFFFFF',
    color: '#0F59C8'
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
    fontSize: '14px',
    lineHeight: '22px',
    letterSpacing: '0%',
    color: '#515151CC',
    marginBottom: '2px',
    display: 'block',
  },
  value: {
    color: '#838383',
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '22px',
    letterSpacing: '0%',
    display: 'block',
  },
};

// Estilos para BuscarCandidatosModal
export const modalInlineStyles = {
  // Estilos do modal
  modalMaxSize: {
    maxWidth: '100vw',
    maxHeight: '100vh'
  },
  // Estilos do container principal
  mainContainer: {
    padding: '1rem 0.5rem 0.5rem 0.5rem',
    width: '100%',
    height: 'auto',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column' as const
  },
  // Estilos do título
  titleStyle: {
    marginTop: '-0.1rem',
    textAlign: 'left' as const
  },
  // Estilos das seções de informação
  infoSection: {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    borderRadius: '6px'
  },
  infoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  infoItem: {
    flex: 1
  },
  // Estilos do botão cancelar
  cancelButton: {
    borderColor: '#05409A',
    color: '#05409A'
  },
  // Estilos adicionais para o modal
  convocacaoSection: {
    marginTop: '0.5rem',
    marginBottom: '1.5rem'
  },
  convocacaoLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '14px'
  },
  // Estilos dos inputs de autorização
  inputsRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  inputsLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
    marginRight: '2rem',
    minWidth: '150px'
  },
  inputsContainer: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },
  // Estilos de vagas utilizadas
  vagasRow: {
    display: 'flex',
    alignItems: 'center'
  },
  // Estilos de erro
  errorContainer: {
    marginTop: '8px',
    marginLeft: '150px'
  },
  // Estilos dos botões
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: '1rem'
  },
  // Estilos da tabela de candidatos
  tableContainer: {
    marginTop: '0rem',
    marginBottom: '1rem',
    width: '100%'
  },
  // Estilos de estado vazio com cor específica
  emptyStateCustom: {
    color: '#8C8C8C'
  },
  // Estilos do divisor final
  finalDivider: {
    margin: "0 0 5px 0",
    width: "100%",
    height: "0px",
    opacity: 1,
    borderWidth: "1px",
    border: "1px solid #F0F0F0"
  },
  // Estilos dos botões finais
  finalButtonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
    marginTop: '0.25rem'
  },
  // Estilos da tabela
  tableHeaderCell: {
    height: '38px',
    padding: '8px 16px'
  }
};

// Estilos comuns para BuscarCandidatosModal
export const modalStyles = {
  // Estilos dos cabeçalhos da tabela
  tableHeader: {
    fontFamily: 'Open Sans',
    fontWeight: 700,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '22px',
    letterSpacing: '0%',
    verticalAlign: 'middle' as const,
    color: '#515151E0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const
  },
  // Estilos dos inputs de autorização
  inputField: {
    width: '60px',
    height: '32px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    padding: '0 8px',
    fontSize: '14px',
    textAlign: 'center' as const,
    backgroundColor: '#fff'
  },
  inputLabel: {
    color: '#333',
    fontSize: '14px'
  },
  // Estilos das seções de informação
  infoSectionLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
    marginBottom: '0.25rem'
  },
  infoSectionValue: {
    color: '#666',
    fontSize: '14px'
  },
  // Estilos dos botões de ação
  actionButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  // Estilos do total de vagas
  totalVagasStyle: {
    color: '#0F59C8',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '4px 8px',
    backgroundColor: '#E6F7FF',
    borderRadius: '4px',
    border: '1px solid #91D5FF'
  },
  // Estilos do loading
  loadingContainer: {
    textAlign: 'center' as const,
    padding: '2rem'
  },
  loadingText: {
    marginTop: '1rem'
  },
  // Estilos de texto da lista
  listTitle: {
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    letterSpacing: "0%",
    color: "#515151",
    marginBottom: '0.5rem',
    display: 'block'
  },
  // Estilos de estado vazio
  emptyState: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#666',
    backgroundColor: '#f5f5f5',
    border: '1px solid #d9d9d9',
    borderRadius: '6px'
  },
  // Estilos de mensagem de erro
  errorMessage: {
    color: '#ff4d4f',
    fontSize: '12px',
    marginTop: '4px',
    fontFamily: 'Open Sans',
    fontWeight: 400
  }
};

// ========================================
// GLOBAL STYLES PARA SELEÇÃO DE CARGOS
// ========================================

export const GlobalStyles = createGlobalStyle`
  /* Estilos específicos para o Select de cargo nesta tela */
  .cargo-select .ant-select-selector {
    height: 45px !important;
    background: #FFFFFF !important;
    border: 1px solid #B1B2B7 !important;
    border-radius: 6px !important; /* Corner Radius */
    padding-left: 8px !important; /* padding-sm */
    padding-right: 8px !important; /* padding-sm */
    display: flex;
    align-items: center;
  }
  .cargo-select .ant-select-selection-item,
  .cargo-select .ant-select-selection-placeholder {
    line-height: 45px !important;
  }

  /* Hover do botão Buscar candidatos (somente quando habilitado) */
  .buscar-candidatos-btn:not(.ant-btn-disabled):hover,
  .buscar-candidatos-btn:not(.ant-btn-disabled):focus {
    background: #0F59C8 !important;
    color: #FFFFFF !important;
    border-color: #0F59C8 !important;
  }
  .buscar-candidatos-btn:not(.ant-btn-disabled):hover .ant-btn-icon,
  .buscar-candidatos-btn:not(.ant-btn-disabled):focus .ant-btn-icon {
    color: #FFFFFF !important;
  }

  /* Estado desabilitado: todo cinza (fundo, borda, texto e ícone) */
  .buscar-candidatos-btn.ant-btn-disabled,
  .buscar-candidatos-btn.ant-btn-primary.ant-btn-disabled,
  .buscar-candidatos-btn.ant-btn[disabled],
  .buscar-candidatos-btn[disabled],
  .buscar-candidatos-btn.ant-btn-disabled:hover,
  .buscar-candidatos-btn.ant-btn-primary.ant-btn-disabled:hover,
  .buscar-candidatos-btn.ant-btn-disabled:focus {
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
    color: rgba(0, 0, 0, 0.25) !important;
  }
  .buscar-candidatos-btn.ant-btn-primary.ant-btn-disabled .ant-btn-icon,
  .buscar-candidatos-btn.ant-btn[disabled] .ant-btn-icon,
  .buscar-candidatos-btn[disabled] .ant-btn-icon,
  .buscar-candidatos-btn.ant-btn-disabled .ant-btn-icon,
  .buscar-candidatos-btn.ant-btn-disabled:hover .ant-btn-icon,
  .buscar-candidatos-btn.ant-btn-disabled:focus .ant-btn-icon {
    color: rgba(0, 0, 0, 0.25) !important;
  }

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

  /* Estilos dos botões do modal Buscar Candidatos */
  
  /* Tamanho padrão dos botões do modal */
  .modal-action-btn {
    width: 111px !important;
    height: 40px !important;
    gap: 8px !important;
    opacity: 1 !important;
    border-radius: 8px !important;
    border-width: 1px !important;
    padding-right: 16px !important;
    padding-left: 16px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 111px !important;
  }

  /* Botão Buscar do modal - igual ao Buscar da Lista de Convocações */
  .modal-buscar-btn {
    box-sizing: border-box;
    border: 1px solid #0F59C8;
    background-color: #FFFFFF;
    font-family: 'Open Sans';
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: 0%;
    vertical-align: middle;
    color: #0F59C8;
    box-shadow: none;
  }

  .modal-buscar-btn .anticon {
    color: #0F59C8;
  }

  .modal-buscar-btn:hover,
  .modal-buscar-btn:focus {
    background-color: #0F59C8 !important;
    border-color: #0F59C8 !important;
    color: #FFFFFF !important;
  }

  .modal-buscar-btn:hover .anticon,
  .modal-buscar-btn:focus .anticon {
    color: #FFFFFF !important;
  }

  .modal-buscar-btn.ant-btn-disabled,
  .modal-buscar-btn[disabled] {
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
    color: rgba(0, 0, 0, 0.25) !important;
  }

  .modal-buscar-btn.ant-btn-disabled .anticon,
  .modal-buscar-btn[disabled] .anticon {
    color: rgba(0, 0, 0, 0.25) !important;
  }

  /* Hover do Cancel igual ao Buscar */
  .modal-cancel-btn:hover,
  .modal-cancel-btn:focus {
    background-color: #0F59C8 !important;
    border-color: #0F59C8 !important;
    color: #FFFFFF !important;
  }

  /* Tamanho específico do botão Cancelar */
  .modal-cancel-btn {
    width: 77px !important;
    height: 45px !important;
    min-width: 77px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  /* Label do botão Cancelar */
  .modal-cancel-label {
    width: 45px;
    height: 22px;
    opacity: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: 'Open Sans';
    font-weight: 600;
    font-style: normal;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    text-align: center;
  }

  /* Botão Adicionar ao cargo - medidas e cores específicas */
  .modal-adicionar-btn {
    width: 158px !important;
    height: 45px !important;
    opacity: 0.8 !important;
    border-radius: 8px !important;
    border-width: 1px !important;
    padding: 4px 15px !important;
    gap: 8px !important;
    background: var(--Primary-colorPrimaryText, #002C8C) !important;
    border: 1px solid var(--colorLinkActive, #0958D9) !important;
    color: #FFFFFF !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .modal-adicionar-btn .anticon {
    color: #FFFFFF !important;
  }

  /* Estado desabilitado do botão Adicionar ao cargo: todo cinza */
  .modal-adicionar-btn.ant-btn-disabled,
  .modal-adicionar-btn[disabled],
  .modal-adicionar-btn.ant-btn-disabled:hover,
  .modal-adicionar-btn.ant-btn-disabled:focus {
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
    color: rgba(0, 0, 0, 0.25) !important;
    opacity: 1 !important;
  }
  .modal-adicionar-btn.ant-btn-disabled .anticon,
  .modal-adicionar-btn[disabled] .anticon {
    color: rgba(0, 0, 0, 0.25) !important;
  }
  .modal-adicionar-btn.ant-btn-disabled .modal-adicionar-label,
  .modal-adicionar-btn[disabled] .modal-adicionar-label {
    color: rgba(0, 0, 0, 0.25) !important;
  }

  /* Label do botão Adicionar ao cargo */
  .modal-adicionar-label {
    width: 126px;
    height: 22px;
    opacity: 1;
    display: inline-block;
    font-family: 'Open Sans';
    font-weight: 600;
    font-style: normal;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    text-align: center;
    color: #FFFF;
  }

  /* Labels dos radios Calculada e Digitadas */
  .modal-radio-label {
    width: 61px;
    height: 22px;
    opacity: 1;
    font-family: 'Open Sans';
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    color: var(--Text-neutral-color-text, #000000E0);
  }

  /* Labels Autorizações Digitadas e Candidatos Convocados */
  .modal-section-label {
    width: 166px;
    height: 22px;
    opacity: 1;
    font-family: 'Inter';
    font-weight: 600;
    font-style: normal;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    vertical-align: middle;
    color: #515151;
  }

  /* Estilos da tabela de cargos adicionados */
  .ant-table-thead > tr > th .ant-table-column-sorter {
    width: 8px !important;
    height: 12px !important;
    opacity: 1 !important;
  }
  .ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-up,
  .ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-down {
    width: 8px !important;
    height: 12px !important;
    opacity: 1 !important;
    font-size: 12px !important;
  }
`;
