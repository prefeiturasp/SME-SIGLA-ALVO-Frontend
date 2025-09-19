import React, { useState } from "react";
import { Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import {
  StyledTabs,
} from "./styles";

// Importar os componentes das abas
import Vagas from "./Vagas";
import VagasSistemaIngresso from "./VagasSistemaIngresso";
import Habilitados from "./Habilitados";
import EscolhasEOL from "./EscolhasEOL";
import Historico from "./Habilitados/components/Historico";
 
const { Text } = Typography;

const breadcrumbItems = [
  { title: <Link to="/"><Text strong>Home</Text></Link> },
  { title: <Link to="/processos"><Text strong>Processos</Text></Link> },
  { title: "Importação de dados" },
] as TitleItem[];

const ImportacaoDados: React.FC = () => {

  const location = useLocation();
  const tipo = location.state?.tipo; 
  const [activeTab, setActiveTab] = useState(tipo||"VAGAS");
  const [showHistorico, setShowHistorico] = useState(false);
  
  const navigate = useNavigate();


  const handleShowHistorico = () => {
    setShowHistorico(true);
  };

  const handleBackFromHistorico = () => {
    setShowHistorico(false);
  };

  const handleShowLayoutPadrao = () => {    
    navigate('/processos/importacao-dados/layout-padrao-habilitados')

  };

  const handleShowLayoutPadraoVagas = () => {    
    navigate('/processos/importacao-dados/layout-padrao-vagas')
  };

 
  const tabItems = [
    {
      key: "VAGAS",
      label: "Vagas",
      children: <Vagas
          onShowLayoutPadrao={handleShowLayoutPadraoVagas}
      />,
    },
    {
      key: "vagas-sistema",
      label: "Vagas - Sistema de ingresso",
      children: <VagasSistemaIngresso />,
    },
    {
      key: "HABILITADOS",
      label: "Habilitados",
      children: <Habilitados 
        onShowHistorico={handleShowHistorico}
        onShowLayoutPadrao={() => handleShowLayoutPadrao()}
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
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Importação de dados"
      >
        <Historico onVoltar={handleBackFromHistorico} />
      </BaseTela>
    );
  }


  

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Importação de dados"
    >
      <StyledTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </BaseTela>
  );
};

export default ImportacaoDados;