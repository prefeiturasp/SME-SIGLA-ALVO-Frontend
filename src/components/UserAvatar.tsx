import React from "react";
import { Space, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { UserLabel, StyledUserAvatar, UserAvatarIcon } from "../pages/Base/styles";
import { useNavigate } from "react-router-dom";
import { useGetMeusDados } from "../pages/MeusDados/hooks/useGetMeusDados";

const getPrimeiroNome = (nomeCompleto?: string | null) => {
  const nome = String(nomeCompleto ?? "").trim();
  if (!nome) return "";
  return nome.split(/\s+/)[0] ?? "";
};

export const UserAvatar: React.FC = () => {
  const { data } = useGetMeusDados();
  const primeiroNome = getPrimeiroNome(data?.nome_completo) || localStorage.getItem("NOME_USUARIO") || "Usuário";
  const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USUARIO");
    navigate("/login");
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "meus-dados",
      label: "Dados do usuário",
      onClick: () => navigate("/meus-dados"),
    },
    {
      type: "divider",
    },
    {
      key: "sair",
      label: "Sair",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Space size="small">
      <UserLabel>
        Seja bem vindo(a), {primeiroNome}
      </UserLabel>

      <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
        <StyledUserAvatar
          size="default"
          icon={<UserAvatarIcon />}
          style={{ cursor: "pointer" }}
        />
      </Dropdown>
    </Space>
  );
};
