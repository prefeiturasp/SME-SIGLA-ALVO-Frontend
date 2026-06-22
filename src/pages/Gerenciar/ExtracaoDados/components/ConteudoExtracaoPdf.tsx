import React from "react";
import { Col, Row } from "antd";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import CampaignIcon from "@mui/icons-material/Campaign";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ReplayIcon from "@mui/icons-material/Replay";
import ScheduleIcon from "@mui/icons-material/Schedule";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  TextTitulo,
  TextTituloSecundario,
} from "../../../../components/EstilosCompartilhados";
import type { IExtracaoDadosIndicadores } from "../../../../services/resources/relatorios/IExtracaoDados";
import type { DreGraficoItem, TabelaVagasDreItem } from "../utils/mapGraficosDre";
import type {
  AutorizacaoPublicadaItem,
  RelatorioDetalhadoItem,
} from "../utils/mapRelatoriosDetalhados";
import IndicadorCard from "./IndicadorCard";
import GraficoBarrasDre from "./GraficoBarrasDre";
import TabelaVagasDre from "./TabelaVagasDre";
import RelatoriosDetalhados from "./RelatoriosDetalhados";
import AutorizacoesPublicadas from "./AutorizacoesPublicadas";
import { IndicatorsCard, PdfHeader } from "../styles";

export type ConteudoExtracaoPdfProps = {
  indicadores: IExtracaoDadosIndicadores;
  graficoEscolhasDre: DreGraficoItem[];
  graficoVagasDre: DreGraficoItem[];
  tabelaVagasDre: TabelaVagasDreItem[];
  relatoriosDetalhados: RelatorioDetalhadoItem[];
  autorizacoesPublicadas: AutorizacaoPublicadaItem[];
  dataGeracao: string;
  filtroAplicado?: string;
};

/**
 * Versao "somente conteudo" da tela de Extracao de Dados, usada para gerar o
 * PDF. Renderiza indicadores, graficos e tabelas sem nenhum filtro, header ou
 * menu. Cada bloco capturavel recebe o atributo `data-pdf-section` para que o
 * hook de exportacao consiga iterar e paginar cada secao individualmente.
 */
const ConteudoExtracaoPdf: React.FC<ConteudoExtracaoPdfProps> = ({
  indicadores,
  graficoEscolhasDre,
  graficoVagasDre,
  tabelaVagasDre,
  relatoriosDetalhados,
  autorizacoesPublicadas,
  dataGeracao,
  filtroAplicado,
}) => (
  <div>
    <div data-pdf-section>
      <PdfHeader>
        <h1>Extração de dados</h1>
        <span>Gerado em {dataGeracao}</span>
        <span>Filtro aplicado: {filtroAplicado ?? "Todos os concursos"}</span>
      </PdfHeader>

      <IndicatorsCard>
        <Row>
        <Col span={24}>
          <TextTitulo style={{ fontSize: 20, display: "block" }}>Indicadores</TextTitulo>
          <TextTituloSecundario style={{ fontSize: 14, marginTop: 8, display: "block" }}>
            Acompanhe os indicadores, convocações, escolhas e dados consolidados dos concursos públicos.
          </TextTituloSecundario>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "1.5rem" }}>
        <Col xs={24} sm={12} lg={6}>
          <IndicadorCard
            icon={<TaskAltIcon fontSize="small" />}
            title="Habilitados"
            value={indicadores.habilitados}
            description="Total de pessoas aprovadas e consideradas aptas no concurso"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <IndicadorCard
            icon={<GroupsIcon fontSize="small" />}
            title="Lista específica"
            value={indicadores.listaEspecifica}
            description="Distribuição de candidatos por lista de classificação"
            breakdown={[
              { label: "Geral", value: indicadores.listaGeral },
              { label: "PCD", value: indicadores.listaPcd },
              { label: "NNA", value: indicadores.listaNna },
            ]}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <IndicadorCard
            icon={<CampaignIcon fontSize="small" />}
            title="Convocados"
            value={indicadores.convocados}
            description="Total de candidatos chamados oficialmente."
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <IndicadorCard
            icon={<HowToRegIcon fontSize="small" />}
            title="Escolhas realizadas"
            value={indicadores.escolhasRealizadas}
            description="Candidatos que realizaram escolha de vaga ou unidade."
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <IndicadorCard
            icon={<PersonOffIcon fontSize="small" />}
            title="Não convocados"
            value={indicadores.naoConvocados}
            description="Habilitados que ainda não foram convocados."
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <IndicadorCard
            icon={<ReplayIcon fontSize="small" />}
            title="Reconvocações"
            value={indicadores.reconvocacoes}
            description="Candidatos que solicitaram participação em nova chamada."
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <IndicadorCard
            icon={<ScheduleIcon fontSize="small" />}
            title="Não escolha"
            value={indicadores.semEscolha}
            description="Convocados que decidiram pela não escolha."
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <IndicadorCard
            icon={<VerifiedUserIcon fontSize="small" />}
            title="Autorizações"
            value={indicadores.autorizacoes}
            description="Autorizações liberadas para continuidade das contratações."
          />
        </Col>
      </Row>
      </IndicatorsCard>
    </div>

    <div data-pdf-section data-pdf-chart>
      <GraficoBarrasDre
        title="Escolhas por DRE"
        subtitle="Distribuição de escolhas consolidadas por DRE."
        data={graficoEscolhasDre}
        tooltipLabel="escolhas"
        barColor="#002C8C"
      />
    </div>

    <div data-pdf-section data-pdf-chart>
      <GraficoBarrasDre
        title="Total de vagas ofertadas por DRE"
        subtitle="Comparativo de vagas disponibilizadas em cada DRE."
        data={graficoVagasDre}
        tooltipLabel="vagas"
        barColor="#0F59C8"
      />
    </div>

    <div data-pdf-section>
      <TabelaVagasDre data={tabelaVagasDre} />
    </div>

    <div data-pdf-section>
      <RelatoriosDetalhados data={relatoriosDetalhados} mostrarFiltros={false} />
    </div>

    <div data-pdf-section>
      <AutorizacoesPublicadas data={autorizacoesPublicadas} />
    </div>
  </div>
);

export default ConteudoExtracaoPdf;
