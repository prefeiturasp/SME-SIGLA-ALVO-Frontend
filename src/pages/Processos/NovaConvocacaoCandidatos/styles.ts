import styled from "styled-components";
import { Button, Card, Form } from "antd";

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