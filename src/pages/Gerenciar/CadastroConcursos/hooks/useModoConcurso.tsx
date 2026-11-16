import { useLocation, useParams } from "react-router-dom";

const BASE = "/gerenciar/concursos";

export const ROTA_LISTAGEM_CONCURSOS = BASE;

export interface IEstadoNavegacaoConcurso {
  houveAlteracao?: boolean;
}

export const seHouveAlteracao = (state: unknown): boolean => {
  return Boolean((state as IEstadoNavegacaoConcurso | null)?.houveAlteracao);
};

export const opcoesNavegacaoConcurso = (
  houveAlteracao: boolean
): { state: IEstadoNavegacaoConcurso } => ({
  state: { houveAlteracao },
});

export const useModoConcurso = () => {
  const { pathname } = useLocation();
  const { uuid: uuidRota } = useParams();

  const isEdicao = pathname.includes("/editar/");

  const getStepPath = (stepIndex: number, uuid?: string): string | null => {
    if (isEdicao) {
      if (!uuid) return null;
      return `${BASE}/editar/${uuid}/passo-${stepIndex + 1}`;
    }
    if (!uuid) {
      return stepIndex === 0 ? `${BASE}/adicionar/passo-1` : null;
    }
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
