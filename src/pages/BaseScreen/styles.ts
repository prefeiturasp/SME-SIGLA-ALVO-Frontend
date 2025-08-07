import styled from "styled-components";
import { Modal as AntModal } from "antd";
import FormItem from "antd/es/form/FormItem";

export const SelectContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const SelectDivider = styled.div`
  width: 49%;
`;

export const CustomModal = styled(AntModal)`
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

export const CustomFormItem = styled(FormItem)`
  padding-bottom: 0;
  display: flex;
  flex-direction: column;

  .ant-row {
    display: block;
  }
`;
