import styled from "styled-components";
import { Typography } from "antd";

const { Text } = Typography;

export const ModalTitleStyled = styled.div`
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  color: #1c1d22;
  margin-bottom: 1.5rem;
`;

export const RequisitoItem = styled.div<{ $status: "idle" | "ok" | "error" }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: ${({ $status }) =>
    $status === "ok" ? "#52c41a" : $status === "error" ? "#ff4d4f" : "#161616"};

  .anticon {
    font-size: 0.875rem;
    flex-shrink: 0;
  }
`;

export const RequisitosTitulo = styled(Text)`
  font-size: 0.875rem;
  font-weight: 700;
  color: #161616;
  display: block;
  margin-bottom: 0.5rem;
`;

export const RequisitosNaoTitulo = styled(Text)`
  font-size: 0.875rem;
  font-weight: 700;
  color: #161616;
  display: block;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

export const FieldLabel = styled(Text)`
  font-size: 0.875rem;
  font-weight: 600;
  color: #161616;
  display: block;
  margin-bottom: 0.25rem;
`;

export const FieldWrapper = styled.div`
  margin-bottom: 1rem;
`;

export const ErrorText = styled(Text)`
  color: #ff4d4f;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.25rem;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;
