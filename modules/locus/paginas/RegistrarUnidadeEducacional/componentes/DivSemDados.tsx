import { Typography } from "antd";
import styled from "styled-components";

const { Text } = Typography;

const DivTracejado = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  padding: 30px ${({ theme }) => theme.spacing.md}px;
  border: 1px dashed ${({ theme }) => theme.colors.lightBorder};
  border-radius: ${({ theme }) => theme.layout.radius}px;
  text-align: center;
`;

export function DivSemDados() {
  return (
    <DivTracejado>
      <Text strong>Nenhum componente adicionado</Text>
      <br />
      <Text type="secondary">
        Selecione um componente curricular e informe a quantidade de módulos.
      </Text>
    </DivTracejado>
  );
}
