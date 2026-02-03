import React, { useEffect, useMemo, useState } from "react";
import { Modal, Typography } from "antd";
import { useGetAgendasPorProcessoConvocacao } from "../../EscolhaCandidatos/hooks/useGetAgendasPorProcessoConvocacao";
import { FilterSelect } from "../../EscolhaCandidatos/styles";

type Props = {
  open: boolean;
  processoUuid?: string;
  onOk: (payload: { agendaUuid?: string }) => void;
  onCancel: () => void;
};

const ListaCandidatosSessaoModal: React.FC<Props> = ({
  open,
  processoUuid,
  onOk,
  onCancel,
}) => {
  const { agendasList, agendasIsLoading } = useGetAgendasPorProcessoConvocacao({
    processoUuid,
    enabled: open,
  });

  const [selectedAgendaUuid, setSelectedAgendaUuid] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (open) {
      setSelectedAgendaUuid(undefined);
    }
  }, [open, processoUuid]);

  const agendaOptions = useMemo(
    () =>
      agendasList.map((agenda) => ({
        value: agenda.uuid,
        label:
          agenda.sessao
            ? `${agenda.sessao} • ${agenda.cargo_nome}`
            : `${agenda.cargo_nome}`,
      })),
    [agendasList]
  );

  const handleChange = (value: unknown) => {
    setSelectedAgendaUuid(value as string | undefined);
  };

  const handleOk = () => {
    onOk({
      agendaUuid: selectedAgendaUuid,
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      title="Lista de Candidatos por Sessão"
      okText="Gerar"
    >
      <div style={{ padding: 16 }}>
        <Typography.Text strong>Sessões</Typography.Text>
        <FilterSelect
          allowClear
          placeholder="Todas as sessões"
          style={{ width: "100%", marginTop: 8 }}
          value={selectedAgendaUuid}
          options={agendaOptions}
          loading={agendasIsLoading}
          disabled={!processoUuid}
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
};

export default ListaCandidatosSessaoModal;


