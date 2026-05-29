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
