import styled, { createGlobalStyle } from "styled-components";
import FormItem from "antd/es/form/FormItem";

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
  gap: 4px; /* espaço entre texto e ícone */
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
`;