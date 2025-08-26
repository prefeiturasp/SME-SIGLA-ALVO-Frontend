import styled, { createGlobalStyle } from 'styled-components';
import { Button, Card, Form, Row, Col, Input, Typography, Modal as AntModal } from 'antd';


export const StyledCardPequeno = styled(Card)`
  width: 12.5rem;
  padding: 0;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #cecacaff;
  margin: 10px 8px;
`;

export const StyledCardGrande = styled(Card)`
  width: 15.625rem;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
`;

export const CardIconContainer = styled.div`
  width: 3.75rem;
  background-color: #05409a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.25rem;
`;

export const CardContentContainer = styled.div`
  flex: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ActionButton = styled(Button)`
  margin: 0.625rem 0.5rem;
  border-radius: 0.3125rem;
`;

export const PrimaryButton = styled(Button)`
  background-color: #05409a;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  margin: 0.625rem 0.5rem;
  &:hover {
    background-color: #38388bff !important;
    color: #fff !important;
  }
`;

export const AddButton = styled(PrimaryButton)`
  margin-top: 0.75rem;
`;

export const CustomFormItem = styled(Form.Item).attrs({
  colon: false,
  labelAlign: "left",
  labelCol: { span: 24 },
})`
  padding-bottom: 0;
  .ant-form-item-label > label {
    font-weight: 500;
    font-size: 0.875rem;
  }
  .ant-form-item-control {
    width: 100%;
  }
  .ant-row {
    display: block;
  }
`;

// Shared modal styles used across modals in this feature
export const CustomModal = styled(AntModal)`
  .ant-modal-content {
    padding: 2rem 2rem 1.5rem 2rem;
    border-radius: 2px;
  }
  .ant-modal-header {
    padding: 0;
  }
  .ant-modal-footer {
    padding: 1.5rem 0 0 0;
    .ant-btn-primary {
      border-radius: 2px;
    }
  }
`;

export const ModalCustomFormItem = styled(Form.Item)`
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  .ant-row {
    display: block;
  }
  .ant-form-item-label > label {
    font-weight: 700;
    height: 30px;
  }
`;

export const SelectContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const SelectDivider = styled.div`
  width: 80%;
`;

export const CustomTitle = styled(Typography.Title).attrs({ level: 4 })`
  margin: 2.375rem 0 1rem 0;
`;

export const GlobalFonts = createGlobalStyle`
  /* Roboto Bold */
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-stretch: 100%;
    font-display: block;
    src: url(https://penpot.sme.prefeitura.sp.gov.br/internal/gfonts/font/roboto/v48/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYjalmUiAo.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  /* Roboto Regular */
  @font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-stretch: 100%;
    font-display: block;
    src: url(https://penpot.sme.prefeitura.sp.gov.br/internal/gfonts/font/roboto/v48/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbVmUiAo.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  /* Open Sans Regular */
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    font-stretch: 100%;
    font-display: block;
    src: url(https://penpot.sme.prefeitura.sp.gov.br/internal/gfonts/font/opensans/v43/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
`;

export const ModalContainer = styled.div`
  padding: 1rem;
  width: 1104px;
  height: 728px;
  max-width: 100vw;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  border-radius: 0.25rem;
  box-shadow: 0px 0.375rem 1.125rem 0px rgba(0, 0, 0, 0.06);
  gap: 1rem;
  overflow: hidden;
  
  @media (max-width: 1104px) {
    width: calc(100vw - 3rem);
    height: auto;
    min-height: 600px;
    max-height: calc(100vh - 3rem);
  }
  
  @media (max-height: 728px) {
    height: auto;
    min-height: 500px;
    max-height: calc(100vh - 3rem);
  }
`;

export const ModalTitle = styled.div`
  margin-bottom: 1rem;
  flex-shrink: 0;
  
  .ant-typography {
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.2;
    color: rgba(45, 46, 47, 1);
    margin: 0;
    text-align: left;
  }
`;

export const CompetitionInfo = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: transparent;
  border-radius: 0.5rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InfoItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  margin-bottom: 0.75rem;
  
  .ant-typography {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    
    &:first-child {
      font-weight: 700;
      font-size: 1rem;
      line-height: 1.2;
      color: rgba(45, 46, 47, 1);
      text-align: right;
      padding-right: 0.5rem;
    }
    
    &:last-child {
      font-weight: 700;
      font-size: 1rem;
      line-height: 1.2;
      color: rgba(5, 64, 154, 1);
      text-align: left;
    }
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 1rem;
  flex-shrink: 0;
  display: flex;
  gap: 1rem;
  
  .ant-typography {
    display: block;
    margin-bottom: 0.5rem;
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1.4;
    color: rgba(45, 46, 47, 1);
  }
  
  .ant-input {
    border-radius: 0.25rem;
    border: 1px solid #C5C7C9;
    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    line-height: 1.4;
    color: rgba(114, 118, 121, 1);
    padding: 0.5rem;
    height: 2.5rem;
  }
`;

export const RadioGroup = styled.div`
  margin-bottom: 1rem;
  flex-shrink: 0;
  
  .ant-typography {
    display: block;
    margin-bottom: 0.75rem;
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1.4;
    color: rgba(45, 46, 47, 1);
  }
  
  .ant-radio-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .ant-radio-wrapper {
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.2;
    color: rgba(45, 46, 47, 1);
  }
  
  .ant-radio {
    .ant-radio-inner {
      border-width: 2px;
      border-color: #000000;
    }
  }
`;

export const TableContainer = styled.div`
  margin-bottom: 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 0.5rem;
  width: 100%;
  background-color: #FFFFFF;
  padding-bottom: 0.25rem;   /* pequeno respiro interno opcional */
`;

export const TableHeader = styled(Row)`
  background-color: #EBEBED;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #d9d9d9;
  
  .ant-typography {
    margin: 0;
    text-align: left;
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.4;
    color: rgba(0, 0, 0, 1);
  }
`;

export const TableRow = styled(Row)`
  /* antes era height: 3rem; */
  min-height: 3rem;           /* 48px sem risco de cortar conteúdo */
  box-sizing: border-box;     /* padding conta dentro da altura */
  display: flex;
  align-items: center;
  padding: 0 1rem;            /* só laterais */
  border-bottom: 1px solid #f0f0f0;
  background-color: ${props => props.className?.includes('alternate') ? '#F6F6F6' : '#FFFFFF'};

  &:last-child {
    border-bottom: none;
    /* remova padding-bottom extra aqui, se você tinha adicionado */
  }

  .ant-typography {
    margin: 0;
    text-align: left;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.4;
    color: rgba(52, 58, 64, 1);
  }
`;

export const TableCell = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  
  .ant-input {
    width: 8.125rem;
    height: 1.4375rem;
    background: #FFFFFF;
    border: 1px solid #C5C7C9;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-family: 'Roboto', sans-serif;
    font-size: 0.75rem;
    line-height: 1.2;
    color: #000000;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  flex-shrink: 0;
  
  .ant-btn {
    border-radius: 0.25rem;
    height: auto;
    padding: 0.5rem 1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.4;
  }
  
  .ant-btn-lg {
    height: auto;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    min-width: 23.125rem;
  }
  
  .ant-btn-primary {
    background: #05409A;
    border: 1px solid #05409A;
    color: rgba(255, 255, 255, 1);
    
    &:hover {
      background: #05409A;
      border-color: #05409A;
      color: rgba(255, 255, 255, 1);
    }
  }
  
  .ant-btn-default {
    border: 1px solid #05409A;
    color: rgba(5, 64, 154, 1);
    background: transparent;
    
    &:hover {
      border-color: #05409A;
      color: rgba(5, 64, 154, 1);
      background: transparent;
    }
  }
`;

// Estilos específicos para os campos de entrada
export const StyledInput = styled(Input)`
  &.ant-input {
    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    line-height: 1.4;
    color: #000000;
  }
`;

// Estilos para os textos específicos
export const StyledText = styled(Typography.Text)`
  &.ant-typography {
    font-family: 'Roboto', sans-serif;
    
    &.text-blue {
      color: rgba(5, 64, 154, 1);
      font-weight: 700;
    }
    
    &.text-dark {
      color: rgba(45, 46, 47, 1);
      font-weight: 700;
    }
    
    &.text-gray {
      color: rgba(52, 58, 64, 1);
      font-weight: 400;
    }
  }
`;
 