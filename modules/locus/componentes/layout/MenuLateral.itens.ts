import type { ComponentType } from "react";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { IconeExcluir } from "@locus/componentes/IconeExcluir";
import { CAMINHOS } from "@locus/rotas/caminhos";
import { LOCUS_BASENAME } from "@locus/base";

export interface ItemMenu {
  key: string;
  label: string;
  icone: ComponentType<{ fontSize?: "inherit" | "small" | "medium" | "large" }>;
  path?: string;
  prefix: string[];
}

export const ITENS_MENU: ItemMenu[] = [
  {
    key: "cadastro",
    label: "Cadastro",
    icone: PostAddOutlinedIcon,
    path: CAMINHOS.cadastroGestaoUnidades,
    prefix: [`${LOCUS_BASENAME}/cadastro`],
  },
  {
    key: "relatorios-consultas",
    label: "Relatórios consultas",
    icone: SummarizeOutlinedIcon,
    prefix: [`${LOCUS_BASENAME}/relatorios`],
  },
  {
    key: "data-base",
    label: "Data base",
    icone: CalendarMonthOutlinedIcon,
    prefix: [`${LOCUS_BASENAME}/data-base`],
  },
  {
    key: "vagas",
    label: "Vagas",
    icone: DescriptionOutlinedIcon,
    prefix: [`${LOCUS_BASENAME}/vagas`],
  },
  {
    key: "remocao",
    label: "Remoção",
    icone: IconeExcluir,
    prefix: [`${LOCUS_BASENAME}/remocao`],
  },
  {
    key: "integracao",
    label: "Integração",
    icone: LinkOutlinedIcon,
    prefix: [`${LOCUS_BASENAME}/integracao`],
  },
];

export function menuItemAtivo(pathname: string): string {
  const item = ITENS_MENU.find((i) =>
    i.prefix.some((prefixo) => pathname.startsWith(prefixo)),
  );
  return item?.key ?? "";
}
