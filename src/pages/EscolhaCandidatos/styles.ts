import styled from "styled-components";
import { Button, Card, Checkbox, Col, Radio, Row, Select, Table, Typography } from "antd";
import { PrimaryButton, StyledSelect } from "../../components/EstilosCompartilhados";

export const FilterSelect = styled(StyledSelect)`
  width: 100%;
  height: 40px;

  .ant-select-selector {
    height: 40px !important;
    display: flex;
    align-items: center;
    padding: 0 0.75rem !important;
    border-radius: 0.375rem !important;
  }

  .ant-select-selection-placeholder,
  .ant-select-selection-item {
    display: flex;
    align-items: center;
  }

  .ant-select-selection-search-input {
    height: 40px !important;
  }
`;

export const FilterButton = styled(PrimaryButton)`
  width: 173px !important;
  height: 40px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Open Sans", sans-serif !important;
  font-weight: 600 !important;
  font-style: normal !important;
  font-size: 16px !important;
  line-height: 24px !important;
  letter-spacing: 0 !important;
  vertical-align: middle;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FiltersRow = styled(Row)`
  width: 100%;
`;

export const FiltersCard = styled(Card)`
  border-radius: 0.75rem;
  border: none;
  padding: 1.5rem 1.75rem;
  box-shadow: none;
  min-height: 133px;

  .ant-card-body {
    padding: 0;
    min-height: 133px;
    display: flex;
    align-items: center;
  }
`;

export const FilterLabel = styled(Typography.Text)`
  display: block;
  color: #515151;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const ButtonCol = styled(Col)`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const EmptyStateCard = styled(Card)`
  border-radius: 0.75rem;
  border: none;
  box-shadow: none;
  min-height: 530px;
  display: flex;
  align-items: center;
  justify-content: center;

  .ant-card-body {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
  }
`;

export const EmptyStateContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  max-width: 28rem;
`;

export const EmptyStateImage = styled.img`
  width: 220px;
  max-width: 100%;
`;

export const EmptyStateTitle = styled(Typography.Text)`
  color: #1f1f1f;
  font-size: 1.25rem;
  font-weight: 700;
`;

export const EmptyStateDescription = styled(Typography.Paragraph)`
  color: #838383;
  font-size: 0.875rem;
  margin: 0;
`;

export const ResultsCard = styled(Card)`
  border-radius: 0.75rem;
  border: none;
  box-shadow: none;
  padding: 1.5rem 1.75rem;

  .ant-card-body {
    padding: 0;
  }
`;

export const ResultsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 0.25rem;
`;

export const SituacaoFiltersRow = styled(Row)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0 0.25rem;
`;

export const SituacaoCheckboxWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

export const ButtonActionsWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  margin-left: auto;
`;

export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ModalHeading = styled(Typography.Text)`
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0;
  color: #000000d9;
`;

export const ModalInfoCard = styled.div`
  width: 100%;
  background: #f7f7f7;
  border-radius: 12px;
  padding: 1.5rem 1.75rem;
  display: grid;
  gap: 1rem 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`;

export const ModalInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const ModalInfoLabel = styled.span`
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
  color: #515151cc;
`;

export const ModalInfoValue = styled.span`
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
  color: #838383e0;
`;

export const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ModalSectionTitle = styled.span`
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
  color: #515151;
`;

export const ModalRadioGroup = styled(Radio.Group)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

export const ModalFieldsRow = styled(Row)`
  width: 100%;
`;

export const ModalFieldLabel = styled.span`
  display: block;
  margin-bottom: 0.5rem;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
  color: #515151;
`;

export const ModalSelect = styled(Select)`
  width: 100%;

  .ant-select-selector {
    height: 44px !important;
    border-radius: 8px !important;
    display: flex;
    align-items: center;
    padding: 0 1rem !important;
  }

  .ant-select-selection-item,
  .ant-select-selection-placeholder {
    line-height: 42px !important;
  }
`;

export const ModalRadio = styled(Radio)`
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
  color: #515151;
`;

export const ModalCheckbox = styled(Checkbox)`
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
  color: #515151;
`;

export const ModalSaveButton = styled(Button)`
  background-color: #0f59c8 !important;
  border-color: #0f59c8 !important;
  color: #ffffff !important;

  &:hover:not(:disabled) {
    background-color: #87ceeb !important;
    border-color: #87ceeb !important;
    color: #002c8c !important;
  }

  &:disabled {
    background-color: #d9d9d9 !important;
    border-color: #d9d9d9 !important;
    color: rgba(0, 0, 0, 0.25) !important;
    cursor: not-allowed !important;
  }
`;

export const ModalCancelButton = styled(Button)`
  border: 0.0625rem solid #0f59c8 !important;
  background-color: #ffffff !important;
  color: #0f59c8 !important;
  box-shadow: none !important;

  &:hover:not(:disabled) {
    background-color: #0f59c8 !important;
    border-color: #0f59c8 !important;
    color: #ffffff !important;
  }
`;

export const StyledCandidatosTable = styled(Table)`
  background-color: #fff;

  .ant-table-thead > tr > th {
    height: 38px !important;
    min-height: 38px !important;
    max-height: 38px !important;
    padding: 0 16px !important;
    border-bottom: 1px solid #d9d9d9;
    font-family: "Open Sans", sans-serif !important;
    font-weight: 700 !important;
    font-style: normal !important;
    font-size: 14px !important;
    line-height: 22px !important;
    letter-spacing: 0 !important;
    vertical-align: middle !important;
    color: #515151e0 !important;
    border: none !important;
    box-sizing: border-box !important;
  }

  .ant-table-tbody > tr:nth-child(even) > td {
    background-color: #f8f8f8;
  }

  .ant-table-tbody > tr:nth-child(odd) > td {
    background-color: #ffffff;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #fafafa;
    border: none !important;
    font-family: "Open Sans", sans-serif !important;
    font-weight: 400 !important;
    font-style: normal !important;
    font-size: 14px !important;
    line-height: 22px !important;
    letter-spacing: 0 !important;
    vertical-align: middle !important;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f0f8ff !important;
  }

  .ant-table-tbody > tr:nth-child(even) {
    background-color: #f6f6f6;
  }

  .ant-table-pagination {
    display: flex;
    justify-content: flex-end;
    .ant-pagination-item {
      border-radius: 5px;
    }
  }

  .ant-pagination-total-text {
    margin-right: auto;
    color: #727679;
  }
  box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.06);
` as unknown as typeof Table;

