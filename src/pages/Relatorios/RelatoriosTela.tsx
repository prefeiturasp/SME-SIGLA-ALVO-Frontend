import React, { useCallback, useMemo, useState } from "react";
import { Col, Row, Radio, Table, Typography, Card, Modal, Spin, message } from "antd";
import type { RadioChangeEvent } from "antd";
import { EyeOutlined, FileExcelOutlined, FilePdfOutlined, FileWordOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { useRelatorios } from "./hooks/useRelatorios";
import ListaCandidatosSessaoModal from "./components/ListaCandidatosSessaoModal";
import { usePostRelatorio } from "./hooks/usePostRelatorio";
import { FilterSelect, FilterLabel } from "../EscolhaCandidatos/styles";
import PersonalizacaoModal from "./components/PersonalizacaoModal";
import type { RelatorioLinha } from "../../services/resources/relatorios/IRelatorios";

type RelatorioTipo = "EM_ANDAMENTO" | "FINALIZADO";

const { Text } = Typography;

const RelatoriosTela: React.FC = () => {
  const navigate = useNavigate();
  const [tipoRelatorio, setTipoRelatorio] = useState<RelatorioTipo>("EM_ANDAMENTO");
  const [filtroSelect, setFiltroSelect] = useState<string | undefined>(undefined);
  const [cabecalhoHtml] = useState<string>("");
  const [processoError, setProcessoError] = useState<string | undefined>(undefined);

  const breadcrumbItems = useMemo(
    () => [
      {
        title: (
          <Text
            strong
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Home
          </Text>
        ),
      },
      { title: "Relatórios" },
    ] as TitleItem[],
    [navigate]
  );

  const { processosConvocacaoOptions, processosConvocacaoOptionsIsLoading } = useRelatorios();
  const { postRelatorio, isPostingRelatorio } = usePostRelatorio();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [previewText, setPreviewText] = useState<string | undefined>(undefined);
  const [previewHtml, setPreviewHtml] = useState<string | undefined>(undefined);

  const [listaModalOpen, setListaModalOpen] = useState(false);
  const [listaSelectedOption, setListaSelectedOption] = useState<string | undefined>(undefined);
  const [listaSelectedCandidatosUuids, setListaSelectedCandidatosUuids] = useState<string[] | undefined>(undefined);
  const [personalizacaoModalOpen, setPersonalizacaoModalOpen] = useState(false);
  const [selectedRelatorioForPersonalizacao, setSelectedRelatorioForPersonalizacao] = useState<RelatorioLinha | null>(null);
  type PendingListaAction =
    | { action: "visualizar" }
    | { action: "export"; formato: "xls" | "pdf" | "docx" };
  const [pendingListaAction, setPendingListaAction] = useState<
    ({ record: RelatorioLinha } & PendingListaAction) | null
  >(null);

  const dataSource: RelatorioLinha[] = useMemo(
    () => [
      { key: "LAUDA_VAGAS", tipo: "Lauda de vagas" },
      { key: "LAUDA_CONVOCACAO", tipo: "Lauda de Convocação" },
      { key: "RELACAO_VAGAS", tipo: "Relação de Vagas" },
      { key: "SUMULA_ESCOLHAS", tipo: "Súmula de Escolhas" },
      { key: "SUMULA_RECONVOCACAO", tipo: "Súmula de Reconvocados" },
      { key: "SUMULA_NAO_ESCOLHAS", tipo: "Súmula de Não Escolha" },
      { key: "LISTAGEM_ESCOLHAS_DRES", tipo: "Listagem de Escolhas por DREs" },
      { key: "RESULTADO_ESCOLHA_SIM", tipo: "Resultado de Escolha de vagas - Sim" },
      { key: "RESULTADO_ESCOLHA_NAO", tipo: "Resultado de Escolha de vagas - Não" },
      { key: "RESULTADO_ESCOLHA_RECONVOCACAO", tipo: "Resultado de Escolha de vagas - Reconvocação" },
      { key: "LISTA_CANDIDATOS_SESSAO", tipo: "Lista de Candidatos por Sessão" },
    ],
    []
  );

  const handleTipoChange = (e: RadioChangeEvent) => {
    setTipoRelatorio(e.target.value);
  };

  const handleClosePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(undefined);
    setPreviewText(undefined);
    setPreviewHtml(undefined);
    setPreviewVisible(false);
  };

  const buildPayload = useCallback((record: RelatorioLinha) => {
    const payload: Record<string, unknown> = {
      processo_uuid: filtroSelect,
      cabecalho: cabecalhoHtml,
      tipo: record.key,
      usuario: localStorage.getItem("USUARIO") ?? "",
    };
    if (record.key === "LISTA_CANDIDATOS_SESSAO") {
      payload.agenda_uuid = listaSelectedOption;
    }
    return payload;
  }, [cabecalhoHtml, filtroSelect, listaSelectedOption]);

  const executeVisualizar = useCallback(async (record: RelatorioLinha, overrideAgendaUuid?: string) => {
    if (!filtroSelect) {
      setProcessoError("Selecione um processo");
      return;
    }
    if (!record?.key) {
      message.error("Tipo de relatório não identificado.");
      return;
    }

    const payload = buildPayload(record);
    if (record.key === "LISTA_CANDIDATOS_SESSAO") {
      if (overrideAgendaUuid) {
        (payload as any).agenda_uuid = overrideAgendaUuid;
      }
    }

    try {
      const result = await postRelatorio(payload, "html");
      if (result instanceof Blob) {
        const url = URL.createObjectURL(result);
        setPreviewUrl(url);
        setPreviewVisible(true);
      } else if (typeof result === "string") {
        setPreviewHtml(result);
        setPreviewVisible(true);
      } else {
        setPreviewText(JSON.stringify(result, null, 2));
        setPreviewVisible(true);
      }
    } catch (err) {
      message.error("Não foi possível gerar o relatório.");
    }
  }, [buildPayload, filtroSelect, postRelatorio]);

  const handleVisualizar = useCallback(
    async (record: RelatorioLinha) => {
      if (!filtroSelect) {
        setProcessoError("Selecione um processo");
        return;
      }
      if (record.key === "LISTA_CANDIDATOS_SESSAO") {
        setListaSelectedOption(undefined);
        setListaSelectedCandidatosUuids(undefined);
        setPendingListaAction({ action: "visualizar", record });
        setListaModalOpen(true);
        return;
      }
      return executeVisualizar(record);
    },
    [executeVisualizar, filtroSelect]
  );

  const executeExport = useCallback(async (record: RelatorioLinha, formato: "xls" | "pdf" | "docx", overrideAgendaUuid?: string) => {
    if (!filtroSelect) {
      setProcessoError("Selecione um processo");
      return;
    }
    if (!record?.key) {
      message.error("Tipo de relatório não identificado.");
      return;
    }

    const payload = buildPayload(record);
    if (record.key === "LISTA_CANDIDATOS_SESSAO") {
      if (overrideAgendaUuid) {
        (payload as any).agenda_uuid = overrideAgendaUuid;
      }
    }

    try {
      const result = await postRelatorio(payload, formato);
      let blob: Blob;
      if (result instanceof Blob) {
        blob = result;
      } else if (typeof result === "string") {
        let type: string;
        if (formato === "pdf") {
          type = "application/pdf";
        } else if (formato === "docx") {
          type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else {
          type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }
        blob = new Blob([result], { type });
      } else {
        let type: string;
        if (formato === "pdf") {
          type = "application/pdf";
        } else if (formato === "docx") {
          type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else {
          type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }
        blob = new Blob([JSON.stringify(result ?? {}, null, 2)], { type });
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      let ext: string;
      if (formato === "pdf") {
        ext = "pdf";
      } else if (formato === "docx") {
        ext = "docx";
      } else {
        ext = "xlsx";
      }
      a.href = url;
      a.download = `${record.key.toLowerCase()}-${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      message.error("Não foi possível exportar o relatório.");
    }
  }, [buildPayload, filtroSelect, postRelatorio]);

  const handleExport = useCallback(
    async (record: RelatorioLinha, formato: "xls" | "pdf" | "docx") => {
      if (!filtroSelect) {
        setProcessoError("Selecione um processo");
        return;
      }
      if (record.key === "LISTA_CANDIDATOS_SESSAO") {
        setListaSelectedOption(undefined);
        setListaSelectedCandidatosUuids(undefined);
        setPendingListaAction({ action: "export", formato, record });
        setListaModalOpen(true);
        return;
      }
      return executeExport(record, formato);
    },
    [executeExport, filtroSelect]
  );

  const handleListaOk = useCallback(
    ({ agendaUuid }: { agendaUuid?: string }) => {
      const pending = pendingListaAction;
      if (!pending) {
        setListaModalOpen(false);
        return;
      }
      setListaSelectedOption(agendaUuid);
      setListaModalOpen(false);
      setPendingListaAction(null);
      if (pending.action === "visualizar") {
        executeVisualizar(pending.record, agendaUuid);
      } else {
        executeExport(pending.record, pending.formato, agendaUuid);
      }
    },
    [pendingListaAction, executeExport, executeVisualizar]
  );

  const getExportFormats = useCallback((_recordKey: string): ("xls" | "pdf" | "docx")[] => {
    // Ambos os relatórios têm Excel, PDF e Word
    return ["xls", "pdf", "docx"];
  }, []);

  const handlePersonalizacao = useCallback(
    (record: RelatorioLinha) => {
      if (!filtroSelect) {
        setProcessoError("Selecione um processo");
        return;
      }
      setSelectedRelatorioForPersonalizacao(record);
      setPersonalizacaoModalOpen(true);
    },
    [filtroSelect]
  );

  const columns = useMemo(
    () => [
      {
        title: "Tipo",
        dataIndex: "tipo",
        key: "tipo",
      },
      {
        title: "Visualizar",
        key: "visualizar",
        align: "center" as const,
        render: (_: any, record: RelatorioLinha) => (
          <EyeOutlined
            style={{ fontSize: 18, color: "#0F59C8", cursor: "pointer" }}
            onClick={() => handleVisualizar(record)}
          />
        ),
      },
      {
        title: "Exportar",
        key: "exportar",
        align: "center" as const,
        render: (_: any, record: RelatorioLinha) => {
          const formats = getExportFormats(record.key);
          return (
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              {formats.includes("xls") && (
                <FileExcelOutlined
                  style={{ fontSize: 18, color: "#08979C", cursor: "pointer" }}
                  onClick={() => handleExport(record, "xls")}
                  title="Exportar para Excel"
                />
              )}
              {formats.includes("pdf") && (
                <FilePdfOutlined
                  style={{ fontSize: 18, color: "#C41D7F", cursor: "pointer" }}
                  onClick={() => handleExport(record, "pdf")}
                  title="Exportar para PDF"
                />
              )}
              {formats.includes("docx") && (
                <FileWordOutlined
                  style={{ fontSize: 18, color: "#2B579A", cursor: "pointer" }}
                  onClick={() => handleExport(record, "docx")}
                  title="Exportar para Word"
                />
              )}
            </div>
          );
        },
      },
      {
        title: "Personalização",
        key: "personalizacao",
        align: "center" as const,
        render: (_: any, record: RelatorioLinha) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => handlePersonalizacao(record)}
          >
            <EditOutlined style={{ color: "#05409A" }} />
          </div>
        ),
      },
    ],
    [handleExport, handleVisualizar, getExportFormats, handlePersonalizacao]
  );

  return (
    <BaseTela breadcrumbItems={breadcrumbItems} title="Relatórios">
      <Spin spinning={isPostingRelatorio}>
      <Card style={{ border: "none", borderRadius: 12, marginBottom: 16 }}>
        <Row gutter={[16, 12]} align="middle">
          <Col xs={24} md={12}>
            <FilterLabel>Situação</FilterLabel>
            <div style={{ marginTop: 8 }}>
              <Radio.Group
                value={tipoRelatorio}
                onChange={handleTipoChange}
              >
                <Radio value="EM_ANDAMENTO">Em andamento</Radio>
                <Radio value="FINALIZADO">Finalizados</Radio>
              </Radio.Group>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <FilterLabel>Processo</FilterLabel>
            <FilterSelect
              allowClear
              placeholder="Selecione um processo"
              style={{ width: "100%", marginTop: 8 }}
              value={filtroSelect}
              loading={processosConvocacaoOptionsIsLoading}
              options={processosConvocacaoOptions as any}
              onChange={(value) => {
                setFiltroSelect(value as string | undefined);
                setProcessoError(undefined);
              }}
              status={processoError ? "error" : undefined}
            />
            {processoError && (
              <div style={{ color: "#ff4d4f", fontSize: "14px", marginTop: "4px" }}>
                {processoError}
              </div>
            )}
          </Col>
        </Row>
      </Card>

      <Table
        rowKey="key"
        dataSource={dataSource}
        columns={columns as any}
        pagination={false}
      />
      </Spin>

      <Modal
        open={previewVisible}
        onCancel={handleClosePreview}
        footer={null}
        width={1400}
        styles={{ body: { padding: 0 } }}
      >
        {previewUrl ? (
          <iframe
            title="relatorio-pdf"
            src={previewUrl}
            style={{ width: "100%", height: "80vh", border: 0 }}
          />
        ) : previewHtml ? (
          <div
            style={{ width: "100%", height: "80vh", overflow: "auto", padding: 0 }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          <pre style={{ margin: 0, padding: 16, whiteSpace: "pre-wrap" }}>
            {previewText}
          </pre>
        )}
      </Modal>
      <ListaCandidatosSessaoModal
        open={listaModalOpen}
        processoUuid={filtroSelect}
        onOk={handleListaOk}
        onCancel={() => {
          setListaModalOpen(false);
          setPendingListaAction(null);
        }}
      />
      <PersonalizacaoModal
        open={personalizacaoModalOpen}
        onCancel={() => {
          setPersonalizacaoModalOpen(false);
          setSelectedRelatorioForPersonalizacao(null);
        }}
        selectedRelatorio={selectedRelatorioForPersonalizacao}
        processoNome={
          (Array.isArray(processosConvocacaoOptions) 
            ? (processosConvocacaoOptions as any[]).find((opt: any) => opt.value === filtroSelect)?.label 
            : undefined) || "—"
        }
        processoUuid={filtroSelect || ""}
      />
    </BaseTela>
  );
};

export default RelatoriosTela;


