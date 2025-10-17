import styled, { createGlobalStyle } from "styled-components";
import FormItem from "antd/es/form/FormItem";
import { Layout, Typography, Avatar } from "antd";
import { UserOutlined, BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

export const SelectContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const SelectDivider = styled.div`
  width: 49%;
`;



export const CustomFormItem = styled(FormItem)`
  padding-bottom: 0;
  display: flex;
  flex-direction: column;

  .ant-row {
    display: block;
  }
`;

export const CustomLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

// Estilos do UserAvatar
export const UserLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: 'Open Sans', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0px;
`;

export const StyledUserAvatar = styled(Avatar)`
  background: none !important;
`;

export const UserAvatarIcon = styled(AccountCircleRoundedIcon)`
  font-size: 2.5rem !important;
  color: #1C1D22 !important;
`;

export const GlobalMenuWidth = createGlobalStyle`
  .ant-menu-submenu-popup .ant-menu {
    min-width: 250px;
  }
  .ant-menu-submenu-popup .ant-menu-item,
  .ant-menu-submenu-popup li.ant-menu-item {
    white-space: nowrap;
    width: 100%;
    min-width: 250px;
  }

  /* Estilos globais do breadcrumb */
  .ant-breadcrumb {
    ol {
      display: flex;
      align-items: center;
      
      li {
        display: flex;
        align-items: center;
        
        a, span {
          color: #71717A !important;
          font-family: 'Open Sans', sans-serif !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          line-height: 24px !important;
          letter-spacing: 0% !important;
          text-align: center !important;
          text-decoration: none !important;
          background: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        &:hover {
          a, span {
            color: #1C1D22 !important;
            background: transparent !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
          }
        }
        
        &:last-child {
          a, span {
            color: #0F59C8 !important;
            background: transparent !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
          }
          
          &:hover {
            a, span {
              color: #0F59C8 !important;
              background: transparent !important;
              border: none !important;
              outline: none !important;
              box-shadow: none !important;
            }
          }
        }
      }
    }
    
    .ant-breadcrumb-separator {
      color: #71717A !important;
      font-size: 1rem !important;
      display: flex !important;
      align-items: center !important;
      
      .MuiSvgIcon-root {
        display: flex;
        align-items: center;
        color: #71717A !important;
      }
    }
  }
`;

export const StyledLayout = styled(Layout)`
  height: 100vh;
  
  overflow: hidden;
  overflow-x: hidden;
`;

export const StyledHeader = styled(Layout.Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  
  border-bottom: 0.0625rem solid #FAFAFA;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  height: 4.5rem;
  line-height: 4.5rem;
  width: calc(100% - 6.625rem);
  margin-left: 6.625rem;
  z-index: 999;
  
  .ant-breadcrumb {
    flex: 1;
    margin: 0 2rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
  }
`;

export const PrefSPLogo = styled.img`
  width: 8.45875rem;
  height: 8.45875rem;
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0.5rem;
  margin: 0.25rem 0.5rem;
  background: #1C1D22;
`;

export const AlvoLogo = styled.img`
  width: 4.17rem;
  height: 1.4375rem;
  position: relative;
  top: -0.3125rem;
`;

export const StyledSider = styled(Layout.Sider)`
  background: #1C1D22 !important;
  position: fixed !important;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  height: 100vh;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  
  .ant-layout-sider-children {
    background: #1C1D22;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;


export const SidebarFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  background: #1C1D22;
  color: #ffffff;
  
  .MuiSvgIcon-root {
    font-size: 1.25rem;
    cursor: pointer;
    
    &:hover {
      color: #adb5bd;
    }
  }
`;

export const StyledContent = styled(Layout.Content)`
  
  margin:1.5625rem 2.5rem 1.5625rem 8.625rem;
  height: calc(100vh - 4.5rem - 3.75rem);
  overflow-y: auto;
`;

export const StyledFooter = styled(Layout.Footer)`
  text-align: end;
  color: #6c757d;
  font-size: 0.75rem;
  padding: 1rem 0rem;
  height: 3.75rem;
  line-height: 1.75rem;
`;

export const SidePanel = styled.div`
  position: fixed;
  left: 6.625rem;
  top: 4.5rem;
  width: 16.8125rem;
  height: calc(100vh - 4.5rem);
  background: #ffffff;
  border-right: 0.0625rem solid #FAFAFA;
  box-shadow: 0.125rem 0 0.5rem rgba(0, 0, 0, 0.1);
  z-index: 998;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export const SidePanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #ffffff;
`;


export const SidePanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const SidePanelItem = styled.div`
  width: 16.8125rem;
  min-height: 3.375rem;
  padding-top: 0.625rem;
  padding-right: 0.625rem;
  padding-bottom: 1.25rem;
  padding-left: 1.5rem;
  gap: 0.625rem;
  border-bottom: 0.0625rem solid #FAFAFA;
  cursor: pointer;
  font-size: 0.875rem;
  color: #515151;
  font-weight: 700;
  display: flex;
  align-items: center;
  opacity: 1;
  transition: color 0.2s ease;

  &:hover {
    color: #0F59C8;
  }
`;

export const CustomMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  flex: 1;
`;

export const CustomMenuItem = styled.div<{ $isSelected?: boolean; $isOpen?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  margin: 0.25rem 0;
  border-radius: 0.375rem;
  cursor: pointer;
  color: #ffffff;
  font-family: 'Open Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  text-align: center;
  width: calc(100% - 1rem);
  transition: all 0.2s ease;
  border: 0.125rem solid transparent;

  span {
    margin-top: 0.25rem;
    font-family: 'Open Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 700;
    font-style: normal;
  }

  &:hover {
    background-color: #495057;
  }

  ${({ $isSelected }) => $isSelected && `
    background-color: #495057;
  `}

  ${({ $isOpen }) => $isOpen && `
    border: 0.125rem solid #495057;
    background-color: #343a40;
  `}
`;

export const ProcessosIcon = styled(UserOutlined)`
  font-size: 1.03125rem;
`;

export const RelatoriosIcon = styled(BarChartOutlined)`
  font-size: 1.03125rem;
`;

export const GerenciarIcon = styled(SettingOutlined)`
  font-size: 1rem;
`;

export const SidePanelTitle = styled(Typography.Title)`
  margin: 0 !important;
  color: #212529 !important;
`;

export const PageTitle = styled(Typography.Text)`

  
  
  border-left: 3px solid #FF8048;
color: #1C1D22;

font-size: 24px;
font-style: normal;
font-weight: 600;
line-height: normal;

  padding-left:15px;

  
`;

export const PageContentContainer = styled.div<{ $bgColor?: string; $borderRadius?: number }>`
  background: ${({ $bgColor }) => $bgColor || '#FAFAFA'};
  min-height: 30vh;
  border-radius: ${({ $borderRadius }) => $borderRadius || 0}px;]
`;