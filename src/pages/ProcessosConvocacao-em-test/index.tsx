import { useState } from "react";
import { defaultValues, useProcessosConvocacaoForm } from "./hooks/useProcessosConvocacaoForm";
import { useProcessosConvocacaoData } from "./hooks/useProcessosConvocacaoData";
import ProcessosConvocacaoView from "./view";
import type { IFiltroProcessos } from "../../services/resources/convocacao/IConvocacao";

export default function ProcessosConvocacaoContainer() {
  const form = useProcessosConvocacaoForm();
  const [filters, setFilters] = useState<IFiltroProcessos>(defaultValues);
  const { concursosQuery, processosQuery } = useProcessosConvocacaoData(filters);

  const handleSub = (data: IFiltroProcessos) => setFilters(data);
  const handleReset = () => {
    form.reset(defaultValues);
    setFilters(defaultValues);
  };

  
  return (
    <ProcessosConvocacaoView
      form={form}
      concursosQuery={concursosQuery}
      processosQuery={processosQuery}
      onSubmit={handleSub}
      onReset={handleReset}
    />
  );
}
