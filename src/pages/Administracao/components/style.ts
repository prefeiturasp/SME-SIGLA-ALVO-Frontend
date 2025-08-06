import { Button, Table, Typography } from "antd";
import styled from "styled-components";
 
 
export const CustomLink = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.token.colorPrimary};
    &:hover {
    opacity: 0.5;
  }
  
`;


export const DeleteLink = styled.a`
      &:hover {
    opacity: 0.5;
  }
  color: ${({ theme }) => theme.token.colorError};
  
`;

export const DeleteButton = styled(Button)`
  color: ${({ theme }) => theme.token.colorError};
  border: none;
  background: transparent;
  font-size: 16px;
   width:24px;

  &:hover {
    opacity: 0.5;
    color: ${({ theme }) => theme.token.colorError};
    background: transparent;
  }
`;

export const EditButton = styled(Button)`
  color: ${({ theme }) => theme.token.colorPrimary};
  border: none;
  background: transparent;
  font-size: 16px;
   width:24px;

  &:hover {
    opacity: 0.5;
    color: ${({ theme }) => theme.token.colorPrimary};
    background: transparent;
  }
`;






export const Icon = styled.span`
  font-family: "Material Symbols Outlined";
  font-size: 24px;
  line-height: 1;
  display: inline-block;
`;

 


export const CustomTitle = styled(Typography.Title).attrs({ level: 4 })`
  font-weight: 700;
  margin: 2.375rem 0 1rem 0;
`;



export const StyledTable = styled(Table)`
    .ant-table-thead > tr > th {
    background-color: #EBEBED !important;
    font-weight: 600;
    border: none !important; /* remove bordas do header */
  }

  /* Remove bordas das linhas do corpo */
  .ant-table-tbody > tr > td {
    border: none !important;
  }

  /* Linhas alternadas */
  .ant-table-tbody > tr:nth-child(odd) {
    background-color: #ffffff;
  }

  .ant-table-tbody > tr:nth-child(even) {
    background-color: #F6F6F6;
  }

  .ant-table-pagination {
    display: flex;
    justify-content: flex-end; /* por padrão tudo à direita */
  }

  .ant-pagination-total-text {
    margin-right: auto; /* empurra só o texto total para esquerda */
  }
` as typeof Table;
