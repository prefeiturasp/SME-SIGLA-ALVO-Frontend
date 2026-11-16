import React from "react";
import { Col, Form, Input, Modal, Row, Select, Typography, message } from "antd";
import { AppButton, AppFormItem, FormLabel } from '@/components/ui';
import type { EditarPermissaoModalProps } from "../../../../services/resources/permissoes/IPermissoes";
import { patchUsuario } from "../hooks/patchAtualizarPermissoesUsuarios";

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
  username,
  permissoesOptions,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm<{ nome: string; email: string }>();
  const [permissoes, setPermissoes] = React.useState<string[]>(data?.permissoes ?? []);
  const [saving, setSaving] = React.useState(false);

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

  const handleSalvar = async () => {
    if (!username) {
      onClose();
      return;
    }

    let values: { nome: string; email: string };
    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    const currentNome = (data?.nome ?? "").trim();
    const nextNome = (values.nome ?? "").trim();
    const currentEmail = (data?.email ?? "").trim();
    const nextEmail = (values.email ?? "").trim();

    const payload: {
      username: string;
      grupos: string[];
      nome?: string;
      email?: string;
    } = { username, grupos: permissoes };

    if (nextNome !== currentNome) payload.nome = nextNome;
    if (nextEmail !== currentEmail) payload.email = nextEmail;

    setSaving(true);
    try {
      await patchUsuario(payload);
      onSuccess?.(nextNome || data?.nome || "");
    } catch (e: any) {
      const respData = e?.response?.data;
      const emailErr = Array.isArray(respData?.email) ? respData.email[0] : undefined;
      if (emailErr) {
        form.setFields([{ name: "email", errors: [String(emailErr)] }]);
        return;
      }
      console.error("Falha ao salvar permissão do usuário:", e);
      message.error("Não foi possível salvar a permissão do usuário.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={<Typography.Title level={4} style={{ margin: 0 }}>Editar permissão</Typography.Title>}
      onCancel={onClose}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
          <AppButton
            variant="secondary"
            size="large"
            style={{ height: 48, width: 152, marginTop: 0 }}
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </AppButton>
          {!isView && (
            <AppButton
              variant="primary"
              size="large"
              style={{ height: 48, width: 200, marginTop: 0 }}
              loading={saving}
              onClick={handleSalvar}
            >
              Salvar permissão
            </AppButton>
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
            <FormLabel>Login (RF)</FormLabel>
            <div style={{ ...valueStyle, marginTop: 12 }}>{data?.login ?? ""}</div>
          </Col>
          <Col span={10}>
            {isView ? (
              <>
                <FormLabel>Nome</FormLabel>
                <div style={{ ...valueStyle, marginTop: 12 }}>{data?.nome ?? ""}</div>
              </>
            ) : (
              <AppFormItem
                name="nome"
                label="Nome"
                style={{ marginBottom: 0 }}
                rules={[
                  { required: true, whitespace: true, message: "Campo obrigatório." },
                  { min: 3, message: "O nome deve ter ao menos 3 caracteres." },
                  { max: 100, message: "O nome deve ter no máximo 100 caracteres." },
                  {
                    pattern: /^[A-Za-zÀ-ÿ\s'-]+$/,
                    message: "O nome não pode conter números ou caracteres especiais.",
                  },
                ]}
              >
                <Input size="large" placeholder="Nome" />
              </AppFormItem>
            )}
          </Col>
          <Col span={8}>
            {isView ? (
              <>
                <FormLabel>E-mail</FormLabel>
                <div style={{ ...valueStyle, marginTop: 12 }}>{data?.email ?? ""}</div>
              </>
            ) : (
              <AppFormItem
                name="email"
                label="E-mail"
                style={{ marginBottom: 0 }}
                rules={[
                  { required: true, whitespace: true, message: "Campo obrigatório." },
                  { type: "email", message: "Informe um e-mail válido." },
                ]}
              >
                <Input size="large" placeholder="E-mail" />
              </AppFormItem>
            )}
          </Col>

          <Col span={12}>
            <FormLabel style={{ marginTop: 4 }}>Permissões</FormLabel>
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
