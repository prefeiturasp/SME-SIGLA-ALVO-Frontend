import React, { useState } from "react";
import { Modal, Button, Alert, Form } from "antd";
import { useAlterarEmail } from "../hooks/usePostAlterarEmail";
import { StandardInput } from "../../../components/EstilosCompartilhados";
import {
  ModalTitleStyled,
  ButtonsContainer,
} from "./AlterarEmailModal.styles";

interface AlterarEmailModalProps {
  open: boolean;
  onClose: () => void;
}

interface AlterarEmailFormValues {
  novo_email: string;
  confirmacao_novo_email: string;
}

const AlterarEmailModal: React.FC<AlterarEmailModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm<AlterarEmailFormValues>();
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutate, isPending } = useAlterarEmail();

  const handleClose = () => {
    form.resetFields();
    setApiError(null);
    onClose();
  };

  const handleSalvar = async () => {
    setApiError(null);
    try {
      const values = await form.validateFields();

      mutate(
        { novo_email: values.novo_email.trim() },
        {
          onSuccess: () => {
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
              form.setFields([{ name: "novo_email", errors: [mensagem] }]);
            } else {
              setApiError(mensagem);
            }
          },
        }
      );
    } catch {
      // validateFields já exibe os erros nos campos
    }
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
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="novo_email"
          label="Novo e-mail"
          required
          rules={[
            { required: true, message: "Campo obrigatório." },
            { type: "email", message: "Informe um e-mail válido." },
          ]}
        >
          <StandardInput type="email" placeholder="Digite o novo e-mail" />
        </Form.Item>

        <Form.Item
          name="confirmacao_novo_email"
          label="Confirmação do novo e-mail"
          required
          dependencies={["novo_email"]}
          rules={[
            { required: true, message: "Campo obrigatório." },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("novo_email") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Os e-mails não conferem."));
              },
            }),
          ]}
        >
          <StandardInput
            type="email"
            placeholder="Digite o novo e-mail novamente"
          />
        </Form.Item>
      </Form>

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
