import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Typography } from "antd";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { StyledTabs } from "../ImportacaoDados/styles";
import ExportacaoVagasFormTab from "./components/ExportacaoVagasFormTab";
import ExportacaoCandidatosFormTab from "./components/ExportacaoCandidatosFormTab";
import ExportacaoLotesFormTab from "./components/ExportacaoLotesFormTab";

const { Text } = Typography;

const breadcrumbItems: TitleItem[] = [
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
  { title: "Exportação de Dados" },
];

const tabItems = [
  {
    key: "VAGAS_PROCESSO",
    label: "Vagas Processo",
    children: <ExportacaoVagasFormTab tipo="vagas-processo" />,
  },
  {
    key: "CANDIDATOS_PROCESSO",
    label: "Candidatos Processo",
    children: <ExportacaoCandidatosFormTab />,
  },
  {
    key: "VAGAS_SIGPEC",
    label: "Vagas SIGPEC",
    children: <ExportacaoVagasFormTab tipo="vagas-sigpec" />,
  },
  {
    key: "LOTES_SIGPEC",
    label: "Lotes SIGPEC",
    children: <ExportacaoLotesFormTab />,
  },
];

const ExportacaoDadosTela: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("VAGAS_PROCESSO");

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Exportação de Dados"
    >
      <StyledTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </BaseTela>
  );
};

export default ExportacaoDadosTela;
