import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CabecalhoSecao } from "@locus/componentes/CabecalhoSecao";
import { ColunaComInfo } from "@locus/componentes/ColunaComInfo";
import { UnidadesSemDados } from "./UnidadesSemDados";
import { criarPaginacaoPadrao, FormItem, TagVagas } from "@locus/estilos";
import { Table } from "antd";
import { TAMANHO_PAGINA } from "@locus/paginas/GestaoUnidadesEducacionais/dados/dadosEstaticos";
import { DICAS_COLUNAS_UNIDADE } from "@locus/servicos/recursos/unidadesEducacionais/textos";
import type { StatusListagemUnidades } from "@locus/servicos/recursos/unidadesEducacionais";
import type { UnidadeEducacional } from "@locus/servicos/recursos/unidadesEducacionais/tipos";
import { formatarNumeroPadded } from "@locus/utilitarios/formatadores";

const { RangePicker } = DatePicker;

const colunas: ColumnsType<UnidadeEducacional> = [
  {
    title: "Código de lotação",
    dataIndex: "codigoLotacao",
    key: "codigoLotacao",
  },
  { title: "Tipo", dataIndex: "tipo", key: "tipo" },
  { title: "Unidade Educacional", dataIndex: "nome", key: "nome" },
  { title: "DRE", dataIndex: "dre", key: "dre" },
  {
    title: <ColunaComInfo titulo="Módulo" dica={DICAS_COLUNAS_UNIDADE.modulo} />,
    dataIndex: "modulo",
    key: "modulo",
  },
  {
    title: (
      <ColunaComInfo titulo="Lotação" dica={DICAS_COLUNAS_UNIDADE.lotacao} />
    ),
    dataIndex: "lotacao",
    key: "lotacao",
  },
  {
    title: (
      <ColunaComInfo titulo="Afastados" dica={DICAS_COLUNAS_UNIDADE.afastados} />
    ),
    dataIndex: "afastados",
    key: "afastados",
    render: (valor: number) => formatarNumeroPadded(valor),
  },
  {
    title: <ColunaComInfo titulo="Vagas" dica={DICAS_COLUNAS_UNIDADE.vagas} />,
    dataIndex: "saldoVagas",
    key: "saldoVagas",
    render: (saldo: number) => <TagVagas saldo={saldo} />,
  },
];

export interface TabelaUnidadesProps {
  unidades: UnidadeEducacional[];
  total: number;
  carregando: boolean;
  statusListagem: StatusListagemUnidades;
  aoSelecionarUnidade?: (unidade: UnidadeEducacional) => void;
  aoRegistrar?: () => void;
}

export function TabelaUnidades({
  unidades,
  total,
  carregando,
  statusListagem,
  aoSelecionarUnidade,
  aoRegistrar,
}: TabelaUnidadesProps) {
  const semResultado = statusListagem === "semResultado";

  return (
    <section>
      <div style={{ padding: "0 8px" }}>
        <CabecalhoSecao
          titulo="Unidades educacionais"
          descricao="Clique em uma unidade educacional para conferir os módulos de cada componente curricular. Você também pode selecionar um período para consultar as movimentações realizadas nesse intervalo."
          acao={
            <FormItem
              label="Selecione um período"
              htmlFor="periodo"
              layout="vertical"
              style={{ marginBottom: 0 }}
            >
              <RangePicker
                id="periodo"
                format="DD/MM/YYYY"
                placeholder={["00/00/0000", "00/00/0000"]}
                disabled={semResultado}
              />
            </FormItem>
          }
        />
      </div>

      {semResultado ? (
        <UnidadesSemDados
          titulo="Não encontramos dados para esta busca"
          descricao="Experimente remover alguns filtros ou selecionar outros critérios de busca."
        />
      ) : statusListagem === "semCadastro" ? (
        <UnidadesSemDados
          titulo="Não há unidades educacionais cadastradas"
          descricao="Que tal registrar a primeira UE agora?"
          acao={
            <Button
              type="primary"
              icon={<AddRoundedIcon fontSize="small" />}
              onClick={aoRegistrar}
            >
              Registrar UE
            </Button>
          }
        />
      ) : (
        <Table
          rowKey="codigoLotacao"
          columns={colunas}
          dataSource={unidades}
          loading={carregando}
          rowClassName={(_, indice) =>
            [
              indice % 2 === 1 ? "linhaPar" : "",
              aoSelecionarUnidade ? "linhaClicavel" : "",
            ]
              .filter(Boolean)
              .join(" ")
          }
          onRow={(unidade) => ({
            onClick: () => aoSelecionarUnidade?.(unidade),
            role: aoSelecionarUnidade ? "button" : undefined,
            tabIndex: aoSelecionarUnidade ? 0 : undefined,
            onKeyDown: (evento) => {
              if (
                aoSelecionarUnidade &&
                (evento.key === "Enter" || evento.key === " ")
              ) {
                evento.preventDefault();
                aoSelecionarUnidade(unidade);
              }
            },
          })}
          pagination={criarPaginacaoPadrao({
            total,
            pageSize: TAMANHO_PAGINA,
          })}
        />
      )}
    </section>
  );
}

export default TabelaUnidades;
