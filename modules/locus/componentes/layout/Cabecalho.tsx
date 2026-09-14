import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import brasaoPrefeitura from "@locus/assets/logo-prefeitura-cabecalho.png";
import { Cabecalho as EstiloCabecalho } from "@locus/estilos";
import { useUsuarioLogado } from "@locus/hooks/useUsuarioLogado";
import { encerrarSessao } from "@locus/servicos/recursos/autenticacao";
import { breadcrumbDaRota } from "@locus/rotas/caminhos";

export interface CabecalhoProps {
  aoSair?: () => void;
}

export function Cabecalho({ aoSair = () => encerrarSessao() }: CabecalhoProps) {
  const { pathname } = useLocation();
  const usuario = useUsuarioLogado();

  const itensBreadcrumb = useMemo(
    () =>
      breadcrumbDaRota(pathname).map((item) => ({
        title: item.caminho ? (
          <Link to={item.caminho}>{item.titulo}</Link>
        ) : (
          item.titulo
        ),
      })),
    [pathname],
  );

  return (
    <EstiloCabecalho>
      <EstiloCabecalho.Esquerda>
        <EstiloCabecalho.Esquerda.Logo
          src={brasaoPrefeitura}
          alt="Prefeitura de São Paulo"
        />
        <EstiloCabecalho.Esquerda.Breadcrumb
          separator=">"
          items={itensBreadcrumb}
        />
      </EstiloCabecalho.Esquerda>

      <EstiloCabecalho.Direita>
        <EstiloCabecalho.Direita.UsuarioLogado>
          <EstiloCabecalho.Direita.UsuarioRf>
            RF: {usuario.rf}
          </EstiloCabecalho.Direita.UsuarioRf>
          <EstiloCabecalho.Direita.UsuarioNome>
            {usuario.nome}
          </EstiloCabecalho.Direita.UsuarioNome>
        </EstiloCabecalho.Direita.UsuarioLogado>
        <EstiloCabecalho.Direita.BotaoSair
          type="button"
          onClick={aoSair}
          aria-label="Sair"
        >
          <EstiloCabecalho.Direita.IconeSair aria-hidden>
            <PowerSettingsNewOutlinedIcon fontSize="inherit" />
          </EstiloCabecalho.Direita.IconeSair>
          Sair
        </EstiloCabecalho.Direita.BotaoSair>
      </EstiloCabecalho.Direita>
    </EstiloCabecalho>
  );
}

export default Cabecalho;
