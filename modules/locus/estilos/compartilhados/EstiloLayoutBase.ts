import { Breadcrumb as AntBreadcrumb, Layout, Menu } from "antd";
import styled from "styled-components";
import { colors, layout, spacing } from "@locus/estilos/tokens/tokens";

const { Header: AntHeader, Content: AntContent, Footer: AntFooter } = Layout;
const { Sider: AntSider } = Layout;

/* ======= LayoutBase ======= */

export const LayoutRaiz = styled(Layout)`
  min-height: 100vh;
`;

export const LayoutCorpo = styled(Layout)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const LayoutHeader = styled(AntHeader)`
  padding: 0;
`;

export const LayoutConteudo = styled(AntContent)`
  flex: 1;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.appBackground};
`;

export const LayoutConteudoInterno = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

export const LayoutFooter = styled(AntFooter)`
  padding: 0;
`;

/* ======= Cabecalho ======= */

const CabecalhoEstilo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl}px;
  height: ${({ theme }) => theme.layout.headerHeight}px;
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightBorder};
  box-shadow: ${({ theme }) => theme.layout.headerShadow};
  position: relative;
  z-index: 2;
`;

/* Lado esquerdo do cabeçalho: logo da Prefeitura e breadcrumb da rota atual */
const EsquerdaEstilo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg}px;
  min-width: 0;
`;

const Logo = styled.img`
  width: 129px;
  flex-shrink: 0;
`;

const Breadcrumb = styled(AntBreadcrumb)`
  & .ant-breadcrumb-link,
  & .ant-breadcrumb-link a {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.tertiaryText};
  }

  & li.ant-breadcrumb-item:last-child .ant-breadcrumb-link,
  & li.ant-breadcrumb-item:last-child .ant-breadcrumb-link a {
    color: ${({ theme }) => theme.colors.blue};
    font-weight: 700;
  }
`;

const Esquerda = Object.assign(EsquerdaEstilo, {
  Logo,
  Breadcrumb,
});

/* Lado direito do cabeçalho: dados do usuário logado e ação de sair */
const DireitaEstilo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  flex-shrink: 0;
`;

const UsuarioLogado = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 219px;
  padding: ${({ theme }) => theme.spacing.xs}px
    ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.headerUserBackground};
  text-align: center;
  line-height: 1.15;
  letter-spacing: -0.01em;
`;

const UsuarioRf = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamilyRoboto};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.headerUserText};
  white-space: nowrap;
`;

const UsuarioNome = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamilyRoboto};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.headerUserText};
  white-space: nowrap;
`;

const BotaoSair = styled.button`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: #929494;
  font-family: ${({ theme }) => theme.typography.fontFamilyRoboto};
  font-size: 14px;
`;

const IconeSair = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.white};

  & svg {
    font-size: 16px;
  }
`;

const Direita = Object.assign(DireitaEstilo, {
  UsuarioLogado,
  UsuarioRf,
  UsuarioNome,
  BotaoSair,
  IconeSair,
});

export const Cabecalho = Object.assign(CabecalhoEstilo, {
  Esquerda,
  Direita,
});

/* ======= MenuLateral ======= */

export const MenuSider = styled(AntSider)`
  background: ${colors.primary};
  position: sticky;
  top: 0;
  height: 100vh;

  & .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

export const MenuLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${layout.headerHeight}px;
  padding: 0 12px;
  flex-shrink: 0;
`;

export const MenuLogoImagem = styled.img`
  width: 85.1px;
  height: 19.9px;
  display: block;
  flex-shrink: 0;
`;

export const MenuLateralMenu = styled(Menu)`
  flex: 1;
  border-inline-end: 0 !important;
  background: transparent !important;
  overflow-y: auto;

  & .ant-menu-item {
    height: auto !important;
    line-height: 1.2 !important;
    padding: 12px ${spacing.sm}px !important;
    margin: ${spacing.sm}px ${spacing.sm}px !important;
    width: calc(100% - ${spacing.md}px) !important;
    border-radius: ${layout.radius}px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 6px;
    text-align: center;
    white-space: normal !important;
  }

  & .ant-menu-item .ant-menu-title-content {
    margin: 0 !important;
    font-size: 14px;
    font-weight: 700;
    line-height: 24px;
  }

  & .ant-menu-item .ant-menu-item-icon {
    font-size: 24px !important;
  }

  & .ant-menu-item,
  & .ant-menu-item:hover,
  & .ant-menu-item .ant-menu-title-content,
  & .ant-menu-item .ant-menu-item-icon,
  & .ant-menu-item-selected,
  & .ant-menu-item-selected .ant-menu-title-content,
  & .ant-menu-item-selected .ant-menu-item-icon {
    color: ${colors.white} !important;
  }
`;

export const MenuRodape = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.md}px 0 ${spacing.xl}px;
  flex-shrink: 0;
`;

export const BotaoSairMenu = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  color: #babbbc;
  cursor: pointer;
  padding: ${spacing.sm}px;

  & svg {
    font-size: 26px;
  }
`;

/* ======= Rodape ======= */

const RodapeEstilo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
  height: ${({ theme }) => theme.layout.footerHeight}px;
  padding: ${({ theme }) => theme.spacing.md}px
    ${({ theme }) => theme.spacing.xl}px;
  background: ${({ theme }) => theme.colors.white};
`;

const RodapeLogo = styled.img`
  width: 100px;
  height: ${({ theme }) => theme.spacing.xl}px;
  object-fit: contain;
`;

const Versao = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamilyRoboto};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.footerVersionText};
`;

export const Rodape = Object.assign(RodapeEstilo, {
  Logo: RodapeLogo,
  Versao,
});
