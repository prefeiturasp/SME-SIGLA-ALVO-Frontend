import React, { useEffect } from "react";
import { Steps, Typography, App } from "antd";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../../Base/BaseTela";
import FormVigencia from "../components/FormVigencia";
import { useVigenciaForm } from "../hooks/useVigenciaForm";
import type { IVigenciaFormFields } from "../hooks/useVigenciaForm";
import { useModoConcurso } from "../hooks/useModoConcurso";
import { usePostConcurso } from "../hooks/usePostConcurso";
import { usePatchConcurso } from "../hooks/usePatchConcurso";
import { useGetConcursoByUuid } from "../../../GerenciamentoVagas/hooks/useGetConcursoPorUuid";
import { StepActionsConcurso } from "../components/StepActionsConcurso";
import { steps } from "../components/stepsConcurso";
import { useConcursoSteps } from "../components/useConcursoSteps";
import {
  detalheParaPasso3,
  montarPayloadConcurso,
  montarPayloadPasso3,
} from "../utils/montarPayloadConcurso";
import {
  CHAVE_PASSO_3,
  lerPasso1,
  lerPasso2,
  limparWizard,
} from "../utils/wizardStorage";
import { obterMensagemNumeroProcessoDuplicado } from "../utils/erroConcurso";
import {
  CardTitle,
  ConvocacaoStepsGlobalStyle,
  StyledCardWithoutBorder,
} from "@/components/ui";

const { Text } = Typography;

const VigenciaTela: React.FC = () => {
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const current = 2;

  const { isEdicao, uuidRota, getStepPath, labelTela, labelBotaoFinal } =
    useModoConcurso();
  const uuid = uuidRota;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useVigenciaForm();

  const { concursoData: concurso } = useGetConcursoByUuid(
    isEdicao ? uuidRota ?? "" : ""
  );

  useEffect(() => {
    if (isEdicao && concurso) {
      reset(detalheParaPasso3(concurso));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdicao, concurso]);

  const postConcurso = usePostConcurso();
  const patchConcurso = usePatchConcurso();

  const { stepItems, handleStepChange } = useConcursoSteps({
    uuid,
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

  // Edição: PATCH parcial do passo 3 e volta à listagem.
  const salvarEdicao = (passo3: IVigenciaFormFields) => {
    if (!uuidRota) return;
    patchConcurso.mutate(
      { uuid: uuidRota, payload: montarPayloadPasso3(passo3) },
      { onSuccess: () => navigate("/gerenciar/concursos") }
    );
  };

  // Adição: monta o payload completo dos 3 passos e faz o POST único.
  const finalizarCadastro = (passo3: IVigenciaFormFields) => {
    sessionStorage.setItem(CHAVE_PASSO_3, JSON.stringify(passo3));

    const passo1 = lerPasso1();
    const passo2 = lerPasso2();

    if (!passo1 || !passo2) {
      notification.error({
        message: "Cadastro incompleto",
        description:
          "Alguns dados do concurso não foram encontrados. " +
          "Recomece o cadastro do início.",
        placement: "top",
        duration: 3.5,
      });
      navigate("/gerenciar/concursos/adicionar/passo-1");
      return;
    }

    const payload = montarPayloadConcurso(passo1, passo2, passo3);

    postConcurso.mutate(payload, {
      onSuccess: () => {
        limparWizard();
        navigate("/gerenciar/concursos");
      },
      onError: (error) => {
        const mensagem = obterMensagemNumeroProcessoDuplicado(error);
        if (mensagem) {
          notification.error({
            message: "Erro ao cadastrar",
            description: mensagem,
            placement: "top",
            duration: 3.5,
          });
        }
      },
    });
  };

  const next = handleSubmit(isEdicao ? salvarEdicao : finalizarCadastro);

  const prev = () => {
    navigate(getStepPath(1, uuid) ?? "/gerenciar/concursos");
  };

  const cancel = () => {
    if (!isEdicao) limparWizard();
    navigate("/gerenciar/concursos");
  };

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
          <CardTitle>Vigência</CardTitle>
          <Text
            type="secondary"
            style={{ display: "block", marginTop: 8, marginBottom: 24 }}
          >
            Informe as datas que definem a validade e a vigência do concurso.
          </Text>

          <FormVigencia control={control} erros={errors} />

          <StepActionsConcurso
            current={current}
            steps={steps}
            next={next}
            prev={prev}
            onCancel={cancel}
            canAvancar={isValid}
            loading={postConcurso.isPending || patchConcurso.isPending}
            labelFinal={labelBotaoFinal}
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default VigenciaTela;
