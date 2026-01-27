import styled from 'styled-components';
import { Tabs, InputNumber, Typography, Checkbox } from 'antd';
import { CustomFormItem } from '../../../components/FormStyle';

const { Text } = Typography;

// Estilos para as abas
export const StyledTabs = styled(Tabs)`
  margin-bottom: 0;
  
  .ant-tabs-tab-bar {
    background-color: #f5f5f5;
    margin: 0;
    padding: 0 1.5rem;
  }
  
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {    
    font-weight: 600 !important;
  }
  
  .ant-tabs-tab:not(.ant-tabs-tab-active) .ant-tabs-tab-btn {
    color: #666 !important;
    font-weight: 400 !important;
  }

  .ant-tabs-tab.ant-tabs-tab-disabled .ant-tabs-tab-btn {
    font-weight: 400 !important;
  }
`;

// Estilos para AbaConvocacao
export const StyledCustomFormItem = styled(CustomFormItem)`
  .ant-form-item-label {
    text-align: left !important;
  }
  
  .ant-form-item-label > label {
    font-family: "Open Sans", sans-serif !important;
    font-weight: 700 !important;
    font-style: normal !important;
    font-size: 14px !important;
    line-height: 22px !important;
    letter-spacing: 0% !important;
    color: #000000 !important;
    text-align: left !important;
  }
`;

export const StyledInputNumber = styled(InputNumber)`
  width: 100% !important;
  height: 45px !important;

  .ant-input-number-input-wrap {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .ant-input-number-input {
    text-align: left;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 11px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 24px;
  gap: 0.5rem;
`;

export const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  line-height: 22px;
  margin-top: 8px;
  font-family: "Open Sans", sans-serif;
`;

// Estilos para AbaRelatorios
export const LabelText = styled(Text)`
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
  color: #000000;
  display: block;
  margin-bottom: 16px;
`;

export const QuillEditorWrapper = styled.div`
  .ql-container {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    min-height: 240px;
  }

  .ql-toolbar {
    border: 1px solid #d9d9d9;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
    background-color: #fafafa;
  }

  .ql-container {
    border-top: none;
    border-radius: 0 0 6px 6px;
  }

  .ql-editor {
    min-height: 240px;
  }

  .ql-editor.ql-blank::before {
    font-style: italic;
    color: #bfbfbf;
  }
`;

// Estilos para AbaTipoUnidade
export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CheckboxItem = styled(Checkbox)`
  .ant-checkbox-wrapper {
    display: flex;
    align-items: center;
  }
  
  .ant-checkbox-wrapper span {
    padding-left: 8px;
  }
`;

