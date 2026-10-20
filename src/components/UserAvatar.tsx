import React from "react";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import {
  UsuarioCabecalho,
  UsuarioLogadoBotao,
  UsuarioRf,
  UsuarioNome,
  BotaoSairCabecalho,
  IconeSairCabecalho,
} from "@/components/ui";
import { useNavigate } from "react-router-dom";

export const UserAvatar: React.FC = () => {
  const rf =
    localStorage.getItem("RF_USUARIO") || localStorage.getItem("USUARIO") || "";
  const nome = localStorage.getItem("NOME_USUARIO") || "Usuário";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USUARIO");
    localStorage.removeItem("RF_USUARIO");
    localStorage.removeItem("NOME_USUARIO");
    navigate("/login");
  };

  return (
    <UsuarioCabecalho>
      <UsuarioLogadoBotao
        type="button"
        onClick={() => navigate("/meus-dados")}
        aria-label="Dados do usuário"
      >
        <UsuarioRf>RF: {rf}</UsuarioRf>
        <UsuarioNome title={nome}>{nome}</UsuarioNome>
      </UsuarioLogadoBotao>
      <BotaoSairCabecalho type="button" onClick={handleLogout} aria-label="Sair">
        <IconeSairCabecalho aria-hidden>
          <PowerSettingsNewOutlinedIcon fontSize="inherit" />
        </IconeSairCabecalho>
        Sair
      </BotaoSairCabecalho>
    </UsuarioCabecalho>
  );
};
