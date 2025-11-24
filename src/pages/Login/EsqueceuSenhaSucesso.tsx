import React from "react";
import logoPrefSP from "../../assets/logo_PrefSP_sem fundo_horizontal_fundo claro.png";
import { useEsqueceuSenhaSucesso } from "./hooks/useEsqueceuSenhaSucesso";
import {
  LoginContainer,
  LeftSide,
  LoginCard,
  StyledForm,
  StyledButton,
  PrefLogoContainer,
  PrefLogoImage,
  StyledTitle,
  StyledText,
  BackToLoginButton,
  StyledAlert,
  SuccessMessage,
  EmailText,
  InstructionsText,
} from "./style";

const EsqueceuSenhaSucesso: React.FC = () => {
  const {
    loading,
    usuarioEmail,
    usuarioRf,
    handleBackToLogin,
  } = useEsqueceuSenhaSucesso();

  return (
    <LoginContainer>
      <LeftSide>
        <LoginCard>
          <StyledTitle level={2}>
            Recuperação de senha
          </StyledTitle>
            
          <StyledAlert
            message={
              <SuccessMessage>
                Seu link de recuperação de senha foi enviado para{" "}
                <EmailText>{usuarioEmail}</EmailText>
              </SuccessMessage>
            }
            type="success"
            showIcon
            description={
              <InstructionsText>
                Verifique sua caixa de entrada ou lixo eletrônico.
              </InstructionsText>
            }
          />
          
          <StyledForm>
            <StyledButton 
              type="primary" 
              onClick={handleBackToLogin}
              loading={loading}
            >
              Continuar
            </StyledButton>
            
            <PrefLogoContainer>
              <PrefLogoImage src={logoPrefSP} alt="Prefeitura de São Paulo" />
            </PrefLogoContainer>
          </StyledForm>
        </LoginCard>
      </LeftSide>
    </LoginContainer>
  );
};

export default EsqueceuSenhaSucesso;
