import type { TitleProps } from "antd/es/typography/Title";
import { CardTitleStyled } from "../../../design-system/estilos/EstiloTituloCard";

export type CardTitleProps = TitleProps;

export function CardTitle(props: CardTitleProps) {
  return <CardTitleStyled {...props} />;
}

export { CardTitleStyled, cardTitleStyle } from "../../../design-system/estilos/EstiloTituloCard";
