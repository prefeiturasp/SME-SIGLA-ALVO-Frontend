// styled.d.ts — Alvo (token) + Locus (Tema) no mesmo projeto
import "styled-components";
import type { GlobalToken } from "antd/es/theme/interface";
import type { Tema } from "../modules/locus/estilos/tokens/tokens";

declare module "styled-components" {
  export interface DefaultTheme extends Tema {
    token?: GlobalToken;
  }
}
