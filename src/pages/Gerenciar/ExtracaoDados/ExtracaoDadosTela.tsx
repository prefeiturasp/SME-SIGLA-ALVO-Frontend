import React, { useMemo, useRef, useState } from "react";
import { Button, Col, Row, Select, Spin, Typography } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import CampaignIcon from "@mui/icons-material/Campaign";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ReplayIcon from "@mui/icons-material/Replay";
import ScheduleIcon from "@mui/icons-material/Schedule";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { CustomFormItem } from "../../../components/FormStyle";
import {
  TabContentContainer,
  TextTitulo,
  TextTituloSecundario,
  StyledSelect,
} from "../../../components/EstilosCompartilhados";
import { useConcursos } from "../../../hooks/useConcursos";
import useConvocacao from "../../Processos/ConvocacaoCandidatos/hooks/useConvocacao";
import type { IListRequest } from "../../../types/IListRequest";
import IndicadorCard from "./components/IndicadorCard";
import { useGetExtracaoDados } from "./hooks/useGetExtracaoDados";
import { useGetExtracaoDadosTodos } from "./hooks/useGetExtracaoDadosTodos";
import GraficoBarrasDre from "./components/GraficoBarrasDre";
import TabelaVagasDre from "./components/TabelaVagasDre";
import RelatoriosDetalhados from "./components/RelatoriosDetalhados";
import ConteudoExtracaoPdf from "./components/ConteudoExtracaoPdf";
import { useExportarPdf } from "./hooks/useExportarPdf";
import {
  mapExtracaoDadosToIndicadores,
  mapExtracaoDadosTodosToIndicadores,
} from "./utils/mapIndicadores";
import {
  mapDresParaGraficoEscolhas,
  mapDresParaGraficoVagas,
  mapDresParaTabela,
  mapDresTodosParaGraficoEscolhas,
  mapDresTodosParaGraficoVagas,
  mapDresTodosParaTabela,
} from "./utils/mapGraficosDre";
import {
  mapDresConcursosParaRelatoriosDetalhados,
  mapDresParaRelatoriosDetalhados,
} from "./utils/mapRelatoriosDetalhados";
import { FilterActions, FilterCard, IndicatorsCard } from "./styles";

const { Text } = Typography;

type FiltrosAplicados = {
  concurso_uuid: string;
  ano: string;
};

const ExtracaoDadosTela: React.FC = () => {
  const [concursoUuid, setConcursoUuid] = useState<string | undefined>();
  const [ano, setAno] = useState<string | undefined>();
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
    filtrosAplicados?.ano,
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

  // Dados exibidos na tela: filtrados quando ha filtro aplicado, senao usam a
  // variante consolidada ja calculada acima.
  const indicadores = useMemo(
    () =>
      filtrosAplicados
        ? mapExtracaoDadosToIndicadores(extracaoDados, filtrosAplicados.ano)
        : indicadoresTodos,
    [extracaoDados, indicadoresTodos, filtrosAplicados]
  );

  const graficoEscolhasDre = useMemo(
    () =>
      filtrosAplicados
        ? mapDresParaGraficoEscolhas(extracaoDados, filtrosAplicados.ano)
        : graficoEscolhasDreTodos,
    [extracaoDados, graficoEscolhasDreTodos, filtrosAplicados]
  );

  const graficoVagasDre = useMemo(
    () =>
      filtrosAplicados
        ? mapDresParaGraficoVagas(extracaoDados, filtrosAplicados.ano)
        : graficoVagasDreTodos,
    [extracaoDados, graficoVagasDreTodos, filtrosAplicados]
  );

  const tabelaVagasDre = useMemo(
    () =>
      filtrosAplicados
        ? mapDresParaTabela(extracaoDados, filtrosAplicados.ano)
        : tabelaVagasDreTodos,
    [extracaoDados, tabelaVagasDreTodos, filtrosAplicados]
  );

  const relatoriosDetalhados = useMemo(
    () =>
      filtrosAplicados
        ? mapDresParaRelatoriosDetalhados(
            extracaoDados,
            filtrosAplicados.ano,
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

  // Descricao do filtro selecionado na tela, exibida no cabecalho do PDF.
  // Os dados do PDF permanecem consolidados; isto e apenas informativo.
  const filtroAplicado = useMemo(() => {
    const partes: string[] = [];

    if (concursoUuid) {
      const concursoSelecionado = concursosOptions.find(
        (concurso: { value: string; label: string }) =>
          concurso.value === concursoUuid
      );
      partes.push(`Concurso: ${concursoSelecionado?.label ?? concursoUuid}`);
    }

    if (ano) {
      partes.push(`Ano: ${ano}`);
    }

    return partes.length > 0 ? partes.join(" | ") : undefined;
  }, [concursoUuid, ano, concursosOptions]);

  const canFilter = Boolean(concursoUuid && ano);

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
    setAno(undefined);
    setFiltrosAplicados(null);
  };

  const handleFiltrar = () => {
    if (!concursoUuid || !ano) {
      return;
    }

    setFiltrosAplicados({
      concurso_uuid: concursoUuid,
      ano: ano,
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
                  <StyledSelect
                    value={concursoUuid}
                    onChange={(value) => {
                      setConcursoUuid(value as string | undefined);
                      setAno(undefined);
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
                  </StyledSelect>
                </CustomFormItem>
              </Col>
              <Col xs={24} md={12}>
                <CustomFormItem label="Ano" labelCol={{ span: 24 }}>
                  <StyledSelect
                    value={ano}
                    onChange={(value) => setAno(value as string | undefined)}
                    placeholder="Selecione o ano"
                    disabled={!concursoUuid}
                    loading={processosConvocacaoIsLoading}
                    allowClear
                    suffixIcon={<ExpandMoreIcon style={{ fontSize: "1.5rem", color: "#032B68" }} />}
                  >
                    {anoOptions.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </StyledSelect>
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

          <RelatoriosDetalhados data={relatoriosDetalhados} />
        </TabContentContainer>
      </Spin>

      {/* Versao consolidada renderizada fora da viewport, capturada para o PDF. */}
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
        <ConteudoExtracaoPdf
          indicadores={indicadoresTodos}
          graficoEscolhasDre={graficoEscolhasDreTodos}
          graficoVagasDre={graficoVagasDreTodos}
          tabelaVagasDre={tabelaVagasDreTodos}
          relatoriosDetalhados={relatoriosDetalhadosTodos}
          dataGeracao={dataGeracao}
          filtroAplicado={filtroAplicado}
        />
      </div>
    </BaseTela>
  );
};

export default ExtracaoDadosTela;
