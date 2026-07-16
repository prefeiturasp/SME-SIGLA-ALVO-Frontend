import { useLocation, useParams } from "react-router-dom";

const BASE = "/gerenciar/concursos";

/**
 * Resolve o "modo" do wizard de concurso (adicionar vs editar) a partir da
 * rota atual, centralizando as diferenças entre os dois fluxos para que as
 * três telas de passo possam ser reutilizadas em ambos.
 *
 * - **adicionar**: paths sob `/adicionar`, uuid gerado no passo 1.
 * - **editar**: paths sob `/editar/:uuid`, uuid vindo da rota; salva a cada passo.
 */
export const useModoConcurso = () => {
  const { pathname } = useLocation();
  const { uuid: uuidRota } = useParams();

  const isEdicao = pathname.includes("/editar/");

  /**
   * Monta o path de um passo (0-based) respeitando o modo. No fluxo de
   * adicionar, o passo 1 não tem uuid na URL; nos demais, o uuid é necessário.
   */
  const getStepPath = (stepIndex: number, uuid?: string): string | null => {
    if (isEdicao) {
      if (!uuid) return null;
      return `${BASE}/editar/${uuid}/passo-${stepIndex + 1}`;
    }
    if (stepIndex === 0) return `${BASE}/adicionar/passo-1`;
    if (!uuid) return null;
    return `${BASE}/adicionar/${uuid}/passo-${stepIndex + 1}`;
  };

  return {
    isEdicao,
    /** UUID do concurso na edição (undefined ao adicionar). */
    uuidRota,
    getStepPath,
    /** Rótulo da tela (breadcrumb e título). */
    labelTela: isEdicao ? "Editar concurso" : "Adicionar concurso",
    /** Rótulo do botão do último passo. */
    labelBotaoFinal: isEdicao ? "Salvar" : "Adicionar concurso",
  };
};
