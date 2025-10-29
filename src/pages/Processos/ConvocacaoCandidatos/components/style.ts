import { Typography } from "antd";
import styled from "styled-components";

export const CustomTitle = styled(Typography.Title).attrs({ level: 4 })`
  margin: 2.375rem 0 1rem 0;
`;

// Estilos para o componente SortIcon
export const sortIconContainer = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '0.0625rem',
  cursor: 'pointer'
};

export const sortIconUp = (isActive: boolean) => ({
  color: isActive ? '#1890ff' : '#BFBFBF',
  fontSize: '0.5rem',
  lineHeight: '1'
});

export const sortIconDown = (isActive: boolean) => ({
  color: isActive ? '#1890ff' : '#BFBFBF',
  fontSize: '0.5rem',
  lineHeight: '1'
});

// Estilos para o componente StatusRenderer
export const statusContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

export const statusDot = (color: string) => ({
  width: '0.5rem',
  height: '0.5rem',
  borderRadius: '50%',
  backgroundColor: color,
  flexShrink: 0
});

export const statusText = {
  fontFamily: 'Open Sans',
  fontSize: '0.875rem',
  color: '#515151'
};

// Estilos para o cabeçalho da coluna Status
export const statusHeaderContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

// Estilos para os ícones de ação
export const editIcon = {
  width: '0.9765625rem',
  height: '0.9765625rem',
  color: '#838383',
  fontSize: '0.9765625rem'
};

export const viewIcon = {
  width: '1.2164474725723267rem',
  height: '0.9095982313156128rem',
  color: '#838383',
  fontSize: '0.9095982313156128rem'
};



// Estilos para o botão "Finalizar Processo"
export const finalizarButton = {
  width: '8.5rem',
  height: '1.5rem',
  gap: '0.5rem',
  opacity: 1,
  borderRadius: '0.375rem',
  paddingRight: '0.5rem',
  paddingLeft: '0.5rem',
  borderWidth: '0.0625rem',
  border: '0.0625rem solid #0F59C8',
  backgroundColor: '#FFFFFF',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 400,
  fontStyle: 'normal' as const,
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  letterSpacing: '0%',
  verticalAlign: 'middle' as const,
  color: '#0F59C8',
  boxShadow: 'none'
};

export const finalizarButtonHover = {
  backgroundColor: '#0F59C8',
  borderColor: '#0F59C8',
  color: '#FFFFFF'
};

export const finalizarButtonLeave = {
  backgroundColor: '#FFFFFF',
  borderColor: '#0F59C8',
  color: '#0F59C8'
};

// Estilos para o texto vazio da tabela
export const emptyTextContainer = {
  padding: '2.5rem 0',
  textAlign: 'center' as const,
  color: '#8C8C8C',
  fontSize: '1rem',
  fontFamily: 'Inter, sans-serif'
};

// Estilos para botões com visibilidade hidden
export const hiddenButton = {
  visibility: 'hidden' as const
};