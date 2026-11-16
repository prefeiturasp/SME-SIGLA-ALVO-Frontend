/** Login fica no portal SIGLA (fora do basename /alvo/). */
export const URL_LOGIN_PORTAL = "/login";

const CAMPOS_SESSAO = ["TOKEN", "USUARIO", "NOME_USUARIO"] as const;

export function redirecionarParaLogin(): void {
  window.location.assign(URL_LOGIN_PORTAL);
}

export function encerrarSessao(
  aoFinalizar: () => void = redirecionarParaLogin,
): void {
  try {
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USUARIO");
    localStorage.removeItem("NOME_USUARIO");
  } catch {
    // storage indisponível
  }
  aoFinalizar();
}

export function obterEnvironment(): string | undefined {
  const valor = window.__ENV__?.ENVIRONMENT;
  return valor || undefined;
}

/**
 * Só em ENVIRONMENT=local: lê TOKEN, USUARIO e NOME_USUARIO da query,
 * grava no localStorage se ainda não existirem e remove os params da URL.
 */
export function aplicarSessaoDaQuery(
  search: string = window.location.search,
  environment: string | undefined = obterEnvironment(),
): boolean {
  if (environment !== "local") {
    return false;
  }

  const params = new URLSearchParams(search);
  let aplicou = false;

  for (const campo of CAMPOS_SESSAO) {
    const valorQuery = params.get(campo);
    if (!valorQuery) continue;

    const valorAtual = localStorage.getItem(campo);
    if (!valorAtual) {
      localStorage.setItem(campo, valorQuery);
      aplicou = true;
    }
    params.delete(campo);
  }

  const sobrouQuery = params.toString();
  const novaUrl =
    window.location.pathname +
    (sobrouQuery ? `?${sobrouQuery}` : "") +
    window.location.hash;

  window.history.replaceState(null, "", novaUrl);
  return aplicou;
}
