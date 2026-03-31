import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Typography } from "antd";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { StyledTabs } from "../ImportacaoDados/styles";
import ExportacaoVagasFormTab from "./components/ExportacaoVagasFormTab";
import ExportacaoCandidatosFormTab from "./components/ExportacaoCandidatosFormTab";
import ExportacaoLotesFormTab from "./components/ExportacaoLotesFormTab";
import { useGetPermissions } from "../../routes/PermissionContextGuard";


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

const ExportacaoDadosTela: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("VAGAS_PROCESSO");
  const { can } = useGetPermissions();

  const canViewExportacaoVagasProcesso = can("view_exportacaovagasprocesso");
  const canViewExportacaoCandidatosProcesso = can("view_exportacaocandidatosprocesso");
  const canViewExportacaoVagasSigpec = can("view_exportacaovagassigpec");
  const canAddExportacaoVagasProcesso = can("add_exportacaovagasprocesso");
  const canAddExportacaoCandidatosProcesso = can("add_exportacaocandidatosprocesso");
  const canAddExportacaoVagasSigpec = can("add_exportacaovagassigpec");

  const tabItems = useMemo(() => [
    {
      key: "VAGAS_PROCESSO",
      label: "Vagas Processo",
      children: (
        <ExportacaoVagasFormTab
          tipo="vagas-processo"
          canViewExportacaoVagasProcesso={canViewExportacaoVagasProcesso}
          canAddExportacaoVagasProcesso={canAddExportacaoVagasProcesso}
        />
      ),
    },
    {
      key: "CANDIDATOS_PROCESSO",
      label: "Candidatos Processo",
      children: (
        <ExportacaoCandidatosFormTab
          tipo="candidatos-processo"
          canViewExportacaoCandidatosProcesso={canViewExportacaoCandidatosProcesso}
          canAddExportacaoCandidatosProcesso={canAddExportacaoCandidatosProcesso}
        />
      ),
    },
    {
      key: "VAGAS_SIGPEC",
      label: "Vagas SIGPEC",
      children: (
        <ExportacaoVagasFormTab
          tipo="vagas-sigpec"
          canViewExportacaoVagasProcesso={canViewExportacaoVagasSigpec}
          canAddExportacaoVagasProcesso={canAddExportacaoVagasSigpec}
        />
      ),
    },
    {
      key: "LOTES_SIGPEC",
      label: "Lotes SIGPEC",
      children: <ExportacaoLotesFormTab />,
    },
  ], [
    canViewExportacaoVagasProcesso,
    canAddExportacaoVagasProcesso,
    canViewExportacaoCandidatosProcesso,
    canAddExportacaoCandidatosProcesso,
    canViewExportacaoVagasSigpec,
    canAddExportacaoVagasSigpec,
  ]);

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
