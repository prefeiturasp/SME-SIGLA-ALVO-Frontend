import styled from "styled-components";
import { Modal, Table, Typography, Select, Upload, Button, Card } from "antd";
import Paragraph from "antd/es/typography/Paragraph";

const { Text } = Typography;

export const TextBlue = styled(Text)`
  color: #05409a;
  font-weight: 700;
`;

export const CustomModal = styled(Modal)`
  .ant-modal-title {
    font-weight: 700;
    font-size: 20px;
    line-height: 1.4;
  }
`;

export const CustomModal2 = styled(Modal)`
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
  .ant-modal-body {
  }
`;

// Container para conteúdo das abas
export const TabContentContainer = styled.div`
  padding: 0.5rem 0 1.5rem 0;

  /* Remove qualquer outline ou border de debug */
  .ant-row,
  .ant-col {
    outline: none !important;
    border: none !important;
  }
`;

// Estilos para os cards de seção
export const SectionCard = styled(Card)`
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
`;

// Títulos das seções
export const SectionTitle = styled(Typography.Title).attrs({ level: 5 })`
  margin-bottom: 1.5rem !important;
  color: #333 !important;
`;

// Estilos para o select de concurso
export const StyledSelect = styled(Select)`
  width: 100%;

  .ant-select-selector {
    border-radius: 0.375rem;
  }

  .ant-select-suffix {
    color: #032b68;
  }
`;

// Checkbox personalizado
export const StyledCheckbox = styled.div`
  color: #333;
`;

// Estilos para a tabela (consolidado dos dois arquivos)
export const StyledTable = styled(Table)`
  background-color: #fff;

  .ant-table-thead > tr > th {
    background-color: #FAFAFA;
    border-bottom: 1px solid #d9d9d9;
    font-weight: 600;
    border: none !important;
  }

  .ant-table-tbody > tr:nth-child(even) > td {
    background-color: #f8f8f8;
  }

  .ant-table-tbody > tr:nth-child(odd) > td {
    background-color: #ffffff;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #FAFAFA;
    border: none !important;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f0f8ff !important;
  }

  .ant-table-tbody > tr:nth-child(even) {
    background-color: #f6f6f6;
  }

  .ant-table-pagination {
    display: flex;
    justify-content: flex-end;
    .ant-pagination-item {
      border-radius: 5px;
    }
  }

  .ant-pagination-total-text {
    margin-right: auto;
    color: #727679;
  }
  box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.06);
` as unknown as typeof Table;

// Container para renderização de texto com quebra de linha
export const MultilineText = styled.div`
  white-space: pre-line;
`;

// Área de upload de arquivos
export const UploadArea = styled.div`
  border: 0.125rem dashed #d9d9d9;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  text-align: center;
  background-color: #fafafa;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: border-color 0.3s;
`;

// Divider entre seções
export const SectionDivider = styled.div`
  border-top: 1px solid #FAFAFA;
  margin: 1.5rem 0;
  width: 100%;
`;

// Upload personalizado do Ant Design
export const StyledUpload = styled(Upload)`
  width: 100%;
  
  .ant-upload {
    width: 100%;
    height: 80px;
  }

  .ant-upload-drag {
    border: none !important;
    background: transparent !important;
    border-radius: 0 !important;
    padding: 0 !important;
  }

  .ant-upload-drag:hover {
    border: none !important;
  }

  .ant-upload-drag-hover {
    border: none !important;
  }
`;

// Container para os botões de ação
export const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding: 1rem 0;
`;

// Botão secundário personalizado
export const SecondaryButton = styled(Button)`
  min-width: 124px;
  height: 2.88rem

  gap: 17px;
  flex-shrink: 0;

  border-radius: var(--BorderRadius-borderRadiusLG, 8px);
  border: 1px solid #b1b2b7;
  color: #838383;
  padding:0 1rem;

  &:hover {
    border-color: #05409a;
    color: #05409a;
    background-color: #fff;
  }
`;

// Botão primário personalizado
export const PrimaryButton = styled(Button)`
  padding:0 1rem;
  border-radius: 0.375rem !important;
 
  height: 2.88rem !important;
  
  background-color: #002c8c !important;
  border-color: #002c8c !important;
  color: #ffffff !important;

  &:hover {
    background-color: #87ceeb !important;
    border-color: #87ceeb !important;
    color: #002c8c !important;
  }

  &:focus {
    background-color: #002c8c !important;
    border-color: #002c8c !important;
    color: #ffffff !important;
  }
`;

// Container do layout padrão
export const LayoutContainer = styled.div`
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// Seção do cabeçalho do layout padrão
export const HeaderSection = styled.div`
  margin-bottom: 2.5rem;

  h3 {
    margin: 0;
    color: #262626;
    font-size: 18px;
    font-weight: 600;
  }
`;

// Container da tabela do layout padrão
export const TableContainer = styled.div`
  margin-bottom: 2rem;

  .ant-table {
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.06);
  }

  .ant-table-thead > tr > th {
    background-color: #f5f5f5;
    font-weight: 600;
    color: #262626;
    border: none !important;
    padding: 16px 20px;
  }

  .ant-table-tbody > tr > td {
    vertical-align: top;
    padding: 16px 20px;
    border: none !important;
  }

  .ant-table-tbody > tr:nth-child(even) {
    background-color: #f6f6f6;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #fafafa;
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }
`;

// Container dos botões do layout padrão
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 2rem;
`;


export const StyledCardWithoutBorder = styled(Card)`

.ant-card-head {
  border-bottom: none;
  padding: 1.25rem ;
}
.ant-card-body {
    padding: 1.25rem;
  }
`;



export const TextSubHeading = styled(Text)`
color: #515151;
font-size: 18px;
font-weight: 600;
`;


export const TextTituloCinza = styled(Text)`
color: rgba(81, 81, 81, 0.80);
font-size: 14px;
font-weight: 600;
line-height: 22px; 

`;
export const TextSubTituloCinza = styled(Paragraph)`
color: #838383;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: 22px;
`;


export const CustomTitle = styled(Typography.Title).attrs({ level: 4 })`
  margin: 2.375rem 0 1rem 0;
`;