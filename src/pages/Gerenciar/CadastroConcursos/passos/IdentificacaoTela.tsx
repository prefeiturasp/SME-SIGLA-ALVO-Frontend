import React, { useEffect } from "react";
import { Steps, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../../Base/BaseTela";
import FormConcurso from "../components/FormConcurso";
import { useConcursoForm } from "../hooks/useConcursoForm";
import {
  seHouveAlteracao,
  opcoesNavegacaoConcurso,
  ROTA_LISTAGEM_CONCURSOS,
  useModoConcurso,
} from "../hooks/useModoConcurso";
import { usePostConcurso } from "../hooks/usePostConcurso";
import { usePatchConcurso } from "../hooks/usePatchConcurso";
import { useGetConcursoByUuid } from "../../../GerenciamentoVagas/hooks/useGetConcursoPorUuid";
import { StepActionsConcurso } from "../components/StepActionsConcurso";
import { steps } from "../components/stepsConcurso";
import { useConcursoSteps } from "../components/useConcursoSteps";
import {
  detalheParaPasso1,
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
  const { state } = useLocation();
  const houveAlteracaoAnterior = seHouveAlteracao(state);
  const current = 0;

  const { isEdicao, uuidRota, getStepPath, labelTela } = useModoConcurso();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isDirty },
  } = useConcursoForm();

  const { concursoData: concurso } = useGetConcursoByUuid(uuidRota ?? "");

  useEffect(() => {
    if (concurso) {
      reset(detalheParaPasso1(concurso));
    }

  }, [concurso]);

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
          Cadastro de concursos
        </Text>
      ),
    },
    { title: labelTela },
  ] as TitleItem[];

  const irParaPasso2 = (uuid: string, houveAlteracao: boolean) => {
    navigate(
      getStepPath(1, uuid) ?? "/gerenciar/concursos",
      opcoesNavegacaoConcurso(houveAlteracao)
    );
  };

  const tratarErroProcessoDuplicado = (error: unknown) => {
    const mensagem = obterMensagemNumeroProcessoDuplicado(error);
    if (mensagem) {
      setError("numero_processo", { type: "manual", message: mensagem });
    }
  };

  const bloqueado = concurso?.situacao === "EM_ANDAMENTO";

  const next = handleSubmit((valores) => {
    const payload = bloqueado
      ? montarPayloadStatus(valores)
      : montarPayloadPasso1(valores);

    if (uuidRota) {
      if (!isDirty) {
        irParaPasso2(uuidRota, houveAlteracaoAnterior);
        return;
      }

      patchConcurso.mutate(
        { uuid: uuidRota, payload },
        {
          onSuccess: () => irParaPasso2(uuidRota, true),
          onError: tratarErroProcessoDuplicado,
        }
      );
      return;
    }

    postConcurso.mutate(
      { ...payload, situacao: "INCOMPLETO" },
      {
        onSuccess: (data) => irParaPasso2(data.uuid, houveAlteracaoAnterior),
        onError: tratarErroProcessoDuplicado,
      }
    );
  });

  const prev = () => {
    if (uuidRota) {
      navigate(
        ROTA_LISTAGEM_CONCURSOS,
        opcoesNavegacaoConcurso(houveAlteracaoAnterior)
      );
      return;
    }
    navigate(ROTA_LISTAGEM_CONCURSOS);
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
