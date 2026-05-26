import React, { useState } from "react";
import { App, Modal, Button, Alert } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useAlterarEmail } from "../hooks/usePostAlterarEmail";
import { StandardInput } from "../../../components/EstilosCompartilhados";
import {
  ModalTitleStyled,
  FieldLabel,
  FieldWrapper,
  ErrorText,
  ButtonsContainer,
} from "./AlterarEmailModal.styles";

interface AlterarEmailModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  novo_email: string;
  confirmacao_novo_email: string;
}

interface FormErrors {
  novo_email?: string;
  confirmacao_novo_email?: string;
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AlterarEmailModal: React.FC<AlterarEmailModalProps> = ({ open, onClose }) => {
  const [form, setForm] = useState<FormState>({
    novo_email: "",
    confirmacao_novo_email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const { notification } = App.useApp();
  const { mutate, isPending } = useAlterarEmail();
  const queryClient = useQueryClient();

  const handleClose = () => {
    setForm({ novo_email: "", confirmacao_novo_email: "" });
    setErrors({});
    setApiError(null);
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const novoEmail = form.novo_email.trim();
    const confirmacao = form.confirmacao_novo_email.trim();

    if (!novoEmail) {
      newErrors.novo_email = "Campo obrigatório.";
    } else if (!REGEX_EMAIL.test(novoEmail)) {
      newErrors.novo_email = "Informe um e-mail válido.";
    }

    if (!confirmacao) {
      newErrors.confirmacao_novo_email = "Campo obrigatório.";
    } else if (novoEmail !== confirmacao) {
      newErrors.confirmacao_novo_email = "Os e-mails não conferem.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = () => {
    setErrors({});
    setApiError(null);
    if (!validate()) return;

    mutate(
      { novo_email: form.novo_email.trim() },
      {
        onSuccess: () => {
          notification.success({
            message: "E-mail Alterado",
            description: "O e-mail foi alterado com sucesso!",
            placement: "top",
            duration: 3.5,
          });
          queryClient.invalidateQueries({ queryKey: ["meus-dados"] });
          handleClose();
        },
        onError: (error: any) => {
          const data = error?.response?.data;
          const fieldError = Array.isArray(data?.novo_email)
            ? data.novo_email[0]
            : undefined;
          const detail =
            typeof data?.detail === "string" ? data.detail : undefined;
          const mensagem =
            fieldError ?? detail ?? "Erro ao alterar o e-mail. Tente novamente.";

          if (fieldError) {
            setErrors((prev) => ({ ...prev, novo_email: mensagem }));
          } else {
            setApiError(mensagem);
          }
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={520}
      centered
      destroyOnHidden
      title={<ModalTitleStyled>Alterar e-mail</ModalTitleStyled>}
    >
      <FieldWrapper>
        <FieldLabel>Novo e-mail*</FieldLabel>
        <StandardInput
          type="email"
          placeholder="Digite o novo e-mail"
          value={form.novo_email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, novo_email: e.target.value }))
          }
          status={errors.novo_email ? "error" : undefined}
        />
        {errors.novo_email && <ErrorText>{errors.novo_email}</ErrorText>}
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel>Confirmação do novo e-mail*</FieldLabel>
        <StandardInput
          type="email"
          placeholder="Digite o novo e-mail novamente"
          value={form.confirmacao_novo_email}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              confirmacao_novo_email: e.target.value,
            }))
          }
          status={errors.confirmacao_novo_email ? "error" : undefined}
        />
        {errors.confirmacao_novo_email && (
          <ErrorText>{errors.confirmacao_novo_email}</ErrorText>
        )}
      </FieldWrapper>

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
        message="Importante: Ao alterar a seu e-mail, ele se tornará padrão em todos os sistemas da SME aos quais você já possui acesso."
        style={{ marginTop: "1rem", fontSize: "0.8125rem" }}
      />

      <ButtonsContainer>
        <Button onClick={handleClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="primary" onClick={handleSalvar} loading={isPending}>
          Confirmar
        </Button>
      </ButtonsContainer>
    </Modal>
  );
};

export default AlterarEmailModal;
