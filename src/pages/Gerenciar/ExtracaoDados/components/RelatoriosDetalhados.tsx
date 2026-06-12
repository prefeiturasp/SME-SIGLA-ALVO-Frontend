import React, { useMemo, useState } from "react";
import { Button, Col, Row, Select } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CustomFormItem } from "../../../../components/FormStyle";
import {
  StyledSelect,
  TextTitulo,
  TextTituloSecundario,
} from "../../../../components/EstilosCompartilhados";
import type { RelatorioDetalhadoItem } from "../utils/mapRelatoriosDetalhados";
import {
  FilterActions,
  RelatoriosDetalhadosFilter,
  RelatoriosDetalhadosTable,
  TableCard,
} from "../styles";

type RelatoriosDetalhadosProps = {
  data: RelatorioDetalhadoItem[];
};

const TODOS_CARGOS = "todos";
const TODAS_DRES = "todas";

const formatNumber = (value: number) => value.toLocaleString("pt-BR");

const RelatoriosDetalhados: React.FC<RelatoriosDetalhadosProps> = ({ data }) => {
  const [cargo, setCargo] = useState<string>(TODOS_CARGOS);
  const [dre, setDre] = useState<string>(TODAS_DRES);
  const [cargoAplicado, setCargoAplicado] = useState<string>(TODOS_CARGOS);
  const [dreAplicado, setDreAplicado] = useState<string>(TODAS_DRES);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const cargoOptions = useMemo(() => {
    const cargos = new Map<string, string>();

    data.forEach((item) => {
      const value = item.codigoCargo ? String(item.codigoCargo) : item.cargo;
      cargos.set(value, item.cargo);
    });

    return [
      { value: TODOS_CARGOS, label: "Todos" },
      ...Array.from(cargos.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [data]);

  const dreOptions = useMemo(() => {
    const dres = new Map<string, string>();

    data.forEach((item) => {
      dres.set(item.dreOriginal, item.dre);
    });

    return [
      { value: TODAS_DRES, label: "Todas" },
      ...Array.from(dres.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [data]);

  const dadosFiltrados = useMemo(() => {
    return data.filter((item) => {
      const cargoMatch =
        cargoAplicado === TODOS_CARGOS ||
        (item.codigoCargo ? String(item.codigoCargo) : item.cargo) === cargoAplicado;
      const dreMatch = dreAplicado === TODAS_DRES || item.dreOriginal === dreAplicado;

      return cargoMatch && dreMatch;
    });
  }, [cargoAplicado, data, dreAplicado]);

  const columns = useMemo<ColumnsType<RelatorioDetalhadoItem>>(
    () => [
      {
        title: "Concurso",
        dataIndex: "concurso",
        key: "concurso",
        ellipsis: true,
      },
      {
        title: "Cargo",
        dataIndex: "cargo",
        key: "cargo",
        ellipsis: true,
      },
      {
        title: "DRE",
        dataIndex: "dre",
        key: "dre",
        ellipsis: true,
      },
      {
        title: "Escolhas",
        dataIndex: "escolhas",
        key: "escolhas",
        width: 100,
        onCell: () => ({ className: "col-numerica-valor" }),
        render: (value: number) => formatNumber(value),
      },
      {
        title: "Não Escolhas",
        dataIndex: "naoEscolhas",
        key: "naoEscolhas",
        width: 140,
        onCell: () => ({ className: "col-numerica-valor" }),
        render: (value: number) => formatNumber(value),
      },
      {
        title: "Autorizações",
        dataIndex: "autorizacoes",
        key: "autorizacoes",
        width: 140,
        onCell: () => ({ className: "col-numerica-valor" }),
        render: (value: number) => formatNumber(value),
      },
      {
        title: "Última atualização",
        dataIndex: "data_autorizacao",
        key: "data_autorizacao",
        width: 180,
      },
    ],
    []
  );

  const dadosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * 10;
    return dadosFiltrados.slice(inicio, inicio + 10);
  }, [dadosFiltrados, paginaAtual]);

  const pagination = useMemo<TablePaginationConfig>(
    () => ({
      current: paginaAtual,
      pageSize: 10,
      total: dadosFiltrados.length,
      showSizeChanger: false,
      showTotal: (total, range) =>
        `Mostrando ${range[0]}-${range[1]} de ${total} registro(s)`,
      onChange: (page) => setPaginaAtual(page),
    }),
    [dadosFiltrados.length, paginaAtual]
  );

  const handleLimparFiltros = () => {
    setCargo(TODOS_CARGOS);
    setDre(TODAS_DRES);
    setCargoAplicado(TODOS_CARGOS);
    setDreAplicado(TODAS_DRES);
    setPaginaAtual(1);
  };

  const handleFiltrar = () => {
    setCargoAplicado(cargo);
    setDreAplicado(dre);
    setPaginaAtual(1);
  };

  return (
    <TableCard>
      <TextTitulo style={{ fontSize: 20, marginLeft: 16, display: "block" }}>
        Relatórios detalhados
      </TextTitulo>
      <TextTituloSecundario style={{ fontSize: 14, marginTop: 8, marginLeft: 16, display: "block" }}>
        Lista consolidada por concurso, cargo e DRE.
      </TextTituloSecundario>

      <RelatoriosDetalhadosFilter>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <CustomFormItem label="Cargo" labelCol={{ span: 24 }}>
              <StyledSelect
                value={cargo}
                onChange={(value) => setCargo(value as string)}
                suffixIcon={<ExpandMoreIcon style={{ fontSize: "1.5rem", color: "#032B68" }} />}
              >
                {cargoOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </StyledSelect>
            </CustomFormItem>
          </Col>
          <Col xs={24} md={12}>
            <CustomFormItem label="DRE" labelCol={{ span: 24 }}>
              <StyledSelect
                value={dre}
                onChange={(value) => setDre(value as string)}
                suffixIcon={<ExpandMoreIcon style={{ fontSize: "1.5rem", color: "#032B68" }} />}
              >
                {dreOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </StyledSelect>
            </CustomFormItem>
          </Col>
        </Row>

        <FilterActions style={{ marginTop: 0 }}>
          <Button type="primary" ghost size="large" onClick={handleLimparFiltros}>
            Limpar filtros
          </Button>
          <Button type="primary" size="large" onClick={handleFiltrar}>
            Filtrar
          </Button>
        </FilterActions>
      </RelatoriosDetalhadosFilter>

      <RelatoriosDetalhadosTable
        columns={columns}
        dataSource={dadosPaginados}
        pagination={pagination}
        locale={{ emptyText: "Nenhum dado encontrado" }}
      />
    </TableCard>
  );
};

export default RelatoriosDetalhados;
