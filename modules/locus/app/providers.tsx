import type { ReactNode } from "react";
import { App as AntdApp, ConfigProvider } from "antd";
import { ThemeProvider } from "styled-components";
import ptBR from "antd/locale/pt_BR";
import { temaAntd } from "@locus/estilos/temas/temaAntd";
import { tema } from "@locus/estilos/tokens/tokens";
import { GlobalStyle } from "@locus/estilos/global/GlobalStyle";

export { LOCUS_BASENAME } from "@locus/base";

/**
 * Providers isolados do Locus (tema + antd).
 * O roteamento fica no router do Alvo — evita BrowserRouter aninhado.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={tema}>
      <GlobalStyle />
      <ConfigProvider theme={temaAntd} locale={ptBR}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default Providers;
