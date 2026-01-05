import React from "react";
import { Space } from "antd";
import { UserLabel, StyledUserAvatar, UserAvatarIcon } from "../pages/Base/styles";

const getPrimeiroNome = (nomeCompleto?: string | null) => {
  const nome = String(nomeCompleto ?? "").trim();
  if (!nome) return "";
  return nome.split(/\s+/)[0] ?? "";
};

export const UserAvatar: React.FC = () => {
  const nomeCompleto = localStorage.getItem("NOME_USUARIO");
  const primeiroNome = getPrimeiroNome(nomeCompleto);

  return (
    <Space size="small">
      <UserLabel>
        Seja bem vindo(a), {primeiroNome || "Usuário"}
      </UserLabel>
      
      <StyledUserAvatar size="default" icon={<UserAvatarIcon />} />            
    </Space>
  );
};
