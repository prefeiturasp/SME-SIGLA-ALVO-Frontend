import React, { useEffect, useState } from "react";
import { Button, Col, Input, Modal, notification, Row, Spin, Typography } from "antd";

import { ClearButton } from "../../ConvocacaoCandidatos/style";
import {
  getCandidatoByUuid,
  patchCandidatoByUuid,
} from "../../../../services/resources/candidatos";

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

/** Máscara (XX) X XXXX-XXXX — retorna só os dígitos permitidos (máx. 11). */
function apenasDigitosTelefone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

/** Formata para exibição: (XX) X XXXX-XXXX */
function formatarTelefone(value: string): string {
  const d = apenasDigitosTelefone(value);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 3) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarTelefone(telefone: string): string | null {
  const d = apenasDigitosTelefone(telefone);
  if (d.length === 0) return "Telefone é obrigatório.";
  if (d.length !== 11) return "Telefone deve ter 11 dígitos no formato (XX) X XXXX-XXXX.";
  return null;
}

function validarEmail(email: string): string | null {
  const t = (email ?? "").trim();
  if (t.length === 0) return "E-mail é obrigatório.";
  if (!REGEX_EMAIL.test(t)) return "Informe um e-mail válido.";
  return null;
}

type AlterarCandidatoModalProps = {
  open: boolean;
  candidatoUuid?: string;
  concurso?: string;
  cargo?: string;
  nomeCandidato?: string;
  onClose: () => void;
  onSave?: () => void;
};

const AlterarCandidatoModal: React.FC<AlterarCandidatoModalProps> = ({
  open,
  candidatoUuid,
  concurso,
  cargo,
  nomeCandidato,
  onClose,
  onSave,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [concursoExibir, setConcursoExibir] = useState("");
  const [cargoExibir, setCargoExibir] = useState("");
  const [erroTelefone, setErroTelefone] = useState<string | null>(null);
  const [erroEmail, setErroEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !candidatoUuid) {
      setNome(nomeCandidato ?? "—");
      setConcursoExibir(concurso ?? "—");
      setCargoExibir(cargo ?? "—");
      setTelefone("");
      setEmail("");
      setErroTelefone(null);
      setErroEmail(null);
      return;
    }

    setNome(nomeCandidato ?? "—");
    setConcursoExibir(concurso ?? "—");
    setCargoExibir(cargo ?? "—");
    setErroTelefone(null);
    setErroEmail(null);

    setLoading(true);
    const { response } = getCandidatoByUuid(candidatoUuid);
    response
      .then((data) => {
        setNome(data.nome ?? nomeCandidato ?? "—");
        setConcursoExibir(concurso ?? "—");
        setCargoExibir(cargo ?? "—");
        const digitos = apenasDigitosTelefone(data.celular ?? "");
        setTelefone(formatarTelefone(digitos));
        setEmail(data.email ?? "");
      })
      .catch(() => {
        notification.error({
          message: "Erro ao carregar dados do candidato.",
          placement: "top",
          duration: 3.5,
        });
        setTelefone("");
        setEmail("");
      })
      .finally(() => setLoading(false));
  }, [open, candidatoUuid, nomeCandidato, concurso, cargo]);

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = formatarTelefone(e.target.value);
    setTelefone(next);
    setErroTelefone(null);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErroEmail(null);
  };

  const handleSalvar = async () => {
    const errTel = validarTelefone(telefone);
    const errEm = validarEmail(email);
    setErroTelefone(errTel);
    setErroEmail(errEm);
    if (errTel || errEm) {
      notification.warning({
        message: "Corrija os campos antes de salvar.",
        placement: "top",
        duration: 3.5,
      });
      return;
    }
    if (!candidatoUuid) {
      notification.error({
        message: "Candidato não identificado.",
        placement: "top",
        duration: 3.5,
      });
      return;
    }

    setSaving(true);
    try {
      const { response } = patchCandidatoByUuid(candidatoUuid, {
        celular: apenasDigitosTelefone(telefone),
        email: email.trim(),
      });
      await response;
      notification.success({
        message: "Sucesso ao alterar o candidato.",
        placement: "top",
        duration: 3.5,
      });
      onSave?.();
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        (err as Error)?.message ??
        "Erro ao alterar o candidato.";
      notification.error({
        message: "Erro ao alterar o candidato",
        description: String(detail),
        placement: "top",
        duration: 3.5,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Alterar candidato
        </Typography.Title>
      }
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
          <Button
            size="large"
            type="primary"
            style={{ height: 48, width: 200, marginTop: 0 }}
            loading={saving}
            disabled={saving}
            onClick={handleSalvar}
          >
            Salvar
          </Button>
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
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[32, 24]} style={{ marginTop: 8 }}>
            <Col span={6}>
              <div style={labelStyle}>Candidato</div>
              <div style={{ ...valueStyle, marginTop: 12 }}>{nome}</div>
            </Col>
            <Col span={10}>
              <div style={labelStyle}>Concurso</div>
              <div style={{ ...valueStyle, marginTop: 12 }}>{concursoExibir}</div>
            </Col>
            <Col span={8}>
              <div style={labelStyle}>Cargo</div>
              <div style={{ ...valueStyle, marginTop: 12 }}>{cargoExibir}</div>
            </Col>

            <Col span={12}>
              <div style={{ ...labelStyle, marginTop: 4 }}>Telefone</div>
              <Input
                size="large"
                style={{ marginTop: 12 }}
                placeholder="(XX) X XXXX-XXXX"
                value={telefone}
                onChange={handleTelefoneChange}
                status={erroTelefone ? "error" : undefined}
              />
              {erroTelefone && (
                <Typography.Text type="danger" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
                  {erroTelefone}
                </Typography.Text>
              )}
            </Col>
            <Col span={12}>
              <div style={{ ...labelStyle, marginTop: 4 }}>E-mail</div>
              <Input
                size="large"
                style={{ marginTop: 12 }}
                placeholder="E-mail"
                value={email}
                onChange={handleEmailChange}
                status={erroEmail ? "error" : undefined}
              />
              {erroEmail && (
                <Typography.Text type="danger" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
                  {erroEmail}
                </Typography.Text>
              )}
            </Col>
          </Row>

          <div
            style={{
              height: 1,
              background: "#F0F0F0",
              marginTop: 28,
            }}
          />
        </>
      )}
    </Modal>
  );
};

export default AlterarCandidatoModal;
