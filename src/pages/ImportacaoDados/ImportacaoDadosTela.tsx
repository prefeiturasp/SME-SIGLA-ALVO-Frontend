import React, { useState } from "react";
import { Button, Tooltip, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { StyledTabs } from "./styles";
import { CloudDownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { ButtonGroup } from "../Processos/ConvocacaoCandidatos/style";
import { useLayoutDownload } from "../../hooks/useLayoutDownload";
import HabilitadosFormTab from "./Habilitados/HabilitadosFormTab";
import VagasFormTab from "./Vagas/VagasFormTab";
import EscolhasFormTab from "./Escolhas/EscolhasFormTab";
import { useGetPermissions } from "../../routes/PermissionContextGuard";

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
  const { can } = useGetPermissions();

  //controla as permissões do topo da tela
  const canViewLayoutArquivoImportacao = can("view_layoutarquivoimportacao");
  const canBaixarLayoutArquivoImportacao = can("baixar_layoutarquivoimportacao");

  //controla as permissões das abas Vagas
  const canAddImportacaoArquivoVagas = can("add_importacaoarquivovagas");
  const canViewHistoricoVagas = can("view_importacaoarquivovagas");

  //controla as permissões das abas Habilitados
  const canAddImportacaoArquivoHabilitados = can("add_importacaoarquivohabilitado");
  const canViewHistoricoHabilitados = can("view_importacaoarquivohabilitado");
  

  
  const location = useLocation();
  const tipo = location.state?.tipo;
  const [activeTab, setActiveTab] = useState<string>(tipo || "HABILITADOS");

  const navigate = useNavigate();

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
          canViewHistoricoVagas={canViewHistoricoVagas}
          canImportarVagas={canAddImportacaoArquivoVagas}                 
        />
      ),
    },
    {
      key: "HABILITADOS",
      label: "Habilitados",
      children: (
        <HabilitadosFormTab
          onShowLayoutPadrao={() => handleShowLayoutPadrao("HABILITADOS")}
          canViewHistoricoHabilitados={canViewHistoricoHabilitados}
          canImportarHabilitados={canAddImportacaoArquivoHabilitados}
        />
      ),
    },
    {
      key: "ESCOLHAS",
      label: "Escolhas",
      children: (
        <EscolhasFormTab
          onShowLayoutPadrao={() => handleShowLayoutPadrao("ESCOLHAS")}
          canViewHistoricoVagas={canViewHistoricoVagas}
          canImportarVagas={canAddImportacaoArquivoVagas}
        />
      ),
    },
  ];

  const { handleBaixarArquivo } = useLayoutDownload();

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Importação de dados"
      buttons={
        activeTab !== "ESCOLHAS" ? (
          <ButtonGroup>
            <Tooltip title={!canViewLayoutArquivoImportacao?"Você não possui permissão para essa ação":"Ver layout padrão"} arrow={true} >
            <Button
              disabled={!canViewLayoutArquivoImportacao}
              size="large"
              onClick={() => handleShowLayoutPadrao(activeTab)}
              style={{ color: "#434343" }}
            >
              <EyeOutlined style={{ fontSize: 22, color: "#838383" }} /> Ver
              layout Padrão
            </Button>
            </Tooltip>

            <Tooltip title={!canBaixarLayoutArquivoImportacao?"Você não possui permissão para essa ação":"Baixar layout padrão"} arrow={true} > 
            <Button
              size="large"
              onClick={() => handleBaixarArquivo(activeTab)}
              style={{ color: "#434343" }}
              disabled={!canBaixarLayoutArquivoImportacao}
            >
              <CloudDownloadOutlined style={{ fontSize: 22, color: "#838383" }} />{" "}
              Baixar layout Padrão
            </Button>
            </Tooltip>
          </ButtonGroup>
        ) : undefined
      }
    >
      <>
        <StyledTabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </>
    </BaseTela>
  );
};

export default ImportacaoDadosTela;
