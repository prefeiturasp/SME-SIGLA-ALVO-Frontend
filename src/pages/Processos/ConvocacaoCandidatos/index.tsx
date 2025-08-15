import ProcessosConvocacaoView from "./view/ProcessosConvocacaoView";

import { useProcessosConvocacao } from "./hooks/useProcessosConvocacao";

export default function ProcessosConvocacaoContainer() {
  const {
    concursosOptions,
    concursosIsLoading,
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    listRequest,
    onAntTableChange,
    handleSub,
  } = useProcessosConvocacao();

  return (
    <ProcessosConvocacaoView
      handleSub={handleSub}
      concursosIsLoading={concursosIsLoading}
      concursosOptions={concursosOptions}
      onAntTableChange={onAntTableChange}
      processosConvocacaoData={processosConvocacaoData}
      processosLoading={processosConvocacaoIsLoading}
      listRequest={listRequest}
    />
  );
}
