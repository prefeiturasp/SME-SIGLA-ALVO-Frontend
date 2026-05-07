import styled from "styled-components";
import { Typography } from "antd";

const { Text } = Typography;

export const CardContainer = styled.div`
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 2rem;
  display: flex;
  gap: 2.5rem;
  align-items: stretch;
`;

export const AvatarCard = styled.div`
  background: #e8eaf6;
  border-radius: 0.5rem;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%;
  min-width: 220px;
  gap: 0.75rem;
`;

export const NomeUsuario = styled(Text)`
  font-weight: 700;
  font-size: 1.375rem;
  color: #1c1d22;
  text-align: center;
  display: block;
`;

export const InfoLine = styled(Text)`
  font-size: 1.0625rem;
  color: #515151;
  display: block;
`;

export const FieldsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const FieldLabel = styled(Text)`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1c1d22;
  display: block;
  margin-bottom: 0.375rem;
`;

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
