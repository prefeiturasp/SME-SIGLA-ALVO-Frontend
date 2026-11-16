import type { InputProps } from "antd";
import { StyledFormInput } from "../../../design-system/estilos/EstiloForms";

export type AppInputProps = InputProps;

export function AppInput(props: AppInputProps) {
  return <StyledFormInput {...props} />;
}

/** @deprecated Use AppInput from @/components/ui */
export const StandardInput = StyledFormInput;

export { StyledFormInput } from "../../../design-system/estilos/EstiloForms";
