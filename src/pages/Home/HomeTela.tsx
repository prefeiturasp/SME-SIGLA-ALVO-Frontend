import React from "react";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import {
  HomeContainer,
  PromoCard,
  LogoContainer,
  AlvoLogo,
  Tagline,
  DescriptionText,
  FeaturesList,
} from "./styles";
import alvoImg from "../../assets/alvo-img.png";

const breadcrumbItems = [
  {
    title: "Home",
  },
] as TitleItem[];

export const HomeTela: React.FC = () => {
  return (
    <BaseTela breadcrumbItems={breadcrumbItems} title="Página inicial">
      <HomeContainer>
        <PromoCard>
          <LogoContainer>
            <AlvoLogo src={alvoImg} alt="ALVO" />
            <Tagline>ALOCAÇÃO DE VAGAS ONLINE</Tagline>
          </LogoContainer>

          <DescriptionText>
            Sistema para convocação e escolha de habilitados em concursos da
            Secretaria de Educação. Geração de relatórios e acompanhamento dos
            processos de convocação e escolha de vaga.
          </DescriptionText>

          <FeaturesList>
            <li>Convocação de candidatos.</li>
            <li>Processo de escolha de vagas.</li>
            <li>Relatórios detalhados.</li>
            <li>Acompanhamento em tempo real.</li>
          </FeaturesList>
        </PromoCard>
      </HomeContainer>
    </BaseTela>
  );
};
