import { Segmented } from "antd";
import styled from "styled-components";

const LARGURA_BORDA = 2;
const RESPIRO_INTERNO = 4;

const alturaItem = (alturaControle: number) =>
  alturaControle - 2 * (RESPIRO_INTERNO + LARGURA_BORDA);

export const FiltroSituacao = styled(Segmented)`
  box-sizing: border-box;
  width: 100%;
  height: ${({ theme }) => theme.layout.controlHeight}px;
  padding: ${RESPIRO_INTERNO}px;
  border: ${LARGURA_BORDA}px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radius}px;

  .ant-segmented-item,
  .ant-segmented-thumb {
    border-radius: ${({ theme }) => theme.layout.radius - RESPIRO_INTERNO}px;
  }

  .ant-segmented-item,
  .ant-segmented-thumb,
  .ant-segmented-item-label {
    height: ${({ theme }) => alturaItem(theme.layout.controlHeight)}px;
    line-height: ${({ theme }) => alturaItem(theme.layout.controlHeight)}px;
  }

  /* Itens dividem a largura sem encolher abaixo do rotulo, evitando "...". */
  .ant-segmented-group {
    height: 100%;
  }

  .ant-segmented-item {
    flex: 1 0 auto;
  }

  .ant-segmented-item-label {
    padding: 0 ${({ theme }) => theme.spacing.lg}px;
    overflow: visible;
    text-overflow: clip;
  }

  /* O rc-segmented so marca -item-selected apos a animacao do thumb, deixando
     o texto preto durante o deslize. O input fica :checked desde o clique. */
  .ant-segmented-item:has(.ant-segmented-item-input:checked),
  .ant-segmented-item:has(.ant-segmented-item-input:checked):hover,
  .ant-segmented-item:has(.ant-segmented-item-input:checked):active {
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const GrupoComponente = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: 600;
  font-style: normal;
  font-size: ${({ theme }) => theme.typography.fontSizeBase}px;
  line-height: 1;
  letter-spacing: 0;
  color: ${({ theme }) => theme.colors.primaryText};
`;
