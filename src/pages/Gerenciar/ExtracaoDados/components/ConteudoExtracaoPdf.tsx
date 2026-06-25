import React from "react";
import { Col, Row } from "antd";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CampaignIcon from "@mui/icons-material/Campaign";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ReplayIcon from "@mui/icons-material/Replay";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  TextTitulo,
  TextTituloSecundario,
} from "../../../../components/EstilosCompartilhados";
import type {
  IExtracaoDadosIndicadores,
  IExtracaoDadosIndicadoresComparativo,
} from "../../../../services/resources/relatorios/IExtracaoDados";
import type {
  DreComparativoResumo,
  DreGraficoComparativoItem,
  DreGraficoItem,
  TabelaVagasDreComparativoItem,
  TabelaVagasDreItem,
} from "../utils/mapGraficosDre";
import type {
  AutorizacaoPublicadaItem,
  RelatorioDetalhadoItem,
} from "../utils/mapRelatoriosDetalhados";
import IndicadorCard from "./IndicadorCard";
import IndicadorCardComparativo from "./IndicadorCardComparativo";
import GraficoBarrasDre from "./GraficoBarrasDre";
import GraficoBarrasDreComparativo from "./GraficoBarrasDreComparativo";
import TabelaVagasDre from "./TabelaVagasDre";
import RelatoriosDetalhados from "./RelatoriosDetalhados";
import AutorizacoesPublicadas from "./AutorizacoesPublicadas";
import { IndicatorsCard, PdfHeader } from "../styles";

type ConteudoExtracaoPdfPropsBase = {
  relatoriosDetalhados: RelatorioDetalhadoItem[];
  autorizacoesPublicadas: AutorizacaoPublicadaItem[];
  dataGeracao: string;
};

type ConteudoExtracaoPdfPropsSimples = ConteudoExtracaoPdfPropsBase & {
  isComparativo?: false;
  indicadores: IExtracaoDadosIndicadores;
  graficoEscolhasDre: DreGraficoItem[];
  graficoVagasDre: DreGraficoItem[];
  tabelaVagasDre: TabelaVagasDreItem[];
};

type ConteudoExtracaoPdfPropsComparativo = ConteudoExtracaoPdfPropsBase & {
  isComparativo: true;
  indicadoresComparativo: IExtracaoDadosIndicadoresComparativo;
  anoAntigo: string;
  anoRecente: string;
  dresComparativo: DreComparativoResumo[];
  graficoEscolhasComparativo: DreGraficoComparativoItem[];
  graficoVagasComparativo: DreGraficoComparativoItem[];
  tabelaVagasDreComparativo: TabelaVagasDreComparativoItem[];
};

export type ConteudoExtracaoPdfProps =
  | ConteudoExtracaoPdfPropsSimples
  | ConteudoExtracaoPdfPropsComparativo;

/**
 * Versao "somente conteudo" da tela de Extracao de Dados, usada para gerar o
 * PDF. Renderiza indicadores, graficos e tabelas sem nenhum filtro, header de
 * tela ou menu. Suporta os dois formatos da tela: simples (sem filtro ou 1 ano)
 * e comparativo com estatisticas (2 anos selecionados). Cada bloco capturavel
 * recebe o atributo `data-pdf-section` para que o hook de exportacao consiga
 * iterar e paginar cada secao individualmente.
 */
const ConteudoExtracaoPdf: React.FC<ConteudoExtracaoPdfProps> = (props) => {
  const { relatoriosDetalhados, autorizacoesPublicadas, dataGeracao } = props;

  return (
    <div>
      <div data-pdf-section>
        <PdfHeader>
          <h1>Extração de dados</h1>
          <span>Gerado em {dataGeracao}</span>
        </PdfHeader>

        <IndicatorsCard>
          <Row>
            <Col span={24}>
              <TextTitulo style={{ fontSize: 20, display: "block" }}>Indicadores</TextTitulo>
              <TextTituloSecundario style={{ fontSize: 14, marginTop: 8, display: "block" }}>
                Acompanhe os indicadores, convocações, escolhas e dados consolidados dos concursos públicos.
              </TextTituloSecundario>
              {props.isComparativo && (
                <TextTituloSecundario
                  style={{ fontSize: 14, marginTop: 8, display: "block", fontWeight: 600 }}
                >
                  Acompanhe os indicadores nos anos {props.indicadoresComparativo.anoRecente} e{" "}
                  {props.indicadoresComparativo.anoAntigo}.
                </TextTituloSecundario>
              )}
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: "1.5rem" }}>
            {props.isComparativo ? (
              <>
                <Col xs={24} sm={12} lg={8}>
                  <IndicadorCardComparativo
                    icon={<TaskAltIcon fontSize="small" />}
                    title="Habilitados"
                    anoAntigo={props.indicadoresComparativo.anoAntigo}
                    anoRecente={props.indicadoresComparativo.anoRecente}
                    item={props.indicadoresComparativo.habilitados}
                    breakdown={props.indicadoresComparativo.listaEspecifica.breakdown}
                    modoValorUnico
                    description="Total de pessoas aprovadas e consideradas aptas no concurso"
                  />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <IndicadorCardComparativo
                    icon={<CampaignIcon fontSize="small" />}
                    title="Convocados"
                    anoAntigo={props.indicadoresComparativo.anoAntigo}
                    anoRecente={props.indicadoresComparativo.anoRecente}
                    item={props.indicadoresComparativo.convocados}
                    description="Total de candidatos chamados oficialmente."
                  />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <IndicadorCardComparativo
                    icon={<PersonOffIcon fontSize="small" />}
                    title="Não convocados"
                    anoAntigo={props.indicadoresComparativo.anoAntigo}
                    anoRecente={props.indicadoresComparativo.anoRecente}
                    item={props.indicadoresComparativo.naoConvocados}
                    description="Habilitados que ainda não foram convocados."
                  />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <IndicadorCardComparativo
                    icon={<VerifiedUserIcon fontSize="small" />}
                    title="Autorizações"
                    anoAntigo={props.indicadoresComparativo.anoAntigo}
                    anoRecente={props.indicadoresComparativo.anoRecente}
                    item={props.indicadoresComparativo.autorizacoes}
                    description="Autorizações liberadas para continuidade das contratações."
                  />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <IndicadorCardComparativo
                    icon={<HowToRegIcon fontSize="small" />}
                    title="Escolhas realizadas"
                    anoAntigo={props.indicadoresComparativo.anoAntigo}
                    anoRecente={props.indicadoresComparativo.anoRecente}
                    item={props.indicadoresComparativo.escolhasRealizadas}
                    description="Candidatos que realizaram escolha de vaga ou unidade."
                  />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <IndicadorCardComparativo
                    icon={<ScheduleIcon fontSize="small" />}
                    title="Não escolha"
                    anoAntigo={props.indicadoresComparativo.anoAntigo}
                    anoRecente={props.indicadoresComparativo.anoRecente}
                    item={props.indicadoresComparativo.semEscolha}
                    description="Convocados que decidiram pela não escolha."
                  />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <IndicadorCardComparativo
                    icon={<ReplayIcon fontSize="small" />}
                    title="Reconvocações"
                    anoAntigo={props.indicadoresComparativo.anoAntigo}
                    anoRecente={props.indicadoresComparativo.anoRecente}
                    item={props.indicadoresComparativo.reconvocacoes}
                    description="Candidatos que solicitaram participação em nova chamada."
                  />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <IndicadorCardComparativo
                    icon={<PendingActionsIcon fontSize="small" />}
                    title="Pendentes de escolha"
                    anoAntigo={props.indicadoresComparativo.anoAntigo}
                    anoRecente={props.indicadoresComparativo.anoRecente}
                    item={props.indicadoresComparativo.pendentesEscolha}
                    description="Convocados que ainda não realizaram a escolha de vaga."
                  />
                </Col>
              </>
            ) : (
              <>
                <Col xs={24} sm={12} lg={6}>
                  <IndicadorCard
                    icon={<TaskAltIcon fontSize="small" />}
                    title="Habilitados"
                    value={props.indicadores.habilitados}
                    description="Total de pessoas aprovadas e consideradas aptas no concurso"
                    breakdown={[
                      { label: "Geral", value: props.indicadores.listaGeral },
                      { label: "PCD", value: props.indicadores.listaPcd },
                      { label: "NNA", value: props.indicadores.listaNna },
                    ]}
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <IndicadorCard
                    icon={<CampaignIcon fontSize="small" />}
                    title="Convocados"
                    value={props.indicadores.convocados}
                    description="Total de candidatos chamados oficialmente."
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <IndicadorCard
                    icon={<PersonOffIcon fontSize="small" />}
                    title="Não convocados"
                    value={props.indicadores.naoConvocados}
                    description="Habilitados que ainda não foram convocados."
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <IndicadorCard
                    icon={<VerifiedUserIcon fontSize="small" />}
                    title="Autorizações"
                    value={props.indicadores.autorizacoes}
                    description="Autorizações liberadas para continuidade das contratações."
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <IndicadorCard
                    icon={<HowToRegIcon fontSize="small" />}
                    title="Escolhas realizadas"
                    value={props.indicadores.escolhasRealizadas}
                    description="Candidatos que realizaram escolha de vaga ou unidade."
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <IndicadorCard
                    icon={<ScheduleIcon fontSize="small" />}
                    title="Não escolha"
                    value={props.indicadores.semEscolha}
                    description="Convocados que decidiram pela não escolha."
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <IndicadorCard
                    icon={<ReplayIcon fontSize="small" />}
                    title="Reconvocações"
                    value={props.indicadores.reconvocacoes}
                    description="Candidatos que solicitaram participação em nova chamada."
                  />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <IndicadorCard
                    icon={<PendingActionsIcon fontSize="small" />}
                    title="Pendentes de escolha"
                    value={props.indicadores.pendentesEscolha}
                    description="Convocados que ainda não realizaram a escolha de vaga."
                  />
                </Col>
              </>
            )}
          </Row>
        </IndicatorsCard>
      </div>

      {props.isComparativo ? (
        <>
          <div data-pdf-section data-pdf-chart>
            <GraficoBarrasDreComparativo
              title="Escolhas por DRE"
              subtitle={`Distribuição de escolhas consolidadas por DRE nos anos ${props.anoRecente} e ${props.anoAntigo}.`}
              data={props.graficoEscolhasComparativo}
              resumos={props.dresComparativo}
              tooltipLabel="escolhas"
              corAnoAntigo="#002C8C"
              corAnoRecente="#F5A623"
              layoutBarras="empilhado"
              exibirTituloDreNoTooltip
            />
          </div>

          <div data-pdf-section data-pdf-chart>
            <GraficoBarrasDreComparativo
              title="Total de vagas ofertadas por DRE"
              subtitle={`Comparativo de vagas disponibilizadas em cada DRE nos anos ${props.anoRecente} e ${props.anoAntigo}.`}
              data={props.graficoVagasComparativo}
              resumos={props.dresComparativo}
              tooltipLabel="vagas"
              corAnoAntigo="#0F59C8"
              corAnoRecente="#F5A623"
              layoutBarras="empilhado"
            />
          </div>

          <div data-pdf-section>
            <TabelaVagasDre
              dataComparativo={props.tabelaVagasDreComparativo}
              subtitle={`Tabela com escolhas e percentual de preenchimento nos anos ${props.anoRecente} e ${props.anoAntigo}.`}
            />
          </div>
        </>
      ) : (
        <>
          <div data-pdf-section data-pdf-chart>
            <GraficoBarrasDre
              title="Escolhas por DRE"
              subtitle="Distribuição de escolhas consolidadas por DRE."
              data={props.graficoEscolhasDre}
              tooltipLabel="escolhas"
              barColor="#002C8C"
            />
          </div>

          <div data-pdf-section data-pdf-chart>
            <GraficoBarrasDre
              title="Total de vagas ofertadas por DRE"
              subtitle="Comparativo de vagas disponibilizadas em cada DRE."
              data={props.graficoVagasDre}
              tooltipLabel="vagas"
              barColor="#0F59C8"
            />
          </div>

          <div data-pdf-section>
            <TabelaVagasDre data={props.tabelaVagasDre} />
          </div>
        </>
      )}

      <div data-pdf-section>
        <RelatoriosDetalhados data={relatoriosDetalhados} mostrarFiltros={false} />
      </div>

      <div data-pdf-section>
        <AutorizacoesPublicadas data={autorizacoesPublicadas} />
      </div>
    </div>
  );
};

export default ConteudoExtracaoPdf;
