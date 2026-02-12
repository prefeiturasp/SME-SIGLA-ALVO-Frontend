import React, { useEffect, useState } from "react";
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Modal, Row, Col, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { usePostAutorizacaoPublicada } from "../hooks/usePostAutorizacaoPublicada";
import { usePatchAutorizacaoPublicada } from "../hooks/usePatchAutorizacaoPublicada";

type Props = {
  open: boolean;
  cargo?: string;
  cargoUuid?: string;
  mode?: "create" | "edit";
  autorizacaoUuid?: string;
  initialValues?: {
    quantidade?: number;
    dataAutorizacao?: string;
    observacao?: string;
    vagasSemEfeito?: boolean;
  };
  onCancel: () => void;
  onAdd: (payload: {
    quantidade?: number;
    dataAutorizacao?: string;
    observacao?: string;
    vagasSemEfeito?: boolean;
  }) => void;
};

const AdicionarAutorizacaoModal: React.FC<Props> = ({
  open,
  cargo,
  cargoUuid,
  mode = "create",
  autorizacaoUuid,
  initialValues,
  onCancel,
  onAdd,
}) => {
  const [form] = Form.useForm();
  const [quantidade, setQuantidade] = useState<number | undefined>(undefined);
  const [dataAutorizacao, setDataAutorizacao] = useState<Dayjs | null>(null);
  const [observacao, setObservacao] = useState<string>("");
  const [vagasSemEfeito, setVagasSemEfeito] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (mode === "edit") {
        setQuantidade(initialValues?.quantidade);
        setDataAutorizacao(
          initialValues?.dataAutorizacao ? dayjs(initialValues.dataAutorizacao) : null
        );
        setObservacao(initialValues?.observacao ?? "");
        setVagasSemEfeito(initialValues?.vagasSemEfeito ?? false);
        form.setFieldsValue({
          quantidade: initialValues?.quantidade,
          dataAutorizacao: initialValues?.dataAutorizacao
            ? dayjs(initialValues.dataAutorizacao)
            : null,
          observacao: initialValues?.observacao ?? "",
        });
      } else {
        // create: iniciar vazio
        setQuantidade(undefined);
        setDataAutorizacao(null);
        setObservacao("");
        setVagasSemEfeito(false);
        form.setFieldsValue({
          quantidade: undefined,
          dataAutorizacao: null,
          observacao: "",
        });
      }
    }
  }, [open, form, mode, initialValues?.quantidade, initialValues?.dataAutorizacao, initialValues?.observacao, initialValues?.vagasSemEfeito]);

  const handleConfirm = async () => {
    await form.validateFields();
    const qtd = typeof quantidade === "number" ? quantidade : 0;
    const payload = {
      cargo: cargoUuid,
      vagas_sem_efeito: vagasSemEfeito,
      autorizacoes: vagasSemEfeito ? 0 : qtd,
      autorizacoes_sem_efeito: vagasSemEfeito ? qtd : 0,
      observacao: observacao?.trim() || undefined,
      data_autorizacao: dataAutorizacao ? dayjs(dataAutorizacao).format("YYYY-MM-DD") : undefined,
    };
    setSubmitting(true);
    if (mode === "edit" && autorizacaoUuid) {
      // Enviar apenas campos alterados
      const prevVagas = initialValues?.vagasSemEfeito ?? false;
      const prevQtd = typeof initialValues?.quantidade === "number" ? initialValues!.quantidade! : 0;
      const prevAut = prevVagas ? 0 : prevQtd;
      const prevAutSem = prevVagas ? prevQtd : 0;
      const prevObs = initialValues?.observacao?.trim() || undefined;
      const prevData = initialValues?.dataAutorizacao
        ? dayjs(initialValues.dataAutorizacao).format("YYYY-MM-DD")
        : undefined;

      const diff: Record<string, unknown> = {};
      if (payload.vagas_sem_efeito !== prevVagas) diff.vagas_sem_efeito = payload.vagas_sem_efeito;
      if (payload.autorizacoes !== prevAut) diff.autorizacoes = payload.autorizacoes;
      if (payload.autorizacoes_sem_efeito !== prevAutSem) diff.autorizacoes_sem_efeito = payload.autorizacoes_sem_efeito;
      if (payload.observacao !== prevObs) diff.observacao = payload.observacao;
      if (payload.data_autorizacao !== prevData) diff.data_autorizacao = payload.data_autorizacao;

      // Somente envia PATCH se houver algo modificado
      if (Object.keys(diff).length > 0) {
        await usePatchAutorizacaoPublicada(autorizacaoUuid, diff);
      }
    } else {
      await usePostAutorizacaoPublicada(payload);
    }
    setSubmitting(false);
    onAdd({
      quantidade,
      dataAutorizacao: dataAutorizacao ? dayjs(dataAutorizacao).format("YYYY-MM-DD") : undefined,
      observacao: observacao?.trim() || undefined,
      vagasSemEfeito,
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={mode === "edit" ? "Editar Autorização publicada" : "Adicionar Autorização publicada"}
      width={720}
    >
      <div style={{ marginBottom: 12 }}>
        <Typography.Text style={{ fontSize: 16 }}>
          Cargo: <strong>{cargo || "—"}</strong>
        </Typography.Text>
      </div>
      <Form layout="vertical" form={form} requiredMark={false}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Quantidade"
              name="quantidade"
              rules={[{ required: true, message: "Informe a quantidade" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                value={quantidade}
                onChange={(v) => setQuantidade(typeof v === "number" ? v : undefined)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Data"
              name="dataAutorizacao"
              rules={[{ required: true, message: "Informe a data" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                value={dataAutorizacao}
                onChange={(v) => setDataAutorizacao(v as Dayjs | null)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Observação"
          name="observacao"
          rules={[{ required: true, message: "Informe a observação" }]}
        >
          <Input.TextArea
            rows={4}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Descreva observações relevantes"
          />
        </Form.Item>
        <Form.Item>
          <Checkbox
            checked={vagasSemEfeito}
            onChange={(e) => setVagasSemEfeito(e.target.checked)}
          >
            Vagas sem efeito
          </Checkbox>
        </Form.Item>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onCancel} disabled={submitting}>Cancelar</Button>
          <Button type="primary" onClick={handleConfirm} loading={submitting}>
            {mode === "edit" ? "Editar" : "Adicionar"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AdicionarAutorizacaoModal;

