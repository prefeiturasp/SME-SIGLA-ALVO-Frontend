import React from "react";
import { Input } from "antd";
import { Controller } from "react-hook-form";
import { CheckCircleFilled } from "@ant-design/icons";
import logoPrefSP from "../../assets/logo_PrefSP_sem fundo_horizontal_fundo claro.png";
import { useNovaSenha } from "./hooks/useNovaSenha";
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
  BackToLoginButton,
  ImportantNoticeContainer,
  ImportantText,
  NoticeText,
  PasswordRequirementsList,
  PasswordRequirementTitle,
  RequirementItem,
} from "./style";

const NovaSenhaTela: React.FC = () => {
  const {
    loading,
    alert,
    control,
    handleSubmit,
    errors,
    isButtonDisabled,
    hasMinLength,
    hasLowerCase,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
    hasNoSpaces,
    hasNoAccents,
    handleCancel,
  } = useNovaSenha();

  return (
    <LoginContainer>
      <LeftSide>
        <LoginCard>
          <StyledTitle level={2}>
            Crie uma nova senha
          </StyledTitle>
          
          <StyledText>
            Esta será sua nova senha de acesso ao SIGLA
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
              <FieldLabel>Nova senha</FieldLabel>
              <Controller
                name="nova_senha"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="••••••••••••"
                    status={errors.nova_senha ? 'error' : ''}
                  />
                )}
              />
              {errors.nova_senha && (
                <ErrorMessage>
                  {errors.nova_senha.message}
                </ErrorMessage>
              )}
            </FormField>

            <PasswordRequirementsList>
              <PasswordRequirementTitle>
                Por questões de segurança, a senha deve seguir os seguintes critérios:
              </PasswordRequirementTitle>
              
              <RequirementItem $met={hasLowerCase}>
                <CheckCircleFilled />
                <span>Ao menos uma letra minúscula</span>
              </RequirementItem>
              
              <RequirementItem $met={hasUpperCase}>
                <CheckCircleFilled />
                <span>Ao menos uma letra maiúscula</span>
              </RequirementItem>
              
              <RequirementItem $met={hasMinLength}>
                <CheckCircleFilled />
                <span>Entre 8 e 12 caracteres</span>
              </RequirementItem>
              
              <RequirementItem $met={hasNumber}>
                <CheckCircleFilled />
                <span>Ao menos um caracter numérico</span>
              </RequirementItem>
              
              <RequirementItem $met={hasSpecialChar}>
                <CheckCircleFilled />
                <span>Ao menos um caracter especial (#$@!%&*?)</span>
              </RequirementItem>
              
              <RequirementItem $met={hasNoSpaces}>
                <CheckCircleFilled />
                <span>Não deve conter espaços em branco</span>
              </RequirementItem>
              
              <RequirementItem $met={hasNoAccents}>
                <CheckCircleFilled />
                <span>Não deve conter caracteres acentuados</span>
              </RequirementItem>
            </PasswordRequirementsList>
            
            <FormField>
              <FieldLabel>Confirmação da nova senha</FieldLabel>
              <Controller
                name="confirmar_senha"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="••••••••••••"
                    status={errors.confirmar_senha ? 'error' : ''}
                  />
                )}
              />
              {errors.confirmar_senha && (
                <ErrorMessage>
                  {errors.confirmar_senha.message}
                </ErrorMessage>
              )}
            </FormField>
            
            <ImportantNoticeContainer>
              <ImportantText>Importante!</ImportantText>{" "}
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
              Salvar senha
            </StyledButton>
            
            <BackToLoginButton onClick={handleCancel}>
              Cancelar
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

export default NovaSenhaTela;

