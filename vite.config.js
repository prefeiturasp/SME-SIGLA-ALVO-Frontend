import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "node:path";

function normalizarBase(valor) {
  const base = (valor || "/").trim() || "/";
  if (base === "/") return "/";
  const comBarra = base.startsWith("/") ? base : `/${base}`;
  return comBarra.endsWith("/") ? comBarra : `${comBarra}/`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // process.env tem prioridade (Docker ARG/ENV no build). Arquivo .env e so fallback local.
  const basePath = process.env.VITE_BASE_PATH ?? env.VITE_BASE_PATH;
  const base = normalizarBase(basePath);

  console.info(
    `[vite] base = ${base} (VITE_BASE_PATH=${basePath ?? "(nao definido)"})`,
  );

  return {
    base,
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true,
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@locus": path.resolve(__dirname, "./modules/locus"),
      },
    },
  };
});
