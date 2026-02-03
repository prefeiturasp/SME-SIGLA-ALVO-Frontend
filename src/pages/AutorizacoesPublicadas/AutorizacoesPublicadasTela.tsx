import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Input, Row, Table, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import ConfigurarAutorizacaoModal from "./components/ConfigurarAutorizacaoModal";
import { useGetCargosAutorizacoesPublicadas } from "./hooks/useGetCargos";

type Registro = {
  key: string;
  cargoUuid?: string;
  cargoCodigo: number;
  cargo: string;
  ultimaAtualizacao: string;
  totalAutorizacoes: number;
  totalSemEfeito: number;
  escolhasRealizadas: number;
};

const { Text } = Typography;

const AutorizacoesPublicadasTela: React.FC = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState<string>("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedCargoCodigo, setSelectedCargoCodigo] = useState<number | undefined>(undefined);
  const [selectedCargo, setSelectedCargo] = useState<string | undefined>(undefined);
  const [selectedCargoUuid, setSelectedCargoUuid] = useState<string | undefined>(undefined);
  const [rows, setRows] = useState<Registro[]>([]);
  const [cargosLoading, setCargosLoading] = useState<boolean>(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [appliedBusca, setAppliedBusca] = useState<string>("");

  const breadcrumbItems = useMemo(
    () => [
      {
        title: (
          <Text
            strong
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Home
          </Text>
        ),
      },
      {
        title: (
          <Text
            strong
          >
            Gerenciar
          </Text>
        ),
      },
      { title: "Gestão de Autorizações publicadas" },
    ] as TitleItem[],
    [navigate]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    const run = async () => {
      setCargosLoading(true);
      const result = await useGetCargosAutorizacoesPublicadas(ctrl.signal);
      if ((result as any)?.message) {
        setRows([]);
      } else {
        const data = result as unknown as Array<any>;
        const list = Array.isArray(data) ? data : [];
        const formatDate = (iso?: string | null): string => {
          if (!iso) return "—";
          const d = new Date(iso);
          if (Number.isNaN(d.getTime())) return "—";
          const dd = String(d.getDate()).padStart(2, "0");
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const yyyy = d.getFullYear();
          return `${dd}/${mm}/${yyyy}`;
        };
        const mapped: Registro[] = list.map((cargo) => {
          const dataRecente = cargo?.data_autorizacao_mais_recente as string | null | undefined;
          let saldoAtual= (Number(cargo?.autorizacoes) - Number(cargo?.total_escolhas));
          return {
            key: String(cargo?.uuid || cargo?.codigo || Math.random()),
            cargoUuid: typeof cargo?.uuid === "string" ? cargo.uuid : undefined,
            cargoCodigo: Number(cargo?.codigo) || 0,
            cargo: String(cargo?.nome || "—"),
            ultimaAtualizacao: formatDate(dataRecente),
            totalAutorizacoes: Number(cargo?.autorizacoes) || 0,
            totalSemEfeito: Number(cargo?.autorizacoes_sem_efeito) || 0,
            escolhasRealizadas: cargo?.total_escolhas || 0,
            saldoAtual: saldoAtual > 0 ? saldoAtual : 0,
          };
        });
        setRows(mapped);
      }
      setCargosLoading(false);
    };
    void run();
    return () => ctrl.abort();
  }, [refreshToken]);

  const filteredData = useMemo(() => {
    const term = appliedBusca.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => r.cargo.toLowerCase().includes(term));
  }, [rows, appliedBusca]);

  const columns = useMemo(
    () => [
      { title: "Código do cargo", dataIndex: "cargoCodigo", key: "cargoCodigo", align: "center" as const },
      { title: "Cargo", dataIndex: "cargo", key: "cargo" },
      { title: "Última atualização", dataIndex: "ultimaAtualizacao", key: "ultimaAtualizacao", align: "center" as const },
      { title: "Total autorizações", dataIndex: "totalAutorizacoes", key: "totalAutorizacoes", align: "center" as const },
      { title: "Total sem efeito", dataIndex: "totalSemEfeito", key: "totalSemEfeito", align: "center" as const },
      { title: "Escolhas realizadas", dataIndex: "escolhasRealizadas", key: "escolhasRealizadas", align: "center" as const },
      { title: "Saldo atual", dataIndex: "saldoAtual", key: "saldoAtual", align: "center" as const },
      {
        title: "Gerenciar",
        key: "gerenciar",
        align: "center" as const,
        render: (_: any, record: any) => (
          <SettingOutlined
            style={{ fontSize: 18, color: "#0F59C8", cursor: "pointer" }}
            title="Gerenciar"
            onClick={() => {
              setSelectedCargoUuid(record?.cargoUuid);
              setSelectedCargoCodigo(record?.cargoCodigo);
              setSelectedCargo(record?.cargo);
              setConfigModalOpen(true);
            }}
          />
        ),
      },
    ],
    []
  );

  const handleBuscar = () => {
    setAppliedBusca(busca);
    setPagination((prev) => ({ current: 1, pageSize: prev.pageSize }));
  };

  return (
    <BaseTela breadcrumbItems={breadcrumbItems} title="Gestão de Autorizações publicadas">
      <Card style={{ border: "none", borderRadius: 12, marginBottom: 16 }}>
        <Row gutter={[16, 12]} align="bottom">
          <Col xs={24} md={12}>
            <Typography.Text strong>Buscar</Typography.Text>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Input
                allowClear
                placeholder="Digite um termo"
                style={{ flex: 1 }}
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <Button type="primary" onClick={handleBuscar}>
                Filtrar
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      <Card style={{ border: "none", borderRadius: 12 }}>
        <Table
          rowKey="key"
          dataSource={filteredData}
          columns={columns as any}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredData.length,
            showSizeChanger: true,
          }}
          loading={cargosLoading}
          onChange={(pg) =>
            setPagination({
              current: Number(pg.current) || 1,
              pageSize: Number(pg.pageSize) || 10,
            })
          }
        />
      </Card>
      <ConfigurarAutorizacaoModal
        open={configModalOpen}
        cargoUuid={selectedCargoUuid}
        cargoCodigo={selectedCargoCodigo}
        cargo={selectedCargo}
        onCancel={() => {
          setConfigModalOpen(false);
          setRefreshToken((prev) => prev + 1);
        }}
        onAdd={() => {}}
      />
    </BaseTela>
  );
};

export default AutorizacoesPublicadasTela;

