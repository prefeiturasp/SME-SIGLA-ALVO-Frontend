import styled from "styled-components";
import FormItem from "antd/es/form/FormItem";
import type { FormItemProps } from "antd/es/form/FormItem";
import type { ReactNode } from "react";
import { tokens } from "../../../design-system/tokens";
import { FormLabel } from "../Typography/FormLabel";

const { label } = tokens.typography;

function normalizeFormLabel(labelProp: FormItemProps["label"]): ReactNode {
  if (typeof labelProp === "string") {
    return <FormLabel>{labelProp}</FormLabel>;
  }

  return labelProp;
}

export const AppFormItemStyled = styled(FormItem)`
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.125rem;

  .ant-row {
    display: block;
  }

  .ant-input,
  .ant-select,
  .ant-picker,
  .ant-input-number,
  .MuiInputBase-root {
    width: 100%;
    height: ${tokens.controlHeight}px;
  }

  .ant-form-item-label {
    padding-bottom: 0;
    margin-bottom: 0.75rem;
  }

  .ant-form-item-label > label {
    color: ${tokens.colors.textPrimary};
    font-weight: ${label.fontWeight};
    font-size: ${label.fontSize}px;
    line-height: ${label.lineHeight};
    margin-bottom: 0;
  }

  .ant-form-item-control {
    margin-top: -4px;
  }
`;

export type AppFormItemProps = FormItemProps;

export function AppFormItem({ label, ...props }: AppFormItemProps) {
  return <AppFormItemStyled label={normalizeFormLabel(label)} {...props} />;
}

/** @deprecated Use AppFormItem from @/components/ui */
export const CustomFormItem = AppFormItemStyled;
