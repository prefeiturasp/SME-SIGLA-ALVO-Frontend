import logoPrefSP from "@locus/assets/logo-prefeitura-rodape.png";
import { Rodape as EstiloRodape } from "@locus/estilos";

export const VERSAO_SISTEMA = "v2.3";

export function Rodape() {
  return (
    <EstiloRodape>
      <EstiloRodape.Logo src={logoPrefSP} alt="Prefeitura de São Paulo" />
      <EstiloRodape.Versao>
        Versão {VERSAO_SISTEMA} - Homologada para Google Chrome e Firefox.
      </EstiloRodape.Versao>
    </EstiloRodape>
  );
}

export default Rodape;
