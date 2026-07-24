import { useMemo } from "react";
import { items } from "./stepsConcurso";

type UseConcursoStepsParams = {
  uuid?: string;
  currentStepIndex: number;
  onNavigate: (path: string) => void;
  getStepPath: (stepIndex: number, uuid?: string) => string | null;
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
