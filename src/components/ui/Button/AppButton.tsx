import type { ButtonProps } from "antd";
import {
  PrimaryButtonStyled,
  SecondaryButtonStyled,
  TertiaryButtonStyled,
} from "../../../design-system/estilos/EstiloButton";

export type AppButtonVariant = "primary" | "secondary" | "tertiary";

export type AppButtonProps = Omit<ButtonProps, "type" | "ghost"> & {
  variant?: AppButtonVariant;
};

export function AppButton({
  variant = "primary",
  size = "large",
  ...props
}: AppButtonProps) {
  if (variant === "secondary") {
    return <SecondaryButtonStyled type="default" size={size} {...props} />;
  }

  if (variant === "tertiary") {
    return <TertiaryButtonStyled type="default" size={size} {...props} />;
  }

  return <PrimaryButtonStyled size={size} {...props} />;
}

/** @deprecated Use AppButton variant="primary" */
export const PrimaryButton = PrimaryButtonStyled;

/** @deprecated Use AppButton variant="secondary" */
export const SecondaryButton = SecondaryButtonStyled;

export {
  PrimaryButtonStyled,
  SecondaryButtonStyled,
  TertiaryButtonStyled,
  FinalizarButton,
} from "../../../design-system/estilos/EstiloButton";
