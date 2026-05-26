import React, { useState } from "react";
import { Descriptions, Typography, Table, Spin, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { IHistoricoEnvioEmail, ICandidatoEnvioEmail } from "../../../../services/resources/convocacao/IConvocacao";
import { CustomModal2 } from "../../../../components/EstilosCompartilhados";
import ConteudoEmailModal from "./ConteudoEmailModal";

const { Text } = Typography;

interface DetalheCartaConvocacaoModalProps {
  open: boolean;
  onClose: () => void;
  registro: IHistoricoEnvioEmail | null;
}

const DetalheCartaConvocacaoModal: React.FC<DetalheCartaConvocacaoModalProps> = ({
  open,
  onClose,
  registro,
}) => {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState<ICandidatoEnvioEmail | null>(null);

  const { data: detalhe, isLoading } = useQuery({
    queryKey: ["getDetalheEnvioEmail", registro?.uuid],
    queryFn: ({ signal }) =>
      registro?.uuid
        ? API.Convocacao.getDetalheEnvioEmail(registro.uuid, { signal }).response
        : Promise.resolve(null),
    enabled: open && !!registro?.uuid,
    staleTime: 1000 * 60,
  });

  const candidatos = detalhe?.candidatos ?? [];

  const handleVerEmail = (record: ICandidatoEnvioEmail) => {
    setCandidatoSelecionado(record);
    setEmailModalOpen(true);
  };

  const columns: ColumnsType<ICandidatoEnvioEmail> = [
    { title: "Nome", dataIndex: "nome", key: "nome", ellipsis: true },
    { title: "RF", dataIndex: "rf", key: "rf", width: 100 },
    { title: "E-mail", dataIndex: "email", key: "email", ellipsis: true },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (val: string) => val ?? "—",
    },
    {
      title: "Ação",
      key: "acao",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Tooltip title="Visualizar e-mail enviado">
          <EyeOutlined
            style={{ cursor: "pointer", fontSize: "18px", color: "#0F59C8" }}
            onClick={() => handleVerEmail(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <CustomModal2
      className="detalhe-carta-modal"
      title="Detalhes do envio"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
    >
      <style>{`
        .detalhe-carta-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
      `}</style>
      {!registro ? null : isLoading ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <Spin />
        </div>
      ) : (
        <>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Processo">
              <Text>{detalhe?.processo_nome ?? registro.processo_nome ?? "—"}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Qtd. candidatos">
              <Text>{detalhe?.quantidade_candidatos ?? registro.quantidade_candidatos ?? "—"}</Text>
            </Descriptions.Item>
            {detalhe?.criado_em && (
              <Descriptions.Item label="Enviado em">
                <Text>{dayjs(detalhe.criado_em).format("DD/MM/YYYY HH:mm")}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
          {candidatos.length > 0 && (
            <>
              <Text strong style={{ display: "block", marginTop: 16, marginBottom: 8 }}>
                Candidatos
              </Text>
              <div className="detalhe-carta-modal-table-wrap">
                <style>{`
                  .detalhe-carta-modal-table-wrap .ant-table-pagination {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                  }
                  .detalhe-carta-modal-table-wrap .ant-pagination-total-text {
                    margin-right: auto;
                  }
                `}</style>
                <Table
                  size="small"
                  columns={columns}
                  dataSource={candidatos}
                  rowKey={(_, i) => String(i)}
                  scroll={{ x: 500 }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                      <Text style={{ fontWeight: 700 }}>
                        Mostrando {range[0]}-{range[1]} de {total} registro(s)
                      </Text>

                  }}
                />
              </div>
            </>
          )}
        </>
      )}

      <ConteudoEmailModal
        open={emailModalOpen}
        onClose={() => {
          setEmailModalOpen(false);
          setCandidatoSelecionado(null);
        }}
        nomeCandidato={candidatoSelecionado?.nome}
        conteudo={candidatoSelecionado?.conteudo ?? ""}
        status={candidatoSelecionado?.status}
        statusDetalhe={candidatoSelecionado?.status_detalhe}
      />
    </CustomModal2>
  );
};

export default DetalheCartaConvocacaoModal;
