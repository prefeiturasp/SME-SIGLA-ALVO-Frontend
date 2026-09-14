import { z } from "zod";

export const usuarioLogadoSchema = z.object({
  rf: z.string(),
  nome: z.string(),
  email: z.string().email().optional(),
});
export type UsuarioLogado = z.infer<typeof usuarioLogadoSchema>;

export const USUARIO_MOCK: UsuarioLogado = {
  rf: "1234567",
  nome: "Marcus Paulo de Souza Andrade",
  email: "marcus.andrade@sme.prefeitura.sp.gov.br",
};

export function obterUsuarioLogado(): UsuarioLogado {
  try {
    const bruto = localStorage.getItem("USUARIO");
    if (bruto) {
      return usuarioLogadoSchema.parse(JSON.parse(bruto));
    }
  } catch {
    // storage indisponivel ou JSON invalido -> usa o mock
  }
  return USUARIO_MOCK;
}


export function encerrarSessao(
  aoFinalizar: () => void = () => window.location.reload(),
): void {
  try {
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USUARIO");
  } catch {
    // ignora storage indisponivel
  }
  aoFinalizar();
}
