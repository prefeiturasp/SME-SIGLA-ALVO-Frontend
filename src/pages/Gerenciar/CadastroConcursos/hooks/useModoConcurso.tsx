import { useLocation, useParams } from "react-router-dom";

const BASE = "/gerenciar/concursos";

export const useModoConcurso = () => {
  const { pathname } = useLocation();
  const { uuid: uuidRota } = useParams();

  const isEdicao = pathname.includes("/editar/");

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
    uuidRota,
    getStepPath,
    labelTela: isEdicao ? "Editar concurso" : "Adicionar concurso",
    labelBotaoFinal: isEdicao ? "Salvar" : "Adicionar concurso",
  };
};
