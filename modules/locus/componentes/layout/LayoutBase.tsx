import { Outlet } from "react-router-dom";
import {
  LayoutConteudo,
  LayoutConteudoInterno,
  LayoutCorpo,
  LayoutFooter,
  LayoutHeader,
  LayoutRaiz,
} from "@locus/estilos";
import { Cabecalho } from "./Cabecalho";
import { MenuLateral } from "./MenuLateral";
import { Rodape } from "./Rodape";

export function LayoutBase() {
  return (
    <LayoutRaiz hasSider>
      <MenuLateral />
      <LayoutCorpo>
        <LayoutHeader>
          <Cabecalho />
        </LayoutHeader>
        <LayoutConteudo>
          <LayoutConteudoInterno>
            <Outlet />
          </LayoutConteudoInterno>
        </LayoutConteudo>
        <LayoutFooter>
          <Rodape />
        </LayoutFooter>
      </LayoutCorpo>
    </LayoutRaiz>
  );
}

export default LayoutBase;
