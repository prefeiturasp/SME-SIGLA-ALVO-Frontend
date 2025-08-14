

import ProcessosConvocacaoView from "./ProcessosConvocacaoView";

import { useProcessosConvocacao } from "./hooks/useProcessosConvocacao";
 
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



 

  return (
    <ProcessosConvocacaoView
      concursosOptions={concursosOptions}
      paginationPage={1}
      onSubmit2={handleSub}
      onAntTableChange={onAntTableChange}
       processosData={processosQuery.data}
      processosLoading={concursosIsLoading}
    onReset={handleReset}
    />
  );
}
