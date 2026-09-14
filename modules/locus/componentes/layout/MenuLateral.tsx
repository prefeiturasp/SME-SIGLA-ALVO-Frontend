import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import logoLocus from "@locus/assets/logo-locus.svg";
import {
  BotaoSairMenu,
  MenuLateralMenu,
  MenuLogo,
  MenuLogoImagem,
  MenuRodape,
  MenuSider,
} from "@locus/estilos";
import { layout as tokensLayout } from "@locus/estilos/tokens/tokens";
import { encerrarSessao } from "@locus/servicos/recursos/autenticacao";
import { ITENS_MENU, menuItemAtivo } from "./MenuLateral.itens";

export function MenuLateral() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const itensMenu = useMemo(
    () =>
      ITENS_MENU.map(({ key, label, icone: Icone, path }) => ({
        key: key,
        icon: <Icone fontSize="inherit" />,
        label: label,
        disabled: !path,
        onClick: path ? () => navigate(path) : undefined,
      })),
    [navigate],
  );

  const chaveAtiva = menuItemAtivo(pathname);

  return (
    <MenuSider width={tokensLayout.menuWidth} theme="dark">
      <MenuLogo>
        <MenuLogoImagem src={logoLocus} alt="Locus" />
      </MenuLogo>

      <MenuLateralMenu
        mode="inline"
        theme="dark"
        selectedKeys={chaveAtiva ? [chaveAtiva] : []}
        items={itensMenu}
      />

      <MenuRodape>
        <BotaoSairMenu
          type="button"
          onClick={() => encerrarSessao()}
          aria-label="Sair"
        >
          <LogoutOutlinedIcon fontSize="inherit" />
        </BotaoSairMenu>
      </MenuRodape>
    </MenuSider>
  );
}

export default MenuLateral;
