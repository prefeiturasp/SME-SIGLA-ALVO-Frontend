import type { SvgIconProps } from "@mui/material/SvgIcon";
import { IconeExcluirLixeira } from "@locus/estilos";

export type IconeExcluirProps = SvgIconProps;

export function IconeExcluir({
  fontSize = "small",
  ...props
}: IconeExcluirProps) {
  return <IconeExcluirLixeira fontSize={fontSize} aria-hidden {...props} />;
}

export default IconeExcluir;
