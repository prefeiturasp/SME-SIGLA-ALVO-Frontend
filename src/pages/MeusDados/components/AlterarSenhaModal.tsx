import React, { useState, useMemo } from "react";
import { Modal, Button, Alert, message, Row, Col } from "antd";
import { EyeInvisibleOutlined, EyeOutlined, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { useAlterarSenha } from "../hooks/useAlterarSenha";
import { StandardInput } from "../../../components/EstilosCompartilhados";
import {
  ModalTitleStyled,
  RequisitoItem,
  RequisitosTitulo,
  RequisitosNaoTitulo,
  FieldLabel,
  FieldWrapper,
  ErrorText,
  ButtonsContainer,
} from "./AlterarSenhaModal.styles";

interface AlterarSenhaModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  senha_atual: string;
  nova_senha: string;
  confirmacao_nova_senha: string;
}

interface FormErrors {
  senha_atual?: string;
  nova_senha?: string;
  confirmacao_nova_senha?: string;
}

type RequisiteStatus = "idle" | "ok" | "error";

interface RequisiteCheck {
  label: string;
  status: RequisiteStatus;
}

const RequisiteIcon: React.FC<{ status: RequisiteStatus }> = ({ status }) => {
  if (status === "ok") return <CheckCircleFilled style={{ color: "#52c41a" }} />;
  if (status === "error") return <CloseCircleFilled style={{ color: "#ff4d4f" }} />;
  return <CheckCircleFilled style={{ color: "#d9d9d9" }} />;
};

const AlterarSenhaModal: React.FC<AlterarSenhaModalProps> = ({ open, onClose }) => {
  const [form, setForm] = useState<FormState>({
    senha_atual: "",
    nova_senha: "",
    confirmacao_nova_senha: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmacao, setShowConfirmacao] = useState(false);
  const [senhaDigitada, setSenhaDigitada] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const requisitos: RequisiteCheck[] = useMemo(() => {
    const s = form.nova_senha;
    const digitou = senhaDigitada;

    const check = (ok: boolean): RequisiteStatus => {
      if (!digitou) return "idle";
      return ok ? "ok" : "error";
    };

    return [
      { label: "Ao menos uma letra minúscula", status: check(/[A-Z]/.test(s)) },
      { label: "Ao menos uma letra maiúscula", status: check(/[a-z]/.test(s)) },
      { label: "Entre 8 e 12 caracteres", status: check(s.length >= 8 && s.length <= 12) },
      { label: "Ao menos um caracter numérico", status: check(/[0-9]/.test(s)) },
      { label: "Ao menos um caracter especial (#$@!%&*?)", status: check(/[^A-Za-z0-9]/.test(s)) },
    ];
  }, [form.nova_senha, senhaDigitada]);

  const requisitosNao: RequisiteCheck[] = useMemo(() => {
    const s = form.nova_senha;
    const digitou = senhaDigitada;

    const check = (ok: boolean): RequisiteStatus => {
      if (!digitou) return "idle";
      return ok ? "ok" : "error";
    };

    return [
      { label: "Espaço em branco", status: check(!/\s/.test(s)) },
      { label: "Caracteres acentuados", status: check(!/[À-ÿ]/.test(s)) },
    ];
  }, [form.nova_senha, senhaDigitada]);

  const { mutate, isPending } = useAlterarSenha();

  const handleClose = () => {
    setForm({ senha_atual: "", nova_senha: "", confirmacao_nova_senha: "" });
    setErrors({});
    setShowSenhaAtual(false);
    setShowNovaSenha(false);
    setShowConfirmacao(false);
    setSenhaDigitada(false);
    setApiError(null);
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.senha_atual) {
      newErrors.senha_atual = "Campo obrigatório.";
    }

    if (!form.nova_senha) {
      newErrors.nova_senha = "Campo obrigatório.";
    } else {
      const senha = form.nova_senha;
      if (senha.length < 8 || senha.length > 12) {
        newErrors.nova_senha = "A senha deve ter entre 8 e 12 caracteres.";
      } else if (!/[A-Z]/.test(senha)) {
        newErrors.nova_senha = "A senha deve conter ao menos uma letra maiúscula.";
      } else if (!/[a-z]/.test(senha)) {
        newErrors.nova_senha = "A senha deve conter ao menos uma letra minúscula.";
      } else if (!/[0-9]/.test(senha)) {
        newErrors.nova_senha = "A senha deve conter ao menos um número.";
      } else if (!/[^A-Za-z0-9]/.test(senha)) {
        newErrors.nova_senha = "A senha deve conter ao menos um símbolo.";
      } else if (/\s/.test(senha)) {
        newErrors.nova_senha = "A senha não deve conter espaços em branco.";
      } else if (/[À-ÿ]/.test(senha)) {
        newErrors.nova_senha = "A senha não deve conter caracteres acentuados.";
      }
    }

    if (!form.confirmacao_nova_senha) {
      newErrors.confirmacao_nova_senha = "Campo obrigatório.";
    } else if (form.nova_senha !== form.confirmacao_nova_senha) {
      newErrors.confirmacao_nova_senha = "As senhas não conferem.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = () => {
    setErrors({});
    setApiError(null);
    if (!validate()) return;

    mutate(form, {
      onSuccess: () => {
        message.success("Senha alterada com sucesso!");
        handleClose();
      },
      onError: (error: any) => {
        const detail = error?.response?.data?.detail;
        if (detail === "Senha atual incorreta.") {
          setErrors((prev) => ({ ...prev, senha_atual: "Senha atual incorreta." }));
        } else {
          setApiError(detail ?? "Erro ao alterar a senha. Tente novamente.");
        }
      },
    });
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={700}
      centered
      destroyOnHidden
      title={<ModalTitleStyled>Nova senha</ModalTitleStyled>}
    >
      <Row gutter={32}>
        <Col span={10}>
          <RequisitosTitulo>A nova senha deve conter:</RequisitosTitulo>
          {requisitos.map((req) => (
            <RequisitoItem key={req.label} $status={req.status}>
              <RequisiteIcon status={req.status} />
              {req.label}
            </RequisitoItem>
          ))}
          <RequisitosNaoTitulo>A nova senha NÃO deve conter:</RequisitosNaoTitulo>
          {requisitosNao.map((req) => (
            <RequisitoItem key={req.label} $status={req.status}>
              <RequisiteIcon status={req.status} />
              {req.label}
            </RequisitoItem>
          ))}
        </Col>

        <Col span={14}>
          <FieldWrapper>
            <FieldLabel>Senha atual*</FieldLabel>
            <StandardInput
              type={showSenhaAtual ? "text" : "password"}
              placeholder="Digite a senha atual"
              value={form.senha_atual}
              onChange={(e) => setForm((prev) => ({ ...prev, senha_atual: e.target.value }))}
              suffix={
                showSenhaAtual ? (
                  <EyeOutlined onClick={() => setShowSenhaAtual(false)} style={{ cursor: "pointer" }} />
                ) : (
                  <EyeInvisibleOutlined onClick={() => setShowSenhaAtual(true)} style={{ cursor: "pointer" }} />
                )
              }
              status={errors.senha_atual ? "error" : undefined}
            />
            {errors.senha_atual && <ErrorText>{errors.senha_atual}</ErrorText>}
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel>Nova senha*</FieldLabel>
            <StandardInput
              type={showNovaSenha ? "text" : "password"}
              placeholder="Digite a nova senha"
              value={form.nova_senha}
              onChange={(e) => {
                setSenhaDigitada(true);
                setForm((prev) => ({ ...prev, nova_senha: e.target.value }));
              }}
              suffix={
                showNovaSenha ? (
                  <EyeOutlined onClick={() => setShowNovaSenha(false)} style={{ cursor: "pointer" }} />
                ) : (
                  <EyeInvisibleOutlined onClick={() => setShowNovaSenha(true)} style={{ cursor: "pointer" }} />
                )
              }
              status={errors.nova_senha ? "error" : undefined}
            />
            {errors.nova_senha && <ErrorText>{errors.nova_senha}</ErrorText>}
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel>Confirmação da nova senha*</FieldLabel>
            <StandardInput
              type={showConfirmacao ? "text" : "password"}
              placeholder="Digite a nova senha novamente"
              value={form.confirmacao_nova_senha}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, confirmacao_nova_senha: e.target.value }))
              }
              suffix={
                showConfirmacao ? (
                  <EyeOutlined onClick={() => setShowConfirmacao(false)} style={{ cursor: "pointer" }} />
                ) : (
                  <EyeInvisibleOutlined onClick={() => setShowConfirmacao(true)} style={{ cursor: "pointer" }} />
                )
              }
              status={errors.confirmacao_nova_senha ? "error" : undefined}
            />
            {errors.confirmacao_nova_senha && (
              <ErrorText>{errors.confirmacao_nova_senha}</ErrorText>
            )}
          </FieldWrapper>
        </Col>
      </Row>

      {apiError && (
        <Alert
          type="error"
          showIcon={false}
          message={apiError}
          style={{ marginTop: "1rem", textAlign: "center", fontWeight: 600 }}
        />
      )}

      <Alert
        type="info"
        showIcon={false}
        message="Importante: Ao alterar a sua senha, ela se tornará padrão e será utilizada para acessar todos os sistemas da SME aos quais você já possui acesso."
        style={{ marginTop: "1rem", fontSize: "0.8125rem" }}
      />

      <ButtonsContainer>
        <Button onClick={handleClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="primary" onClick={handleSalvar} loading={isPending}>
          Salvar senha
        </Button>
      </ButtonsContainer>
    </Modal>
  );
};

export default AlterarSenhaModal;
