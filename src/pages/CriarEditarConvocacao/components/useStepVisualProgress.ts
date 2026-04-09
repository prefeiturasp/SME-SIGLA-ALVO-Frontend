import { useEffect, useMemo, useState } from "react";

export function useStepVisualProgress(params: {
  processoUuid?: string;
  passoAtual: number;
  currentStepIndex: number;
}) {
  const { processoUuid, passoAtual, currentStepIndex } = params;

  const visualStorageKey = useMemo(
    () => (processoUuid ? `convocacao-step-visual:${processoUuid}` : null),
    [processoUuid]
  );
  const completedStorageKey = useMemo(
    () => (processoUuid ? `convocacao-step-completed:${processoUuid}` : null),
    [processoUuid]
  );

  const [persistedVisualStep, setPersistedVisualStep] = useState<number>(() => {
    if (!visualStorageKey || typeof window === "undefined") return 0;
    const saved = Number(window.sessionStorage.getItem(visualStorageKey) ?? "0");
    return Number.isFinite(saved) ? saved : 0;
  });
  const [persistedCompletedStep, setPersistedCompletedStep] = useState<number>(() => {
    if (!completedStorageKey || typeof window === "undefined") return 0;
    const saved = Number(window.sessionStorage.getItem(completedStorageKey) ?? "0");
    return Number.isFinite(saved) ? saved : 0;
  });

  const currentStep = currentStepIndex + 1;

  useEffect(() => {
    if (!visualStorageKey || typeof window === "undefined") return;
    const saved = Number(window.sessionStorage.getItem(visualStorageKey) ?? "0");
    const safeSaved = Number.isFinite(saved) ? saved : 0;
    const nextValue = Math.max(safeSaved, passoAtual, currentStep);
    window.sessionStorage.setItem(visualStorageKey, String(nextValue));
    setPersistedVisualStep(nextValue);
  }, [visualStorageKey, passoAtual, currentStep]);

  useEffect(() => {
    if (!completedStorageKey || typeof window === "undefined") return;
    const savedCompleted = Number(
      window.sessionStorage.getItem(completedStorageKey) ?? "0"
    );
    const safeSavedCompleted = Number.isFinite(savedCompleted) ? savedCompleted : 0;
    const nextCompleted = Math.max(safeSavedCompleted, passoAtual);
    window.sessionStorage.setItem(completedStorageKey, String(nextCompleted));
    setPersistedCompletedStep(nextCompleted);
  }, [completedStorageKey, passoAtual]);

  const markStepCompleted = (stepNumber: number) => {
    if (!completedStorageKey || typeof window === "undefined") return;
    const savedCompleted = Number(
      window.sessionStorage.getItem(completedStorageKey) ?? "0"
    );
    const safeSavedCompleted = Number.isFinite(savedCompleted) ? savedCompleted : 0;
    const nextCompleted = Math.max(safeSavedCompleted, stepNumber);
    window.sessionStorage.setItem(completedStorageKey, String(nextCompleted));
    setPersistedCompletedStep(nextCompleted);
  };

  return {
    passoVisual: Math.max(passoAtual, currentStep, persistedVisualStep),
    completedStep: Math.max(passoAtual, persistedCompletedStep),
    markStepCompleted,
  };
}
