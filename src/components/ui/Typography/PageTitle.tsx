import type { TextProps } from "antd/es/typography/Text";
import { PageTitleStyled } from "../../../design-system/estilos/EstiloTituloPagina";

export type PageTitleProps = TextProps;

export function PageTitle(props: PageTitleProps) {
  return <PageTitleStyled {...props} />;
}

export { PageTitleStyled, pageTitleStyle } from "../../../design-system/estilos/EstiloTituloPagina";
