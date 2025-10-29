import React, { useState } from "react";
import { Button, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { StyledTabs } from "./styles";
import { CloudDownloadOutlined, EyeOutlined } from "@ant-design/icons";

// Importar os componentes das abas
import Vagas from "./Vagas/VagasFormTab";

import { ButtonGroup } from "../Processos/ConvocacaoCandidatos/style";

import { useLayoutDownload } from "../../hooks/useLayoutDownload";
import HistoricoHabilitadosModal from "./Habilitados/components/HistoricoHabilitadosModal";
import HabilitadosFormTab from "./Habilitados/HabilitadosFormTab";
import VagasForm from "./Vagas/VagasFormTab";
import VagasFormTab from "./Vagas/VagasFormTab";

const { Text } = Typography;

const breadcrumbItems = [
  {
    title: (
      <Link to="/">
        <Text strong>Home</Text>
      </Link>
    ),
  },
  {
    title: (
      <Link to="/processos">
        <Text strong>Processos</Text>
      </Link>
    ),
  },
  { title: "Importação de dados" },
] as TitleItem[];

const ImportacaoDadosTela: React.FC = () => {
  const location = useLocation();
  const tipo = location.state?.tipo;
  const [activeTab, setActiveTab] = useState<string>(tipo || "HABILITADOS");
  const [showHistorico, setShowHistorico] = useState(false);

  const navigate = useNavigate();

  const handleShowHistorico = () => {
    setShowHistorico(true);
  };

  const handleBackFromHistorico = () => {
    setShowHistorico(false);
  };

  const handleShowLayoutPadrao = (tipo: string) => {
    navigate(`/processos/importacao-dados/layout-padrao-${tipo}`);
  };

  const tabItems = [
    
    {
      key: "VAGAS",
      label: "Vagas Escolas",
      children: (
        <VagasFormTab
          onShowLayoutPadrao={() => handleShowLayoutPadrao("VAGAS")}
        />
      ),
    },
    {
      key: "HABILITADOS",
      label: "Habilitados",
      children: (
        <HabilitadosFormTab
          onShowHistorico={handleShowHistorico}
          onShowLayoutPadrao={() => handleShowLayoutPadrao("HABILITADOS")}
        />
      ),
    },
  ];

  const { handleBaixarArquivo, isDownloading } = useLayoutDownload();

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Importação de dados"
      buttons={
        <ButtonGroup>
          <Button
            size="large"
            onClick={() => handleShowLayoutPadrao(activeTab)}
            style={{ color: "#434343" }}
          >
            <EyeOutlined style={{ fontSize: 22, color: "#838383" }} /> Ver
            layout Padrão
          </Button>

          <Button
            size="large"
            onClick={() => handleBaixarArquivo(activeTab)}
            style={{ color: "#434343" }}
          >
            <CloudDownloadOutlined style={{ fontSize: 22, color: "#838383" }} />{" "}
            Baixar layout Padrão
          </Button>
        </ButtonGroup>
      }
    >
      <>
        <StyledTabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
        <HistoricoHabilitadosModal
          onVoltar={handleBackFromHistorico}
          isOpen={showHistorico}
          onClose={() => setShowHistorico(false)}
        />
      </>
    </BaseTela>
  );
};

export default ImportacaoDadosTela;
