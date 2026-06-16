import React, { useState } from "react";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { StyledTabs } from "./styles";
import AbaRelatorios from "./components/AbaRelatorios";
import AbaConvocacao from "./components/AbaConvocacao";
import AbaTipoUnidade from "./components/AbaTipoUnidade";
import { useGetPermissions } from "../../../routes/PermissionContextGuard";

const { Text } = Typography;

const CadastroParametrosTela: React.FC = () => {
  const { can } = useGetPermissions();
  const canViewParametrizacao = can("view_parametrizacao");
  const canAddParametrizacao = can("add_parametrizacao");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("RELATORIO");

  const breadcrumbItems = [
    {
      title: (
        <Text strong style={{ cursor: "pointer" }}>
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
      children: <AbaRelatorios canAddParametrizacao={canAddParametrizacao} />,
    },
    {
      key: "CONVOCACAO",
      label: "Convocação",
      children: <AbaConvocacao canAddParametrizacao={canAddParametrizacao} />,
    },
    {
      key: "TIPOS_UNIDADE",
      label: "Tipos de Unidade",
      children: <AbaTipoUnidade canAddParametrizacao={canAddParametrizacao} />,
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

