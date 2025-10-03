import React from "react";
import { Input, Tooltip } from "antd";
import { Controller } from "react-hook-form";
import logoPrefSP from "../../assets/logo_PrefSP_sem fundo_horizontal_fundo claro.png";
import { useEsqueceuSenha } from "./hooks/useEsqueceuSenha";
import {
  LoginContainer,
  LeftSide,
  LoginCard,
  StyledForm,
  FormField,
  FieldLabel,
  ErrorMessage,
  StyledButton,
  PrefLogoContainer,
  PrefLogoImage,
  StyledTitle,
  StyledText,
  StyledAlert,
  StyledTooltipIcon,
  BackToLoginButton,
  ImportantNoticeContainer,
  ImportantText,
  NoticeText,
} from "./style";

const EsqueceuSenhaTela: React.FC = () => {
  const {
    loading,
    alert,
    control,
    handleSubmit,
    errors,
    isButtonDisabled,
    handleBackToLogin,
  } = useEsqueceuSenha();

  return (
    <LoginContainer>
      <LeftSide>
        <LoginCard>
          <StyledTitle level={2}>
            Recuperação de senha
          </StyledTitle>
          
          <StyledText>
            Informe o seu RF. Você receberá um e-mail com orientações para redefinir sua senha.
          </StyledText>
          
          {alert && (
            <StyledAlert
              message={alert.message}
              type={alert.type}
              showIcon
            />
          )}
          
          <StyledForm onSubmit={handleSubmit}>
            <FormField>
              <FieldLabel>
                RF
                <Tooltip title="Insira seu Registro Funcional">
                  <StyledTooltipIcon />
                </Tooltip>
              </FieldLabel>
              <Controller
                name="rf"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="12345678"
                    status={errors.rf ? 'error' : ''}
                  />
                )}
              />
              {errors.rf && (
                <ErrorMessage>
                  {errors.rf.message}
                </ErrorMessage>
              )}
            </FormField>
            
            <ImportantNoticeContainer>
              <ImportantText>Importante:</ImportantText>{" "}
              <NoticeText>
                Ao alterar a sua senha, ela se tornará padrão e será utilizada para acessar todos os sistemas da SME aos quais você já possui acesso.
              </NoticeText>
            </ImportantNoticeContainer>
            
            <StyledButton 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              disabled={isButtonDisabled}
            >
              Continuar
            </StyledButton>
            
            <BackToLoginButton onClick={handleBackToLogin}>
              Voltar
            </BackToLoginButton>
            
            <PrefLogoContainer>
              <PrefLogoImage src={logoPrefSP} alt="Prefeitura de São Paulo" />
            </PrefLogoContainer>
          </StyledForm>
        </LoginCard>
      </LeftSide>
    </LoginContainer>
  );
};

export default EsqueceuSenhaTela;
