import React, { useState } from "react";
import { Typography, Card, Row, Col, Button } from "antd";

import BaseScreen, { type TitleItem } from "../../BaseScreen";
import { useForm, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";

import { useConcursos } from "./hooks/useConcursos";
import type { IConvocacaoFiltros } from "../../../services/resources/convocacao/IConvocacao";
import FormPrincipal from "./components/FormPrincipal";
import Cargo from "./components/Cargo";
import AgendaTela from "./components/Agenda/AgendaTela";

const { Text } = Typography;


const breadcrumbItems = [
  { title: <Link to="/"><Text strong>Home</Text></Link> },
  { title: <Link to="/processos"><Text strong>Processos</Text></Link> },
  { title: <Link to="/processos/convocacao"><Text strong>Convocação de candidatos</Text></Link> },
  { title: "Nova Convocação" },
] as TitleItem[];

type ConcursoOption = {
  value: string;
  label: string;
  cargos?: { value: string; label: string }[];
};

type FormFields = {
  concurso: string;
  tipo_processo: string;
  descricao: string;
  cargo: string;
  data_convocacao: string;
  data_corte_vagas: string;
};

export const NovaConvocacaoCandidatos: React.FC = () => {
  const { concursosData, concursosIsLoading } = useConcursos();

  const { control, reset } = useForm<FormFields>({
    defaultValues: {
      concurso: undefined,
      tipo_processo: undefined,
      descricao: undefined,
      cargo: "",
      data_convocacao: "",
      data_corte_vagas: "",
    },
  });

  const watchFields = useWatch({ control });

  const isCargoLiberado = watchFields.concurso;
  const [cargosDisponiveis, setCargosDisponiveis] = useState<
    { value: string; label: string }[]
  >([]);
  const [cardData, setCardData] = useState({
    vagas: 0,
    autorizacoes: 0,
    reservas: 0,
    convocar: 0,
  });
  const [cargoSelecionado, setCargoSelecionado] = useState<
    string | undefined
  >();
  const [podeVisualizarVagas, setPodeVisualizarVagas] = useState(false);
  const buscarCargosDoConcurso = (concursoValue: string) => {
    if (!concursoValue) {
      setCargosDisponiveis([]);
      return;
    }

    const concursoSelecionado = ((concursosData as unknown as ConcursoOption[]) || []).find(
      (c: ConcursoOption) => c.value === concursoValue,
    );

    if (concursoSelecionado && concursoSelecionado.cargos) {
      setCargosDisponiveis(concursoSelecionado.cargos);
    }

    setCargoSelecionado(undefined);
    setPodeVisualizarVagas(false);

    setCardData({
      vagas: 0,
      autorizacoes: 0,
      reservas: 0,
      convocar: 0,
    });
  };

  const handleSub = (data: FormFields) => {
    console.log("Enviando dados para o backend:", {
      ...data,
      page: 1,
      page_size: 10,
    });
  };

  const handleReset = () => {
    reset({
      concurso: "",
      tipo_processo: "",
      descricao: "",
      cargo: "",
      data_convocacao: "",
      data_corte_vagas: "",
    });
    setCargoSelecionado(undefined);
    setCargosDisponiveis([]);
    setPodeVisualizarVagas(false);
  };

  // Labels selecionados para concurso e cargo
  const selectedConcursoLabel =
    ((concursosData as unknown as ConcursoOption[]) || []).find(
      (opt) => opt.value === watchFields.concurso,
    )?.label || "";

  const selectedCargoLabel =
    (cargosDisponiveis || []).find((opt) => opt.value === watchFields.cargo)?.label || "";

  return (
    <BaseScreen
      breadcrumbItems={breadcrumbItems}
      title="Processo de convocação de candidatos"
    >
      <Card style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: 24 }}>
        <Typography.Title level={4} style={{ margin: "0 0 1rem 0" }}>
          Busca Processos
        </Typography.Title>
        <FormPrincipal
          control={control}
          concursosData={((concursosData as unknown as ConcursoOption[]) || [])}
          concursosIsLoading={concursosIsLoading}
          isCargoLiberado={isCargoLiberado}
          buscarCargosDoConcurso={buscarCargosDoConcurso}
        />
      </Card>

      <Cargo
        isCargoLiberado={isCargoLiberado as any}
        cargosDisponiveis={cargosDisponiveis}
        cardData={cardData}
        setCardData={setCardData}
        podeVisualizarVagas={podeVisualizarVagas}
        setPodeVisualizarVagas={setPodeVisualizarVagas}
        selectedConcursoLabel={selectedConcursoLabel}
        selectedCargoLabel={selectedCargoLabel}
        watchFields={watchFields}
        control={control}
        agendaComponent={
          <AgendaTela 
            cargosDisponiveis={cargosDisponiveis}
            watchFields={watchFields}
          />
        }
      />


      <Row justify="end" gutter={16} style={{ marginTop: 24 }}>
        <Col>
          <Button type="primary" ghost size="large">
            Cancelar
          </Button>
        </Col>
        <Col>
          <Button type="primary" size="large">
            Salvar
          </Button>
        </Col>
      </Row>
    </BaseScreen>
  );
};

export default NovaConvocacaoCandidatos;
