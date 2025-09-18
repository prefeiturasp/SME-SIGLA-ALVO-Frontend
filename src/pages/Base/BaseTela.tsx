import { Breadcrumb, Typography, type MenuProps } from "antd";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { IProcessoConvocacao } from "../../services/resources/convocacao/IConvocacao";
import React, { Suspense } from "react";
import { Layout, Menu, theme } from "antd";
import icon from "../../assets/alvo-img.png";

import { UserAvatar } from "../../components/UserAvatar/UserAvatar";
import { useNavigate, useLocation } from "react-router-dom";
import { GlobalMenuWidth } from "./styles";

export interface INewSampleModalData extends IProcessoConvocacao {
  description: string;
}

export type TitleItem = { title: string } | { title: React.ReactElement };
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { CustomLabel } from "./styles";

interface INewSampleModalProps {
  children: React.ReactNode;
  breadcrumbItems: TitleItem[];
  title: string;
}

const { Header, Content, Footer } = Layout;


const BaseTela: React.FC<INewSampleModalProps> = ({
  children,
  breadcrumbItems,
  title,
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();



  const navigate = useNavigate();
  const location = useLocation();

   

  // Função para determinar qual menu deve estar selecionado baseado na URL
  const getSelectedKeys = () => {
    const path = location.pathname;
    
    if (path.startsWith('/processos')) {
      return ['sub2']; // Processos
    } else if (path.startsWith('/administracao') || path.startsWith('/admin')) {
      return ['sub1']; // Administração
    } else if (path.startsWith('/relatorios') || path.startsWith('/relatorio')) {
      return ['sub3']; // Relatórios
    }
    
    return []; // Nenhum selecionado se não corresponder a nenhuma seção
  };

const menuItens: MenuProps["items"] = [
  {
    key: "sub1",
    label: 
    <CustomLabel>
      Administração <ArrowDropDownIcon />
    </CustomLabel>,
    children: [
      { key: 1, label: "Concursos" },
      { key: 2, label: "Escolas" },
    ],
  },
  {
    key: "sub2",
    label: 
    <CustomLabel>
      Processos <ArrowDropDownIcon />
    </CustomLabel>,
    children: [
      { key: 3, label: "Convocação de candidatos", onClick: () => navigate("/processos/convocacao") }, 
      { key: 4, label: "Escolha de candidatos" },
      { key: 5, label: "Importação de dados", onClick: () => navigate("/processos/importacao-dados") },
    ]
  },
  {
    key: "sub3",
    label: 
        <CustomLabel>
      Relatórios <ArrowDropDownIcon />
    </CustomLabel>,
     children: [
      { key: 5, label: "Relatório ABCD" },
      { key: 6, label: "Relatório EFGH" },
    ],
  },
];

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
       
      <GlobalMenuWidth />
      <Header style={{ display: "flex", alignItems: "center", padding:'0 1.5rem', boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.1)' }}>
         <img
          src={icon}
          alt="Sistema Alvo"
        />
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={getSelectedKeys()}
          items={menuItens}
          style={{ flex: 1, marginLeft: "1.5rem" }}
        />
        <UserAvatar />
      </Header>

      <Content style={{ padding: "1.5rem"}}>
        <Breadcrumb separator={<KeyboardArrowRightIcon  />}  items={breadcrumbItems} />
        <Typography.Title level={2} style={{ margin:"1rem 0" ,fontWeight: 700 }} >
          {title}
        </Typography.Title>
        <div
          style={{
            background: colorBgContainer,
            minHeight: "30vh",
            borderRadius: borderRadiusLG,
          }}
        >
          <Suspense fallback={<Typography.Text>Carregando...</Typography.Text>}>
            {children}
          </Suspense>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>Alvo</Footer>
    </Layout>
  );
};

export default BaseTela;
