import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { App } from "antd";
import dayjs from "dayjs";
import useListRequest from "../../../../hooks/useListRequest";
import useConvocacao from "../../../Processos/ConvocacaoCandidatos/hooks/useConvocacao";
import { API } from "../../../../services";
import type { Dayjs } from "dayjs";

export interface ICartaConvocacaoForm {
  processo_convocacao: string | undefined;
  data: Dayjs | null;
}

const defaultValues: ICartaConvocacaoForm = {
  processo_convocacao: undefined,
  data: null,
};

export const useCartaConvocacao = () => {
  const { notification } = App.useApp();
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<ICartaConvocacaoForm>({
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

  const handleEnviarForm = async (_data: ICartaConvocacaoForm) => {
    if (!_data.processo_convocacao || !_data.data) {
      notification.error({
        message: "Dados incompletos",
        description: "Selecione o processo de convocação e a data.",
        placement: "top",
        duration: 3.5,
      });
      return;
    }

    const processo_nome =
      processosConvocacaoOptions.find((o) => o.value === _data.processo_convocacao)?.label ?? "";
    const dataFormatada = dayjs(_data.data).format("DD-MM-YYYY");

    try {
      const res = await API.Convocacao.postCartaConvocacao({
        processo_uuid: _data.processo_convocacao,
        processo_nome,
        data: dataFormatada,
      }).response;

      notification.success({
        message: "Envio de e-mails iniciado.",
        placement: "top",
        duration: 3.5,
      });
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        (error as Error)?.message ??
        "Ocorreu um erro ao enviar a carta de convocação. Tente novamente.";
      notification.error({
        message: "Erro ao enviar carta de convocação",
        description: String(msg),
        placement: "top",
        duration: 3.5,
      });
    }
  };

  return {
    control,
    formErrors,
    handleSubmit,
    handleEnviarForm,
    processosConvocacaoOptions,
    processosConvocacaoOptionsIsLoading: processosConvocacaoIsLoading,
  };
};
