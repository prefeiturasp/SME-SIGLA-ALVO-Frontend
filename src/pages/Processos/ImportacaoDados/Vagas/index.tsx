import React from "react";
import { PlaceholderContainer, PlaceholderText } from "./styles";
import {
  ActionButtonsContainer,
  SecondaryButton,
  PrimaryButton,
} from "../../../../components/estilosCompartilhados/styles";

interface VagasProps {
  onShowLayoutPadrao: () => void;
}

const Vagas: React.FC<VagasProps> = ({ onShowLayoutPadrao }) => {
  return (
    <PlaceholderContainer>
      <PlaceholderText>Esta aba será implementada em breve.</PlaceholderText>
      
      {/* Botões de Ação */}
      <ActionButtonsContainer>
        <PrimaryButton
          type="primary"
          size="large"
          onClick={onShowLayoutPadrao}
        >
          Layout padrão
        </PrimaryButton>
      </ActionButtonsContainer>
    </PlaceholderContainer>
  );
};

export default Vagas;
