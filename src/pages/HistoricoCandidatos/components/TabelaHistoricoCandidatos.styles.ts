import styled from "styled-components";
import { StyledTable } from "@/components/ui";
import { tokens } from "@/design-system/tokens";

const { colors, fontFamily } = tokens;

/** Extensão do StyledTable padrão para cabeçalhos agrupados do histórico. */
export const TabelaHistoricoStyled = styled(StyledTable)`
  .ant-table-thead > tr > th {
    height: auto !important;
    min-height: 38px !important;
    padding: 0.75rem 1rem !important;
    font-family: ${fontFamily} !important;
    font-weight: 700 !important;
    font-style: normal !important;
    font-size: 14px !important;
    line-height: 22px !important;
    letter-spacing: 0 !important;
    text-align: center !important;
    white-space: nowrap;
    vertical-align: middle !important;
    border: none !important;
    border-bottom: 1px solid #f0f0f0 !important;
  }

  /* Linha dos grupos: Convocados, Escolhas, Não Escolhas, Reconvocação */
  .ant-table-thead > tr:first-child > th {
    background-color: #EBEBED !important;
  }

  /* Linha dos subcabeçalhos: Data, Total, Geral, PcD, NNA */
  .ant-table-thead > tr:not(:first-child) > th {
    background-color: #e7eff6 !important;
  }

  .ant-table-tbody > tr > td {
    font-family: ${fontFamily} !important;
    font-weight: 400 !important;
    font-style: normal !important;
    font-size: 14px !important;
    line-height: 22px !important;
    letter-spacing: 0 !important;
    color: ${colors.textPrimary} !important;
    text-align: center !important;
    vertical-align: middle !important;
    padding: 0.75rem 1rem !important;
    border: none !important;
  }

  .ant-table-tbody > tr > td.celula-convocacao {
    font-weight: 700 !important;
  }

  .ant-table-tbody > tr > td.celula-total {
    font-weight: 600 !important;
  }

  /* Escolhas: esquerda e direita; Não Escolhas: só direita — contínuas do header às linhas */
  .ant-table-thead > tr > th.header-escolhas,
  .ant-table-thead > tr > th.borda-grupo-esquerda,
  .ant-table-tbody > tr > td.borda-grupo-esquerda {
    border-left: 1px solid #d9d9d9 !important;
  }

  .ant-table-thead > tr > th.header-escolhas,
  .ant-table-thead > tr > th.header-nao-escolhas,
  .ant-table-thead > tr > th.borda-grupo-direita,
  .ant-table-tbody > tr > td.borda-grupo-direita {
    border-right: 1px solid #d9d9d9 !important;
  }

  /* Garante que nenhuma linha de medição residual ocupe espaço */
  .ant-table-tbody > tr.ant-table-measure-row {
    display: none !important;
  }

  .ant-table-pagination {
    display: none;
  }
` as typeof StyledTable;

export const TabelaHistoricoWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;
