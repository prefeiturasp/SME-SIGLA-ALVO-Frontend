import type { TitleProps } from "antd/es/typography/Title";
import { BuscaProcessosTitleStyled } from "../../../design-system/estilos/EstiloTituloCard";

export type BuscaProcessosTitleProps = TitleProps;

export function BuscaProcessosTitle(props: Readonly<BuscaProcessosTitleProps>) {
  return <BuscaProcessosTitleStyled {...props} />;
}

export {
  BuscaProcessosTitleStyled,
  buscaProcessosTitleStyle,
  buscaProcessosTitleSpacing,
} from "../../../design-system/estilos/EstiloTituloCard";
