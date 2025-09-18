import React from "react";
import { Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import BaseScreen, { type TitleItem } from "../../BaseScreen";

import LayoutPadrao from "../Habilitados/components/LayoutPadrao";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
import useLayout from "../../../hooks/useLayout";

const { Text } = Typography;

const breadcrumbItems = [
  { title: <Link to="/"><Text strong>Home</Text></Link> },
  { title: <Link to="/processos"><Text strong>Processos</Text></Link> },
    { title: <Link to="/processos/importacao-dados"><Text strong>Importação de dados</Text></Link> },
  { title: "Layout padrão" },
] as TitleItem[];



interface LayoutPadraoProps {
  tipo?: string,
}

const LayoutPadraoVagas: React.FC<LayoutPadraoProps> = ({ tipo = 'VAGAS' }) => {

  const { dataLayout, layoutIsLoading } = useLayout(tipo);


  const navigate = useNavigate();
  
  const handleVoltar = () => {
    navigate('/processos/importacao-dados', { state: { tipo: tipo } }); 
  };

  return (
    <BaseScreen
      breadcrumbItems={breadcrumbItems}
      title="Importação de dados"
    >
      <LayoutPadrao
        loading={layoutIsLoading}
        title={tipo === 'VAGAS' ? 'Layout: Arquivo de Vagas' : 'Layout: Arquivo de Aprovados (HABILITADOS)'}
        onVoltar={handleVoltar} dataSource={dataLayout?.results[0].estrutura || []} />
    </BaseScreen>
  );
};

export default LayoutPadraoVagas;