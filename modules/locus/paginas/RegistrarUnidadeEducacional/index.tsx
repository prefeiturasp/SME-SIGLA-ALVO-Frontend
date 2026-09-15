import { Button } from "antd";
import { CabecalhoPagina } from "@locus/componentes/CabecalhoPagina";
import { ConteudoPagina } from "@locus/estilos";
import { CardCaracteristicasUnidade } from "./componentes/CardCaracteristicasUnidade";
import { CardComponentesCurriculares } from "./componentes/CardComponentesCurriculares";
import { CardDadosUnidade } from "./componentes/CardDadosUnidade";
import { useRegistrarUnidadeEducacional } from "./hooks/useRegistrarUnidadeEducacional";

export function RegistrarUnidadeEducacional() {
  const {
    dados,
    caracteristicas,
    componentes,
    componenteSelecionado,
    quantidadeModulos,
    erroMotivoNaoContabilizacao,
    erroCodigoLotacao,
    erroComponenteCurricular,
    salvando,
    atualizarDados,
    alternarCaracteristica,
    definirComponenteSelecionado,
    definirQuantidadeModulos,
    adicionarComponente,
    removerComponente,
    consultarLotacao,
    cancelar,
    registrar,
  } = useRegistrarUnidadeEducacional();

  return (
    <>
      <CabecalhoPagina
        titulo="Registrar nova Unidade Educacional"
        acoes={
          <>
            <Button type="default" onClick={cancelar} disabled={salvando}>
              Cancelar
            </Button>
            <Button type="primary" onClick={registrar} loading={salvando}>
              Registrar UE
            </Button>
          </>
        }
      />

      <ConteudoPagina>
        <CardDadosUnidade
          dados={dados}
          erroCodigoLotacao={erroCodigoLotacao}
          aoAtualizar={atualizarDados}
          aoConsultar={consultarLotacao}
        />

        <CardCaracteristicasUnidade
          caracteristicas={caracteristicas}
          dados={dados}
          erroMotivoNaoContabilizacao={erroMotivoNaoContabilizacao}
          aoAlternar={alternarCaracteristica}
          aoAtualizarDados={atualizarDados}
        />

        <CardComponentesCurriculares
          componentes={componentes}
          componenteSelecionado={componenteSelecionado}
          quantidadeModulos={quantidadeModulos}
          erroComponenteCurricular={erroComponenteCurricular}
          aoSelecionarComponente={definirComponenteSelecionado}
          aoAlterarQuantidade={definirQuantidadeModulos}
          aoAdicionar={adicionarComponente}
          aoRemover={removerComponente}
        />
      </ConteudoPagina>
    </>
  );
}

export default RegistrarUnidadeEducacional;
