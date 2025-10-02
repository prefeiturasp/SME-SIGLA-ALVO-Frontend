import React from "react";
import { Input, Tooltip } from "antd";
import { EyeInvisibleOutlined } from "@ant-design/icons";
import { Controller } from "react-hook-form";
import logoPrefSP from "../../assets/logo_PrefSP_sem fundo_horizontal_fundo claro.png";
import { useLogin } from "./hooks/useLogin";
import {
  LoginContainer,
  LeftSide,
  LoginCard,
  StyledForm,
  FormField,
  FieldLabel,
  ErrorMessage,
  StyledButton,
  ForgotPasswordLink,
  PrefLogoContainer,
  PrefLogoImage,
  StyledTitle,
  StyledText,
  StyledAlert,
  StyledTooltipIcon,
} from "./style";


const LoginTela: React.FC = () => {
  const {
    loading,
    alert,
    control,
    handleSubmit,
    errors,
  } = useLogin();

  return (
    <LoginContainer>
      <LeftSide>
        <LoginCard>
          <StyledTitle level={2}>
            Bem-vindo ao SIGLA
          </StyledTitle>
          
          <StyledText>
            Sistema Integrado de Gestão de Lotação e Alocação
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
                name="usuario"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="12345678"
                    status={errors.usuario ? 'error' : ''}
                  />
                )}
              />
              {errors.usuario && (
                <ErrorMessage>
                  {errors.usuario.message}
                </ErrorMessage>
              )}
            </FormField>
            
            <FormField>
              <FieldLabel>
                Senha
                <Tooltip title="Digite sua senha">
                  <StyledTooltipIcon />
                </Tooltip>
              </FieldLabel>
              <Controller
                name="senha"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="********"
                    status={errors.senha ? 'error' : ''}
                    iconRender={(visible) => (visible ? <EyeInvisibleOutlined /> : <EyeInvisibleOutlined />)}
                  />
                )}
              />
              {errors.senha && (
                <ErrorMessage>
                  {errors.senha.message}
                </ErrorMessage>
              )}
            </FormField>
            
            <StyledButton type="primary" htmlType="submit" loading={loading}>
              Acessar
            </StyledButton>
            
            <ForgotPasswordLink href="#">
              Esqueci minha senha
            </ForgotPasswordLink>
            
            <PrefLogoContainer>
              <PrefLogoImage src={logoPrefSP} alt="Prefeitura de São Paulo" />
            </PrefLogoContainer>
          </StyledForm>
        </LoginCard>
      </LeftSide>
    </LoginContainer>
  );
};

export default LoginTela;
