import React, { useState } from "react";
import { Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import {
  StyledTabs,
} from "./styles";

// Importar os componentes das abas
import Vagas from "./Vagas/VagasTela";
import Habilitados from "./Habilitados/HabilitadosTela";
   
const { Text } = Typography;

const breadcrumbItems = [
  { title: <Link to="/"><Text strong>Home</Text></Link> },
  { title: <Link to="/processos"><Text strong>Processos</Text></Link> },
  { title: "Importação de dados" },
] as TitleItem[];

const ImportacaoDadosTela: React.FC = () => {

  const location = useLocation();
  const tipo = location.state?.tipo; 
  const [activeTab, setActiveTab] = useState(tipo||"HABILITADOS");
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
      key: "HABILITADOS",
      label: "Habilitados",
      children: <Habilitados 
        onShowHistorico={handleShowHistorico}
        onShowLayoutPadrao={() => handleShowLayoutPadrao()}
      />,
    },
    {
      key: "VAGAS",
      label: "Vagas Escolas",
      children: <Vagas
          onShowLayoutPadrao={handleShowLayoutPadraoVagas}
      />,
    },

  ];

 

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

export default ImportacaoDadosTela;