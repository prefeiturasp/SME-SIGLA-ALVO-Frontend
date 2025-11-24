import styled from "styled-components";
import { Button, Typography, Alert, Select } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

export const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

export const LeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #ffffff;
`;


export const LoginCard = styled.div`
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem 2rem 1rem 2rem;
  box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 31.25rem;
  min-width: 28.125rem;
`;


export const StyledForm = styled.form`
  width: 100%;
`;

export const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

export const FieldLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;


export const ErrorMessage = styled.div`
  color: #ff4d4f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  height: 3rem;
  background-color: #8B5CF6;
  border-color: #8B5CF6;
  border-radius: 0.375rem;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #7C3AED;
    border-color: #7C3AED;
  }
`;

export const ForgotPasswordLink = styled.a`
  color: #05409A;
  font-size: 0.875rem;
  text-decoration: none;
  margin-top: 1rem;
  display: block;
  text-align: center;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const PrefLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.125rem;
`;

export const PrefLogoImage = styled.img`
  height: 11rem;
  opacity: 0.9;
`;

export const StyledTitle = styled(Typography.Title)`
  text-align: center !important;
  margin: 0 0 0.5rem 0 !important;
  font-size: 1.75rem !important;
  font-weight: 700 !important;
  color: #333 !important;
`;

export const StyledText = styled(Typography.Text)`
  display: block !important;
  text-align: center !important;
  color: #666 !important;
  font-size: 0.875rem !important;
  margin: 0 0 1rem 0 !important;
  line-height: 1.4 !important;
`;

export const StyledAlert = styled(Alert)`
  margin-bottom: 1rem !important;
`;

export const StyledTooltipIcon = styled(QuestionCircleOutlined)`
  color: #666 !important;
  cursor: help !important;
`;

export const StyledSelect = styled(Select)`
  width: 100%;
  height: 3rem;
  
  .ant-select-selector {
    height: 3rem !important;
    border-radius: 0.375rem !important;
    border: 1px solid #d9d9d9 !important;
    
    &:hover {
      border-color: #8B5CF6 !important;
    }
  }
  
  .ant-select-selection-placeholder {
    line-height: 3rem !important;
  }
  
  .ant-select-selection-item {
    line-height: 3rem !important;
  }
`;

export const BackToLoginButton = styled(Button)`
  width: 100%;
  height: 3rem;
  background-color: #ffffff;
  border-color: #8B5CF6;
  color: #8B5CF6;
  border-radius: 0.375rem;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 1rem;
  
  &:hover {
    background-color: #f8f7ff;
    border-color: #7C3AED;
    color: #7C3AED;
  }
`;

export const ImportantNoticeContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 0.375rem;
  padding: 1rem;
  margin: 1rem 0;
  text-align: justify;
  line-height: 1.5;
`;

export const ImportantText = styled.span`
  font-weight: 700;
  color: #333;
`;

export const NoticeText = styled.span`
  color: #333;
`;

export const SuccessIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4rem;
  height: 4rem;
  background-color: #52c41a;
  border-radius: 50%;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1.5rem auto;
`;

export const SuccessMessage = styled.div`
  text-align: center;
  color: #333;
  font-size: 0.875rem;
  margin-bottom: 0;
  line-height: 1.4;
  padding: 0;
`;

export const EmailText = styled.span`
  font-weight: 600;
  color: #8B5CF6;
`;

export const InstructionsText = styled.div`
  text-align: center;
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  line-height: 1.4;
`;

export const PasswordRequirementsList = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 0.375rem;
`;

export const PasswordRequirementTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.75rem;
`;

export const RequirementItem = styled.div<{ $met: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.$met ? '#52c41a' : '#666'};
  margin-bottom: 0.5rem;
  
  .anticon {
    color: ${props => props.$met ? '#52c41a' : '#d9d9d9'};
    font-size: 1rem;
  }
`;
