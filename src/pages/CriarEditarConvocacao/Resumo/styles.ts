import { createGlobalStyle } from "styled-components";
import { agendaTabelaStyles } from "../Agenda/styles";

// ========================================
// GLOBAL STYLES PARA RESUMO
// ========================================

export const ResumoTableStyles = createGlobalStyle`
  /* Remover bordas arredondadas da tabela de resumo */
  .resumo-agenda-table .ant-table,
  .resumo-agenda-table .ant-table-container,
  .resumo-agenda-table .ant-table-content,
  .resumo-agenda-table .ant-table-thead > tr > th:first-child,
  .resumo-agenda-table .ant-table-thead > tr > th:last-child {
    border-radius: 0 !important;
  }
  
  .resumo-agenda-table .ant-table-thead > tr > th {
    border-radius: 0 !important;
  }
  
  /* Remover padding do collapse content box quando contém tabela de resumo */
  .ant-collapse-content-box:has(.resumo-agenda-table) {
    padding: 0.5rem !important;
  }
  
  /* Fallback para navegadores que não suportam :has() */
  .ant-collapse-content-box .resumo-agenda-table {
    margin: 0 !important;
  }
`;

// ========================================
// ESTILOS PARA RESUMO AGENDA TABELA
// ========================================

export const resumoAgendaTabelaStyles = {
  // Container da tabela
  tableContainer: {
    ...agendaTabelaStyles.expandedTableContainer,
    padding: "0",
  },
  
  // Estilo da tabela
  table: {
    ...agendaTabelaStyles.expandedTable,
    width: "100%",
    borderRadius: "0",
  },
  
  // Estilo do header da tabela
  tableHeader: {
    ...agendaTabelaStyles.expandedTableHeader,
    borderRadius: "0",
  },
  
  // Mensagem vazia
  emptyMessage: agendaTabelaStyles.emptyMessage,
};

// ========================================
// ESTILOS PARA RESUMO DO PROCESSO
// ========================================

export const resumoDoProcessoStyles = {
  // Coluna com margin bottom
  colWithMargin: {
    marginBottom: "1rem",
  },
};

// ========================================
// ESTILOS PARA RESUMO (PÁGINA PRINCIPAL)
// ========================================

export const resumoStyles = {
  // Estilo do título do card
  cardTitle: (token: any) => ({
    fontWeight: "400",
    color: token.colorTextSecondary,
  }),
  
  // Estilo do card com margin top
  cardWithMarginTop: {
    marginTop: "1.25rem",
  },
  
  // Estilo do label do collapse
  collapseLabel: {
    fontFamily: "Open Sans",
    fontWeight: 600,
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    letterSpacing: "0%",
    verticalAlign: "middle",
    color: "#000000D9",
  },
  
  // Estilo da mensagem quando não há agendas
  emptyAgendasMessage: {
    padding: "1.25rem",
    textAlign: "center" as const,
    color: "#8C8C8C",
  },
  
  // Estilo do breadcrumb item
  breadcrumbItem: {
    cursor: "pointer",
  },
};

