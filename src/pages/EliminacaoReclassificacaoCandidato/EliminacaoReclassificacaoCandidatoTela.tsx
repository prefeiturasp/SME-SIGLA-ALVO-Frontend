import React, { useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Typography, Input, Table, Tooltip } from "antd";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { PrimaryButton, SecondaryButton, StyledSelect, ActionButtonsContainer } from "../../components/EstilosCompartilhados";
import { CustomFormItem } from "../../components/FormStyle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useConcursos } from "../../hooks/useConcursos";
import { useGetConcursoByUuid } from "../GerenciamentoVagas/hooks/useGetConcursoPorUuid";
import type { ColumnsType } from "antd/es/table";
import { Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import AlterarSituacaiCandidatoModal from "./components/AlterarSituacaoCandidatoModal";
import { useGetHablitados } from "./hooks/useGetHablitados";

type FiltrosForm = {
  concurso?: string;
  cargo?: string;
  nome?: string;
  rf?: string;
  rg?: string;
  cpf?: string;
};

type Registro = {
  key: string;
  nome: string;
  rf: string;
  rg: string;
  cpf: string;
  candidatoUuid?: string;
  hasPCD?: boolean;
  hasNNA?: boolean;
  reclassificadosDe?: string[];
  hasReclassificacao?: boolean;
  tipoClassificacao: string;
  classificacaoGeral: number | string;
  classificacaoDeficiente: number | string;
  classificacaoNNA: number | string;
  situacao: string;
};

const { Text } = Typography;

const EliminacaoReclassificacaoCandidatoTela: React.FC = () => {
  const navigate = useNavigate();
  const breadcrumbItems = useMemo<TitleItem[]>(
    () => [
      { title: <Text strong style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Home</Text> },
      { title: "Eliminação e Reclassificação de Candidato" },
    ],
    [navigate]
  );

  const { control, handleSubmit, reset, watch } = useForm<FiltrosForm>({
    defaultValues: {
      concurso: undefined,
      cargo: undefined,
      nome: "",
      rf: "",
      rg: "",
      cpf: "",
    },
  });

  const concursoSelecionado = watch("concurso");
  const cargoSelecionadoForm = watch("cargo");
  const { concursosData, concursosOptionsIsLoading } = useConcursos();
  const { concursoData, concursoIsLoading } = useGetConcursoByUuid(concursoSelecionado || "");

  const [appliedFilters, setAppliedFilters] = useState<FiltrosForm | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Registro | null>(null);
  const [habilitadosParams, setHabilitadosParams] = useState<Record<string, unknown> | undefined>(undefined);
  const { habilitadosData } = useGetHablitados(
    habilitadosParams,
    Boolean(habilitadosParams)
  );

  // Tabela inicia sem dados; será populada após filtrar
  const [rows, setRows] = useState<Registro[]>([]);

  const filteredRows = useMemo(() => {
    if (!appliedFilters) return rows;
    const f = appliedFilters;
    return rows.filter((row) => {
      const byNome = f.nome ? row.nome.toLowerCase().includes(f.nome.toLowerCase()) : true;
      const byRf = f.rf ? row.rf.toLowerCase().includes(f.rf.toLowerCase()) : true;
      const byRg = f.rg ? row.rg.toLowerCase().includes(f.rg.toLowerCase()) : true;
      const byCpf = f.cpf ? row.cpf.replace(/\D/g, "").includes(f.cpf.replace(/\D/g, "")) : true;
      return byNome && byRf && byRg && byCpf;
    });
  }, [appliedFilters, rows]);

  const columns: ColumnsType<Registro> = useMemo(
    () => [
      {
        title: "Nome do candidato",
        dataIndex: "nome",
        key: "nome",
        sorter: (a: Registro, b: Registro) => a.nome.localeCompare(b.nome),
        sortDirections: ["ascend", "descend"],
      },
      { title: "RF", dataIndex: "rf", key: "rf", align: "center" },
      { title: "RG", dataIndex: "rg", key: "rg", align: "center" },
      { title: "CPF", dataIndex: "cpf", key: "cpf", align: "center" },
      {
        title: "Tipo de classificação",
        dataIndex: "tipoClassificacao",
        key: "tipoClassificacao",
        align: "center",
        render: (value: string, record: Registro) => (
          <span>
            {value}
            {record.hasReclassificacao ? " *" : ""}
          </span>
        ),
      },
      {
        title: "Classificação geral",
        dataIndex: "classificacaoGeral",
        key: "classificacaoGeral",
        align: "center",
        sorter: (a: Registro, b: Registro) =>
          (typeof a.classificacaoGeral === "number" ? a.classificacaoGeral : Number(a.classificacaoGeral) || 0) -
          (typeof b.classificacaoGeral === "number" ? b.classificacaoGeral : Number(b.classificacaoGeral) || 0),
        sortDirections: ["ascend", "descend"],
      },
      {
        title: "Classificação deficiente",
        dataIndex: "classificacaoDeficiente",
        key: "classificacaoDeficiente",
        align: "center",
        sorter: (a: Registro, b: Registro) =>
          (typeof a.classificacaoDeficiente === "number" ? a.classificacaoDeficiente : Number(a.classificacaoDeficiente) || 0) -
          (typeof b.classificacaoDeficiente === "number" ? b.classificacaoDeficiente : Number(b.classificacaoDeficiente) || 0),
        sortDirections: ["ascend", "descend"],
      },
      {
        title: "Classificação NNA",
        dataIndex: "classificacaoNNA",
        key: "classificacaoNNA",
        align: "center",
        sorter: (a: Registro, b: Registro) =>
          (typeof a.classificacaoNNA === "number" ? a.classificacaoNNA : Number(a.classificacaoNNA) || 0) -
          (typeof b.classificacaoNNA === "number" ? b.classificacaoNNA : Number(b.classificacaoNNA) || 0),
        sortDirections: ["ascend", "descend"],
      },
      { title: "Situação", dataIndex: "situacao", key: "situacao", align: "center" },
      {
        title: "Alterar",
        key: "alterar",
        align: "center",
        render: (_: any, record: Registro) => (
          (() => {
            const isEliminado = String(record?.situacao || "").toLowerCase() === "eliminado";
            return (
              <Tooltip title={isEliminado ? "Candidato eliminado" : "Alterar"}>
                <EditOutlined
                  style={{
                    fontSize: 16,
                    color: isEliminado ? "#BFBFBF" : "#0F59C8",
                    cursor: isEliminado ? "not-allowed" : "pointer",
                  }}
                  onClick={() => {
                    if (isEliminado) return;
                    setSelectedRow(record);
                    setModalOpen(true);
                  }}
                />
              </Tooltip>
            );
          })()
        ),
      },
    ],
    []
  );

  const handleFiltrar = handleSubmit(async (data) => {
    setAppliedFilters(data);
    setPagination((prev) => ({ ...prev, current: 1 }));

    try {
      const concursoUuid = data.concurso;
      const cargoUuid = data.cargo;
      const cargoCodigo = (Array.isArray(concursoData?.cargos) ? (concursoData as any).cargos : [])
        .find((c: any) => c?.uuid === cargoUuid)?.codigo;

      const params: Record<string, unknown> = {
        lote__concurso_uuid: concursoUuid,
        codigo_cargo: cargoCodigo,
      };
      if (data.nome && String(data.nome).trim()) params.candidato__nome = String(data.nome).trim();
      if (data.rf && String(data.rf).trim()) params.candidato__registro_funcional = String(data.rf).trim();
      if (data.rg && String(data.rg).trim()) params.candidato__rg = String(data.rg).trim();
      if (data.cpf && String(data.cpf).trim()) params.candidato__cpf = String(data.cpf).trim();

      setHabilitadosParams(params);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Falha ao buscar candidatos habilitados:", err);
    }
  });

  useEffect(() => {
    if (!habilitadosData) return;
    const list: any[] = Array.isArray(habilitadosData) ? (habilitadosData as any[]) : [];
    const mapped: Registro[] = list.map((item: any, idx: number) => {
      const candidato = item?.candidato || {};
      const tipo = String(item?.categoria_efetiva || "").toUpperCase();
      const reclassificadosDe = Array.isArray(item?.reclassificacoes)
        ? (item.reclassificacoes as any[]).map((rec: any) => String(rec?.desclassificado_de || "").toUpperCase()).filter(Boolean)
        : [];
      return {
        key: String(item?.uuid || item?.id || idx),
        nome: String(candidato?.nome || "—"),
        rf: String(candidato?.registro_funcional || "—"),
        rg: String(candidato?.rg || "—"),
        cpf: String(candidato?.cpf || "—"),
        candidatoUuid: String(candidato?.uuid || item?.uuid || ""),
        hasPCD: Boolean(item?.classificacao_pcd),
        hasNNA: Boolean(item?.classificacao_nna),
        reclassificadosDe,
        hasReclassificacao: reclassificadosDe.length > 0,
        tipoClassificacao: tipo,
        classificacaoGeral: Number(item?.classificacao) || "-",
        classificacaoDeficiente: Number(item?.classificacao_pcd) || "-",
        classificacaoNNA: Number(item?.classificacao_nna) || "-",
        situacao: item?.eliminado ? "Eliminado" : "Ativo",
      };
    });
    setRows(mapped);
  }, [habilitadosData]);

  const handleLimpar = () => {
    reset({
      concurso: undefined,
      cargo: undefined,
      nome: "",
      rf: "",
      rg: "",
      cpf: "",
    });
    setAppliedFilters(null);
    setPagination({ current: 1, pageSize: 10 });
  };

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Eliminação e Reclassificação de Candidato"
    >
      <Card style={{ marginTop: "1.25rem" }} variant="borderless">
        <Row gutter={[24, 16]} style={{ textAlign: "left" }}>
          <Col xs={24} sm={12} md={12}>
            <Controller
              control={control}
              name="concurso"
              render={({ field }) => (
                <CustomFormItem label="Concurso" labelCol={{ span: 24 }}>
                  <StyledSelect
                    style={{ marginTop: 6 }}
                    value={field.value}
                    onChange={(value: unknown) => {
                      field.onChange(value as string | undefined);
                      // Ao mudar o concurso, limpar o cargo
                      (control as any)._formValues.cargo = undefined;
                    }}
                    placeholder="Selecione o concurso"
                    allowClear
                    suffixIcon={<ExpandMoreIcon style={{ fontSize: "1.5rem", color: "#032B68" }} />}
                    loading={concursoSelecionado ? concursoIsLoading : concursosOptionsIsLoading}
                  >
                    {(() => {
                      const list = Array.isArray((concursosData as any)?.results)
                        ? (concursosData as any).results
                        : Array.isArray(concursosData)
                        ? (concursosData as any)
                        : [];
                      return list.map((c: any) => {
                        const value = c?.uuid ?? c?.value;
                        const label = c?.descricao ?? c?.nome ?? c?.label ?? value;
                        return (
                          <Select.Option key={String(value)} value={String(value)}>
                            {label}
                          </Select.Option>
                        );
                      });
                    })()}
                  </StyledSelect>
                </CustomFormItem>
              )}
            />
          </Col>

          <Col xs={24} sm={12} md={12}>
            <Controller
              control={control}
              name="cargo"
              render={({ field }) => (
                <CustomFormItem label="Cargo" labelCol={{ span: 24 }}>
                  <StyledSelect
                    style={{ marginTop: 6 }}
                    value={field.value}
                    onChange={(value: unknown) => field.onChange(value as string | undefined)}
                    placeholder="Selecione o cargo"
                    allowClear
                    suffixIcon={<ExpandMoreIcon style={{ fontSize: "1.5rem", color: "#032B68" }} />}
                    loading={concursoIsLoading}
                    disabled={!concursoSelecionado}
                  >
                    {Array.isArray(concursoData?.cargos) &&
                      (concursoData?.cargos as any[]).map((cargo: any) => (
                        <Select.Option key={cargo.uuid} value={cargo.uuid}>
                          {cargo.nome}
                        </Select.Option>
                      ))}
                  </StyledSelect>
                </CustomFormItem>
              )}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Controller
              control={control}
              name="nome"
              render={({ field }) => (
                <CustomFormItem label="Nome" labelCol={{ span: 24 }}>
                  <Input {...field} style={{ marginTop: 6 }} placeholder="Digite o nome" />
                </CustomFormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Controller
              control={control}
              name="rf"
              render={({ field }) => (
                <CustomFormItem label="RF" labelCol={{ span: 24 }}>
                  <Input {...field} style={{ marginTop: 6 }} placeholder="Digite o RF" />
                </CustomFormItem>
              )}
            />
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Controller
              control={control}
              name="rg"
              render={({ field }) => (
                <CustomFormItem label="RG" labelCol={{ span: 24 }}>
                  <Input {...field} style={{ marginTop: 6 }} placeholder="Digite o RG" />
                </CustomFormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Controller
              control={control}
              name="cpf"
              render={({ field }) => (
                <CustomFormItem label="CPF" labelCol={{ span: 24 }}>
                  <Input {...field} style={{ marginTop: 6 }} placeholder="Digite o CPF" />
                </CustomFormItem>
              )}
            />
          </Col>

          <Col xs={24} md={24} style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
            <ActionButtonsContainer style={{ justifyContent: "flex-end", width: "100%" }}>
              <SecondaryButton onClick={handleLimpar}>Limpar</SecondaryButton>
              <PrimaryButton onClick={handleFiltrar} disabled={!concursoSelecionado || !cargoSelecionadoForm}>
                Filtrar
              </PrimaryButton>
            </ActionButtonsContainer>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: "1.25rem" }} variant="borderless">
        <Table
          columns={columns}
          dataSource={filteredRows}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
            showSizeChanger: true,
            showTotal: (total, range) => (
                <span style={{ marginLeft: 16 }}>
                  {`Mostrando ${range?.[0] ?? 0}-${range?.[1] ?? 0} de ${total ?? 0} registro(s)`}
                </span>
              ),
          }}
          rowKey="key"
        />
        {filteredRows.length > 0 && (
          <div style={{ marginTop: 4, textAlign: "left" }}>
            <Text type="secondary">* Candidato reclassificado</Text>
          </div>
        )}
      </Card>

      <AlterarSituacaiCandidatoModal
        open={modalOpen}
        nomeCandidato={selectedRow?.nome || ""}
        candidatoUuid={selectedRow?.candidatoUuid || ""}
        hasPCD={selectedRow?.hasPCD || false}
        hasNNA={selectedRow?.hasNNA || false}
        reclassificadosDe={selectedRow?.reclassificadosDe || []}
        concursoUuid={concursoSelecionado || ""}
        concursoLabel={(() => {
          const list = Array.isArray((concursosData as any)?.results)
            ? (concursosData as any).results
            : Array.isArray(concursosData)
            ? (concursosData as any)
            : [];
          const found = list.find((c: any) => String(c?.uuid ?? c?.value) === String(concursoSelecionado));
          return found ? (found?.descricao ?? found?.nome ?? found?.label ?? String(concursoSelecionado || "")) : String(concursoSelecionado || "");
        })()}
        cargoUuid={cargoSelecionadoForm || ""}
        cargoLabel={(() => {
          const list = Array.isArray(concursoData?.cargos) ? (concursoData as any).cargos : [];
          const found = list.find((c: any) => String(c?.uuid) === String(cargoSelecionadoForm));
          return found ? String(found?.nome || "") : String(cargoSelecionadoForm || "");
        })()}
        situacaoInicial={selectedRow?.situacao || "Ativo"}
        onCancel={() => {
          setModalOpen(false);
          setSelectedRow(null);
        }}
        onSave={(novaSituacao) => {
          if (selectedRow) {
            setRows((prev) =>
              prev.map((r) => (r.key === selectedRow.key ? { ...r, situacao: novaSituacao } : r))
            );
          }
          setModalOpen(false);
          setSelectedRow(null);
        }}
      />
    </BaseTela>
  );
};

export default EliminacaoReclassificacaoCandidatoTela;

