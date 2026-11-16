import type { ComponentProps } from "react";
import { FormLabelStyled } from "../../../design-system/estilos/EstiloLabels";

export type FormLabelProps = ComponentProps<typeof FormLabelStyled>;

export function FormLabel(props: FormLabelProps) {
  return <FormLabelStyled {...props} />;
}

export { FormLabelStyled, labelStyle } from "../../../design-system/estilos/EstiloLabels";
