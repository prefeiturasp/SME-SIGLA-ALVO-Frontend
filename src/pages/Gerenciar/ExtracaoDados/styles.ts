import styled from "styled-components";
import { Card } from "antd";
import { StyledSelect, StyledTable } from "../../../components/EstilosCompartilhados";

export const ExtracaoFilterSelect = styled(StyledSelect)`
  width: 100%;
  height: 2.5rem;

  .ant-select-selector {
    height: 2.5rem !important;
    min-height: 2.5rem !important;
    display: flex !important;
    align-items: center !important;
    padding: 0 0.75rem !important;
    border-radius: 0.375rem;
  }

  .ant-select-selection-item,
  .ant-select-selection-placeholder {
    display: flex;
    align-items: center;
  }

  &.ant-select-multiple {
    .ant-select-selector {
      padding-block: 0 !important;
    }

    .ant-select-selection-wrap {
      align-self: center !important;
    }

    .ant-select-selection-wrap::after {
      margin-block: 0 !important;
    }

    .ant-select-selection-overflow {
      align-items: center;
    }

    .ant-select-selection-overflow-item-suffix {
      align-self: center;
      margin-block: 0 !important;
      min-height: unset !important;
    }

    .ant-select-selection-item {
      margin-block: 0 !important;
    }

    .ant-select-selection-placeholder {
      top: 50%;
      transform: translateY(-50%);
      inset-inline-start: 0.75rem !important;
      line-height: 1.5;
    }

    .ant-select-selection-search-input {
      height: 2.5rem !important;
    }
  }
`;

export const FilterCard = styled(Card)`
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);
`;

export const IndicatorsCard = styled(Card)`
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);
`;

export const TableCard = styled(Card)`
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);
`;

export const VagasDreTable = styled(StyledTable)`
  .ant-table table {
    table-layout: fixed;
  }

  .col-dre {
    padding-right: 1rem !important;
    vertical-align: middle;
  }

  .col-escolhas,
  .col-vagas,
  .col-percentual {
    text-align: right !important;
  }

  .col-escolhas {
    width: 5.5rem;
    padding-left: 0.75rem !important;
    padding-right: 0.5rem !important;
  }

  .col-vagas {
    width: 5.5rem;
    padding-left: 0.75rem !important;
    padding-right: 0.5rem !important;
  }

  .col-percentual {
    width: 12.5rem;
    padding-left: 0.75rem !important;
    padding-right: 1rem !important;
  }
` as typeof StyledTable;

export const PercentualCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;

  span {
    min-width: 2.5rem;
    text-align: right;
  }

  .ant-progress {
    flex: 1;
    max-width: 7.5rem;
    margin: 0;
  }
`;

export const TabelaCelulaDupla = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  line-height: 1.4;
`;

export const TabelaPercentualDuplo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  width: 100%;
`;

export const ChartCard = styled(Card)`
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);

  .ant-card-body {
    padding-left: 0.5rem;
    padding-right: 1rem;
  }
`;

export const ChartContainer = styled.div`
  margin-top: 1.5rem;
  margin-left: -1.25rem;
  width: calc(100% + 1rem);

  svg text {
    fill: #000000 !important;
    font-size: 12px;
    font-weight: 500;
  }
`;

export const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

export const RelatoriosDetalhadosFilter = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: #f8f9fa;
`;

export const RelatoriosDetalhadosTable = styled(StyledTable)`
  margin-top: 1.5rem;

  .col-numerica-valor {
    text-align: center !important;
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }
` as typeof StyledTable;

export const IndicatorCard = styled(Card)`
  height: 100%;
  border-radius: 0.5rem;
  border: 1px solid #f8f9fa;
  background-color: #f8f9fa;
  overflow: hidden;

  .ant-card-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
    border-radius: 0.5rem;
    background-color: #f8f9fa;
  }
`;

export const IndicatorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #0F59C8;
  font-weight: 700;
  font-size: 0.875rem;
`;

export const IndicatorIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.125rem;
`;

export const IndicatorValueBox = styled.div`
  background-color: #E7EFF6;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  text-align: center;
`;

export const IndicatorValue = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1c1d22;
  line-height: 1.2;
`;

export const IndicatorDescription = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #1C1D22;
  line-height: 1.4;
`;

export const IndicatorBreakdown = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.75);

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-right: 4rem;
  }

  span {
    font-weight: 700;
  }
`;

export const IndicatorCompareRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

export const IndicatorYearBox = styled.div`
  position: relative;
  background-color: #e7eff6;
  border-radius: 0.375rem;
  padding: 0.75rem 0.5rem;
  text-align: center;
  min-height: 4.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
`;

export const IndicatorYearLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #0f59c8;
`;

export const IndicatorCompareValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1c1d22;
  line-height: 1.2;
`;

export const IndicatorVariationPill = styled.span<{ $positivo: boolean }>`
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  padding: 0.125rem 0.375rem;
  border-radius: 999px;
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ $positivo }) => ($positivo ? "#1e7e34" : "#c41e3a")};
  background-color: ${({ $positivo }) => ($positivo ? "#e6f4ea" : "#fce8e8")};
`;

export const IndicatorCompareBreakdown = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.75);
`;

export const IndicatorCompareBreakdownColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const IndicatorCompareBreakdownLabel = styled.span`
  font-weight: 700;
`;

export const IndicatorCompareBreakdownValue = styled.span`
  line-height: 1.3;
`;
