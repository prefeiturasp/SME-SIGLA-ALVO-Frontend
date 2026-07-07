import { Button, Tooltip } from "antd";
import type { ButtonProps, TooltipProps } from "antd";
import type { ReactElement, ReactNode } from "react";

export type AppIconButtonProps = Omit<ButtonProps, "children"> & {
  icon: ReactNode;
  tooltip?: TooltipProps["title"];
  tooltipPlacement?: TooltipProps["placement"];
};

export type ActionIconTooltipProps = {
  title: TooltipProps["title"];
  placement?: TooltipProps["placement"];
  children: ReactElement;
};

/**
 * Tooltip para ações só-ícone fora de AppIconButton (ex.: ícones de exportação).
 * Não usar em botões com texto visível — o label já descreve a ação.
 */
export function ActionIconTooltip({
  title,
  placement = "top",
  children,
}: ActionIconTooltipProps) {
  return (
    <Tooltip title={title} placement={placement} arrow>
      {children}
    </Tooltip>
  );
}

/** Botão só-ícone — tooltip obrigatório quando a ação não é óbvia sem texto. */
export function AppIconButton({
  icon,
  tooltip,
  tooltipPlacement = "top",
  type = "text",
  disabled,
  ...props
}: AppIconButtonProps) {
  const button = (
    <Button type={type} icon={icon} disabled={disabled} {...props} />
  );

  if (!tooltip) {
    return button;
  }

  const tooltipTarget = disabled ? (
    <span style={{ display: "inline-block", cursor: "not-allowed" }}>{button}</span>
  ) : (
    button
  );

  return (
    <Tooltip title={tooltip} placement={tooltipPlacement} arrow>
      {tooltipTarget}
    </Tooltip>
  );
}
