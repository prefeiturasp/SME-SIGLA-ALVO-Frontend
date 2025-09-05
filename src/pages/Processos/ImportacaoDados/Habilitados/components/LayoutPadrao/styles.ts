import styled from 'styled-components';

export const LayoutContainer = styled.div`
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const HeaderSection = styled.div`
  margin-bottom: 2.5rem;
  
  h3 {
    margin: 0;
    color: #262626;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const TableContainer = styled.div`
  margin-bottom: 2rem;
  
  .ant-table {
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.06);
  }
  
  .ant-table-thead > tr > th {
    background-color: #f5f5f5;
    font-weight: 600;
    color: #262626;
    border: none !important;
    padding: 16px 20px;
  }
  
  .ant-table-tbody > tr > td {
    vertical-align: top;
    padding: 16px 20px;
    border: none !important;
  }
  
  .ant-table-tbody > tr:nth-child(even) {
    background-color: #F6F6F6;
  }
  
  .ant-table-tbody > tr:hover > td {
    background-color: #fafafa;
  }
  
  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 2rem;
`;
