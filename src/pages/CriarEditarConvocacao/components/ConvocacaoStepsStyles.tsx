import { createGlobalStyle } from "styled-components";

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
