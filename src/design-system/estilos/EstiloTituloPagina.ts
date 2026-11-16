import styled from "styled-components";
import { Card, Select, Radio, Row, Typography } from "antd";
import DatePicker from "antd/es/date-picker";
import { tokens } from "../tokens";
import { PrimaryButtonStyled, SecondaryButtonStyled } from "./EstiloButton";

const { Text } = Typography;
const RangePicker = DatePicker.RangePicker;
const { pageTitle } = tokens.typography;
const controlHeightPx = `${tokens.controlHeight}px`;

export const pageTitleStyle = {
  fontFamily: tokens.fontFamily,
  fontWeight: pageTitle.fontWeight,
  fontSize: `${pageTitle.fontSize}px`,
  lineHeight: `${pageTitle.lineHeight * 100}%`,
  letterSpacing: `${pageTitle.letterSpacing}%`,
  color: tokens.colors.textPrimary,
} as const;

export const PageTitleStyled = styled(Text)`
  && {
    color: ${tokens.colors.textPrimary};
    font-family: ${tokens.fontFamily};
    font-size: ${pageTitle.fontSize}px;
    font-weight: ${pageTitle.fontWeight};
    line-height: ${pageTitle.lineHeight};
    letter-spacing: ${pageTitle.letterSpacing};
  }
`;

export const PageHeaderRow = styled(Row)`
  min-height: ${controlHeightPx};
  margin: 0 0 2rem 0;
`;


// ===== searchPage.ts =====

// Container principal
export const PageContainer = styled.div`
  /* Reset completo dos estilos do Ant Design para os selects */
  .ant-select {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  /* Reset absoluto para selects customizados */
  .ant-select.custom-select-concurso,
  .ant-select.custom-select-cargo {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: none !important;
  }

  /* Reset absoluto para todos os estados */
  .ant-select.custom-select-concurso *,
  .ant-select.custom-select-cargo * {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  
  .ant-select .ant-select-selector {
    border: 0.0625rem solid #B1B2B7 !important;
    border-radius: 0.375rem !important;
    outline: none !important;
    box-shadow: none !important;
    padding-right: 0.75rem !important;
    box-sizing: border-box !important;
  }
  
  .ant-select:hover .ant-select-selector {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
    outline: none !important;
  }

  /* Remove bordas extras no hover para selects customizados */
  .custom-select-concurso:hover .ant-select-selector,
  .custom-select-cargo:hover .ant-select-selector {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
    outline: none !important;
  }

  /* Força remoção completa de estilos de hover do Ant Design */
  .ant-select.custom-select-concurso:hover,
  .ant-select.custom-select-cargo:hover {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
  }

  .ant-select.custom-select-concurso:hover .ant-select-selector,
  .ant-select.custom-select-cargo:hover .ant-select-selector {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
    outline: none !important;
  }
  
  .ant-select-focused .ant-select-selector {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
    outline: none !important;
  }
  
  .ant-select-open .ant-select-selector {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
    outline: none !important;
  }
  
  .custom-select-concurso .ant-select-selector {
    width: 37.5rem !important;
    height: ${controlHeightPx} !important;
    gap: 0.25rem !important;
    angle: 0deg !important;
    opacity: 1 !important;
    border-radius: 0.375rem !important;
    padding-right: 0.5rem !important;
    padding-left: 0rem !important;
    border-width: 0.0625rem !important;
    border: 0.0625rem solid #B1B2B7 !important;
    background: #FFFFFF !important;
    box-sizing: border-box !important;
    outline: none !important;
    box-shadow: none !important;
  }

  .custom-select-cargo .ant-select-selector {
    width: 36.25rem !important;
    height: ${controlHeightPx} !important;
    gap: 0.25rem !important;
    angle: 0deg !important;
    opacity: 1 !important;
    border-radius: 0.375rem !important;
    padding-right: 0.5rem !important;
    padding-left: 0rem !important;
    border-width: 0.0625rem !important;
    border: 0.0625rem solid #B1B2B7 !important;
    background: #FFFFFF !important;
    box-sizing: border-box !important;
    outline: none !important;
    box-shadow: none !important;
  }

  /* Força remoção de qualquer borda extra */
  .custom-select-concurso,
  .custom-select-cargo {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
  }

  /* Remove bordas de todos os elementos filhos */
  .custom-select-concurso *,
  .custom-select-cargo * {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  /* Restaura apenas a borda do selector */
  .custom-select-concurso .ant-select-selector,
  .custom-select-cargo .ant-select-selector {
    border: 0.0625rem solid #B1B2B7 !important;
    border-radius: 0.375rem !important;
    outline: none !important;
    box-shadow: none !important;
    background: #FFFFFF !important;
  }
  
  .custom-select-concurso .ant-select-selector:hover,
  .custom-select-cargo .ant-select-selector:hover {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
  }
  
  .custom-select-concurso .ant-select-focused .ant-select-selector,
  .custom-select-cargo .ant-select-focused .ant-select-selector {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
    outline: none !important;
  }
  
  .custom-select-concurso .ant-select-arrow,
  .custom-select-cargo .ant-select-arrow {
    right: 0.75rem !important;
    width: auto !important;
    height: auto !important;
  }
  
  .custom-select-concurso .ant-select-selection-item,
  .custom-select-cargo .ant-select-selection-item {
    padding-right: 0 !important;
    padding-left: 0.5rem !important;
  }
  
  .custom-select-concurso .ant-select-selection-placeholder,
  .custom-select-cargo .ant-select-selection-placeholder {
    padding-right: 0 !important;
    padding-left: 0.5rem !important;
  }

  .ant-radio-wrapper .ant-radio-inner {
    width: 1rem !important;
    height: 1rem !important;
    border-radius: 62.4375rem !important;
    border-width: 0.0625rem !important;
    border-color: #0F59C8 !important;
    background-color: #FFFFFF !important;
    opacity: 1 !important;
  }
  .ant-radio-wrapper .ant-radio-checked .ant-radio-inner {
    border-color: #0F59C8 !important;
    background-color: #FFFFFF !important;
  }
  .ant-radio-wrapper .ant-radio-checked .ant-radio-inner::after {
    background-color: #0F59C8 !important;
  }
`;

// Container principal do título e botões
export const HeaderContainer = styled.div`
  width: 100%;
  height: 2.8125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 1;
`;

// Botões de ação do cabeçalho (secundário)
export const ActionButton = styled(SecondaryButtonStyled)`
  width: 15.5625rem;
  min-width: 15.5625rem;
  font-size: 1rem;

  .anticon {
    color: inherit;
  }
`;

 

// Container para agrupar os botões
export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
`;

// Card de busca
export const ConteudoPagina = styled(Card)`
  width: 100%;
  min-height: 20.0625rem;
  gap: 2rem;
  opacity: 1;
  border-radius: 0.625rem;
  padding: 1rem 1rem 1rem 0.75rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
  
  .ant-card-body {
    padding: 1rem 0.75rem 1rem 0.75rem !important;
  }
`;

export { BuscaProcessosTitleStyled as TituloPagina } from "./EstiloTituloCard";

// Labels dos campos
export { FieldLabel } from "./EstiloLabels";

// Selects
export const CustomSelect = styled(Select)`
  width: 100%;
  height: ${controlHeightPx};
  opacity: 1;
  border-radius: 0.375rem;
  padding-left: 0rem;
  padding-right: 0.75rem;
  border-width: 0.0625rem;
  background-color: #FFFFFF;
  border: 0.0625rem solid #B1B2B7;
  box-sizing: border-box;
  outline: none !important;
  box-shadow: none !important;

  /* Configurações específicas para o select de concurso */
  &.custom-select-concurso {
    width: 100% !important;
    height: ${controlHeightPx} !important;
    gap: 0.25rem !important;
    angle: 0deg !important;
    opacity: 1 !important;
    border-radius: 0.375rem !important;
    padding-right: 0.5rem !important;
    padding-left: 0rem !important;
    border-width: 0.0625rem !important;
    background: #FFFFFF !important;
  }

  /* Configurações específicas para o select de cargo */
  &.custom-select-cargo {
    width: 100% !important;
    height: ${controlHeightPx} !important;
    gap: 0.25rem !important;
    angle: 0deg !important;
    opacity: 1 !important;
    border-radius: 0.375rem !important;
    padding-right: 0.5rem !important;
    padding-left: 0rem !important;
    border-width: 0.0625rem !important;
    background: #FFFFFF !important;
    margin-left: 0.70rem !important;
  }

  /* Reset completo de bordas e sombras */
  &, &:hover, &:focus, &.ant-select-focused, &.ant-select-open {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
    outline: none !important;
  }

  .ant-select-selector {
    height: ${controlHeightPx} !important;
    border: 0.0625rem solid #B1B2B7 !important;
    border-radius: 0.375rem !important;
    outline: none !important;
    box-shadow: none !important;
    padding-right: 0.75rem !important;
    box-sizing: border-box !important;
    display: flex;
    align-items: center;
  }

  .ant-select-selection-placeholder,
  .ant-select-selection-item {
    display: flex;
    align-items: center;
  }

  .ant-select-selection-search-input {
    height: ${controlHeightPx} !important;
  }

  .ant-select-selector:hover {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
    outline: none !important;
  }

  /* Força remoção de bordas extras no hover */
  &:hover .ant-select-selector {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
    outline: none !important;
  }

  /* Reset completo no hover */
  &:hover {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
  }

  /* Força estilos específicos no hover */
  &.ant-select:hover {
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
  }

  &.ant-select:hover .ant-select-selector {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
    outline: none !important;
  }

  &.ant-select-focused .ant-select-selector {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
    outline: none !important;
  }

  &.ant-select-open .ant-select-selector {
    border: 0.0625rem solid #B1B2B7 !important;
    box-shadow: none !important;
    outline: none !important;
  }
`;

// RangePicker
export const CustomRangePicker = styled(RangePicker)`
  width: 20rem;
  height: ${controlHeightPx};
  angle: 0deg;
  opacity: 1;
  border-radius: 0.375rem;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  border-width: 0.0625rem;
  border-style: solid;
  background-color: #FFFFFF;
  border: 0.0625rem solid #D9D9D9;
`;

// Radio buttons
export const RadioGroup = styled(Radio.Group)`
  .ant-radio-wrapper {
    font-family: 'Open Sans';
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.375rem;
    letter-spacing: 0%;
    color: #000000E0;
  }

  .ant-radio-wrapper .ant-radio-inner {
    width: 1rem !important;
    height: 1rem !important;
    border-radius: 62.4375rem !important;
    border-width: 0.0625rem !important;
    border-color: #D9D9D9 !important;
    background-color: #FFFFFF !important;
    opacity: 1 !important;
  }

  .ant-radio-wrapper .ant-radio-checked .ant-radio-inner {
    border-color: #0F59C8 !important;
    background-color: #FFFFFF !important;
  }

  .ant-radio-wrapper .ant-radio-checked .ant-radio-inner::after {
    background-color: #0F59C8 !important;
  }
`;

// Botão limpar filtros (secundário)
export const ClearButton = styled(SecondaryButtonStyled)`
  width: 8.5rem;
  min-width: 8.5rem;
  font-size: 1rem;
`;

// Botão buscar (primário)
export const SearchButton = styled(PrimaryButtonStyled)`
  width: 6.9375rem;
  min-width: 6.9375rem;
  font-size: 1rem;

  .anticon {
    color: inherit;
  }
`;

// Container da tabela
export const SearchTableContainer = styled.div`
  width: 100%;
  min-height: 17.9375rem;
  opacity: 1;
  
  .ant-table {
    border-radius: 0.375rem;
    overflow: hidden;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.06);
  }
  
  .ant-table-thead > tr > th {
    background-color: #F8F9FA;
    font-weight: 600;
    color: #515151;
    border: none !important;
    padding: 1rem 1.25rem;
    font-family: 'Open Sans';
    font-size: 0.875rem;
    line-height: 1.375rem;
    letter-spacing: 0%;
  }
  
  .ant-table-tbody > tr > td {
    vertical-align: middle;
    padding: 1rem 1.25rem;
    border: none !important;
    font-family: 'Open Sans';
    font-size: 0.875rem;
    line-height: 1.375rem;
    color: #515151;
  }
  
  .ant-table-tbody > tr:nth-child(even) {
    background-color: #F6F6F6;
  }
  
  .ant-table-tbody > tr:nth-child(odd) {
    background-color: #FFFFFF;
  }
  
  .ant-table-tbody > tr:hover > td {
    background-color: #F0F8FF !important;
  }
  
  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }
`;

export const ConcursoTabelaWrapper = styled(SearchTableContainer)`
  .linha-inativa td {
    color: rgba(0, 0, 0, 0.35);
  }

  .ant-pagination {
    display: flex;
    align-items: center;
  }

  .ant-pagination .ant-pagination-total-text {
    margin-right: auto;
  }
`;

// Layout helpers
export const SearchFieldButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const SearchButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  width: 100%;
`;

// Container dos campos de busca
export const SearchFieldsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  opacity: 1;
  
  .ant-form-item {
    margin-bottom: 0.5rem !important;
  }
  
  .ant-form-item-label {
    padding-bottom: 0.25rem !important;
  }

  /* Alinhamento do label do cargo com o select */
  .custom-form-item-cargo .ant-form-item-label {
    margin-left: 0.70rem !important;
  }
`;

// Container para a primeira linha (Concurso + Cargo)
export const FirstRowContainer = styled.div`
  width: 100%;
  height: 4.9375rem;
  gap: 1rem;
  angle: 0deg;
  opacity: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0;
  
  > div {
    width: 48%;
    flex: 1;
  }
`;

// Estilos para o index.tsx - Card principal
export const mainCardStyle = {
  borderRadius: 8,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  marginBottom: 24,
};

export { buscaProcessosTitleStyle, buscaProcessosTitleSpacing } from "./EstiloTituloCard";

// Estilos para o texto de paginação
export const paginationTextStyle = {
  marginLeft: 16
};

// ===== pageHeader.ts =====

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const OrangeAccentBar = styled.div`
  width: 0.25rem;
  height: 2rem;
  background-color: #ff6b35;
  border-radius: 0.125rem;
`;