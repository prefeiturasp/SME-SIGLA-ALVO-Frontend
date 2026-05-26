import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { App } from "antd";
import useListRequest from "../../../../hooks/useListRequest";
import useConvocacao from "../../../Processos/ConvocacaoCandidatos/hooks/useConvocacao";
// import { API } from "../../../../services";
import usePostEnvioEmail from "./usePostEnvioEmail";

export type TipoEnvio = "CONVOCACAO" | "VAGAS" | "RESULTADOS";

export interface IEnvioEmailsForm {
  processo_convocacao?: string;
  tipo?: TipoEnvio;
  conteudo: string;
}

const defaultValues: IEnvioEmailsForm = {
  processo_convocacao: undefined,
  tipo: undefined,
  conteudo: "",
};

export const useEnvioEmails = () => {
  const { notification } = App.useApp();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<IEnvioEmailsForm>({
    defaultValues,
    mode: "onChange",
  });

  const { listRequest: paramsProcessosConvocacao } = useListRequest<{}>({
    pagination: { page: 1, page_size: 100 },
  });
  const { processosConvocacaoData, processosConvocacaoIsLoading } =
    useConvocacao(paramsProcessosConvocacao);

  const processosConvocacaoOptions = useMemo(() => {
    if (!processosConvocacaoData?.results) {
      return [];
    }
    return processosConvocacaoData.results.map((processo: { uuid: string; descricao: string }) => ({
      value: processo.uuid,
      label: processo.descricao,
    }));
  }, [processosConvocacaoData]);

  const postEnvioEmailMutation = usePostEnvioEmail();

  const handleEnviarForm = async (data: IEnvioEmailsForm) => {
    if (!data.processo_convocacao || !data.tipo) {
      notification.error({
        message: "Dados incompletos",
        description: "Selecione o processo de convocação e o tipo.",
        placement: "top",
        duration: 3.5,
      });
      return;
    }

    const processo_nome =
      processosConvocacaoOptions.find((o) => o.value === data.processo_convocacao)?.label ?? "";

    await postEnvioEmailMutation.mutateAsync({
      processo_uuid: data.processo_convocacao,
      processo_nome,
      tipo: data.tipo,
      conteudo: data.conteudo || "",
    });
  };

  return {
    control,
    handleSubmit,
    handleEnviarForm,
    processosConvocacaoOptions,
    processosConvocacaoIsLoading,
    formErrors,
    watch,
    setValue,
  };
};

export default useEnvioEmails;

