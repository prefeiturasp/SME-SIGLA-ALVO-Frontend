import React, { useMemo, useRef, useState } from "react";
import { Button, Col, Row, Select, Spin, Typography } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CampaignIcon from "@mui/icons-material/Campaign";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ReplayIcon from "@mui/icons-material/Replay";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { CustomFormItem } from "../../../components/FormStyle";
import {
  TabContentContainer,
  TextTitulo,
  TextTituloSecundario,
} from "../../../components/EstilosCompartilhados";
import { useConcursos } from "../../../hooks/useConcursos";
import useConvocacao from "../../Processos/ConvocacaoCandidatos/hooks/useConvocacao";
import type { IListRequest } from "../../../types/IListRequest";
import IndicadorCard from "./components/IndicadorCard";
import IndicadorCardComparativo from "./components/IndicadorCardComparativo";
import { useGetExtracaoDados } from "./hooks/useGetExtracaoDados";
import { useGetExtracaoDadosTodos } from "./hooks/useGetExtracaoDadosTodos";
import GraficoBarrasDre from "./components/GraficoBarrasDre";
import GraficoBarrasDreComparativo from "./components/GraficoBarrasDreComparativo";
import TabelaVagasDre from "./components/TabelaVagasDre";
import RelatoriosDetalhados from "./components/RelatoriosDetalhados";
import AutorizacoesPublicadas from "./components/AutorizacoesPublicadas";
import ConteudoExtracaoPdf from "./components/ConteudoExtracaoPdf";
import { useExportarPdf } from "./hooks/useExportarPdf";
import {
  mapExtracaoDadosToIndicadores,
  mapExtracaoDadosTodosToIndicadores,
} from "./utils/mapIndicadores";
import { mapExtracaoDadosToIndicadoresComparativo } from "./utils/mapIndicadoresComparativo";
import {
  mapDresComparativoPorDre,
  mapDresParaGraficoComparativo,
  mapDresParaGraficoEscolhas,
  mapDresParaGraficoVagas,
  mapDresParaTabela,
  mapDresParaTabelaComparativo,
  mapDresTodosParaGraficoEscolhas,
  mapDresTodosParaGraficoVagas,
  mapDresTodosParaTabela,
} from "./utils/mapGraficosDre";
import {
  mapCargosParaAutorizacoesPublicadas,
  mapConcursoFiltradoParaAutorizacoesPublicadas,
  mapDresConcursosParaRelatoriosDetalhados,
  mapDresParaRelatoriosDetalhados,
} from "./utils/mapRelatoriosDetalhados";
import { FilterActions, FilterCard, IndicatorsCard, ExtracaoFilterSelect } from "./styles";

const { Text } = Typography;

type FiltrosAplicados = {
  concurso_uuid: string;
  anos: string[];
};

const ExtracaoDadosTela: React.FC = () => {
  const [concursoUuid, setConcursoUuid] = useState<string | undefined>();
  const [anos, setAnos] = useState<string[]>([]);
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosAplicados | null>(null);

  const { concursosData, concursosOptionsIsLoading } = useConcursos();

  const paramsProcessosConvocacao = useMemo<IListRequest<{ concurso_uuid: string }>>(
    () => ({
      pagination: { page: 1, page_size: 100 },
      filters: { concurso_uuid: concursoUuid! },
    }),
    [concursoUuid]
  );

  const { processosConvocacaoData, processosConvocacaoIsLoading } = useConvocacao(
    paramsProcessosConvocacao,
    Boolean(concursoUuid)
  );

  const { extracaoDadosTodos, extracaoDadosTodosIsLoading } = useGetExtracaoDadosTodos();

  const { extracaoDados, extracaoDadosIsLoading } = useGetExtracaoDados(
    filtrosAplicados?.concurso_uuid,
    filtrosAplicados?.anos,
    Boolean(filtrosAplicados)
  );

  const dadosIsLoading = filtrosAplicados
    ? extracaoDadosIsLoading
    : extracaoDadosTodosIsLoading;

  const concursosOptions = useMemo(() => {
    if (Array.isArray(concursosData)) {
      return concursosData;
    }

    return concursosData?.results ?? [];
  }, [concursosData]);

  const anoOptions = useMemo(() => {
    const results = processosConvocacaoData?.results ?? [];
    const anos = new Set<string>();

    results.forEach((processo) => {
      if (processo.data_convocacao) {
        anos.add(String(new Date(processo.data_convocacao).getFullYear()));
      }
    });

    return Array.from(anos)
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => ({ value: year, label: year }));
  }, [processosConvocacaoData]);

  // Variantes consolidadas (todos os concursos). Servem de base tanto para a
  // tela (quando nao ha filtro aplicado) quanto para o PDF, que e sempre
  // consolidado independentemente do filtro.
  const indicadoresTodos = useMemo(
    () => mapExtracaoDadosTodosToIndicadores(extracaoDadosTodos),
    [extracaoDadosTodos]
  );
  const graficoEscolhasDreTodos = useMemo(
    () => mapDresTodosParaGraficoEscolhas(extracaoDadosTodos),
    [extracaoDadosTodos]
  );
  const graficoVagasDreTodos = useMemo(
    () => mapDresTodosParaGraficoVagas(extracaoDadosTodos),
    [extracaoDadosTodos]
  );
  const tabelaVagasDreTodos = useMemo(
    () => mapDresTodosParaTabela(extracaoDadosTodos),
    [extracaoDadosTodos]
  );
  const relatoriosDetalhadosTodos = useMemo(
    () => mapDresConcursosParaRelatoriosDetalhados(extracaoDadosTodos, concursosOptions),
    [extracaoDadosTodos, concursosOptions]
  );
  const autorizacoesPublicadasTodos = useMemo(
    () => mapCargosParaAutorizacoesPublicadas(extracaoDadosTodos?.concurso?.cargos),
    [extracaoDadosTodos]
  );

  // Dados exibidos na tela: filtrados quando ha filtro aplicado, senao usam a
  // variante consolidada ja calculada acima.
  const indicadores = useMemo(
    () =>
      filtrosAplicados
        ? mapExtracaoDadosToIndicadores(extracaoDados, filtrosAplicados.anos)
        : indicadoresTodos,
    [extracaoDados, indicadoresTodos, filtrosAplicados]
  );

  const indicadoresComparativo = useMemo(
    () =>
      filtrosAplicados && filtrosAplicados.anos.length === 2
        ? mapExtracaoDadosToIndicadoresComparativo(
            extracaoDados,
            filtrosAplicados.anos
          )
        : null,
    [extracaoDados, filtrosAplicados]
  );

  const graficoEscolhasDre = useMemo(
    () =>
      filtrosAplicados
        ? mapDresParaGraficoEscolhas(extracaoDados, filtrosAplicados.anos)
        : graficoEscolhasDreTodos,
    [extracaoDados, graficoEscolhasDreTodos, filtrosAplicados]
  );

  const graficoVagasDre = useMemo(
    () =>
      filtrosAplicados
        ? mapDresParaGraficoVagas(extracaoDados, filtrosAplicados.anos)
        : graficoVagasDreTodos,
    [extracaoDados, graficoVagasDreTodos, filtrosAplicados]
  );

  const dresComparativo = useMemo(
    () =>
      filtrosAplicados && filtrosAplicados.anos.length === 2
        ? mapDresComparativoPorDre(extracaoDados, filtrosAplicados.anos)
        : [],
    [extracaoDados, filtrosAplicados]
  );

  const graficoEscolhasComparativo = useMemo(
    () => mapDresParaGraficoComparativo(dresComparativo, "escolhas"),
    [dresComparativo]
  );

  const graficoVagasComparativo = useMemo(
    () => mapDresParaGraficoComparativo(dresComparativo, "vagas"),
    [dresComparativo]
  );

  const tabelaVagasDre = useMemo(
    () =>
      filtrosAplicados
        ? mapDresParaTabela(extracaoDados, filtrosAplicados.anos)
        : tabelaVagasDreTodos,
    [extracaoDados, tabelaVagasDreTodos, filtrosAplicados]
  );

  const tabelaVagasDreComparativo = useMemo(
    () => mapDresParaTabelaComparativo(dresComparativo),
    [dresComparativo]
  );

  const relatoriosDetalhados = useMemo(
    () =>
      filtrosAplicados
        ? mapDresParaRelatoriosDetalhados(
            extracaoDados,
            filtrosAplicados.anos,
            filtrosAplicados.concurso_uuid,
            concursosOptions
          )
        : relatoriosDetalhadosTodos,
    [extracaoDados, relatoriosDetalhadosTodos, filtrosAplicados, concursosOptions]
  );

  const pdfRef = useRef<HTMLDivElement>(null);
  const { exportarPdf, isExporting } = useExportarPdf();

  const dataGeracao = useMemo(
    () => new Date().toLocaleDateString("pt-BR"),
    []
  );

  const autorizacoesPublicadas = useMemo(
    () =>
      filtrosAplicados
        ? mapConcursoFiltradoParaAutorizacoesPublicadas(
            extracaoDados?.concurso,
            filtrosAplicados.anos
          )
        : autorizacoesPublicadasTodos,
    [extracaoDados, autorizacoesPublicadasTodos, filtrosAplicados]
  );

  const isComparativo = Boolean(
    filtrosAplicados && filtrosAplicados.anos.length === 2
  );

  const anosComparativo = useMemo(
    () =>
      filtrosAplicados
        ? [...filtrosAplicados.anos].sort((a, b) => a.localeCompare(b))
        : [],
    [filtrosAplicados]
  );

  const anoAntigoComparativo = anosComparativo[0] ?? "";
  const anoRecenteComparativo = anosComparativo.at(-1) ?? "";

  const canFilter = Boolean(concursoUuid && anos.length > 0);

  const breadcrumbItems = useMemo(
    () =>
      [
        {
          title: (
            <Text strong>
              Gerenciar
            </Text>
          ),
        },
        {
          title: (
            <Text strong>
              Extração de dados
            </Text>
          ),
        },
      ] as TitleItem[],
    []
  );

  const handleLimparFiltros = () => {
    setConcursoUuid(undefined);
    setAnos([]);
    setFiltrosAplicados(null);
  };

  const handleFiltrar = () => {
    if (!concursoUuid || !anos.length) {
      return;
    }

    setFiltrosAplicados({
      concurso_uuid: concursoUuid,
      anos,
    });
  };

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Extração de dados"
      buttons={
        <Button
          type="primary"
          size="large"
          icon={<BarChartOutlined />}
          loading={isExporting}
          onClick={() => exportarPdf(pdfRef)}
        >
          Gerar relatório
        </Button>
      }
    >
      <Spin spinning={dadosIsLoading}>
        <TabContentContainer>
          <FilterCard>
            <Row>
              <Col span={24}>
                <TextTituloSecundario>
                  As informações apresentam dados de todos os concursos realizados nos últimos 10 anos.
                  Selecione um concurso e ano específicos para conferir dados mais detalhados.
                </TextTituloSecundario>
              </Col>
            </Row>

            <Row gutter={24} style={{ marginTop: "1.5rem" }}>
              <Col xs={24} md={12}>
                <CustomFormItem label="Concurso" labelCol={{ span: 24 }}>
                  <ExtracaoFilterSelect
                    value={concursoUuid}
                    onChange={(value) => {
                      setConcursoUuid(value as string | undefined);
                      setAnos([]);
                      setFiltrosAplicados(null);
                    }}
                    placeholder="Selecione o concurso"
                    loading={concursosOptionsIsLoading}
                    allowClear
                    suffixIcon={<ExpandMoreIcon style={{ fontSize: "1.5rem", color: "#032B68" }} />}
                  >
                    {concursosOptions.map((concurso: { value: string; label: string }) => (
                      <Select.Option key={concurso.value} value={concurso.value}>
                        {concurso.label}
                      </Select.Option>
                    ))}
                  </ExtracaoFilterSelect>
                </CustomFormItem>
              </Col>
              <Col xs={24} md={12}>
                <CustomFormItem label="Ano" labelCol={{ span: 24 }}>
                  <ExtracaoFilterSelect
                    mode="multiple"
                    maxCount={2}
                    value={anos}
                    onChange={(value) => setAnos(value as string[])}
                    placeholder="Selecione o ano"
                    disabled={!concursoUuid}
                    loading={processosConvocacaoIsLoading}
                    allowClear
                    options={anoOptions}
                    suffixIcon={<ExpandMoreIcon style={{ fontSize: "1.5rem", color: "#032B68" }} />}
                  />
                </CustomFormItem>
              </Col>
            </Row>

            <FilterActions>
              <Button type="primary" ghost size="large" onClick={handleLimparFiltros}>
                Limpar filtros
              </Button>
              <Button
                type="primary"
                size="large"
                disabled={!canFilter}
                onClick={handleFiltrar}
              >
                Filtrar
              </Button>
            </FilterActions>
          </FilterCard>

          <IndicatorsCard>
            <Row>
              <Col span={24}>
                <TextTitulo style={{ fontSize: 20, display: "block" }}>Indicadores</TextTitulo>
                <TextTituloSecundario style={{ fontSize: 14, marginTop: 8, display: "block" }}>
                  Acompanhe os indicadores, convocações, escolhas e dados consolidados dos concursos públicos.
                </TextTituloSecundario>
                {isComparativo && indicadoresComparativo && (
                  <TextTituloSecundario
                    style={{ fontSize: 14, marginTop: 8, display: "block", fontWeight: 600 }}
                  >
                    Acompanhe os indicadores nos anos {indicadoresComparativo.anoRecente} e{" "}
                    {indicadoresComparativo.anoAntigo}.
                  </TextTituloSecundario>
                )}
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "1.5rem" }}>
              {isComparativo && indicadoresComparativo ? (
                <>
                  <Col xs={24} sm={12} lg={8}>
                    <IndicadorCardComparativo
                      icon={<TaskAltIcon fontSize="small" />}
                      title="Habilitados"
                      anoAntigo={indicadoresComparativo.anoAntigo}
                      anoRecente={indicadoresComparativo.anoRecente}
                      item={indicadoresComparativo.habilitados}
                      breakdown={indicadoresComparativo.listaEspecifica.breakdown}
                      modoValorUnico
                      description="Total de pessoas aprovadas e consideradas aptas no concurso"
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <IndicadorCardComparativo
                      icon={<CampaignIcon fontSize="small" />}
                      title="Convocados"
                      anoAntigo={indicadoresComparativo.anoAntigo}
                      anoRecente={indicadoresComparativo.anoRecente}
                      item={indicadoresComparativo.convocados}
                      description="Total de candidatos chamados oficialmente."
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <IndicadorCardComparativo
                      icon={<PersonOffIcon fontSize="small" />}
                      title="Não convocados"
                      anoAntigo={indicadoresComparativo.anoAntigo}
                      anoRecente={indicadoresComparativo.anoRecente}
                      item={indicadoresComparativo.naoConvocados}
                      description="Habilitados que ainda não foram convocados."
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <IndicadorCardComparativo
                      icon={<VerifiedUserIcon fontSize="small" />}
                      title="Autorizações"
                      anoAntigo={indicadoresComparativo.anoAntigo}
                      anoRecente={indicadoresComparativo.anoRecente}
                      item={indicadoresComparativo.autorizacoes}
                      description="Autorizações liberadas para continuidade das contratações."
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <IndicadorCardComparativo
                      icon={<HowToRegIcon fontSize="small" />}
                      title="Escolhas realizadas"
                      anoAntigo={indicadoresComparativo.anoAntigo}
                      anoRecente={indicadoresComparativo.anoRecente}
                      item={indicadoresComparativo.escolhasRealizadas}
                      description="Candidatos que realizaram escolha de vaga ou unidade."
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <IndicadorCardComparativo
                      icon={<ScheduleIcon fontSize="small" />}
                      title="Não escolha"
                      anoAntigo={indicadoresComparativo.anoAntigo}
                      anoRecente={indicadoresComparativo.anoRecente}
                      item={indicadoresComparativo.semEscolha}
                      description="Convocados que decidiram pela não escolha."
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <IndicadorCardComparativo
                      icon={<ReplayIcon fontSize="small" />}
                      title="Reconvocações"
                      anoAntigo={indicadoresComparativo.anoAntigo}
                      anoRecente={indicadoresComparativo.anoRecente}
                      item={indicadoresComparativo.reconvocacoes}
                      description="Candidatos que solicitaram participação em nova chamada."
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <IndicadorCardComparativo
                      icon={<PendingActionsIcon fontSize="small" />}
                      title="Pendentes de escolha"
                      anoAntigo={indicadoresComparativo.anoAntigo}
                      anoRecente={indicadoresComparativo.anoRecente}
                      item={indicadoresComparativo.pendentesEscolha}
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
                      value={indicadores.habilitados}
                      description="Total de pessoas aprovadas e consideradas aptas no concurso"
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
                      icon={<PersonOffIcon fontSize="small" />}
                      title="Não convocados"
                      value={indicadores.naoConvocados}
                      description="Habilitados que ainda não foram convocados."
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
                      icon={<ScheduleIcon fontSize="small" />}
                      title="Não escolha"
                      value={indicadores.semEscolha}
                      description="Convocados que decidiram pela não escolha."
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
                      icon={<PendingActionsIcon fontSize="small" />}
                      title="Pendentes de escolha"
                      value={indicadores.pendentesEscolha}
                      description="Convocados que ainda não realizaram a escolha de vaga."
                    />
                  </Col>
                </>
              )}
            </Row>
          </IndicatorsCard>

          {isComparativo ? (
            <>
              <GraficoBarrasDreComparativo
                title="Escolhas por DRE"
                subtitle={`Distribuição de escolhas consolidadas por DRE nos anos ${anoRecenteComparativo} e ${anoAntigoComparativo}.`}
                data={graficoEscolhasComparativo}
                resumos={dresComparativo}
                tooltipLabel="escolhas"
                corAnoAntigo="#002C8C"
                corAnoRecente="#F5A623"
                layoutBarras="empilhado"
                exibirTituloDreNoTooltip
              />

              <GraficoBarrasDreComparativo
                title="Total de vagas ofertadas por DRE"
                subtitle={`Comparativo de vagas disponibilizadas em cada DRE nos anos ${anoRecenteComparativo} e ${anoAntigoComparativo}.`}
                data={graficoVagasComparativo}
                resumos={dresComparativo}
                tooltipLabel="vagas"
                corAnoAntigo="#0F59C8"
                corAnoRecente="#F5A623"
                layoutBarras="empilhado"
              />

              <TabelaVagasDre
                dataComparativo={tabelaVagasDreComparativo}
                subtitle={`Tabela com escolhas e percentual de preenchimento nos anos ${anoRecenteComparativo} e ${anoAntigoComparativo}.`}
              />
            </>
          ) : (
            <>
              <GraficoBarrasDre
                title="Escolhas por DRE"
                subtitle="Distribuição de escolhas consolidadas por DRE."
                data={graficoEscolhasDre}
                tooltipLabel="escolhas"
                barColor="#002C8C"
              />

              <GraficoBarrasDre
                title="Total de vagas ofertadas por DRE"
                subtitle="Comparativo de vagas disponibilizadas em cada DRE."
                data={graficoVagasDre}
                tooltipLabel="vagas"
                barColor="#0F59C8"
              />

              <TabelaVagasDre data={tabelaVagasDre} />
            </>
          )}

          <RelatoriosDetalhados
            data={relatoriosDetalhados}
            anos={filtrosAplicados?.anos}
          />

          <AutorizacoesPublicadas data={autorizacoesPublicadas} />
        </TabContentContainer>
      </Spin>

      {/* Conteudo renderizado fora da viewport, capturado para o PDF. Reflete o
          filtro aplicado na tela: comparativo (2 anos) ou simples (sem filtro
          ou 1 ano). */}
      <div
        ref={pdfRef}
        aria-hidden
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: "1123px",
          backgroundColor: "#ffffff",
          padding: "24px",
        }}
      >
        {isComparativo && indicadoresComparativo ? (
          <ConteudoExtracaoPdf
            isComparativo
            indicadoresComparativo={indicadoresComparativo}
            anoAntigo={anoAntigoComparativo}
            anoRecente={anoRecenteComparativo}
            dresComparativo={dresComparativo}
            graficoEscolhasComparativo={graficoEscolhasComparativo}
            graficoVagasComparativo={graficoVagasComparativo}
            tabelaVagasDreComparativo={tabelaVagasDreComparativo}
            relatoriosDetalhados={relatoriosDetalhados}
            autorizacoesPublicadas={autorizacoesPublicadas}
            dataGeracao={dataGeracao}
          />
        ) : (
          <ConteudoExtracaoPdf
            indicadores={indicadores}
            graficoEscolhasDre={graficoEscolhasDre}
            graficoVagasDre={graficoVagasDre}
            tabelaVagasDre={tabelaVagasDre}
            relatoriosDetalhados={relatoriosDetalhados}
            autorizacoesPublicadas={autorizacoesPublicadas}
            dataGeracao={dataGeracao}
          />
        )}
      </div>
    </BaseTela>
  );
};

export default ExtracaoDadosTela;
