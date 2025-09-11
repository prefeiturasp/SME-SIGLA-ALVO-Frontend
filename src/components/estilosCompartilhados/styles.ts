import { Modal, Table } from "antd";
import { Typography } from "antd";
import { Card, Select, Upload, Button } from 'antd';


const { Text } = Typography;

import styled from "styled-components";
 
export const TextBlue = styled(Text)`
   color: #05409A;
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

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    border: none !important; 
  }
     
  .ant-table-tbody > tr > td {
    border: none !important;
  }
 
  .ant-table-tbody > tr:nth-child(even) {
    background-color: #F6F6F6;
  }

  .ant-table-pagination {
    display: flex;
    justify-content: flex-end;
    .ant-pagination-item{
    border-radius:5px
    } 
  }


   .ant-pagination-total-text {
    margin-right: auto; 
    color: #727679;
  }
  box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.06);
` as typeof Table;

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
