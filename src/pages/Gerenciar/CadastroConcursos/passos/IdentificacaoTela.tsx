import React, { useEffect, useState } from "react";
import { Steps, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import BaseTela, { type TitleItem } from "../../../Base/BaseTela";
import FormConcurso from "../components/FormConcurso";
import { useConcursoForm } from "../hooks/useConcursoForm";
import { useModoConcurso } from "../hooks/useModoConcurso";
import { usePatchConcurso } from "../hooks/usePatchConcurso";
import { useGetConcursoByUuid } from "../../../GerenciamentoVagas/hooks/useGetConcursoPorUuid";
import { StepActionsConcurso } from "../components/StepActionsConcurso";
import { steps } from "../components/stepsConcurso";
import { useConcursoSteps } from "../components/useConcursoSteps";
import { CHAVE_PASSO_1 } from "../utils/wizardStorage";
import { montarPayloadPasso1 } from "../utils/montarPayloadConcurso";
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

  // Ao adicionar, gera um uuid novo; ao editar, usa o uuid da rota.
  const [uuidGerado] = useState(() => uuidv4());
  const uuidConcurso = isEdicao ? uuidRota : uuidGerado;

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

  // Silencioso: a notificação de sucesso aparece só no último passo.
  const patchConcurso = usePatchConcurso(true);

  const { stepItems, handleStepChange } = useConcursoSteps({
    uuid: uuidConcurso,
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

  const irParaPasso2 = () => {
    navigate(getStepPath(1, uuidConcurso) ?? "/gerenciar/concursos");
  };

  const next = handleSubmit((valores) => {
    if (isEdicao && uuidRota) {
      patchConcurso.mutate(
        { uuid: uuidRota, payload: montarPayloadPasso1(valores) },
        {
          onSuccess: () => irParaPasso2(),
          onError: (error) => {
            const mensagem = obterMensagemNumeroProcessoDuplicado(error);
            if (mensagem) {
              setError("numero_processo", {
                type: "manual",
                message: mensagem,
              });
            }
          },
        }
      );
      return;
    }

    sessionStorage.setItem(CHAVE_PASSO_1, JSON.stringify(valores));
    irParaPasso2();
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
          />

          <StepActionsConcurso
            current={current}
            steps={steps}
            next={next}
            prev={prev}
            onCancel={cancel}
            canAvancar={isValid}
            loading={patchConcurso.isPending}
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default IdentificacaoTela;
