/**
 * Expõe ENVIRONMENT no window.__ENV__ a partir do Vite (uso local).
 * Importar só no entry (main) para o Jest não carregar import.meta.
 */
export function hidratarEnvLocal(): void {
  if (typeof window === "undefined") return;

  window.__ENV__ = {
    ...(window.__ENV__ ?? {}),
    ENVIRONMENT:
      import.meta.env.ENVIRONMENT || window.__ENV__?.ENVIRONMENT || "",
  };
}
