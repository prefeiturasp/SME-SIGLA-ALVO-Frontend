import { Breadcrumb, Col, Row, Tooltip, Typography } from "antd";
import { SnippetsOutlined } from "@ant-design/icons";
import type { IProcessoConvocacao } from "../../services/resources/convocacao/IConvocacao";
import React, { Suspense, useState } from "react";
import { Layout, theme } from "antd";
import alvoIcon from "../../assets/alvo-fundo-branco.png";
import prefSPLogo from "../../assets/logo_PrefSP_sem fundo_horizontal_fundo claro.png";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { UserAvatar } from "../../components/UserAvatar";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GlobalMenuWidth,
  StyledLayout,
  StyledHeader,
  StyledSider,
  SidebarHeader,
  SidebarFooter,
  AlvoLogo,
  PrefSPLogo,
  CustomMenu,
  CustomMenuItem,
  StyledContent,
  StyledFooter,
  SidePanel,
  SidePanelHeader,
  SidePanelContent,
  SidePanelItem,
  ProcessosIcon,
  GerenciarIcon,
  SidePanelTitle,
  PageTitle,
  PageContentContainer,
} from "./styles";

export interface INewSampleModalData extends IProcessoConvocacao {
  description: string;
}

export type TitleItem = { title: string } | { title: React.ReactElement };
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface INewSampleModalProps {
  children: React.ReactNode;
  breadcrumbItems: TitleItem[];
  title: string | React.ReactElement;
  buttons?: React.ReactNode;
}

const BaseTela: React.FC<INewSampleModalProps> = ({
  children,
  breadcrumbItems,
  title,
  buttons,
}) => {
  const {
    token: { colorBgBase, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [selectedMenuTitle, setSelectedMenuTitle] = useState("");
  const [selectedMenuKey, setSelectedMenuKey] = useState("");

  const processedBreadcrumbItems = breadcrumbItems
    .map((item, index) => {
      if (index === 0 && location.pathname === "/") {
        return null;
      }

      if (
        typeof item.title === "string" &&
        item.title.toLowerCase() === "home"
      ) {
        return {
          ...item,
          onClick: () => navigate("/"),
        } as TitleItem & { onClick: () => void };
      }

      return item;
    })
    .filter((item): item is TitleItem => item !== null);

  const getSelectedKeys = () => {
    const path = location.pathname;

    if (path.startsWith("/processos") || path.startsWith("/processo")) {
      return ["processos"];
    } else if (
      path.startsWith("/administracao") ||
      path.startsWith("/admin") ||
      path.startsWith("/gerenciar") ||
      path.startsWith("/parametrizacao")
    ) {
      return ["gerenciar"];
    } else if (
      path.startsWith("/relatorios") ||
      path.startsWith("/relatorio") ||
      path.startsWith("/documentos-por-processo")
    ) {
      return ["documentos-por-processo"];
    }

    return [];
  };

  const handleMenuClick = (key: string, title: string) => {
    if (isSidePanelOpen && selectedMenuKey === key) {
      setIsSidePanelOpen(false);
      setSelectedMenuKey("");
      setSelectedMenuTitle("");
    } else {
      setSelectedMenuTitle(title);
      setSelectedMenuKey(key);
      setIsSidePanelOpen(true);
    }
  };

  const menuItems = [
    {
      key: "processos",
      icon: <ProcessosIcon />,
      label: "Processos",
      onClick: () => handleMenuClick("processos", "Processos"),
    },
    {
      key: "documentos-por-processo",
      icon: <SnippetsOutlined style={{ fontSize: "1.03125rem" }} />,
      label: "Documentos",
      onClick: () => handleMenuClick("documentos-por-processo", "Documentos por Processo"),
    },
    {
      key: "gerenciar",
      icon: <GerenciarIcon />,
      label: "Gerenciar",
      onClick: () => handleMenuClick("gerenciar", "Gerenciar"),
    },
  ];

  const getSubmenuItems = (menuKey: string) => {
    switch (menuKey) {
      case "processos":
        return [
          {
            key: "convocacao",
            label: "Convocação de Candidatos",
            onClick: () => navigate("/processos/convocacao"),
          },
          {
            key: "escolha-candidatos",
            label: "Escolha de Candidatos",
            onClick: () => navigate("/processos/escolha-candidato/"),
          },
          { 
            key: "gerenciamento-vagas", 
            label: "Gerenciamento de Vagas",
            onClick: () => navigate("/processos/gerenciamento-vagas"),
          },
          {
            key: "importacao",
            label: "Importação de Dados",
            onClick: () => navigate("/processos/importacao-dados"),
          },
          {
            key: "exportacao",
            label: "Exportação de Dados",
            onClick: () => navigate("/processos/exportacao-dados"),
          },
          {
            key: "pesquisar-concursados",
            label: "Pesquisar Concursados",
            onClick: () => navigate("/processo/pesquisar-concursado"),
          },
        ];
      case "documentos-por-processo":
        return [
          {
            key: "relatorios",
            label: "Relatórios",
            onClick: () => navigate("/relatorios"),
          },
        ];
      case "gerenciar":
        return [
          {
            key: "autorizacoes-publicadas",
            label: "Autorizações publicadas",
            onClick: () => navigate("/gerenciar/autorizacoes-publicadas"),
          },
          {
            key: "disparo-emails",
            label: "Disparo de e-mails",
            onClick: () => navigate("/gerenciar/disparo-emails"),
          },
          {
            key: "eliminacao-reclassificacao",
            label: "Eliminação e Reclassificação de Candidato",
            onClick: () => navigate("/gerenciar/eliminiacao-e-reclassificacao-candidato"),
          },
          {
            key: "gerenciamento-usuarios",
            label: "Gerenciamento de usuários",
            onClick: () => navigate("/gerenciar/gerenciamento-usuarios"),
          },
          {
            key: "cadastro-parametros",
            label: "Cadastro de Parâmetros",
            onClick: () => navigate("/gerenciar/parametrizacao"),
          },
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USUARIO");
    navigate("/login");
  };

  return (
    <StyledLayout>
      <GlobalMenuWidth />

      <StyledHeader>
        <PrefSPLogo src={prefSPLogo} alt="Prefeitura de São Paulo" />
        <Breadcrumb
          separator={<KeyboardArrowRightIcon />}
          items={processedBreadcrumbItems}
        />
        <UserAvatar />
      </StyledHeader>

      <Layout>
        <StyledSider width={106}>
          <SidebarHeader>
            <AlvoLogo src={alvoIcon} alt="ALVO" />
          </SidebarHeader>
          <CustomMenu>
            {menuItems.map((item) => (
              <CustomMenuItem
                key={item.key}
                onClick={item.onClick}
                $isSelected={getSelectedKeys().includes(item.key)}
                $isOpen={isSidePanelOpen && selectedMenuKey === item.key}
              >
                {item.icon}
                <span>{item.label}</span>
              </CustomMenuItem>
            ))}
          </CustomMenu>
          <SidebarFooter>
            <Tooltip title="Sair">
              <ExitToAppIcon onClick={handleLogout} />
            </Tooltip>
          </SidebarFooter>
        </StyledSider>

        {isSidePanelOpen && (
          <SidePanel>
            <SidePanelHeader>
              <SidePanelTitle level={3}>{selectedMenuTitle}</SidePanelTitle>
            </SidePanelHeader>
            <SidePanelContent>
              {getSubmenuItems(selectedMenuKey).map((item) => (
                <SidePanelItem key={item.key} onClick={item.onClick}>
                  {item.label}
                </SidePanelItem>
              ))}
            </SidePanelContent>
          </SidePanel>
        )}

        <StyledContent
          style={{ marginLeft: isSidePanelOpen ? "23.4375rem" : "8.625rem" }}
        >
          <Row
            align={"middle"}
            justify={"space-between"}
            style={{ margin: "0 0 2rem 0" }}
          >
            <Col>
              <PageTitle>{title}</PageTitle>
            </Col>
            <Col>{buttons}</Col>
          </Row>

          <PageContentContainer
            $bgColor={"none"}
            $borderRadius={borderRadiusLG}
          >
            <Suspense
              fallback={<Typography.Text>Carregando...</Typography.Text>}
            >
              {children}
            </Suspense>
          </PageContentContainer>
        </StyledContent>
      </Layout>

      <StyledFooter style={{ marginRight: "2.5rem" }}>
        Sistema Alvo - Versão: 1.0.33.01 - Todos os direitos reservados
      </StyledFooter>
    </StyledLayout>
  );
};

export default BaseTela;
