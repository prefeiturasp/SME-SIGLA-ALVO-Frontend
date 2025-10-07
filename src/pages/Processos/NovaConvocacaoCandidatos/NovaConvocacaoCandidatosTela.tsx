import React from "react";
import { Typography, Card, Row, Col, Button } from "antd";

import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { Link, useLocation, useNavigate } from "react-router-dom";

import FormPrincipal from "./components/FormPrincipal";
import Cargo from "./components/Cargo";
import AgendaTela from "./components/Agenda/AgendaTela";
import { useNovaConvocacaoCandidatos } from "./hooks/useNovaConvocacaoCandidatos";
 
const { Text } = Typography;




export const NovaConvocacaoCandidatosTela: React.FC = () => {

  const navigate = useNavigate();

  const breadcrumbItems = [
    {
      title: (
        <Text strong style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Home
        </Text>
      ),
    },
    {
      title: (
        <Text strong style={{ cursor: 'pointer' }} onClick={() => navigate('/processos')}>
          Processos
        </Text>
      ),
    },
    {
      title: (
        <Text strong style={{ cursor: 'pointer' }} onClick={() => navigate('/processos/convocacao')}>
          Convocação de candidatos
        </Text>
      ),
    },
    {
      title: "Nova Convocação",
    },
  ] as TitleItem[];





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
    buscarCargosDoConcursoDesabilitarCargoVagas,
    handleSub,
    setCardData,
    setPodeVisualizarVagas,
    postProcessoConvocacaoMutation,
    dadosVagasNasEscolasPorCargo,
    buscarVagasNasEscolasPorCargo
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
          buscarCargosDoConcursoDesabilitarCargoVagas={buscarCargosDoConcursoDesabilitarCargoVagas}
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
        vagasNasEscolasPorCargo={dadosVagasNasEscolasPorCargo?.vagas || []}
        dres={dadosVagasNasEscolasPorCargo?.dres||[]}// || []}
        buscarVagasNasEscolasPorCargo={buscarVagasNasEscolasPorCargo}
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
