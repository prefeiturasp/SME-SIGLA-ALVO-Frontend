import React, { useState } from "react";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { StyledTabs } from "./styles";
import AbaRelatorios from "./components/AbaRelatorios";
import AbaConvocacao from "./components/AbaConvocacao";
import AbaTipoUnidade from "./components/AbaTipoUnidade";

const { Text } = Typography;

const CadastroParametrosTela: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("RELATORIO");

  const breadcrumbItems = [
    {
      title: (
        <Text
          strong
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Home
        </Text>
      ),
    },
    {
      title: (
        <Text strong style={{ cursor: "pointer" }} onClick={() => navigate("/gerenciar")}>
          Gerenciar
        </Text>
      ),
    },
    { title: "Cadastro de Parâmetros" },
  ] as TitleItem[];

  const tabItems = [
    {
      key: "RELATORIO",
      label: "Relatório",
      children: <AbaRelatorios />,
    },
    {
      key: "CONVOCACAO",
      label: "Convocação",
      children: <AbaConvocacao />,
    },
    {
      key: "TIPOS_UNIDADE",
      label: "Tipos de Unidade",
      children: <AbaTipoUnidade />,
    },
  ];

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Cadastro de Parâmetros"
    >
      <StyledTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </BaseTela>
  );
};

export default CadastroParametrosTela;

