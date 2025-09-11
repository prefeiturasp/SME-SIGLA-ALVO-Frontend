import React, { useState } from "react";
import { Typography } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";
import BaseScreen, { type TitleItem } from "../../BaseScreen";
import {
  StyledTabs,
} from "./styles";

// Importar os componentes das abas
import Vagas from "./Vagas";
import VagasSistemaIngresso from "./VagasSistemaIngresso";
import Habilitados from "./Habilitados";
import EscolhasEOL from "./EscolhasEOL";
import Historico from "./Habilitados/components/Historico";
import LayoutPadrao from "./Habilitados/components/LayoutPadrao";

const { Text } = Typography;

const breadcrumbItems = [
  { title: <Link to="/"><Text strong>Home</Text></Link> },
  { title: <Link to="/processos"><Text strong>Processos</Text></Link> },
  { title: "Importação de dados" },
] as TitleItem[];

const ImportacaoDados: React.FC = () => {
  const [activeTab, setActiveTab] = useState("vagas");
  const [showHistorico, setShowHistorico] = useState(false);
  const [showLayoutPadrao, setShowLayoutPadrao] = useState(false);
   
  const navigate = useNavigate();


  const handleShowHistorico = () => {
    setShowHistorico(true);
  };

  const handleBackFromHistorico = () => {
    setShowHistorico(false);
  };

  const handleShowLayoutPadrao = () => {
    setShowLayoutPadrao(true);
  };

  const handleShowLayoutPadraoVagas = () => {    
    navigate('/processos/importacao-dados/layout-padrao-vagas')
  };


  const handleBackFromLayoutPadrao = () => {
    setShowLayoutPadrao(false);
  };

  const tabItems = [
    {
      key: "vagas",
      label: "Vagas",
      children: <Vagas
          onShowHistorico={handleShowHistorico}
          onShowLayoutPadrao={handleShowLayoutPadraoVagas}
      />,
    },
    {
      key: "vagas-sistema",
      label: "Vagas - Sistema de ingresso",
      children: <VagasSistemaIngresso />,
    },
    {
      key: "fundacao",
      label: "Habilitados",
      children: <Habilitados 
        onShowHistorico={handleShowHistorico}
        onShowLayoutPadrao={handleShowLayoutPadrao}
      />,
    },
    {
      key: "escolhas-eol",
      label: "Escolhas EOL",
      children: <EscolhasEOL />,
    },
  ];

  // Se estiver mostrando o histórico, renderiza apenas o componente Histórico
  if (showHistorico) {
    return (
      <BaseScreen
        breadcrumbItems={breadcrumbItems}
        title="Importação de dados"
      >
        <Historico onVoltar={handleBackFromHistorico} />
      </BaseScreen>
    );
  }

  // Se estiver mostrando o layout padrão, renderiza apenas o componente LayoutPadrao
  if (showLayoutPadrao) {
    return (
      <BaseScreen
        breadcrumbItems={breadcrumbItems}
        title="Importação de dados"
      >
        <LayoutPadrao onVoltar={handleBackFromLayoutPadrao} />
      </BaseScreen>
    );
  }

  

  return (
    <BaseScreen
      breadcrumbItems={breadcrumbItems}
      title="Importação de dados"
    >
      <StyledTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </BaseScreen>
  );
};

export default ImportacaoDados;