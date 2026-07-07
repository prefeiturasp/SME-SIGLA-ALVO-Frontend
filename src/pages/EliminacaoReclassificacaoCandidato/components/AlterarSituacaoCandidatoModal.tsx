import React, { useEffect, useState } from "react";
import { Modal, Input, message } from "antd";
import { usePostHabilitadoEliminar } from "../hooks/usePostHabilitadoEliminar";
import { usePostReclassificarCandidato } from "../hooks/usePostReclassificarCandidato";

import { AppButton, StyledSelect, AppFormItem, ModalInfoLabel, ModalInfoValue, InlineInfoItem } from '@/components/ui';
type Props = {
  open: boolean;
  nomeCandidato: string;
  candidatoUuid: string;
  hasPCD?: boolean;
  hasNNA?: boolean;
  reclassificadosDe?: string[];
  concursoUuid?: string;
  concursoLabel?: string;
  cargoUuid?: string;
  cargoLabel?: string;
  situacaoInicial: string;
  onCancel: () => void;
  onSave: (novaSituacao: string) => void;
};

const AlterarSituacaiCandidatoModal: React.FC<Props> = ({
  open,
  nomeCandidato,
  candidatoUuid,
  hasPCD = false,
  hasNNA = false,
  reclassificadosDe = [],
  concursoUuid,
  concursoLabel,
  cargoUuid,
  cargoLabel,
  situacaoInicial,
  onCancel,
  onSave,
}) => {
  const [situacao, setSituacao] = useState<string>("");
  const [motivo, setMotivo] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const eliminarMutation = usePostHabilitadoEliminar();
  const reclassificarMutation = usePostReclassificarCandidato();
  useEffect(() => {
    if (open) {
      // Não pré-selecionar valor para forçar escolha explícita
      setSituacao("");
      setMotivo("");
      setSubmitting(false);
    }
  }, [open, situacaoInicial]);

  const submitAlteracao = async () => {
    if (!situacao) {
      message.warning("Selecione a situação");
      return;
    }
    try {
      setSubmitting(true);
      if (situacao === "ELIMINAR") {
        await eliminarMutation.mutateAsync({ candidato_uuid: candidatoUuid, motivo });
      } else {
        await reclassificarMutation.mutateAsync({
          candidato_uuid: candidatoUuid,
          desclassificar_de: situacao,
          motivo,
        });
      }
      message.success("Situação atualizada com sucesso");
      onSave(situacao);
    } catch (e: any) {
      const detail =
        e?.response?.data?.detail ||
        e?.message ||
        "Falha ao atualizar a situação do candidato.";
      message.error(String(detail));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="Alterar situação do candidato"
      width={720}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <InlineInfoItem style={{ gap: 24 }}>
          <InlineInfoItem>
            <ModalInfoLabel>Concurso:</ModalInfoLabel>
            <ModalInfoValue>{concursoLabel || concursoUuid || "—"}</ModalInfoValue>
          </InlineInfoItem>
          <InlineInfoItem>
            <ModalInfoLabel>Cargo:</ModalInfoLabel>
            <ModalInfoValue>{cargoLabel || cargoUuid || "—"}</ModalInfoValue>
          </InlineInfoItem>
        </InlineInfoItem>
        <InlineInfoItem>
          <ModalInfoLabel>Candidato:</ModalInfoLabel>
          <ModalInfoValue>{nomeCandidato || "—"}</ModalInfoValue>
        </InlineInfoItem>

        <AppFormItem label="Situação" labelCol={{ span: 24 }}>
          <StyledSelect
            style={{ width: "100%" }}
            value={situacao || undefined}
            onChange={(value: unknown) => setSituacao(String(value))}
            placeholder="Selecione a situação"
          >
            <StyledSelect.Option value="ELIMINAR">Eliminar</StyledSelect.Option>
            <StyledSelect.Option
              value="NNA"
              disabled={!hasNNA || reclassificadosDe.includes("NNA")}
            >
              Desclassificar NNA
            </StyledSelect.Option>
            <StyledSelect.Option
              value="PCD"
              disabled={!hasPCD || reclassificadosDe.includes("PCD")}
            >
              Desclassificar PCD
            </StyledSelect.Option>
          </StyledSelect>
        </AppFormItem>

        {situacao && (
          <AppFormItem label="Motivo" labelCol={{ span: 24 }}>
            <Input.TextArea
              rows={4}
              style={{ width: "100%" }}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva o motivo"
            />
          </AppFormItem>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <AppButton variant="secondary" onClick={onCancel} disabled={submitting}>Cancelar</AppButton>
          <AppButton
            loading={submitting}
            disabled={!situacao}
            onClick={submitAlteracao}
          >
            Salvar
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};

export default AlterarSituacaiCandidatoModal;

