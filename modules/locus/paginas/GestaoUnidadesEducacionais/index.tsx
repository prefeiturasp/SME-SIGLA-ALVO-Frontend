import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { Button } from "antd";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CabecalhoPagina } from "@locus/componentes/CabecalhoPagina";
import { useExportarPdf } from "@locus/hooks/useExportarPdf";
import { ConteudoPagina } from "@locus/estilos";
import { CAMINHOS, caminhoDetalheUE } from "@locus/rotas/caminhos";
import { opcoesComponenteCurricular } from "./dados/dadosEstaticos";
import { useGestaoUnidades } from "./hooks/useGestaoUnidades";
import { CardComponenteCurricular } from "./componentes/CardComponenteCurricular";
import { CardFormFiltrosUnidades } from "./componentes/CardFormFiltrosUnidades";
import { TabelaUnidades } from "./componentes/TabelaUnidades";

export function GestaoUnidadesEducacionais() {
  const navigate = useNavigate();
  const { exportarPdf, exportando } = useExportarPdf();
  const refConteudo = useRef<HTMLDivElement>(null);
  const {
    unidades,
    total,
    componenteSelecionado,
    statusListagem,
    carregando,
    selecionarComponente,
    aplicarFiltros,
    limparFiltros,
  } = useGestaoUnidades();

  return (
    <>
      <CabecalhoPagina
        titulo="Gestão das unidades educacionais"
        acoes={
          <>
            <Button
              type="primary"
              icon={<AddRoundedIcon fontSize="small" />}
              onClick={() => navigate(CAMINHOS.cadastroRegistrarUE)}
            >
              Registrar UE
            </Button>
            <Button
              type="default"
              icon={<FileUploadOutlinedIcon fontSize="small" />}
              loading={exportando}
              onClick={() =>
                exportarPdf(refConteudo, "relatorio-gestao-unidades")
              }
            >
              Exportar relatório
            </Button>
          </>
        }
      />

      <ConteudoPagina ref={refConteudo}>
        <CardComponenteCurricular
          opcoesComponente={opcoesComponenteCurricular}
          componenteSelecionado={componenteSelecionado}
          aoSelecionarComponente={selecionarComponente}
        />

        <CardFormFiltrosUnidades
          aoBuscar={aplicarFiltros}
          aoLimpar={limparFiltros}
        />

        <TabelaUnidades
          unidades={unidades}
          total={total}
          carregando={carregando}
          statusListagem={statusListagem}
          aoSelecionarUnidade={(unidade) =>
            navigate(caminhoDetalheUE(unidade.codigoLotacao))
          }
          aoRegistrar={() => navigate(CAMINHOS.cadastroRegistrarUE)}
        />
      </ConteudoPagina>
    </>
  );
}

export default GestaoUnidadesEducacionais;
