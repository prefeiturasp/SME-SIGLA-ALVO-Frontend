import { useMemo } from "react";
import { items } from "./StepsNames";
import { useStepVisualProgress } from "./useStepVisualProgress";

type UseConvocacaoStepsParams = {
  uuid?: string;
  currentStepIndex: number;
  passoAtualBackend?: number;
  hasEdits?: boolean;
  isLoading?: boolean;
  lockFutureStepsWithoutUuid?: boolean;
  onUnsavedChangesWarning?: () => void;
  onNavigate: (path: string) => void;
};

export function useConvocacaoSteps(params: UseConvocacaoStepsParams) {
  const {
    uuid,
    currentStepIndex,
    passoAtualBackend,
    hasEdits = false,
    isLoading = false,
    lockFutureStepsWithoutUuid = false,
    onUnsavedChangesWarning,
    onNavigate,
  } = params;

  const passoAtual = Number(passoAtualBackend ?? 1);
  const { passoVisual, completedStep, markStepCompleted } = useStepVisualProgress({
    processoUuid: uuid,
    passoAtual,
    currentStepIndex,
  });

  const maxStepPermitido = Math.min(3, Math.max(currentStepIndex, passoAtual));

  const stepItems = useMemo(
    () =>
      items.map((item, index) => {
        const isLockedByProgress = index > maxStepPermitido;
        const isLockedByMissingUuid = lockFutureStepsWithoutUuid && !uuid && index > 0;
        const isLocked = isLockedByProgress || isLockedByMissingUuid;
        const isVisited = !isLocked && index <= passoVisual - 1;

        return {
          ...item,
          disabled: isLocked,
          status: index + 1 <= completedStep ? ("finish" as const) : undefined,
          className: isLocked ? "step-locked" : isVisited ? "step-visited" : undefined,
        };
      }),
    [maxStepPermitido, lockFutureStepsWithoutUuid, uuid, passoVisual, completedStep]
  );

  const getStepPath = (stepIndex: number) => {
    if (!uuid) return null;
    if (stepIndex === 0) return `/processos/convocacao/editar/${uuid}/dados-processo`;
    if (stepIndex === 1) return `/processos/convocacao/editar/${uuid}/selecao-cargos`;
    if (stepIndex === 2) return `/processos/convocacao/editar/${uuid}/agenda`;
    return `/processos/convocacao/editar/${uuid}/resumo`;
  };

  const handleStepChange = (nextStep: number) => {
    const isBlockedByProgress = nextStep > maxStepPermitido;
    const isBlockedByMissingUuid =
      lockFutureStepsWithoutUuid && !uuid && nextStep > 0;
    if (isBlockedByProgress || isBlockedByMissingUuid) return;
    if (isLoading) return;
    if (hasEdits) {
      onUnsavedChangesWarning?.();
      return;
    }
    const nextPath = getStepPath(nextStep);
    if (nextPath) onNavigate(nextPath);
  };

  return {
    passoAtual,
    stepItems,
    handleStepChange,
    markStepCompleted,
  };
}
