import { Providers } from "./providers";
import { RotasApp } from "@locus/rotas";

/**
 * Entrada do modulo Locus montada em /locus/* no Alvo.
 * Mantem tema, estilos e layout isolados do app principal.
 */
export function LocusApp() {
  return (
    <Providers>
      <RotasApp />
    </Providers>
  );
}

export default LocusApp;
