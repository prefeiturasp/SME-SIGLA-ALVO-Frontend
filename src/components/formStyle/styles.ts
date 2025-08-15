import styled from "styled-components";
import { Modal as AntModal, Col } from "antd";
import FormItem from "antd/es/form/FormItem";

export const SelectContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const SelectDivider = styled.div`
  width: 49%;
`;

 

export const CustomFormItem = styled(FormItem)`
  padding-bottom: 0;
  display: flex;
  flex-direction: column;

  .ant-row {
    display: block;
  }

    .ant-input,
  .ant-select,
  .ant-picker,
  .ant-input-number,
  .MuiInputBase-root {
    width: 100%;
    height: 2.5rem;
  }
    
  .ant-form-item-label > label {
    font-weight: 700;
  }
  margin-bottom: 1rem;
`;


export const SeparatorCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;

 
`;

