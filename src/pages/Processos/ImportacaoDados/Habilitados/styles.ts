import styled from 'styled-components';
import { Card, Table, Typography, Select, Upload, Button } from 'antd';

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
  box-shadow: 0 0.125rem 0.5rem rgba(0,0,0,0.1);
`;

// Títulos das seções
export const SectionTitle = styled(Typography.Title).attrs({ level: 4 })`
  margin-top: 0 !important;  
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
    color: #032B68;
  }
`;

// Checkbox personalizado
export const StyledCheckbox = styled.div`
  color: #333;
`;

// Estilos para a tabela
export const StyledTable = styled(Table)`
  background-color: #fff;
  
  .ant-table-thead > tr > th {
    background-color: #f0f0f0;
    border-bottom: 1px solid #d9d9d9;
    font-weight: 600;
  }
  
  .ant-table-tbody > tr:nth-child(even) > td {
    background-color: #f8f8f8;
  }
  
  .ant-table-tbody > tr:nth-child(odd) > td {
    background-color: #ffffff;
  }
  
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0;
  }
  
  .ant-table-tbody > tr:hover > td {
    background-color: #f0f8ff !important;
  }
`;

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
  border-top: 1px solid #f0f0f0;
  margin: 1.5rem 0;
  width: 100%;
`;

// Upload personalizado do Ant Design
export const StyledUpload = styled(Upload)`
  width: 100%;
  
  .ant-upload {
    width: 100%;
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
  border-radius: 0.375rem;
  font-weight: 700;
  height: 2.5rem;
  padding: 0 1.5rem;
  border-color: #032B68;
  color: #032B68;
  background-color: #fff;
  
  &:hover {
    border-color: #05409a;
    color: #05409a;
    background-color: #fff;
  }
`;

// Botão primário personalizado
export const PrimaryButton = styled(Button)`
  border-radius: 0.375rem;
  font-weight: 700;
  height: 2.5rem;
  padding: 0 1.5rem;
  background-color: #032B68;
  border-color: #032B68;
  color: #ffffff !important;
  
  &:hover {
    background-color: #021a4a;
    border-color: #021a4a;
    color:rgb(47, 21, 241) !important;
  }
`;
