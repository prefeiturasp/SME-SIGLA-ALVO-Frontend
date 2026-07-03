import React, { useEffect, useState } from "react";
import { Button, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { StyledCardWithoutBorder } from "../../../components/EstilosCompartilhados";
import FormConcurso from "./components/FormConcurso";
import { useConcursoForm } from "./hooks/useConcursoForm";
import { usePostConcurso } from "./hooks/usePostConcurso";
import { usePatchConcurso } from "./hooks/usePatchConcurso";
import { useGetConcursoByUuid } from "../../GerenciamentoVagas/hooks/useGetConcursoPorUuid";

const { Text } = Typography;

const AdicionarEditarConcursoTela: React.FC = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const isEdicao = Boolean(uuid);
  const [carregado, setCarregado] = useState(!isEdicao);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useConcursoForm();

  const { concursoData: concurso } = useGetConcursoByUuid(uuid ?? "");

  useEffect(() => {
    if (concurso) {
      reset({
        cargos_ids: (concurso.cargos ?? []).map((c) => c.uuid),
        nome: concurso.nome,
        numero_processo: concurso.numero_processo ?? "",
        ano_edital: concurso.ano_edital ?? new Date().getFullYear(),
        banca_responsavel: concurso.banca_responsavel ?? "",
        status: concurso.status ?? "ATIVO",
      });
      setCarregado(true);
    }
  }, [concurso, reset]);

  const postConcurso = usePostConcurso();
  const patchConcurso = usePatchConcurso();

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
    { title: isEdicao ? "Editar concurso" : "Adicionar concurso" },
  ] as TitleItem[];

  const onSubmit = handleSubmit((valores) => {
    const payload = {
      nome: valores.nome,
      cargos_ids: valores.cargos_ids,
      numero_processo: valores.numero_processo,
      ano_edital: valores.ano_edital,
      banca_responsavel: valores.banca_responsavel,
      status: valores.status,
    };

    if (isEdicao && uuid) {
      patchConcurso.mutate(
        { uuid, payload },
        { onSuccess: () => navigate("/gerenciar/concursos") }
      );
    } else {
      postConcurso.mutate(payload, {
        onSuccess: () => navigate("/gerenciar/concursos"),
      });
    }
  });

  const opcoesIniciais = (concurso?.cargos ?? []).map((c) => ({
    value: c.uuid,
    label: `${c.codigo} - ${c.nome}`,
  }));

  const salvando = postConcurso.isPending || patchConcurso.isPending;
  const submitDesabilitado = isEdicao
    ? !isDirty || !isValid || salvando
    : !isValid || salvando;

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title={isEdicao ? "Editar concurso" : "Adicionar concurso"}
    >
      <StyledCardWithoutBorder>
        <Typography.Title level={5}>
          {isEdicao
            ? "Altere as informações do concurso"
            : "Adicione um novo concurso"}
        </Typography.Title>
        <Text type="secondary">
          {isEdicao
            ? "Altere as informações necessárias."
            : "Preencha as informações para adicionar um novo concurso."}
        </Text>

        {carregado && (
          <FormConcurso
            control={control}
            erros={errors}
            opcoesIniciais={opcoesIniciais}
          />
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 16,
          }}
        >
          <Button onClick={() => navigate("/gerenciar/concursos")}>
            Voltar
          </Button>
          <Button
            type="primary"
            disabled={submitDesabilitado}
            loading={salvando}
            onClick={onSubmit}
          >
            {isEdicao ? "Salvar" : "Adicionar concurso"}
          </Button>
        </div>
      </StyledCardWithoutBorder>
    </BaseTela>
  );
};

export default AdicionarEditarConcursoTela;
