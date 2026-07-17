import React, { useEffect } from "react";
import { Steps, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../../Base/BaseTela";
import FormConcurso from "../components/FormConcurso";
import { useConcursoForm } from "../hooks/useConcursoForm";
import { useModoConcurso } from "../hooks/useModoConcurso";
import { usePostConcurso } from "../hooks/usePostConcurso";
import { usePatchConcurso } from "../hooks/usePatchConcurso";
import { useGetConcursoByUuid } from "../../../GerenciamentoVagas/hooks/useGetConcursoPorUuid";
import { StepActionsConcurso } from "../components/StepActionsConcurso";
import { steps } from "../components/stepsConcurso";
import { useConcursoSteps } from "../components/useConcursoSteps";
import {
  montarPayloadPasso1,
  montarPayloadStatus,
} from "../utils/montarPayloadConcurso";
import { obterMensagemNumeroProcessoDuplicado } from "../utils/erroConcurso";
import {
  CardTitle,
  ConvocacaoStepsGlobalStyle,
  StyledCardWithoutBorder,
} from "@/components/ui";

const { Text } = Typography;

const IdentificacaoTela: React.FC = () => {
  const navigate = useNavigate();
  const current = 0;

  const { isEdicao, uuidRota, getStepPath, labelTela } = useModoConcurso();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid },
  } = useConcursoForm();

  const { concursoData: concurso } = useGetConcursoByUuid(
    isEdicao ? uuidRota ?? "" : ""
  );

  useEffect(() => {
    if (isEdicao && concurso) {
      reset({
        cargos_ids: (concurso.cargos ?? []).map((c) => c.uuid),
        nome: concurso.nome,
        numero_processo: concurso.numero_processo ?? "",
        banca_responsavel: concurso.banca_responsavel ?? "",
        status: concurso.status ?? "ATIVO",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdicao, concurso]);

  // Passo 1: no cadastro cria via POST (silencioso); na edição atualiza via
  // PATCH (silencioso). A notificação de sucesso só aparece no último passo.
  const postConcurso = usePostConcurso(true);
  const patchConcurso = usePatchConcurso(true);

  const { stepItems, handleStepChange } = useConcursoSteps({
    uuid: uuidRota,
    currentStepIndex: current,
    onNavigate: (path) => navigate(path),
    getStepPath,
    liberarTodos: isEdicao,
  });

  const breadcrumbItems = [
    { title: <Text strong>Gerenciar</Text> },
    {
      title: (
        <Text
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/gerenciar/concursos")}
        >
          Cadastro de concurso
        </Text>
      ),
    },
    { title: labelTela },
  ] as TitleItem[];

  const irParaPasso2 = (uuid: string) => {
    navigate(getStepPath(1, uuid) ?? "/gerenciar/concursos");
  };

  const tratarErroProcessoDuplicado = (error: unknown) => {
    const mensagem = obterMensagemNumeroProcessoDuplicado(error);
    if (mensagem) {
      setError("numero_processo", { type: "manual", message: mensagem });
    }
  };

  // Concurso EM_ANDAMENTO: só o status é editável neste passo.
  const bloqueado = concurso?.situacao === "EM_ANDAMENTO";

  const next = handleSubmit((valores) => {
    const payload = bloqueado
      ? montarPayloadStatus(valores)
      : montarPayloadPasso1(valores);

    if (isEdicao && uuidRota) {
      patchConcurso.mutate(
        { uuid: uuidRota, payload },
        {
          onSuccess: () => irParaPasso2(uuidRota),
          onError: tratarErroProcessoDuplicado,
        }
      );
      return;
    }

    // Cadastro: cria o concurso (INCOMPLETO) e segue com o UUID do backend.
    postConcurso.mutate(
      { ...payload, situacao: "INCOMPLETO" },
      {
        onSuccess: (data) => irParaPasso2(data.uuid),
        onError: tratarErroProcessoDuplicado,
      }
    );
  });

  const prev = () => {
    navigate("/gerenciar/concursos");
  };

  const cancel = () => {
    navigate("/gerenciar/concursos");
  };

  const opcoesIniciais = (concurso?.cargos ?? []).map((c) => ({
    value: c.uuid,
    label: `${c.codigo} - ${c.nome}`,
  }));

  return (
    <>
      <ConvocacaoStepsGlobalStyle />
      <BaseTela breadcrumbItems={breadcrumbItems} title={labelTela}>
        <StyledCardWithoutBorder variant="borderless">
          <Steps
            className="convocacao-steps"
            current={current}
            items={stepItems}
            onChange={handleStepChange}
          />
        </StyledCardWithoutBorder>

        <StyledCardWithoutBorder
          style={{ marginTop: "1.25rem" }}
          variant="borderless"
        >
          <CardTitle>Identificação do concurso</CardTitle>
          <Text
            type="secondary"
            style={{ display: "block", marginTop: 8, marginBottom: 24 }}
          >
            Informe os dados que identificam o concurso e o processo
            administrativo correspondente.
          </Text>

          <FormConcurso
            control={control}
            erros={errors}
            opcoesIniciais={opcoesIniciais}
            bloqueado={bloqueado}
          />

          <StepActionsConcurso
            current={current}
            steps={steps}
            next={next}
            prev={prev}
            onCancel={cancel}
            canAvancar={isValid}
            loading={postConcurso.isPending || patchConcurso.isPending}
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default IdentificacaoTela;
