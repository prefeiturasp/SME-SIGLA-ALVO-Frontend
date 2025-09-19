import styled from 'styled-components';
import { Tabs, Button } from 'antd';
import { PrimaryButton as SharedPrimaryButton, SecondaryButton as SharedSecondaryButton } from '../../components/EstilosCompartilhados';

// Estilos para as abas
export const StyledTabs = styled(Tabs)`
  margin-bottom: 0;
  
  .ant-tabs-tab-bar {
    background-color: #f5f5f5;
    margin: 0;
    padding: 0 1.5rem;
  }
  
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #032B68 !important;
    font-weight: bold !important;
  }
  
  .ant-tabs-tab:not(.ant-tabs-tab-active) .ant-tabs-tab-btn {
    color: #666 !important;
    font-weight: bold !important;
  }
`;

// Container dos botões de ação
export const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  gap: 0.75rem;
`;

// Botão secundário (Histórico e Importar)
export const SecondaryButton = SharedSecondaryButton;

// Botão primário (Layout padrão)
export const PrimaryButton = SharedPrimaryButton;