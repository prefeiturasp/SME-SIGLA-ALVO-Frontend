import { useNavigate } from "react-router-dom";
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
      handleSub={handleSub}
      handleReset={handleReset}
      concursosIsLoading={concursosIsLoading}
      concursosOptions={concursosOptions}
      paginationPage={1}
      onAntTableChange={onAntTableChange}
      processosConvocacaoData={processosQuery.data}
      processosLoading={processosConvocacaoIsLoading}
      listRequest={listRequest}
    />
  );
}
