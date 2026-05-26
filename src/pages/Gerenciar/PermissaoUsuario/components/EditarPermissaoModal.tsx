import React from "react";
import { Button, Col, Input, message, Modal, Row, Select, Typography } from "antd";
import axios from "axios";

import { ClearButton } from "../../../Processos/ConvocacaoCandidatos/style";
import { CustomFormItem } from "../../../../components/FormStyle";
import type { EditarPermissaoModalProps } from "../../../../services/resources/permissoes/IPermissoes";

type FieldErrors = { nome?: string; email?: string };

function primeiraString(valor: unknown): string | undefined {
  if (typeof valor === "string" && valor.trim()) return valor;
  if (Array.isArray(valor) && typeof valor[0] === "string") return valor[0];
  return undefined;
}

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
  const [permissoes, setPermissoes] = React.useState<string[]>(data?.permissoes ?? []);
  const [nome, setNome] = React.useState<string>(data?.nome ?? "");
  const [email, setEmail] = React.useState<string>(data?.email ?? "");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [saving, setSaving] = React.useState<boolean>(false);

  React.useEffect(() => {
    setPermissoes(data?.permissoes ?? []);
    setNome(data?.nome ?? "");
    setEmail(data?.email ?? "");
    setErrors({});
  }, [data?.permissoes, data?.nome, data?.email, open]);

  const isView = mode === "view";

  const handleSalvar = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave({ permissoes, nome, email });
      setErrors({});
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        const body = err.response.data as { nome?: unknown; email?: unknown };
        const next: FieldErrors = {
          nome: primeiraString(body?.nome),
          email: primeiraString(body?.email),
        };
        if (next.nome || next.email) {
          setErrors(next);
          return;
        }
      }
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
              loading={saving}
              style={{ height: 48, width: 200, marginTop: 0 }}
              onClick={() => {
                void handleSalvar();
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
            <CustomFormItem
              style={{ marginTop: 12, marginBottom: 0 }}
              validateStatus={errors.nome ? "error" : undefined}
              help={errors.nome}
            >
              <Input
                size="large"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (errors.nome) setErrors((prev) => ({ ...prev, nome: undefined }));
                }}
                placeholder="Nome"
              />
            </CustomFormItem>
          )}
        </Col>
        <Col span={8}>
          <div style={labelStyle}>E-mail</div>
          {isView ? (
            <div style={{ ...valueStyle, marginTop: 12 }}>{data?.email ?? ""}</div>
          ) : (
            <CustomFormItem
              style={{ marginTop: 12, marginBottom: 0 }}
              validateStatus={errors.email ? "error" : undefined}
              help={errors.email}
            >
              <Input
                size="large"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="E-mail"
              />
            </CustomFormItem>
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
