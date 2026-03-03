/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROCESSOS_CONVOCACAO_API_URL?: string;
  readonly VITE_CONCURSOS_API_URL?: string;
  readonly VITE_CANDIDATOS_API_URL?: string;
  readonly VITE_IMPORTACAO_ARQUIVOS_API_URL?: string;
  readonly VITE_ADMIN_USUARIOS_API_URL?: string;
  readonly VITE_ESCOLHAS_API_URL?: string;
  readonly VITE_AGENDA_API_URL?: string;
  readonly VITE_RELATORIOS_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    __ENV__?: ImportMetaEnv;
  }
}
