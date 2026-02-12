import React, { useEffect, useState } from "react";
import { Modal, Typography, Button, Input, message } from "antd";
import { StyledSelect } from "../../../components/EstilosCompartilhados";
import { usePostHabilitadoEliminar } from "../hooks/usePostHabilitadoEliminar";
import { usePostReclassificarCandidato } from "../hooks/usePostReclassificarCandidato";

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
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Typography.Text strong>Concurso:</Typography.Text>
            <Typography.Text>{concursoLabel || concursoUuid || "—"}</Typography.Text>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Typography.Text strong>Cargo:</Typography.Text>
            <Typography.Text>{cargoLabel || cargoUuid || "—"}</Typography.Text>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Typography.Text strong>Candidato:</Typography.Text>
          <Typography.Text>{nomeCandidato || "—"}</Typography.Text>
        </div>

        <div>
          <Typography.Text strong>Situação</Typography.Text>
          <StyledSelect
            style={{ width: "100%", marginTop: 8 }}
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
        </div>

        {situacao && (
          <div>
            <Typography.Text strong>Motivo</Typography.Text>
            <Input.TextArea
              rows={4}
              style={{ width: "100%", marginTop: 8 }}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva o motivo"
            />
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
          <Button onClick={onCancel} disabled={submitting}>Cancelar</Button>
          <Button
            type="primary"
            loading={submitting}
            disabled={!situacao}
            onClick={submitAlteracao}
          >
            Salvar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AlterarSituacaiCandidatoModal;

