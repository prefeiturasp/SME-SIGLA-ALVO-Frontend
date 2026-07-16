import { useMemo } from "react";
import { items } from "./stepsConcurso";

type UseConcursoStepsParams = {
  /** UUID do concurso. Ausente enquanto no passo 1 do fluxo de adicionar. */
  uuid?: string;
  /** Índice 0-based do passo atual. */
  currentStepIndex: number;
  onNavigate: (path: string) => void;
  /**
   * Monta o path de um passo respeitando o modo (adicionar/editar).
   * Fornecido por `useModoConcurso`.
   */
  getStepPath: (stepIndex: number, uuid?: string) => string | null;
  /**
   * Quando true, todos os passos ficam desbloqueados (edição — o concurso já
   * existe). Quando false, os passos 2/3 dependem do uuid (adicionar).
   */
  liberarTodos?: boolean;
};

export function useConcursoSteps(params: UseConcursoStepsParams) {
  const {
    uuid,
    currentStepIndex,
    onNavigate,
    getStepPath,
    liberarTodos = false,
  } = params;

  const stepItems = useMemo(
    () =>
      items.map((item, index) => {
        const isLocked = !liberarTodos && !uuid && index > 0;
        const isVisited = !isLocked && index < currentStepIndex;

        return {
          ...item,
          disabled: isLocked,
          status: index < currentStepIndex ? ("finish" as const) : undefined,
          className: isLocked
            ? "step-locked"
            : isVisited
              ? "step-visited"
              : undefined,
        };
      }),
    [uuid, currentStepIndex, liberarTodos]
  );

  const handleStepChange = (nextStep: number) => {
    if (!liberarTodos && !uuid && nextStep > 0) return;
    const nextPath = getStepPath(nextStep, uuid);
    if (nextPath) onNavigate(nextPath);
  };

  return {
    stepItems,
    handleStepChange,
  };
}
