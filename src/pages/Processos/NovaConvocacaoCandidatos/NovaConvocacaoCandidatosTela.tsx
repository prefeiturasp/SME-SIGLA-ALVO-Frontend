import React from "react";
import { Typography, Card, Row, Col, Button } from "antd";

import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { Link } from "react-router-dom";

import FormPrincipal from "./components/FormPrincipal";
import Cargo from "./components/Cargo";
import AgendaTela from "./components/Agenda/AgendaTela";
import { useNovaConvocacaoCandidatos } from "./hooks/useNovaConvocacaoCandidatos";

const { Text } = Typography;


const breadcrumbItems = [
  { title: <Link to="/"><Text strong>Home</Text></Link> },
  { title: <Link to="/processos"><Text strong>Processos</Text></Link> },
  { title: <Link to="/processos/convocacao"><Text strong>Convocação de candidatos</Text></Link> },
  { title: "Nova Convocação" },
] as TitleItem[];

export const NovaConvocacaoCandidatosTela: React.FC = () => {
  const {
    control,
    handleSubmit,
    watchFields,
    concursosData,
    concursosOptionsIsLoading,
    cargosDisponiveis,
    cardData,
    podeVisualizarVagas,
    isCargoLiberado,
    selectedConcursoLabel,
    selectedCargoLabel,
    buscarCargosDoConcurso,
    handleSub,
    setCardData,
    setPodeVisualizarVagas,
    postProcessoConvocacaoMutation,
  } = useNovaConvocacaoCandidatos();

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Processo de convocação de candidatos"
    >
      <Card style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: 24 }}>
        <Typography.Title level={4} style={{ margin: "0 0 1rem 0" }}>
          Busca Processos
        </Typography.Title>
        <FormPrincipal
          control={control}
          concursosData={concursosData}
          concursosOptionsIsLoading={concursosOptionsIsLoading}
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
          <Button 
            type="primary" 
            size="large"
            onClick={handleSubmit(handleSub)}
            loading={postProcessoConvocacaoMutation.isPending}
          >
            Salvar
          </Button>
        </Col>
      </Row>
    </BaseTela>
  );
};

export default NovaConvocacaoCandidatosTela;
