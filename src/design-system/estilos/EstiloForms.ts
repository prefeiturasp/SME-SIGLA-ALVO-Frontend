import styled, { createGlobalStyle } from "styled-components";
import {
  Input,
  Select,
  Upload,
  Card,
  Checkbox,
  Col,
  Form,
  InputNumber,
  Layout,
  Menu,
  Radio,
  Row,
  Steps,
  Typography,
  Alert,
  Button,
  Divider,
  Table,
  Avatar,
  Space,
} from "antd";
import { tokens } from "../tokens";
import { PrimaryButtonStyled, SecondaryButtonStyled } from "./EstiloButton";
import { FormLabelStyled } from "./EstiloLabels";
import { CardTitleStyled } from "./EstiloTituloCard";
import { PageTitleStyled } from "./EstiloTituloPagina";
import { tableConfirmIcon, tableCancelIcon } from "./EstiloIcones";
import { QuestionCircleOutlined, UserOutlined, BarChartOutlined, SettingOutlined } from "@ant-design/icons";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { AppFormItemStyled } from "@/components/ui/Form/AppFormItem";

const { controlHeight, borderRadius, colors, fontFamily } = tokens;
const { Title, Text } = Typography;

/** Altura padrão de controles de formulário (40px) */
export const formControlHeight = controlHeight;

/** Objeto de estilo para inputs inline */
export const formInputStyle = {
  width: "100%",
  height: `${controlHeight}px`,
} as const;

export const StyledFormInput = styled(Input)`
  width: 100%;
  height: ${controlHeight}px;
`;

/** Mensagens de erro em formulários */
export const formErrorText = {
  color: colors.actionIconDelete,
  fontSize: "12px",
  marginTop: 4,
};

export const formErrorTextInline = {
  color: colors.actionIconDelete,
  fontSize: "12px",
};

export const formErrorTextRem = {
  color: colors.actionIconDelete,
  fontSize: "0.75rem",
  marginTop: 4,
};

export const formErrorTextBlockRem = {
  color: colors.actionIconDelete,
  fontSize: "0.75rem",
  display: "block" as const,
};

export const formErrorText14 = {
  color: colors.actionIconDelete,
  fontSize: "14px",
  marginTop: "4px",
};

/** Layout de abas de importação/exportação */
export const formTabStyles = {
  introRow: { marginBottom: "1.8125rem" },
  introTitle: { marginTop: "0" },
  introDescription: { fontSize: "14px" },
  fieldsRow: { marginBottom: "1.8125rem" },
};

/** Campo largo legado */
export const standardWideControl = {
  width: "36.875rem",
  height: `${controlHeight}px`,
};

export const standardWideControlWithMargin = {
  ...standardWideControl,
  marginTop: 4,
};

export const standardNarrowControl = {
  width: "16rem",
  height: `${controlHeight}px`,
  marginTop: 4,
};

export const fieldColumn = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start",
};

export const fullWidth = { width: "100%" };

export const selectSuffixIcon = {
  fontSize: "1.5rem",
  color: colors.primary,
};

export const filterControl = { marginTop: 6 };

/** @deprecated Use FilterInlineRow + FilterFieldCol + FilterActionCol */
export const flexRowGap16End = {
  display: "flex",
  gap: 16,
  alignItems: "end" as const,
  width: "100%",
};

export const modalInfoLabelDark = {
  display: "block" as const,
  marginBottom: 12,
  color: colors.textPrimary,
};

export const cardSpacing = {
  marginBottom16: { marginBottom: 16 },
  marginTop20: { marginTop: "1.25rem" },
};

export const shadowCard = {
  borderRadius,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

export const mutedHelperText = {
  fontSize: "12px",
  color: "#666",
};

export const mutedHelperTextRem = {
  color: "#666",
  fontSize: "0.75rem",
};

export const editNumberInput = {
  width: 80,
  textAlign: "center" as const,
  border: "1px solid #d9d9d9",
  borderRadius: "4px",
  padding: "4px 8px",
};

export const editRowCentered = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  justifyContent: "center" as const,
};

export const flexRowGap8 = {
  display: "flex",
  gap: 8,
};

export const flexRowAlignCenterGapHalf = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

export const actionsRowCenter = {
  display: "flex",
  justifyContent: "center",
  gap: 4,
};

export const actionsEndRow = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: 16,
  gap: 8,
};

export const colNoPadding = {
  paddingLeft: 0,
  paddingRight: 0,
};

export const cardBodyNoPadding = { padding: 0 };

export const statRow = {
  display: "flex",
  height: 64,
};

export const statLabelBold = {
  fontSize: 14,
  fontWeight: "bold" as const,
};

export const statValueHighlight = {
  fontSize: 18,
  fontWeight: "bold" as const,
  color: colors.secondary,
};

export const cursorPointer = { cursor: "pointer" as const };

export const paginationSummary = { marginLeft: 16 };

export { fontFamily };


// ===== forms.ts =====

export const StyledSelect = styled(Select)`
  width: 100%;
  height: ${controlHeight}px;

  .ant-select-selector {
    height: ${controlHeight}px !important;
    display: flex;
    align-items: center;
    border-radius: 0.375rem;
  }

  .ant-select-selection-placeholder,
  .ant-select-selection-item {
    display: flex;
    align-items: center;
  }

  .ant-select-selection-search-input {
    height: ${controlHeight}px !important;
  }

  .ant-select-suffix {
    color: #032b68;
  }
`;

export const StyledCheckbox = styled.div`
  color: #333;
`;

export const UploadArea = styled.div<{ status?: string }>`
  border: 0.125rem dashed ${(props) => (props.status === "error" ? "#DB001B" : "#d9d9d9")};
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  text-align: center;
  background-color: "#fafafa";
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: border-color 0.3s;
`;

export const StyledUpload = styled(Upload)`
  .ant-upload {
    width: 100%;
    height: 80px;
    margin-top: 16px;
  }

  .ant-upload-drag {
    border: none !important;
    background: transparent !important;
    border-radius: 0 !important;
    padding: 0 !important;
  }

  .ant-upload-drag:hover {
    border: none !important;
  }

  .ant-upload-drag-hover {
    border: none !important;
  }
`;

// ===== containers.ts =====

export const TabContentContainer = styled.div`
  padding: 0.5rem 0 1.5rem 0;
  min-height: 60vh;

  .ant-row,
  .ant-col {
    outline: none !important;
    border: none !important;
  }
`;

export const ActionButtonsContainer = styled.div`
  margin-top: auto;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1rem 0;
`;

export const MultilineText = styled.div`
  white-space: pre-line;
`;

export const GrupoEsquerda = styled.div`
  display: flex;
  gap: 16px;
`;

export const SectionDivider = styled.div`
  border-top: 1px solid #fafafa;
  margin: 1.5rem 0;
  width: 100%;
`;

export const LayoutContainer = styled.div`
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const HeaderSection = styled.div`
  margin-bottom: 2.5rem;

  h3 {
    margin: 0;
    color: #262626;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const TableContainer = styled.div`
  margin-bottom: 2rem;

  .ant-table {
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.06);
  }

  .ant-table-thead > tr > th {
    background-color: #f5f5f5;
    font-weight: 600;
    color: #262626;
    border: none !important;
    padding: 16px 20px;
  }

  .ant-table-tbody > tr > td {
    vertical-align: top;
    padding: 16px 20px;
    border: none !important;
  }

  .ant-table-tbody > tr:nth-child(even) {
    background-color: #f6f6f6;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #fafafa;
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 2rem;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const SectionCard = styled(Card)`
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
`;

export const StyledCardWithoutBorder = styled(Card)`
  .ant-card-head {
    border-bottom: none;
    padding: 1.25rem;
  }

  .ant-card-body {
    padding: 1.25rem;
  }
`;

export const SelectContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const SelectDivider = styled.div`
  width: 49%;
`;

export const PlaceholderContainer = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: #666;
`;

export const PlaceholderText = styled.div`
  color: #666;
  font-size: 1rem;
`;

// ===== table.ts =====

export const StyledTable = styled(Table)`
  background-color: #fff;

  .ant-table-thead > tr > th {
    background-color: #fafafa;
    border-bottom: 1px solid #d9d9d9;
    font-weight: 600;
    border: none !important;
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

export const StyledCandidatosTable = styled(StyledTable)`
  .ant-table-thead > tr > th {
    height: 38px !important;
    min-height: 38px !important;
    max-height: 38px !important;
    padding: 0 16px !important;
    background-color: #fafafa;
    font-family: "Open Sans", sans-serif !important;
    font-weight: 700 !important;
    font-style: normal !important;
    font-size: 14px !important;
    line-height: 22px !important;
    letter-spacing: 0 !important;
    vertical-align: middle !important;
    color: #515151e0 !important;
    box-sizing: border-box !important;
  }

  .ant-table-tbody > tr > td {
    font-family: "Open Sans", sans-serif !important;
    font-weight: 400 !important;
    font-style: normal !important;
    font-size: 14px !important;
    line-height: 22px !important;
    letter-spacing: 0 !important;
    vertical-align: middle !important;
  }
` as unknown as typeof Table;

// ===== modal.ts =====

export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ModalHeading = styled(Typography.Text)`
  font-family: ${tokens.fontFamily};
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0;
  color: #000000d9;
`;

export const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ModalSectionTitle = styled.span`
  font-family: ${tokens.fontFamily};
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

export { ModalFieldLabel } from "./EstiloLabels";

export const ModalSelect = styled(Select)`
  width: 100%;
  height: ${controlHeight}px;

  .ant-select-selector {
    height: ${controlHeight}px !important;
    border-radius: ${tokens.borderRadius}px !important;
    display: flex;
    align-items: center;
    padding: 0 1rem !important;
  }

  .ant-select-selection-item,
  .ant-select-selection-placeholder {
    display: flex;
    align-items: center;
    line-height: normal !important;
  }

  .ant-select-selection-search-input {
    height: ${controlHeight}px !important;
  }
`;

export const ModalRadio = styled(Radio)`
  font-family: ${tokens.fontFamily};
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
  color: #515151;
`;

export const ModalCheckbox = styled(Checkbox)`
  font-family: ${tokens.fontFamily};
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
  color: #515151;
`;

export const ModalCustomFormItem = styled(Form.Item)`
  padding-bottom: 0;
  display: flex;
  flex-direction: column;

  .ant-row {
    display: block;
  }

  .ant-form-item-label > label {
    color: ${tokens.colors.textPrimary};
    font-family: ${tokens.fontFamily};
    font-weight: ${tokens.typography.label.fontWeight};
    font-size: ${tokens.typography.label.fontSize}px;
    line-height: ${tokens.typography.label.lineHeight};
    letter-spacing: ${tokens.typography.label.letterSpacing};
    height: 30px;
  }
`;

export const ModalContainer = styled.div`
  padding: 1rem;
  width: 1104px;
  height: 728px;
  max-width: 100vw;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 0.25rem;
  box-shadow: 0px 0.375rem 1.125rem 0px rgba(0, 0, 0, 0.06);
  gap: 1rem;
  overflow: hidden;

  @media (max-width: 1104px) {
    width: calc(100vw - 3rem);
    height: auto;
    min-height: 600px;
    max-height: calc(100vh - 3rem);
  }

  @media (max-height: 728px) {
    height: auto;
    min-height: 500px;
    max-height: calc(100vh - 3rem);
  }
`;

export const ModalTitle = styled.div`
  margin-bottom: 1rem;
  flex-shrink: 0;

  .ant-typography {
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.2;
    color: rgba(45, 46, 47, 1);
    margin: 0;
    text-align: left;
  }
`;

export const CompetitionInfo = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: transparent;
  border-radius: 0.5rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InfoItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  margin-bottom: 0.75rem;

  .ant-typography {
    margin: 0;
    font-family: "Roboto", sans-serif;

    &:first-child {
      font-weight: 700;
      font-size: 1rem;
      line-height: 1.2;
      color: rgba(45, 46, 47, 1);
      text-align: right;
      padding-right: 0.5rem;
    }

    &:last-child {
      font-weight: 700;
      font-size: 1rem;
      line-height: 1.2;
      color: rgba(5, 64, 154, 1);
      text-align: left;
    }
  }
`;

export const ModalInputGroup = styled.div`
  margin-bottom: 1rem;
  flex-shrink: 0;
  display: flex;
  gap: 1rem;

  .ant-typography {
    display: block;
    margin-bottom: 0.5rem;
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1.4;
    color: rgba(45, 46, 47, 1);
  }

  .ant-input {
    border-radius: 0.25rem;
    border: 1px solid #c5c7c9;
    font-family: "Open Sans", sans-serif;
    font-size: 1rem;
    line-height: 1.4;
    color: rgba(114, 118, 121, 1);
    padding: 0.5rem;
    height: 2.5rem;
  }
`;

export const ModalFieldGroup = styled.div`
  margin-bottom: 1rem;
  flex-shrink: 0;

  .ant-typography {
    display: block;
    margin-bottom: 0.75rem;
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1.4;
    color: rgba(45, 46, 47, 1);
  }

  .ant-radio-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .ant-radio-wrapper {
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.2;
    color: rgba(45, 46, 47, 1);
  }

  .ant-radio {
    .ant-radio-inner {
      border-width: 2px;
      border-color: #000000;
    }
  }
`;

export const ModalTableContainer = styled.div`
  margin-bottom: 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 0.5rem;
  width: 100%;
  background-color: #ffffff;
  padding-bottom: 0.25rem;
`;

export const ModalTableHeader = styled(Row)`
  background-color: #ebebed;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #d9d9d9;

  .ant-typography {
    margin: 0;
    text-align: left;
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.4;
    color: rgba(0, 0, 0, 1);
  }
`;

export const ModalTableRow = styled(Row)`
  min-height: 3rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid #f0f0f0;
  background-color: ${(props) =>
    props.className?.includes("alternate") ? "#F6F6F6" : "#FFFFFF"};

  &:last-child {
    border-bottom: none;
  }

  .ant-typography {
    margin: 0;
    text-align: left;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.4;
    color: rgba(52, 58, 64, 1);
  }
`;

export const ModalTableCell = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .ant-input {
    width: 8.125rem;
    height: 1.4375rem;
    background: #ffffff;
    border: 1px solid #c5c7c9;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-family: "Roboto", sans-serif;
    font-size: 0.75rem;
    line-height: 1.2;
    color: #000000;
  }
`;

export const ModalActionButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  flex-shrink: 0;

  .ant-btn {
    border-radius: 0.25rem;
    height: auto;
    padding: 0.5rem 1rem;
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.4;
  }

  .ant-btn-lg {
    height: auto;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    min-width: 23.125rem;
  }

  .ant-btn-primary {
    background: #05409a;
    border: 1px solid #05409a;
    color: rgba(255, 255, 255, 1);

    &:hover {
      background: #05409a;
      border-color: #05409a;
      color: rgba(255, 255, 255, 1);
    }
  }

  .ant-btn-default {
    border: 1px solid #05409a;
    color: rgba(5, 64, 154, 1);
    background: transparent;

    &:hover {
      border-color: #05409a;
      color: rgba(5, 64, 154, 1);
      background: transparent;
    }
  }
`;

export const StyledInput = styled(Input)`
  &.ant-input {
    font-family: "Open Sans", sans-serif;
    font-size: 1rem;
    line-height: 1.4;
    color: #000000;
  }
`;

export const StyledText = styled(Typography.Text)`
  &.text-gray {
    color: #838383;
  }
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 1rem;
  gap: 0.5rem;
`;

// ===== modalInfo.ts =====

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

export { ModalInfoLabel } from "./EstiloLabels";

export const ModalInfoValue = styled.span`
  font-family: ${tokens.fontFamily};
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
  color: #838383e0;
`;

// ===== errorModal.ts =====

export const ErrorModalTitle = styled(Typography.Text)`
  font-size: 16px;
`;

export const ErrorModalRow = styled(Row)`
  margin-top: 16px;
`;

export const ErrorModalTextArea = styled(Input.TextArea)`
  margin-top: 8px;
`;

export const ErrorModalContainer = styled.div`
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

export const ErrorModalButtonsContainer = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

// ===== results.ts =====

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

// ===== EmptyState.ts =====

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

export const EmptyStateDescription = styled(Typography.Text)`
  display: block;
  color: ${tokens.colors.actionIconDisabled};
  font-size: 0.875rem;
  margin: 0;
`;

// ===== escolhaCandidatos.ts =====

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

// ===== dashboard.ts =====

export const PlaceholderTestDashboard = styled.div`
  font-size: 1rem;
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

export const PdfHeader = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #d9d9d9;

  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #032b68;
  }

  span {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #595959;
  }
`;

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
  color: #0f59c8;
  font-weight: 700;
  font-size: 0.875rem;
`;

export const IndicatorIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.125rem;
`;

export const IndicatorValueBox = styled.div`
  background-color: #e7eff6;
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
  color: #1c1d22;
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

// ===== shell.ts =====

export const CustomFormItem = AppFormItemStyled;

export const CustomLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

// Estilos do UserAvatar
export const UserLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0px;
`;

export const StyledUserAvatar = styled(Avatar)`
  background: none !important;
`;

export const UserAvatarIcon = styled(AccountCircleRoundedIcon)`
  font-size: 2.5rem !important;
  color: #1c1d22 !important;
`;

export const GlobalMenuWidth = createGlobalStyle`
  .ant-menu-submenu-popup .ant-menu {
    min-width: 250px;
  }
  .ant-menu-submenu-popup .ant-menu-item,
  .ant-menu-submenu-popup li.ant-menu-item {
    white-space: nowrap;
    width: 100%;
    min-width: 250px;
  }

  /* Estilos globais do breadcrumb */
  .ant-breadcrumb {
    ol {
      display: flex;
      align-items: center;
      
      li {
        display: flex;
        align-items: center;
        
        a, span {
          color: #71717A !important;
          font-family: 'Open Sans', sans-serif !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          line-height: 24px !important;
          letter-spacing: 0% !important;
          text-align: center !important;
          text-decoration: none !important;
          background: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        &:hover {
          a, span {
            color: #1C1D22 !important;
            background: transparent !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
          }
        }
        
        &:last-child {
          a, span {
            color: #0F59C8 !important;
            background: transparent !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
          }
          
          &:hover {
            a, span {
              color: #0F59C8 !important;
              background: transparent !important;
              border: none !important;
              outline: none !important;
              box-shadow: none !important;
            }
          }
        }
      }
    }
    
    .ant-breadcrumb-separator {
      color: #71717A !important;
      font-size: 1rem !important;
      display: flex !important;
      align-items: center !important;
      
      .MuiSvgIcon-root {
        display: flex;
        align-items: center;
        color: #71717A !important;
      }
    }
  }
`;

export const StyledLayout = styled(Layout)`
  height: 100vh;

  overflow: hidden;
  overflow-x: hidden;
`;

export const StyledHeader = styled(Layout.Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;

  border-bottom: 0.0625rem solid #fafafa;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  height: 4.5rem;
  line-height: 4.5rem;
  width: calc(100% - 6.625rem);
  margin-left: 6.625rem;
  z-index: 999;

  .ant-breadcrumb {
    flex: 1;
    margin: 0 2rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
  }
`;

export const PrefSPLogo = styled.img`
  width: 8.45875rem;
  height: 8.45875rem;
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0.5rem;
  margin: 0.25rem 0.5rem;
  background: #1c1d22;
`;

export const AlvoLogo = styled.img`
  width: 4.17rem;
  height: 1.4375rem;
  position: relative;
  top: -0.3125rem;
`;

export const StyledSider = styled(Layout.Sider)`
  background: #1c1d22 !important;
  position: fixed !important;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  height: 100vh;
  z-index: 1000;
  display: flex;
  flex-direction: column;

  .ant-layout-sider-children {
    background: #1c1d22;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

export const SidebarFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  background: #1c1d22;
  color: #ffffff;

  .MuiSvgIcon-root {
    font-size: 1.25rem;
    cursor: pointer;

    &:hover {
      color: #adb5bd;
    }
  }
`;

export const StyledContent = styled(Layout.Content)`
  margin: 1.5625rem 2.5rem 1.5625rem 8.625rem;
  height: calc(100vh - 4.5rem - 3.75rem);
  overflow-y: auto;
`;

export const StyledFooter = styled(Layout.Footer)`
  text-align: end;
  color: #6c757d;
  font-size: 0.75rem;
  padding: 1rem 0rem;
  height: 3.75rem;
  line-height: 1.75rem;
`;

export const SidePanel = styled.div`
  position: fixed;
  left: 6.625rem;
  top: 4.5rem;
  width: 16.8125rem;
  height: calc(100vh - 4.5rem);
  background: #ffffff;
  border-right: 0.0625rem solid #fafafa;
  box-shadow: 0.125rem 0 0.5rem rgba(0, 0, 0, 0.1);
  z-index: 998;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export const SidePanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #ffffff;
`;

export const SidePanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const SidePanelItem = styled.div`
  width: 16.8125rem;
  min-height: 3.375rem;
  padding-top: 0.625rem;
  padding-right: 0.625rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  gap: 0.625rem;
  border-bottom: 0.0625rem solid #fafafa;
  cursor: pointer;
  font-size: 0.875rem;
  color: #515151;
  font-weight: 700;
  display: flex;
  align-items: center;
  opacity: 1;
  transition: color 0.2s ease;

  &:hover {
    color: #0f59c8;
  }
`;

export const CustomMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  flex: 1;
`;

export const CustomMenuItem = styled.div<{
  $isSelected?: boolean;
  $isOpen?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  margin: 0.25rem 0;
  border-radius: 0.375rem;
  cursor: pointer;
  color: #ffffff;
  font-family: "Open Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  text-align: center;
  width: calc(100% - 1rem);
  transition: all 0.2s ease;
  border: 0.125rem solid transparent;

  span {
    margin-top: 0.25rem;
    font-family: "Open Sans", sans-serif;
    font-size: 0.875rem;
    font-weight: 700;
    font-style: normal;
  }

  &:hover {
    background-color: #495057;
  }

  ${({ $isSelected }) =>
    $isSelected &&
    `
    background-color: #495057;
  `}

  ${({ $isOpen }) =>
    $isOpen &&
    `
    border: 0.125rem solid #495057;
    background-color: #343a40;
  `}
`;

export const ProcessosIcon = styled(UserOutlined)`
  font-size: 1.03125rem;
`;

export const RelatoriosIcon = styled(BarChartOutlined)`
  font-size: 1.03125rem;
`;

export const GerenciarIcon = styled(SettingOutlined)`
  font-size: 1rem;
`;

export const SidePanelTitle = styled(Typography.Title)`
  margin: 0 !important;
  color: #212529 !important;
`;

export const AppPageTitle = styled(PageTitleStyled)`
  border-left: 3px solid #ff8048;
  padding-left: 15px;
  line-height: normal;
`;

export const PageContentContainer = styled.div<{
  $bgColor?: string;
  $borderRadius?: number;
}>`
  background: ${({ $bgColor }) => ($bgColor === "none" ? "transparent" : $bgColor || "#FAFAFA")};
  min-height: 30vh;
  border-radius: ${({ $borderRadius }) => $borderRadius || 0}px;
`;

// ===== wizardSection.ts =====

export const ShadowSectionCard = styled(Card)`
  width: 100%;
  border-radius: 0.625rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;

  .ant-card-body {
    padding: 1rem 0.75rem 1rem 0.75rem !important;
  }
`;

export const ProcessoConvocacaoCard = styled(ShadowSectionCard)`
  min-height: 147px;
  gap: 2rem;
  opacity: 1;
  padding: 0rem 1rem 0rem 0.25rem;
`;

export const DadosProcessoCard = styled(ShadowSectionCard)`
  min-height: 198px;
  gap: 2rem;
  opacity: 1;
  padding: 0rem 0rem 0rem 0.25rem;
`;

export const CargoCard = styled(ShadowSectionCard)`
  margin-bottom: 24px;
`;

export const CustomStepsStyle = styled.div`
  .custom-steps .ant-steps-item-title {
    font-family: ${tokens.fontFamily} !important;
    font-weight: 600 !important;
    font-style: normal !important;
    font-size: 16px !important;
    line-height: 24px !important;
    letter-spacing: 0% !important;
    color: #515151 !important;
    background: transparent !important;
  }

  .custom-steps .ant-steps-item-process .ant-steps-item-icon {
    width: 32px !important;
    height: 32px !important;
    border-radius: 32px !important;
    border: 1px solid #1890ff !important;
    background: #1890ff !important;
    opacity: 1 !important;
  }
`;

export const StepsContainer = styled.div`
  margin-top: 3rem;
  margin-left: 0.35rem;
`;

export const ProcessoInfoLabel = styled(Typography.Text)`
  font-family: ${tokens.fontFamily};
  font-weight: 600;
  font-style: normal;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
  color: #515151cc;
`;

export const ProcessoInfoValue = styled(Typography.Text)`
  color: #838383;
  font-family: ${tokens.fontFamily};
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
  margin-top: -18px;
`;

export const ProcessoInfoRow = styled(Row)`
  .ant-col {
    margin-bottom: 1rem;
  }
`;

export const ProcessoInfoCol = styled(Col)`
  display: flex;
  flex-direction: column;
`;

export const ProcessoInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeaderWithButtonContainer = styled.div`
  width: 100%;
  height: 2.8125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 1;
`;

export const NavigationButtonsContainer = styled(Row)`
  margin-top: 32px;
`;

export const NavigationButtonsSpace = styled(Space)`
  display: flex;
  align-items: center;
`;

export const BreadcrumbText = styled(Typography.Text)`
  cursor: pointer;
`;

export const CargoSpace = styled(Space)`
  width: 100%;
`;

export const CargoSpaceCompact = styled(Space)`
  width: 100%;
  gap: 34px;
`;

export const ConvocacaoStepsGlobalStyle = createGlobalStyle`
  .convocacao-steps .step-visited .ant-steps-item-icon {
    border-color: #0f59c8 !important;
    background: #ffffff !important;
  }

  .convocacao-steps .step-visited .ant-steps-item-icon > .ant-steps-icon {
    color: #0f59c8 !important;
  }

  .convocacao-steps .step-visited .ant-steps-item-title {
    color: #0f59c8 !important;
    font-weight: 400 !important;
  }

  .convocacao-steps .step-visited .ant-steps-item-container {
    cursor: pointer;
  }

  .convocacao-steps .step-locked .ant-steps-item-icon {
    border-color: #d9d9d9 !important;
    background: #fafafa !important;
  }

  .convocacao-steps .step-locked .ant-steps-item-icon > .ant-steps-icon,
  .convocacao-steps .step-locked .ant-steps-item-title {
    color: #bfbfbf !important;
  }
`;

// ===== agendaLayout.ts =====

// ========================================
// STYLED COMPONENTS PARA AGENDA
// ========================================

// Estilos dos cards com layout específico
export const BaseStyledCard = styled(Card)`
  width: 12.5rem;
  height: 5rem;
  min-width: 12.5rem;
  opacity: 1;
  padding: 0.5rem 1rem;
  gap: 0.25rem;
  border-radius: 0.9375rem;
  border: none;
  margin: 0;
`;

export const StyledCardAmpla = styled(BaseStyledCard)`
  background-color: #FFF1B8;
`;

export const StyledCardNNA = styled(BaseStyledCard)`
  background-color: #EDEEFC;
`;

export const StyledCardPCD = styled(BaseStyledCard)`
  background-color: #F9F0FF;
`;

// ========================================
// OBJETOS DE ESTILOS REUTILIZÁVEIS
// ========================================

// Estilos comuns para AgendaTela
export const commonStyles = {
  // Estilos dos cards
  cardContainer: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.25rem",
    minHeight: "4.0625rem"
  },
  cardIcon: {
    color: "#000000E0",
    fontSize: "1.25rem",
    width: "2.5rem",
    height: "1.25rem",
    opacity: 1
  },
  cardNumber: {
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "2.1875rem",
    lineHeight: "1.25rem",
    color: "#000000E0"
  },
  cardLabel: {
    fontFamily: "Open Sans",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    color: "#000000E0",
    textAlign: "right" as const
  },
  // Estilos da tabela
  tableHeader: {
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "0.875rem",
    lineHeight: "1.375rem",
    letterSpacing: "0%",
    verticalAlign: "middle" as const,
    color: "#000000E0",
    textAlign: "center" as const
  },
  // Estilos do botão Agendar
  agendarButton: {
    width: 'auto',
    height: '2rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid var(--Success-colorSuccessActive, #389E0D)',
    background: '#FFFFFF',
    color: 'var(--Success-colorSuccessActive, #389E0D)',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem'
  }
};

// ========================================
// ESTILOS INLINE IDENTIFICADOS
// ========================================

// Estilos para AgendaTela
export const inlineStyles = {
  // Estilos de navegação
  breadcrumbItem: {
    cursor: "pointer"
  },
  // Estilos de texto
  titleText: {
    width: 1221,
    height: 22,
    opacity: 1
  },
  cardTitle: {
    width: 164,
    height: 25,
    opacity: 1
  },
  tableTitle: {
    width: 312,
    height: 25,
    opacity: 1
  },
  // Estilos de containers
  marginTop: {
    marginTop: "1.25rem"
  },
  // Estilos de cards
  cardsContainer: {
    display: "flex",
    gap: 8
  },
  // Estilos de tabela
  tableActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8
  },
  // Estilos de divisores
  dividerMargin: {
    margin: "0.5rem 0",
    width: "100%",
    maxWidth: "100%"
  },
  dividerBottomMargin: {
    margin: "1.5rem 0 5.3125rem 0",
    width: "100%",
    height: "0px",
    opacity: 1,
    borderWidth: "1px",
    border: "1px solid #F0F0F0"
  },
  // Estilos de colunas
  colNoPadding: {
    paddingLeft: 0,
    paddingRight: 0
  },
  // Estilos de texto específicos
  titleTextWithFont: {
    width: 1221,
    height: 22,
    opacity: 1,
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: 18,
    lineHeight: '1.125rem',
    letterSpacing: '0%',
    color: '#515151'
  },
  cardTitleWithFont: {
    width: 164,
    height: 25,
    opacity: 1,
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: 18,
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#515151'
  },
  tableTitleWithFont: {
    width: 312,
    height: 25,
    opacity: 1,
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: 18,
    lineHeight: '100%',
    letterSpacing: '0%',
    paddingTop: 8,
    color: '#515151'
  },
  // Estilos de container com marginTop
  containerWithMarginTop: {
    marginTop: 0
  },
  // Estilos do título principal
  titleMain: {
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: 24,
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#515151'
  },
  // Estilos da tabela
  tableHeaderCell: {
    height: '2.375rem',
    padding: '0.5rem 1rem'
  },
  // Estilos inline adicionais
  cardHeaderStyles: {
    header: { borderBottom: 'none' },
    body: { paddingTop: 8 }
  },
  cardHeaderStylesSimple: {
    header: { borderBottom: 'none' }
  },
  titleCombinedStyles: {
    width: 203,
    height: 33,
    opacity: 1,
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: 24,
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#515151'
  },
  // Estilos para mensagem placeholder
  placeholderMessage: {
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontSize: '0.875rem',
    color: '#8C8C8C',
    fontStyle: 'italic',
    textAlign: 'center' as const,
    padding: '1.25rem',
    backgroundColor: '#F5F5F5',
    borderRadius: '0.375rem',
    border: '1px dashed #D9D9D9',
    margin: '1rem 0'
  }
};

// Estilos para informações do processo
export const processInfoStyles = {
  container: {
    marginBottom: '1rem',
  },
  label: {
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    letterSpacing: '0%',
    color: '#515151CC',
    marginBottom: '0.125rem',
    display: 'block',
  },
  value: {
    color: '#838383',
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    letterSpacing: '0%',
    display: 'block',
  },
};

// ========================================
// ESTILOS CENTRALIZADOS PARA COMPONENTES
// ========================================

// Estilos para AgendaForm
export const agendaFormStyles = {
  // Card principal do formulário
  agendaCard: {
    marginBottom: '1rem'
  },
  
  // Header do card
  agendaCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  
  agendaCardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  
  agendaCardIcon: {
    color: '#0F59C8',
    fontSize: '1.5625rem'
  },
  
  agendaCardTitle: {
    color: '#0F59C8',
    fontSize: '1.25rem'
  },
  
  agendaCardCloseButton: {
    color: '#666'
  },
  
  // Formulário
  agendaForm: {
    maxWidth: '100%'
  },
  
  // Linhas do formulário
  formRowFirst: {
    marginBottom: '1rem'
  },
  
  formRowSecond: {
    marginBottom: '1rem'
  },
  
  // Cargo info
  cargoInfoLabel: {
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: '#515151CC',
    marginBottom: '0.125rem',
    display: 'block'
  },
  
  cargoInfoValue: {
    color: '#838383',
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontSize: '0.875rem',
    display: 'block'
  },
  
  // Form items
  formItemNoMargin: {
    marginBottom: '0'
  },
  
  // Mensagens de erro
  errorMessage: formErrorTextRem,
  
  errorMessageBlock: formErrorTextBlockRem,
  
  // Checkbox retardatário
  retardatarioCheckbox: {
    fontSize: '0.875rem',
    fontFamily: 'inherit'
  },
  
  // TimePicker range
  timePickerRange: {
    width: '100%',
    height: `${controlHeight}px`,
  },
  
  // Informação de candidatos disponíveis
  candidatosDisponiveis: {
    ...mutedHelperTextRem,
    marginTop: "0.25rem",
    display: 'block'
  },
  
  // Botão adicionar período
  addPeriodButtonCol: {
    textAlign: 'right' as const
  },
  
  addPeriodButtonIcon: (isDisabled: boolean) => ({
    color: isDisabled ? '#BFBFBF' : undefined
  })
};

// Estilos para AgendaTabela
export const agendaTabelaStyles = {
  // Ícone de expansão
  expandIcon: (isExpanded: boolean) => ({
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s ease',
    fontSize: '0.75rem',
    color: '#666',
    cursor: 'pointer'
  }),
  
  // Container de edição inline
  editContainer: editRowCentered,
  
  // Input de edição
  editInput: {
    width: 80,
    textAlign: 'center' as const,
    border: '1px solid #d9d9d9',
    borderRadius: '0.25rem',
    padding: '0.25rem 0.5rem'
  },
  
  // Texto de candidatos
  candidatosText: {
    fontSize: '0.75rem'
  },
  
  // TimePicker de edição
  editTimePicker: {
    width: 80
  },
  
  // Texto "às"
  timeSeparator: {
    fontSize: '0.75rem'
  },
  
  // Texto de conflito
  conflictText: {
    fontSize: '0.625rem'
  },
  
  // Texto online
  onlineText: {
    fontSize: '0.75rem',
    color: '#666'
  },
  
  // Container de ações
  actionsContainer: actionsRowCenter,

  saveIcon: tableConfirmIcon,

  cancelIcon: tableCancelIcon,
  
  // Mensagem de vazio
  emptyMessage: {
    padding: '1rem',
    textAlign: 'center' as const,
    color: '#666'
  },
  
  // Container principal da tabela expandida
  expandedTableContainer: {
    marginTop: 0
  },
  
  // Wrapper da tabela expandida
  expandedTableWrapper: {
    paddingLeft: '7rem',
    paddingRight: '6.875rem',
    marginBottom: '1.5625rem'
  },
  
  // Título da tabela expandida
  expandedTableTitle: {
    marginBottom: '0.75rem'
  },
  
  expandedTableTitleText: {
    fontSize: '0.875rem',
    color: '#262626',
    fontFamily: 'Open Sans, sans-serif'
  },
  
  // Estilos da tabela expandida
  expandedTable: {
    backgroundColor: '#fafafa',
    width: '100%',
    maxWidth: '100%'
  },
  
  // Header da tabela expandida
  expandedTableHeader: {
    backgroundColor: '##FFFFFF',
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    letterSpacing: '0%',
    verticalAlign: 'middle',
    textAlign: 'center',
    color: '##FFFFFF',
    border: 'none',
    padding: '0.6875rem 1rem',
    height: '2.375rem'
  },
  
  // Row da tabela expandida
  expandedTableRow: (isDark: boolean) => ({
    backgroundColor: isDark ? '#f5f5f5' : '#fff'
  }),
  
  // Cell da tabela expandida
  expandedTableCell: {
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    letterSpacing: '0%',
    verticalAlign: 'middle',
    textAlign: 'center',
    color: 'var(--Text-colorText, #000000E0)',
    padding: '0.6875rem 1rem',
    height: '2.375rem',
    border: 'none'
  },
  
  // Contador de candidatos
  candidatosCounter: {
    marginTop: '0.75rem',
    textAlign: 'left' as const
  },
  
  candidatosCounterText: {
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '0.75rem',
    lineHeight: '1.375rem',
    letterSpacing: '0%',
    verticalAlign: 'middle',
    color: '#6C757D',
    whiteSpace: 'nowrap'
  }
};

// Estilos para AgendaTela
export const agendaTelaStyles = {
  // Content style
  contentStyle: {
    lineHeight: "normal",
    textAlign: "left" as const,
    borderRadius: "0.5rem", // token.borderRadiusLG
    marginTop: 20
  }
};

// ========================================
// GLOBAL STYLES PARA AGENDA
// ========================================

export const AgendaGlobalStyles = createGlobalStyle`
  /* Botão Gerenciamento de vagas - igual ao da Lista de Convocações */
  .gerenciamento-vagas-btn {
    width: 15.5625rem;
    height: ${controlHeight}px;
    gap: 0.5rem;
    opacity: 1;
    border-radius: 0.5rem;
    padding-right: 1rem;
    padding-left: 1rem;
    border-width: 0.0625rem;
    border: 0.0625rem solid #0F59C8;
    background-color: transparent;
    font-family: 'Open Sans';
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: 0%;
    vertical-align: middle;
    color: #0F59C8;
    box-shadow: none;
  }

  .gerenciamento-vagas-btn .anticon {
    width: 0.944375rem;
    height: 1.0675rem;
    opacity: 1;
    color: #0F59C8;
  }

  .gerenciamento-vagas-btn:hover,
  .gerenciamento-vagas-btn:focus {
    background-color: #0F59C8 !important;
    border-color: #0F59C8 !important;
    color: #FFFFFF !important;
  }

  .gerenciamento-vagas-btn:hover .anticon,
  .gerenciamento-vagas-btn:focus .anticon {
    color: #FFFFFF !important;
  }

  /* Estilos específicos para o botão Adicionar período */
  .gerenciamento-vagas-btn.adicionar-periodo-btn {
    width: 11.875rem !important;
    font-family: 'Open Sans' !important;
    font-weight: 400 !important;
    font-style: normal !important;
    font-size: 1rem !important;
    line-height: 1.5rem !important;
    letter-spacing: 0% !important;
    vertical-align: middle !important;
  }

         /* Botão Agendar - estilos específicos */
         .agendar-btn {
           width: auto !important;
           height: 2rem !important;
           padding: 0.25rem 0.75rem !important;
           border-radius: 0.375rem !important;
           border: 1px solid #0F59C8 !important;
           background: #FFFFFF !important;
           color: #0F59C8 !important;
           font-family: 'Open Sans' !important;
           font-weight: 600 !important;
           font-size: 0.875rem !important;
           line-height: 1.375rem !important;
           cursor: pointer !important;
           display: inline-flex !important;
           align-items: center !important;
           justify-content: center !important;
           gap: 0.25rem !important;
           box-shadow: none !important;
         }

         .agendar-btn:hover,
         .agendar-btn:focus {
           background-color: #0F59C8 !important;
           border-color: #0F59C8 !important;
           color: #FFFFFF !important;
         }

         .agendar-btn:hover .anticon,
         .agendar-btn:focus .anticon {
           color: #FFFFFF !important;
         }

  /* Estilos do Collapse Agenda */
  .ant-collapse {
    border: 1px solid #F0F0F0 !important;
    border-radius: 0.5rem !important;
    background: #FFFFFF !important;
  }
  
  .ant-collapse-item {
    border-bottom: none !important;
  }
  
  .ant-collapse-header {
    background: #F9F9F9 !important;
    border-radius: 0.5rem !important;
    padding: 0.75rem 1rem !important;
    font-weight: 600 !important;
  }
  
  .ant-collapse-content {
    background: #FFFFFF !important;
    border-radius: 0 0 0.5rem 0.5rem !important;
  }
  
  .ant-collapse-content-box {
    padding: 1rem !important;
  }

  /* Estilos do formulário dentro do Collapse */
  .ant-form-item-label > label {
    font-family: 'Open Sans' !important;
    font-weight: 600 !important;
    font-size: 0.875rem !important;
    color: #515151 !important;
  }

  .ant-input,
  .ant-select-selector,
  .ant-picker,
  .ant-time-picker {
    border-radius: 0.375rem !important;
    border: 1px solid #D9D9D9 !important;
    height: 2.5rem !important;
  }

         .ant-input:focus,
         .ant-select-focused .ant-select-selector,
         .ant-picker-focused {
           border-color: #0F59C8 !important;
           box-shadow: 0 0 0 0.125rem rgba(15, 89, 200, 0.2) !important;
         }

  .ant-radio-wrapper {
    font-family: 'Open Sans' !important;
    font-size: 0.875rem !important;
    color: #515151 !important;
  }

  .ant-radio-checked .ant-radio-inner {
    border-color: #0F59C8 !important;
    background-color: #0F59C8 !important;
  }

  .ant-radio-checked .ant-radio-inner::after {
    background-color: #FFFFFF !important;
  }

  /* Estilos do Checkbox */
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #0F59C8 !important;
    border-color: #0F59C8 !important;
  }

  .ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: #FFFFFF !important;
  }

  .ant-checkbox:hover .ant-checkbox-inner {
    border-color: #0F59C8 !important;
  }

  /* Estilos específicos para inputs de agenda */
  .agenda-input {
    width: 100% !important;
    height: ${controlHeight}px !important;
    opacity: 1 !important;
    border-radius: 0.375rem !important;
    border-width: 1px !important;
    padding-right: var(--padding-sm) !important;
    padding-left: 0.625rem !important;
    border-style: solid !important;
    background: var(--Background-colorBgContainer, #FFFFFF) !important;
    border: 1px solid #D9D9D9 !important;
    font-size: 0.875rem !important;
    line-height: normal !important;
    text-align: left !important;
  }

  .agenda-input::placeholder {
    text-align: left !important;
    color: #BFBFBF !important;
  }

  /* Estilos para campos desabilitados quando retardatário está marcado */
  .agenda-input.ant-input-number-disabled,
  .agenda-input.ant-input-number-disabled:hover {
    background-color: #F5F5F5 !important;
    border-color: #D9D9D9 !important;
    color: #BFBFBF !important;
    cursor: not-allowed !important;
    opacity: 0.6 !important;
  }

  /* Estilo para ícone do botão Adicionar período quando desabilitado */
  .adicionar-periodo-btn.ant-btn-disabled .anticon,
  .adicionar-periodo-btn.ant-btn-disabled .anticon-plus,
  .adicionar-periodo-btn.ant-btn-disabled svg {
    color: #BFBFBF !important;
    fill: #BFBFBF !important;
  }

  .agenda-select .ant-select-selector {
    width: 100% !important;
    height: ${controlHeight}px !important;
    min-height: ${controlHeight}px !important;
    opacity: 1 !important;
    border-radius: 0.375rem !important;
    border-width: 1px !important;
    padding-right: var(--padding-sm) !important;
    padding-left: 0.5625rem !important;
    border-style: solid !important;
    background: var(--Background-colorBgContainer, #FFFFFF) !important;
    border: 1px solid #D9D9D9 !important;
    display: flex !important;
    align-items: center !important;
  }

  .agenda-select .ant-select-selection-item,
  .agenda-select .ant-select-selection-placeholder {
    line-height: normal !important;
    display: flex !important;
    align-items: center !important;
  }

  .agenda-select .ant-select-selection-search {
    line-height: normal !important;
  }

  .agenda-select .ant-select-selection-search-input {
    height: ${controlHeight}px !important;
    line-height: normal !important;
  }

  /* Estilos mais específicos para garantir que funcionem */
  .agenda-select {
    width: 17.5rem !important;
  }

  .agenda-select .ant-select-selection-item {
    height: auto !important;
  }

  .agenda-select .ant-select-selection-placeholder {
    height: auto !important;
  }

  .agenda-picker {
    width: 100% !important;
    height: ${controlHeight}px !important;
    opacity: 1 !important;
    border-radius: 0.375rem !important;
    border-width: 1px !important;
    padding-right: 0.5rem !important;
    padding-left: 0.3125rem !important;
    border-style: solid !important;
    background: var(--Background-colorBgContainer, #FFFFFF) !important;
    border: 1px solid #D9D9D9 !important;
  }

  .agenda-picker .ant-picker-input > input {
    height: ${controlHeight}px !important;
    line-height: normal !important;
    text-align: left !important;
    padding-left: 0.625rem !important;
  }

         .agenda-picker .ant-picker-input > input::placeholder {
           text-align: left !important;
           color: #BFBFBF !important;
         }

         /* Estilos de focus específicos para campos de agenda */
         .agenda-input:focus {
           border-color: #0F59C8 !important;
           box-shadow: 0 0 0 0.125rem rgba(15, 89, 200, 0.2) !important;
         }

         .agenda-picker:focus,
         .agenda-picker.ant-picker-focused {
           border-color: #0F59C8 !important;
           box-shadow: 0 0 0 0.125rem rgba(15, 89, 200, 0.2) !important;
         }

  /* Estilos da tabela de cargos adicionados */
  .ant-table-thead > tr > th .ant-table-column-sorter {
    width: 0.5rem !important;
    height: 0.75rem !important;
    opacity: 1 !important;
  }
  .ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-up,
  .ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-down {
    width: 0.5rem !important;
    height: 0.75rem !important;
    opacity: 1 !important;
    font-size: 0.75rem !important;
  }

  /* Divider alinhado com a tabela */
  .ant-divider {
    margin: 0.5rem 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }
`;

// ===== buscarCandidatosModal.ts =====

// Estilos para BuscarCandidatosModal
export const modalInlineStyles = {
  // Estilos do modal
  modalMaxSize: {
    maxWidth: '100vw',
    maxHeight: '100vh'
  },
  // Estilos do container principal
  mainContainer: {
    padding: '1rem 0.5rem 0.5rem 0.5rem',
    width: '100%',
    height: 'auto',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column' as const
  },
  // Estilos do título
  titleStyle: {
    marginTop: '-0.1rem',
    textAlign: 'left' as const
  },
  // Estilos das seções de informação
  infoSection: {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    borderRadius: '6px'
  },
  infoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  infoItem: {
    flex: 1
  },
  // Estilos do botão cancelar
  cancelButton: {
    borderColor: '#05409A',
    color: '#05409A'
  },
  // Estilos adicionais para o modal
  convocacaoSection: {
    marginTop: '0.5rem',
    marginBottom: '1.5rem'
  },
  convocacaoLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '14px'
  },
  // Estilos dos inputs de autorização
  inputsRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  inputsLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
    marginRight: '2rem',
    minWidth: '150px'
  },
  inputsContainer: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },
  // Estilos de vagas utilizadas
  vagasRow: {
    display: 'flex',
    alignItems: 'center'
  },
  // Estilos de erro
  errorContainer: {
    marginTop: '8px',
    marginLeft: '150px'
  },
  // Estilos dos botões
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: '1rem'
  },
  // Estilos da tabela de candidatos
  tableContainer: {
    marginTop: '0rem',
    marginBottom: '1rem',
    width: '100%'
  },
  // Estilos de estado vazio com cor específica
  emptyStateCustom: {
    color: '#8C8C8C'
  },
  // Estilos do divisor final
  finalDivider: {
    margin: "0 0 5px 0",
    width: "100%",
    height: "0px",
    opacity: 1,
    borderWidth: "1px",
    border: "1px solid #F0F0F0"
  },
  // Estilos dos botões finais
  finalButtonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
    marginTop: '0.25rem'
  },
  // Estilos da tabela
  tableHeaderCell: {
    height: '38px',
    padding: '8px 16px'
  }
};

// Estilos comuns para BuscarCandidatosModal
export const modalStyles = {
  // Estilos dos cabeçalhos da tabela
  tableHeader: {
    fontFamily: 'Open Sans',
    fontWeight: 700,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '22px',
    letterSpacing: '0%',
    verticalAlign: 'middle' as const,
    color: '#515151E0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const
  },
  // Estilos dos inputs de autorização
  inputField: {
    width: '60px',
    height: '32px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    padding: '0 8px',
    fontSize: '14px',
    textAlign: 'center' as const,
    backgroundColor: '#fff'
  },
  inputLabel: {
    color: '#333',
    fontSize: '14px'
  },
  // Estilos das seções de informação
  infoSectionLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
    marginBottom: '0.25rem'
  },
  infoSectionValue: {
    color: '#666',
    fontSize: '14px'
  },
  // Estilos dos botões de ação
  actionButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  // Estilos do total de vagas
  totalVagasStyle: {
    color: '#0F59C8',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '4px 8px',
    backgroundColor: '#E6F7FF',
    borderRadius: '4px',
    border: '1px solid #91D5FF'
  },
  // Estilos do loading
  loadingContainer: {
    textAlign: 'center' as const,
    padding: '2rem'
  },
  loadingText: {
    marginTop: '1rem'
  },
  // Estilos de texto da lista
  listTitle: {
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    letterSpacing: "0%",
    color: "#515151",
    marginBottom: '0.5rem',
    display: 'block'
  },
  // Estilos de estado vazio
  emptyState: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#666',
    backgroundColor: '#f5f5f5',
    border: '1px solid #d9d9d9',
    borderRadius: '6px'
  },
  // Estilos de mensagem de erro
  errorMessage: {
    color: '#ff4d4f',
    fontSize: '12px',
    marginTop: '4px',
    fontFamily: 'Open Sans',
    fontWeight: 400
  }
};

// ========================================
// GLOBAL STYLES PARA SELEÇÃO DE CARGOS
// ========================================

export const BuscarCandidatosGlobalStyles = createGlobalStyle`
  /* Estilos específicos para o Select de cargo nesta tela */
  .cargo-select .ant-select-selector {
    height: ${controlHeight}px !important;
    background: #FFFFFF !important;
    border: 1px solid #B1B2B7 !important;
    border-radius: 6px !important; /* Corner Radius */
    padding-left: 8px !important; /* padding-sm */
    padding-right: 8px !important; /* padding-sm */
    display: flex;
    align-items: center;
  }
  .cargo-select .ant-select-selection-item,
  .cargo-select .ant-select-selection-placeholder {
    line-height: ${controlHeight}px !important;
  }

  /* Hover do botão Buscar candidatos (somente quando habilitado) */
  .buscar-candidatos-btn:not(.ant-btn-disabled):hover,
  .buscar-candidatos-btn:not(.ant-btn-disabled):focus {
    background: #0F59C8 !important;
    color: #FFFFFF !important;
    border-color: #0F59C8 !important;
  }
  .buscar-candidatos-btn:not(.ant-btn-disabled):hover .ant-btn-icon,
  .buscar-candidatos-btn:not(.ant-btn-disabled):focus .ant-btn-icon {
    color: #FFFFFF !important;
  }

  /* Estado desabilitado: todo cinza (fundo, borda, texto e ícone) */
  .buscar-candidatos-btn.ant-btn-disabled,
  .buscar-candidatos-btn.ant-btn-primary.ant-btn-disabled,
  .buscar-candidatos-btn.ant-btn[disabled],
  .buscar-candidatos-btn[disabled],
  .buscar-candidatos-btn.ant-btn-disabled:hover,
  .buscar-candidatos-btn.ant-btn-primary.ant-btn-disabled:hover,
  .buscar-candidatos-btn.ant-btn-disabled:focus {
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
    color: rgba(0, 0, 0, 0.25) !important;
  }
  .buscar-candidatos-btn.ant-btn-primary.ant-btn-disabled .ant-btn-icon,
  .buscar-candidatos-btn.ant-btn[disabled] .ant-btn-icon,
  .buscar-candidatos-btn[disabled] .ant-btn-icon,
  .buscar-candidatos-btn.ant-btn-disabled .ant-btn-icon,
  .buscar-candidatos-btn.ant-btn-disabled:hover .ant-btn-icon,
  .buscar-candidatos-btn.ant-btn-disabled:focus .ant-btn-icon {
    color: rgba(0, 0, 0, 0.25) !important;
  }

  /* Botão Gerenciamento de vagas - igual ao da Lista de Convocações */
  .gerenciamento-vagas-btn {
    width: 15.5625rem;
    height: ${controlHeight}px;
    gap: 0.5rem;
    opacity: 1;
    border-radius: 0.5rem;
    padding-right: 1rem;
    padding-left: 1rem;
    border-width: 0.0625rem;
    border: 0.0625rem solid #0F59C8;
    background-color: transparent;
    font-family: 'Open Sans';
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: 0%;
    vertical-align: middle;
    color: #0F59C8;
    box-shadow: none;
  }

  .gerenciamento-vagas-btn .anticon {
    width: 0.944375rem;
    height: 1.0675rem;
    opacity: 1;
    color: #0F59C8;
  }

  .gerenciamento-vagas-btn:hover,
  .gerenciamento-vagas-btn:focus {
    background-color: #0F59C8 !important;
    border-color: #0F59C8 !important;
    color: #FFFFFF !important;
  }

  .gerenciamento-vagas-btn:hover .anticon,
  .gerenciamento-vagas-btn:focus .anticon {
    color: #FFFFFF !important;
  }

  /* Estilos dos botões do modal Buscar Candidatos */
  
  /* Tamanho padrão dos botões do modal */
  .modal-action-btn {
    width: 111px !important;
    height: 40px !important;
    gap: 8px !important;
    opacity: 1 !important;
    border-radius: 8px !important;
    border-width: 1px !important;
    padding-right: 16px !important;
    padding-left: 16px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    min-width: 111px !important;
  }

  /* Botão Buscar do modal - igual ao Buscar da Lista de Convocações */
  .modal-buscar-btn {
    box-sizing: border-box;
    border: 1px solid #0F59C8;
    background-color: #FFFFFF;
    font-family: 'Open Sans';
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: 0%;
    vertical-align: middle;
    color: #0F59C8;
    box-shadow: none;
  }

  .modal-buscar-btn .anticon {
    color: #0F59C8;
  }

  .modal-buscar-btn:hover,
  .modal-buscar-btn:focus {
    background-color: #0F59C8 !important;
    border-color: #0F59C8 !important;
    color: #FFFFFF !important;
  }

  .modal-buscar-btn:hover .anticon,
  .modal-buscar-btn:focus .anticon {
    color: #FFFFFF !important;
  }

  .modal-buscar-btn.ant-btn-disabled,
  .modal-buscar-btn[disabled] {
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
    color: rgba(0, 0, 0, 0.25) !important;
  }

  .modal-buscar-btn.ant-btn-disabled .anticon,
  .modal-buscar-btn[disabled] .anticon {
    color: rgba(0, 0, 0, 0.25) !important;
  }

  /* Hover do Cancel igual ao Buscar */
  .modal-cancel-btn:hover,
  .modal-cancel-btn:focus {
    background-color: #0F59C8 !important;
    border-color: #0F59C8 !important;
    color: #FFFFFF !important;
  }

  /* Tamanho específico do botão Cancelar */
  .modal-cancel-btn {
    width: 77px !important;
    height: ${controlHeight}px !important;
    min-width: 77px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  /* Label do botão Cancelar */
  .modal-cancel-label {
    width: 45px;
    height: 22px;
    opacity: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: 'Open Sans';
    font-weight: 600;
    font-style: normal;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    text-align: center;
  }

  /* Botão Adicionar ao cargo - medidas e cores específicas */
  .modal-adicionar-btn {
    width: 158px !important;
    height: ${controlHeight}px !important;
    opacity: 0.8 !important;
    border-radius: 8px !important;
    border-width: 1px !important;
    padding: 4px 15px !important;
    gap: 8px !important;
    background: var(--Primary-colorPrimaryText, #002C8C) !important;
    border: 1px solid var(--colorLinkActive, #0958D9) !important;
    color: #FFFFFF !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .modal-adicionar-btn .anticon {
    color: #FFFFFF !important;
  }

  /* Estado desabilitado do botão Adicionar ao cargo: todo cinza */
  .modal-adicionar-btn.ant-btn-disabled,
  .modal-adicionar-btn[disabled],
  .modal-adicionar-btn.ant-btn-disabled:hover,
  .modal-adicionar-btn.ant-btn-disabled:focus {
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
    color: rgba(0, 0, 0, 0.25) !important;
    opacity: 1 !important;
  }
  .modal-adicionar-btn.ant-btn-disabled .anticon,
  .modal-adicionar-btn[disabled] .anticon {
    color: rgba(0, 0, 0, 0.25) !important;
  }
  .modal-adicionar-btn.ant-btn-disabled .modal-adicionar-label,
  .modal-adicionar-btn[disabled] .modal-adicionar-label {
    color: rgba(0, 0, 0, 0.25) !important;
  }

  /* Label do botão Adicionar ao cargo */
  .modal-adicionar-label {
    width: 126px;
    height: 22px;
    opacity: 1;
    display: inline-block;
    font-family: 'Open Sans';
    font-weight: 600;
    font-style: normal;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    text-align: center;
    color: #FFFF;
  }

  /* Labels dos radios Calculada e Digitadas */
  .modal-radio-label {
    width: 61px;
    height: 22px;
    opacity: 1;
    font-family: 'Open Sans';
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    color: var(--Text-neutral-color-text, #000000E0);
  }

  /* Labels Autorizações Digitadas e Candidatos Convocados */
  .modal-section-label {
    width: 166px;
    height: 22px;
    opacity: 1;
    font-family: 'Inter';
    font-weight: 600;
    font-style: normal;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0%;
    vertical-align: middle;
    color: #515151;
  }

  /* Estilos da tabela de cargos adicionados */
  .ant-table-thead > tr > th .ant-table-column-sorter {
    width: 8px !important;
    height: 12px !important;
    opacity: 1 !important;
  }
  .ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-up,
  .ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-down {
    width: 8px !important;
    height: 12px !important;
    opacity: 1 !important;
    font-size: 12px !important;
  }
`;

// ===== filters.ts =====

export const FilterInput = styled(StyledFormInput)`
  border-radius: 0.375rem;
`;

export const FilterSelect = styled(StyledSelect)`
  width: 100%;
  height: ${tokens.controlHeight}px;

  .ant-select-selector {
    height: ${tokens.controlHeight}px !important;
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
    height: ${tokens.controlHeight}px !important;
  }
`;

export const FilterSelectMulti = styled(FilterSelect)`
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
      height: ${tokens.controlHeight}px !important;
    }
  }
`;

export const FilterButton = styled(PrimaryButtonStyled)`
  width: 173px !important;
  height: ${tokens.controlHeight}px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${tokens.fontFamily} !important;
  font-weight: ${tokens.button.fontWeight} !important;
  font-style: normal !important;
  font-size: ${tokens.button.fontSize}px !important;
  line-height: 24px !important;
  letter-spacing: 0 !important;
  vertical-align: middle;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

/** Row de filtros com campos e botões alinhados pela base do input (40px). */
export const FilterInlineRow = styled(Row)`
  width: 100%;
  align-items: flex-end;
`;

/** Coluna padrão de campo em linha de filtro. */
export const FilterFieldCol = Col;

/** Coluna de botões alinhada à base dos campos (mesma linha). */
export const FilterActionCol = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-left: auto;
  min-width: min(100%, calc(${tokens.button.minWidth * 2}px + 1.5rem));
`;

/** Grupo de botões em linha de filtro (gap padrão). */
export const FilterActionsGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.75rem;
  width: 100%;
  padding-left: 0.75rem;
  box-sizing: border-box;

  > * {
    flex-shrink: 0;
  }
`;

/** Label + valor na mesma linha (ex.: Concurso: valor). */
export const InlineInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

/** @deprecated Use FilterInlineRow */
export const FiltersRow = FilterInlineRow;

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
    align-items: stretch;
  }
`;

export const FilterCard = styled(Card)`
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);
`;

/** @deprecated Use FilterActionCol */
export const ButtonCol = FilterActionCol;

/** Ações abaixo do bloco de filtros (não inline). */
export const FilterActionsBelow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

/** @deprecated Use FilterActionsBelow para ações abaixo; FilterActionsGroup para inline */
export const FilterActions = FilterActionsBelow;

// ===== LoginLayout.tsx =====

export const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

export const LeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #ffffff;
`;

export const LoginCard = styled.div`
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem 2rem 1rem 2rem;
  box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 31.25rem;
  min-width: 28.125rem;
`;

export const StyledForm = styled.form`
  width: 100%;
`;

export const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

export { LoginFieldLabel } from "./EstiloLabels";

export const LoginErrorMessage = styled.div`
  color: ${formErrorText.color};
  font-size: ${formErrorText.fontSize};
  margin-top: ${formErrorText.marginTop}px;
`;

export const StyledButton = styled(PrimaryButtonStyled)`
  width: 100%;
  margin-top: 0.5rem;
`;

export const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: ${tokens.colors.secondary};
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  text-align: center;
  font-size: 14px;
`;

export const PrefLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

export const PrefLogoImage = styled.img`
  max-width: 12rem;
  height: auto;
`;

export const StyledTitle = styled(Title)`
  && {
    text-align: center;
    margin-bottom: 0.5rem !important;
  }
`;

export const LoginText = styled(Text)`
  display: block;
  text-align: center;
  color: #515151;
  margin-bottom: 1.5rem;
`;

export const StyledAlert = styled(Alert)`
  margin-bottom: 1rem;
`;

export const StyledTooltipIcon = styled(QuestionCircleOutlined)`
  color: ${tokens.colors.secondary};
  font-size: 14px;
`;

export const BackToLoginButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

export const ImportantNoticeContainer = styled.div`
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

export const ImportantText = styled(Text)`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const NoticeText = styled(Text)`
  display: block;
  color: #515151;
`;

export const PasswordRequirementsList = styled.ul`
  margin: 1rem 0;
  padding-left: 1.25rem;
`;

export const PasswordRequirementTitle = styled(Text)`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const RequirementItem = styled.li<{ $valid?: boolean }>`
  color: ${({ $valid }) => ($valid ? "#52c41a" : "#515151")};
  margin-bottom: 0.25rem;
`;

export const LoginSelect = styled(Select)`
  width: 100%;
`;

export const SuccessMessage = styled.span`
  display: inline;
`;

export const EmailText = styled.strong`
  font-weight: 700;
`;

export const InstructionsText = styled.span`
  display: block;
  color: #515151;
`;

// ===== HomeLayout.tsx =====

export const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0;
`;

export const PromoCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 720px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const HomeAlvoLogo = styled.img`
  max-width: 200px;
  height: auto;
`;

export const Tagline = styled(CardTitleStyled)`
  && {
    margin-top: 0.5rem !important;
    text-align: center !important;
  }
`;

export const DescriptionText = styled.p`
  color: #515151;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

export const FeaturesList = styled.ul`
  color: ${tokens.colors.textPrimary};
  padding-left: 1.25rem;

  li {
    margin-bottom: 0.5rem;
  }
`;

// ===== MeusDadosLayout.tsx =====

export const CardContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

export const AvatarCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
`;

export const NomeUsuario = styled.h2`
  margin: 1rem 0 0.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${tokens.colors.textPrimary};
`;

export const InfoLine = styled.p`
  margin: 0;
  color: #515151;
`;

export const FieldsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 280px;
`;

export { ProfileFieldLabel } from "./EstiloLabels";

export const FieldRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const MeusDadosModalTitle = styled(Title)`
  && {
    margin: 0 0 1rem !important;
  }
`;

export { MeusDadosFieldLabel } from "./EstiloLabels";

export const MeusDadosButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const FieldWrapper = styled.div`
  margin-bottom: 1rem;
`;

export const ErrorText = styled.span`
  color: ${formErrorText.color};
  font-size: ${formErrorText.fontSize};
`;

export const RequisitosTitulo = styled.p`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const RequisitosNaoTitulo = styled.p`
  font-weight: 600;
  color: ${formErrorText.color};
  margin-bottom: 0.5rem;
`;

export const RequisitoItem = styled.li<{ $valid?: boolean }>`
  color: ${({ $valid }) => ($valid ? "#52c41a" : "#515151")};
`;

// ===== ParametrosLayout.tsx =====

export const StyledCustomFormItem = styled(AppFormItemStyled)`
  .ant-form-item-label {
    text-align: left !important;
  }

  .ant-form-item-label > label {
    font-family: "Open Sans", sans-serif !important;
    font-weight: 700 !important;
    font-style: normal !important;
    font-size: 14px !important;
    line-height: 22px !important;
    letter-spacing: 0% !important;
    color: #000000 !important;
    text-align: left !important;
  }
`;

export const StyledInputNumber = styled(InputNumber)`
  width: 100% !important;
  height: ${controlHeight}px !important;

  .ant-input-number-input-wrap {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .ant-input-number-input {
    text-align: left;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 11px;
  }
`;

export const ParametrosButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 24px;
  gap: 0.5rem;
`;

export const ParametrosErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  line-height: 22px;
  margin-top: 8px;
  font-family: "Open Sans", sans-serif;
`;

export const LabelText = styled(Text)`
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0%;
  color: #000000;
  display: block;
  margin-bottom: 16px;
`;

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CheckboxItem = styled(Checkbox)`
  .ant-checkbox-wrapper {
    display: flex;
    align-items: center;
  }

  .ant-checkbox-wrapper span {
    padding-left: 8px;
  }
`;

export const QuillEditorWrapper = styled.div`
  margin-top: 0.5rem;

  .ql-toolbar {
    border-radius: 8px 8px 0 0;
  }

  .ql-container {
    border-radius: 0 0 8px 8px;
    min-height: 240px;
  }
`;