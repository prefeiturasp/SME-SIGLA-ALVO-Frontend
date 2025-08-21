import { Modal, Table } from "antd";
import { Typography } from "antd";

const { Text } = Typography;

import styled from "styled-components";
 
export const TextBlue = styled(Text)`
   color: #05409A;
   font-weight: 700;
 
 
`;





export const CustomModal = styled(Modal)`
  .ant-modal-title {
    font-weight: 700;
    font-size: 20px;
    line-height: 1.4;
   }
`;

export const CustomModal2 = styled(Modal)`
  .ant-modal-content {
    padding: 2rem 2rem 1.5rem 2rem;
    border-radius: 2px;
  }
  .ant-modal-header {
    padding: 0;
  }
  .ant-modal-footer {
    padding: 1.5rem 0 0 0;
    .ant-btn-primary {
      border-radius: 2px;
    }
  }
  .ant-modal-body {
  }
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
    .ant-pagination-item{
    border-radius:5px
    } 
  }

  
  
   .ant-pagination-total-text {
    margin-right: auto; 
    color: #727679;
  }
  box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.06);
` as typeof Table;

 
  