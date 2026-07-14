import { useMemo } from "react";
import { items } from "./stepsConcurso";

type UseConcursoStepsParams = {
  /** UUID do concurso "criado" no passo 1. Ausente enquanto no passo 1. */
  uuid?: string;
  /** Índice 0-based do passo atual. */
  currentStepIndex: number;
  onNavigate: (path: string) => void;
};

/**
 * Monta os itens do stepper de cadastro de concurso e a lógica de navegação
 * entre passos. Espelha o comportamento visual de useConvocacaoSteps, porém
 * sem dependência de progresso vindo do backend: enquanto não existe um uuid
 * (passo 1), os passos 2 e 3 ficam bloqueados; após o uuid, todos os passos
 * ficam navegáveis.
 */
export function useConcursoSteps(params: UseConcursoStepsParams) {
  const { uuid, currentStepIndex, onNavigate } = params;

  const getStepPath = (stepIndex: number): string | null => {
    if (stepIndex === 0) return "/gerenciar/concursos/adicionar/passo-1";
    if (!uuid) return null;
    if (stepIndex === 1)
      return `/gerenciar/concursos/adicionar/${uuid}/passo-2`;
    return `/gerenciar/concursos/adicionar/${uuid}/passo-3`;
  };

  const stepItems = useMemo(
    () =>
      items.map((item, index) => {
        const isLocked = !uuid && index > 0;
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
    [uuid, currentStepIndex]
  );

  const handleStepChange = (nextStep: number) => {
    if (!uuid && nextStep > 0) return;
    const nextPath = getStepPath(nextStep);
    if (nextPath) onNavigate(nextPath);
  };

  return {
    stepItems,
    handleStepChange,
  };
}
