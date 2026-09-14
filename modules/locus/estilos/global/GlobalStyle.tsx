import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    color: ${({ theme }) => theme.colors.primaryText};
    background-color: ${({ theme }) => theme.colors.appBackground};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  img {
    max-width: 100%;
  }

  .ant-form-item-control,
  .ant-form-item-control-input,
  .ant-form-item-control-input-content {
    min-width: 0;
    max-width: 100%;
  }

  .ant-form-item-label > label {
    font-weight: 700;
  }

  .ant-form-item-explain,
  .ant-form-item-explain-connected {
    font-size: ${({ theme }) => theme.typography.fontSizeCaption}px;
    line-height: 1.4;
    min-height: auto;
    margin-top: ${({ theme }) => theme.spacing.xs}px;
    color: ${({ theme }) => theme.colors.primaryText};
  }

  .ant-form-item-explain-error {
    color: ${({ theme }) => theme.colors.error};
  }

  .ant-list-item-meta-description {
    color: ${({ theme }) => theme.colors.primaryText};
  }

  .ant-select .ant-select-selector {
    padding-inline: ${({ theme }) => theme.spacing.md}px !important;
  }

  .ant-select-single .ant-select-selector .ant-select-selection-item,
  .ant-select-single .ant-select-selector .ant-select-selection-placeholder,
  .ant-select-single .ant-select-selector .ant-select-selection-search-input {
    line-height: ${({ theme }) => theme.layout.controlHeight - 2}px;
  }

  .ant-select-disabled .ant-select-selector {
    border-color: ${({ theme }) => theme.colors.border} !important;
    cursor: not-allowed;
  }

  .ant-select-disabled .ant-select-arrow {
    color: ${({ theme }) => theme.colors.secondaryText};
  }

  .ant-card {
    box-shadow: ${({ theme }) => theme.layout.cardShadow};
  }

  .ant-table-thead th .anticon,
  .ant-table-thead th svg {
    color: ${({ theme }) => theme.colors.blue};
    font-size: 16px;
  }

  .ant-table-tbody > tr.linhaPar > td {
    background: ${({ theme }) => theme.colors.stripedBackground};
  }

  .ant-table-tbody > tr.linhaClicavel {
    cursor: pointer;
  }

  .ant-table-thead > tr > th {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primaryText};
  }

  .ant-table-tbody > tr.linhaGrupo > td {
    height: 35px;
    padding-block: 0;
    background: ${({ theme }) => theme.colors.blueBackgroundSoft};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 600;
    font-size: ${({ theme }) => theme.typography.fontSizeBase}px;
    line-height: 1;
    letter-spacing: 0;
    color: ${({ theme }) => theme.colors.primaryText};
  }

  .ant-table-tbody > tr.linhaGrupo > td:first-child {
    border-left: 4px solid ${({ theme }) => theme.colors.blue};
  }

  .ant-pagination {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .ant-pagination-total-text {
    position: absolute;
    inset-inline-start: 0;
    font-weight: 700;
  }

  .ant-pagination-item {
    margin-inline-end: ${({ theme }) => theme.spacing.sm}px;
  }
`;

export default GlobalStyle;
