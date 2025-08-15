import { Table, Typography } from "antd";
import styled from "styled-components";

export const CustomTitle = styled(Typography.Title).attrs({ level: 4 })`
  margin: 2.375rem 0 1rem 0;
`;

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    border: none !important; 
  }
     
  .ant-table-tbody > tr > td {
    border: none !important;
  }
 
  .ant-table-tbody > tr:nth-child(even) {
    background-color: #F6F6F6;
  }

  .ant-table-pagination {
    display: flex;
    justify-content: flex-end; 
  }

  .ant-pagination-total-text {
    margin-right: auto; 
  }
  
  box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.06);
` as typeof Table;



  