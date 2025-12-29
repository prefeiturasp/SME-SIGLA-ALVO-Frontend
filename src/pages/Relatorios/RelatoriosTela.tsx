import React, { useCallback, useMemo, useState } from "react";
import { Col, Row, Radio, Select, Table, Typography, Card, Collapse, Modal, Spin, message } from "antd";
import type { RadioChangeEvent } from "antd";
import { EyeOutlined, FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";
import BaseTela from "../Base/BaseTela";
import { useRelatorios } from "./hooks/useRelatorios";
import QuillEditor from "./components/QuillEditor";
import { usePostRelatorio } from "./hooks/usePostRelatorio";

type RelatorioTipo = "EM_ANDAMENTO" | "FINALIZADO";

type RelatorioLinha = {
  key: string;
  tipo: string;
};

const RelatoriosTela: React.FC = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState<RelatorioTipo>("EM_ANDAMENTO");
  const [filtroSelect, setFiltroSelect] = useState<string | undefined>(undefined);
  const [cabecalhoHtml, setCabecalhoHtml] = useState<string>("");

  const breadcrumbItems = useMemo(
    () => [
      { title: "Relatórios" },
    ],
    []
  );

  const { processosConvocacaoOptions, processosConvocacaoOptionsIsLoading } = useRelatorios();
  const { postRelatorio, isPostingRelatorio } = usePostRelatorio();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [previewText, setPreviewText] = useState<string | undefined>(undefined);
  const [previewHtml, setPreviewHtml] = useState<string | undefined>(undefined);

  const dataSource: RelatorioLinha[] = useMemo(
    () => [
      { key: "LAUDA_VAGAS", tipo: "Lauda de vagas" },
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
    return {
      processo_uuid: filtroSelect,
      cabecalho: cabecalhoHtml,
      tipo: record.key,
      usuario: localStorage.getItem("USUARIO") ?? "",
    } as Record<string, unknown>;
  }, [cabecalhoHtml, filtroSelect]);

  const handleVisualizar = useCallback(async (record: RelatorioLinha) => {
    if (!filtroSelect) {
      message.warning("Selecione um processo para visualizar o relatório.");
      return;
    }
    if (!record?.key) {
      message.error("Tipo de relatório não identificado.");
      return;
    }

    const payload = buildPayload(record);

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

  const handleExport = useCallback(async (record: RelatorioLinha, formato: "xls" | "pdf") => {
    if (!filtroSelect) {
      message.warning("Selecione um processo para exportar o relatório.");
      return;
    }
    if (!record?.key) {
      message.error("Tipo de relatório não identificado.");
      return;
    }

    const payload = buildPayload(record);

    try {
      const result = await postRelatorio(payload, formato);
      let blob: Blob;
      if (result instanceof Blob) {
        blob = result;
      } else if (typeof result === "string") {
        const type =
          formato === "pdf"
            ? "application/pdf"
            : "application/vnd.ms-excel";
        blob = new Blob([result], { type });
      } else {
        blob = new Blob([JSON.stringify(result ?? {}, null, 2)], {
          type:
            formato === "pdf"
              ? "application/pdf"
              : "application/vnd.ms-excel",
        });
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ext = formato === "pdf" ? "pdf" : "xls";
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
        render: (_: any, record: RelatorioLinha) => (
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <FileExcelOutlined
              style={{ fontSize: 18, color: "#08979C", cursor: "pointer" }}
              onClick={() => handleExport(record, "xls")}
            />
            <FilePdfOutlined
              style={{ fontSize: 18, color: "#C41D7F", cursor: "pointer" }}
              onClick={() => handleExport(record, "pdf")}
            />
          </div>
        ),
      },
    ],
    [handleExport, handleVisualizar]
  );

  return (
    <BaseTela breadcrumbItems={breadcrumbItems} title="Relatórios">
      <Spin spinning={isPostingRelatorio}>
      <Card style={{ border: "none", borderRadius: 12, marginBottom: 16 }}>
        <Row gutter={[16, 12]} align="middle">
          <Col xs={24} md={12}>
            <Typography.Text strong>Situação</Typography.Text>
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
            <Typography.Text strong>Processo</Typography.Text>
            <Select
              allowClear
              placeholder="Selecione um processo"
              style={{ width: "100%", marginTop: 8 }}
              value={filtroSelect}
              loading={processosConvocacaoOptionsIsLoading}
              options={processosConvocacaoOptions as any}
              onChange={(value) => setFiltroSelect(value)}
            />
          </Col>
        </Row>
        {filtroSelect && (
          <div style={{ marginTop: 12 }}>
            <Collapse
              items={[
                {
                  key: "obs",
                  label: "Cabeçalho",
                  children: (
                    <QuillEditor
                      value={cabecalhoHtml}
                      onChange={setCabecalhoHtml}
                      placeholder="Digite o cabeçalho do relatório"
                      height={140}
                    />
                  ),
                },
              ]}
            />
          </div>
        )}
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
        title="Visualização do relatório"
        width={900}
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
    </BaseTela>
  );
};

export default RelatoriosTela;


