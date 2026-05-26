import React from "react";
import { Button, Col, Form, Input, Modal, Row, Select, Typography } from "antd";

import { ClearButton } from "../../../Processos/ConvocacaoCandidatos/style";
import type { EditarPermissaoModalProps } from "../../../../services/resources/permissoes/IPermissoes";

const labelStyle: React.CSSProperties = {
  fontFamily: "Open Sans",
  fontWeight: 600,
  fontSize: 16,
  color: "#515151",
};

const valueStyle: React.CSSProperties = {
  fontFamily: "Open Sans",
  fontWeight: 400,
  fontSize: 16,
  color: "#8C8C8C",
};

const EditarPermissaoModal: React.FC<EditarPermissaoModalProps> = ({
  open,
  mode,
  data,
  permissoesOptions,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm<{ nome: string; email: string }>();
  const [permissoes, setPermissoes] = React.useState<string[]>(data?.permissoes ?? []);

  React.useEffect(() => {
    if (open) {
      setPermissoes(data?.permissoes ?? []);
      form.setFieldsValue({
        nome: data?.nome ?? "",
        email: data?.email ?? "",
      });
    } else {
      form.resetFields();
    }
  }, [open, data?.permissoes, data?.nome, data?.email, form]);

  const isView = mode === "view";

  return (
    <Modal
      open={open}
      title={<Typography.Title level={4} style={{ margin: 0 }}>Editar permissão</Typography.Title>}
      onCancel={onClose}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
          <ClearButton
            size="large"
            style={{ height: 48, width: 152, marginTop: 0 }}
            onClick={onClose}
          >
            Cancelar
          </ClearButton>
          {!isView && (
            <Button
              size="large"
              type="primary"
              style={{ height: 48, width: 200, marginTop: 0 }}
              onClick={async () => {
                try {
                  const values = await form.validateFields();
                  onSave?.({
                    permissoes,
                    nome: values.nome,
                    email: values.email,
                  });
                } catch {
                  // validateFields lança quando há erros; o Form já exibe as mensagens
                }
              }}
            >
              Salvar permissão
            </Button>
          )}
        </div>
      }
      width={1100}
      centered
      styles={{
        header: { padding: "24px 24px 16px 24px" },
        body: { padding: "24px" },
        footer: { padding: "20px 24px" },
      }}
    >
      <Form form={form} layout="vertical" requiredMark={false} component={false}>
        <Row gutter={[32, 24]} style={{ marginTop: 8 }}>
          <Col span={6}>
            <div style={labelStyle}>Login (RF)</div>
            <div style={{ ...valueStyle, marginTop: 12 }}>{data?.login ?? ""}</div>
          </Col>
          <Col span={10}>
            <div style={labelStyle}>Nome</div>
            {isView ? (
              <div style={{ ...valueStyle, marginTop: 12 }}>{data?.nome ?? ""}</div>
            ) : (
              <Form.Item
                name="nome"
                style={{ marginTop: 12, marginBottom: 0 }}
                rules={[
                  { required: true, whitespace: true, message: "Campo obrigatório." },
                ]}
              >
                <Input size="large" placeholder="Nome" />
              </Form.Item>
            )}
          </Col>
          <Col span={8}>
            <div style={labelStyle}>E-mail</div>
            {isView ? (
              <div style={{ ...valueStyle, marginTop: 12 }}>{data?.email ?? ""}</div>
            ) : (
              <Form.Item
                name="email"
                style={{ marginTop: 12, marginBottom: 0 }}
                rules={[
                  { required: true, whitespace: true, message: "Campo obrigatório." },
                  { type: "email", message: "Informe um e-mail válido." },
                ]}
              >
                <Input size="large" placeholder="E-mail" />
              </Form.Item>
            )}
          </Col>

          <Col span={12}>
            <div style={{ ...labelStyle, marginTop: 4 }}>Permissões</div>
            <Select
              mode="multiple"
              allowClear
              size="large"
              value={permissoes}
              onChange={(v) => setPermissoes(v)}
              disabled={isView}
              style={{ width: "100%", marginTop: 12 }}
              placeholder="Selecione"
              options={
                permissoesOptions?.length
                  ? permissoesOptions
                  : [
                      { value: "Administrador", label: "Administrador" },
                      { value: "Gestor", label: "Gestor" },
                      { value: "Operador", label: "Operador" },
                      { value: "Consulta", label: "Consulta" },
                    ]
              }
            />
          </Col>
        </Row>
      </Form>

      <div
        style={{
          height: 1,
          background: "#F0F0F0",
          marginTop: 28,
        }}
      />
    </Modal>
  );
};

export default EditarPermissaoModal;
