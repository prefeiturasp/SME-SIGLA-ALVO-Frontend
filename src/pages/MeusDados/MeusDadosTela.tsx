import React, { useState } from "react";
import { Button, Avatar, Spin } from "antd";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import BaseTela from "../Base/BaseTela";
import AlterarSenhaModal from "./components/AlterarSenhaModal";
import { useGetMeusDados } from "./hooks/useGetMeusDados";
import { StandardInput } from "../../components/EstilosCompartilhados";
import {
  CardContainer,
  AvatarCard,
  NomeUsuario,
  InfoLine,
  FieldsContainer,
  FieldLabel,
  FieldRow,
} from "./MeusDadosTela.styles";

const MeusDadosTela: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useGetMeusDados();

  const nomeCompleto = data?.nome_completo ?? "";
  const rf = data?.rf ?? "";
  const email = data?.email ?? "";
  const perfis = data?.perfil_acesso ?? [];

  return (
    <BaseTela
      breadcrumbItems={[{ title: "Início" }, { title: "Meus dados" }]}
      title="Meus dados"
    >
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Spin size="large" />
        </div>
      ) : (
        <CardContainer>
          <AvatarCard>
            <Avatar
              size={72}
              icon={<AccountCircleRoundedIcon style={{ fontSize: "3rem", color: "#3f51b5" }} />}
              style={{ background: "none" }}
            />
            <NomeUsuario>{nomeCompleto || "—"}</NomeUsuario>
            <InfoLine>RF: {rf || "—"}</InfoLine>
          </AvatarCard>

          <FieldsContainer>
            <div>
              <FieldLabel>Nome completo</FieldLabel>
              <StandardInput value={nomeCompleto} disabled />
            </div>

            <div>
              <FieldLabel>E-mail</FieldLabel>
              <FieldRow>
                <StandardInput value={email} disabled style={{ flex: 1 }} />
              </FieldRow>
            </div>

            <div>
              <FieldLabel>Senha</FieldLabel>
              <FieldRow>
                <StandardInput
                  type="password"
                  value="••••••••••"
                  disabled
                  style={{ flex: 1 }}
                />
                <Button onClick={() => setIsModalOpen(true)}>
                  Alterar senha
                </Button>
              </FieldRow>
            </div>

            <div>
              <FieldLabel>RF</FieldLabel>
              <StandardInput value={rf} disabled />
            </div>

            <div>
              <FieldLabel>Perfil de acesso</FieldLabel>
              <StandardInput value={perfis.join(", ") || "—"} disabled />
            </div>
          </FieldsContainer>
        </CardContainer>
      )}

      <AlterarSenhaModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </BaseTela>
  );
};

export default MeusDadosTela;
