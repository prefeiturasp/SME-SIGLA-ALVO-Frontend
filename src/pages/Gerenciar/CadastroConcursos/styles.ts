import styled from "styled-components";

export const CardBusca = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

export const TabelaWrapper = styled.div`
  .linha-inativa td {
    color: rgba(0, 0, 0, 0.35);
  }

  /* Coloca o "Mostrando X de Y" no canto inferior esquerdo,
     mantendo os controles de paginacao a direita. */
  .ant-pagination {
    display: flex;
    align-items: center;
  }

  .ant-pagination .ant-pagination-total-text {
    margin-right: auto;
  }
`;
