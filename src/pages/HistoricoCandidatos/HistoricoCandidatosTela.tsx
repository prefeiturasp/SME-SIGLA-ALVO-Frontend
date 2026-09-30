import React from "react";
import { Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import {
  AppButton,
  BuscaProcessosTitle,
  ConteudoPagina,
  PageContainer,
  SearchTableContainer,
  TextSubTituloCinza,
} from "@/components/ui";
import TabelaHistoricoCandidatos from "./components/TabelaHistoricoCandidatos";
import { useHistoricoCandidatos } from "./hooks/useHistoricoCandidatos";

const { Text } = Typography;

export type HistoricoCandidatosLocationState = {
  processos_uuids?: string[];
};

const HistoricoCandidatosTela: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { processos_uuids: processosUuids = [] } =
    (location.state ?? {}) as HistoricoCandidatosLocationState;

  const { linhas, carregando } = useHistoricoCandidatos(processosUuids);

  const breadcrumbItems = [
    {
      title: (
        <Link to="/processos">
          <Text strong>Processos</Text>
        </Link>
      ),
    },
    {
      title: (
        <Link to="/processos/convocacao">
          <Text strong>Convocação de candidatos</Text>
        </Link>
      ),
    },
    { title: "Histórico de candidatos" },
  ] as TitleItem[];

  return (
    <PageContainer data-processos-count={processosUuids.length}>
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Histórico de candidatos"
        buttons={
          <AppButton
            variant="secondary"
            size="large"
            onClick={() => navigate("/processos/convocacao")}
          >
            Voltar
          </AppButton>
        }
      >
        <ConteudoPagina>
          <BuscaProcessosTitle>Histórico de convocações</BuscaProcessosTitle>
          <TextSubTituloCinza style={{ marginBottom: "1.5rem" }}>
            Consulte o histórico de convocações por categoria: “Total”, “Geral”,
            “PCD” e “NNA”. Cada linha representa uma convocação, exibida da mais
            antiga para a mais recente.
          </TextSubTituloCinza>
          <SearchTableContainer>
            <TabelaHistoricoCandidatos
              data={linhas}
              loading={carregando}
              mostrarDescricao={true}
            />
          </SearchTableContainer>
        </ConteudoPagina>
      </BaseTela>
    </PageContainer>
  );
};

export default HistoricoCandidatosTela;
