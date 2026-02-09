import React, { useEffect, useMemo, useState } from "react";
import { Modal, Typography } from "antd";
import { FilterSelect } from "../../EscolhaCandidatos/styles";
import { API } from "../../../services";

type CargoItem = { cargo_codigo: string; cargo_nome: string };

type Props = {
  open: boolean;
  processoUuid?: string;
  onOk: (payload: { cargoCodigo?: string }) => void;
  onCancel: () => void;
};

const AtaEscolhaCargoModal: React.FC<Props> = ({
  open,
  processoUuid,
  onOk,
  onCancel,
}) => {
  const [cargos, setCargos] = useState<CargoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCargoCodigo, setSelectedCargoCodigo] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open || !processoUuid) {
      setCargos([]);
      setSelectedCargoCodigo(undefined);
      return;
    }
    setLoading(true);
    API.Relatorios.getAtaEscolhaCargos(processoUuid)
      .response.then((data: { cargos: CargoItem[] }) => {
        setCargos(data?.cargos ?? []);
        if (data?.cargos?.length === 1) {
          setSelectedCargoCodigo(data.cargos[0].cargo_codigo);
        } else {
          setSelectedCargoCodigo(undefined);
        }
      })
      .catch(() => setCargos([]))
      .finally(() => setLoading(false));
  }, [open, processoUuid]);

  const cargoOptions = useMemo(
    () =>
      cargos.map((c) => ({
        value: c.cargo_codigo,
        label: c.cargo_nome,
      })),
    [cargos]
  );

  const handleOk = () => {
    onOk({ cargoCodigo: selectedCargoCodigo });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      title="Ata de Escolha - Selecione o cargo"
      okText="Gerar"
      okButtonProps={{ disabled: !selectedCargoCodigo }}
    >
      <div style={{ padding: 16 }}>
        <Typography.Text strong>Cargo</Typography.Text>
        <FilterSelect
          allowClear
          placeholder="Selecione um cargo"
          style={{ width: "100%", marginTop: 8 }}
          value={selectedCargoCodigo}
          options={cargoOptions}
          loading={loading}
          disabled={!processoUuid}
          onChange={(value) => setSelectedCargoCodigo(value as string | undefined)}
        />
      </div>
    </Modal>
  );
};

export default AtaEscolhaCargoModal;
