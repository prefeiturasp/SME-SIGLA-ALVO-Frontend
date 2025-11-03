import { Typography, Input, Row } from "antd";
import styled from "styled-components";

export const CustomTitle = styled(Typography.Title).attrs({ level: 4 })`
  margin: 2.375rem 0 1rem 0;
`;

export const ModalTitle = styled(Typography.Text)`
  font-size: 16px;
`;

export const StyledRow = styled(Row)`
  margin-top: 16px;
`;

export const StyledTextArea = styled(Input.TextArea)`
  margin-top: 8px;
`;

export const ErroContainer = styled.div`
  margin-top: 8px;
  padding: 4px 11px;
  min-height: 146px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background-color: #fff;
  white-space: pre-line;
  font-size: 14px;
  line-height: 1.5715;
`;

export const ButtonsContainer = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
 