import { useState } from "react";
import {
  defaultValues,
  useProcessosConvocacaoForm,
} from "./hooks/useProcessosConvocacaoForm";
import { useProcessosConvocacaoData } from "./hooks/useProcessosConvocacaoData";
import ProcessosConvocacaoView from "./ProcessosConvocacaoView";
import type { IFiltroProcessos } from "../../services/resources/convocacao/IConvocacao";
import { useNavigate } from "react-router-dom";
import { useProcessosConvocacao } from "./hooks/useProcessosConvocacao";
import { vi } from "vitest";

export default function ProcessosConvocacaoContainer() {
  const {
    control,
    handleSubmit,
    formErrors,
    concursosOptions,
    concursosIsLoading,
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    listRequest,
    onAntTableChange,
    handleSub,
    handleReset,
    form,
    concursosQuery,
    processosQuery,
  } = useProcessosConvocacao();



  const mockLogin = vi.fn((email, password) => {
    return Promise.resolve({ email, password });
  });

  return (
    <ProcessosConvocacaoView
      concursosOptions={concursosOptions}
      paginationPage={1}
      onSubmit2={handleSub}
      onAntTableChange={onAntTableChange}
      login={mockLogin}
      processosData={processosQuery.data}
      processosLoading={concursosIsLoading}
    onReset={handleReset}
    />
  );
}
