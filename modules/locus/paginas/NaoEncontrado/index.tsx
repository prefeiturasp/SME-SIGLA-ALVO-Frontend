import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { PaginaErro } from "@locus/componentes/PaginaErro";
import { ConteudoPagina } from "@locus/estilos";
import { CAMINHOS } from "@locus/rotas/caminhos";

export function NaoEncontrado() {
  const navigate = useNavigate();

  return (
    <ConteudoPagina>
      <PaginaErro   
        titulo="Não encontramos esta página..."
   
        descricao="A página que você procura não está disponível ou o endereço pode estar incorreto. Volte à tela inicial para continuar."
        acao={
          <Button
            type="primary"
            icon={<HomeOutlinedIcon fontSize="small" />}
            onClick={() => navigate(CAMINHOS.cadastroGestaoUnidades)}
          >
            Ir para tela inicial
          </Button>
        }
      />
    </ConteudoPagina>
  );
}

export default NaoEncontrado;
