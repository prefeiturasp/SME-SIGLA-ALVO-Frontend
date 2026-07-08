import React from "react";
import { Typography, Card, Row, Col } from "antd";

import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { useNavigate } from "react-router-dom";
import { AppButton, BuscaProcessosTitle } from '@/components/ui';

import FormPrincipal from "./components/FormPrincipal";
import Cargo from "./components/Cargo";
import AgendaTela from "./components/Agenda/AgendaTela";
import { useNovaConvocacaoCandidatos } from "./hooks/useNovaConvocacaoCandidatos";
import {
  breadcrumbItemStyle,
  buttonsRowStyle,
  viewModeButtonsContainerStyle,
} from "@/components/ui";
import { mainCardStyle } from "@/components/ui";
 
const { Text } = Typography;




export const NovaConvocacaoCandidatosTela: React.FC = () => {

  const {
    control,
    formErrors,
    handleSubmit,
    watchFields,
    concursosData,
    concursosOptionsIsLoading,
    cargosDisponiveis,
    cardData,
    podeVisualizarVagas,
    isCargoLiberado,
    selectedConcursoLabel,
    selectedConcursoValue,
    selectedCargoLabel,
    popularSelectDeCargos,
    handleSub,
    setCardData,
    setPodeVisualizarVagas,
    postProcessoConvocacaoMutation,
    dadosVagasNasEscolasPorCargo,
    buscarVagasNasEscolasPorCargo,
    isEdit,
    isViewMode
  } = useNovaConvocacaoCandidatos();

  const navigate = useNavigate();

  const breadcrumbItems = [
    {
      title: (
        <Text strong style={breadcrumbItemStyle} onClick={() => navigate('/')}>
          Home
        </Text>
      ),
    },
    {
      title: (
        <Text strong style={breadcrumbItemStyle} onClick={() => navigate('/processos')}>
          Processos
        </Text>
      ),
    },
    {
      title: (
        <Text strong style={breadcrumbItemStyle} onClick={() => navigate('/processos/convocacao')}>
          Convocação de candidatos
        </Text>
      ),
    },
    {
      title: isViewMode ? "Visualizar Convocação" : isEdit ? "Editar Convocação" : "Nova Convocação",
    },
  ] as TitleItem[];



 return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Processo de convocação de candidatos"
    >
      <Card style={mainCardStyle}>
        <BuscaProcessosTitle>Busca Processos</BuscaProcessosTitle>
        <FormPrincipal
          control={control}
          concursosData={concursosData}
          concursosOptionsIsLoading={concursosOptionsIsLoading}
          isCargoLiberado={isCargoLiberado}
          popularSelectDeCargos={popularSelectDeCargos}
          isViewMode={isViewMode}
          formErrors={formErrors}
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
        selectedConcursoValue={selectedConcursoValue}
        selectedCargoLabel={selectedCargoLabel}
        watchFields={watchFields}
        control={control}
        onCandidatosSelecionados={(quantidade, quantidadesIndividuais) => {
          console.log('Candidatos selecionados:', quantidade, quantidadesIndividuais);
        }}
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


      {!isViewMode && (
        <Row justify="end" gutter={16} style={buttonsRowStyle}>
          <Col>
            <AppButton
              variant="secondary"
              size="large"
              onClick={() => navigate('/processos/convocacao')}
            >
              Cancelar
            </AppButton>
          </Col>
          <Col>
            <AppButton
              variant="primary"
              size="large"
              onClick={handleSubmit(handleSub)}
              loading={postProcessoConvocacaoMutation.isPending}
            >
              Salvar
            </AppButton>
          </Col>
        </Row>
      )}

      {isViewMode && (
        <div style={viewModeButtonsContainerStyle}>
          <AppButton
            variant="secondary"
            size="large"
            onClick={() => navigate(-1)}
          >
            Voltar
          </AppButton>
        </div>
      )}
    </BaseTela>
  );
};

export default NovaConvocacaoCandidatosTela;
