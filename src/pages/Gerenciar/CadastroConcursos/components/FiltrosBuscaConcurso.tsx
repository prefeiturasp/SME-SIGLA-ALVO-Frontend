import { useMemo } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import type { IConcursoFiltros } from "../../../../services/resources/concursos/IConcursos";
import { useListarConcursos } from "../hooks/useListarConcursos";
import {
  AppFormItem,
  FilterInput,
  ClearButton,
  FieldLabel,
  FilterActionCol,
  FilterActionSlot,
  FilterActionsGroup,
  FilterFieldCol,
  FilterInlineRow,
  FilterSelect,
  SearchButton,
  SearchFieldsContainer,
} from "@/components/ui";

interface IFiltrosProps {
  onBuscar: (filtros: IConcursoFiltros) => void;
  onLimpar: () => void;
  concursos: ReturnType<typeof useListarConcursos>["concursos"];
}

interface IFiltrosFields {
  codigo_cargo?: number;
  nome?: string;
  descricao_cargo?: string;
  numero_processo?: string;
  ano_edital?: number;
  banca_responsavel?: string;
  status?: string;
}

const removerVazios = (valores: IFiltrosFields): IConcursoFiltros => {
  return Object.fromEntries(
    Object.entries(valores).filter(([, valor]) => {
      if (valor === undefined || valor === null) return false;
      if (typeof valor === "string") return valor.trim() !== "";
      return true;
    })
  ) as IConcursoFiltros;
};

const FiltrosBuscaConcurso: React.FC<IFiltrosProps> = ({
  onBuscar,
  onLimpar,
  concursos,
}) => {
  const { control, handleSubmit, reset } = useForm<IFiltrosFields>();

  const opcoesBanca = useMemo(() => {
    const bancas = Array.from(
      new Set(
        concursos
          .map((c) => c.banca_responsavel)
          .filter((banca): banca is string => Boolean(banca && banca.trim()))
      )
    ).sort((a, b) => a.localeCompare(b));
    return bancas.map((banca) => ({ value: banca, label: banca }));
  }, [concursos]);

  const opcoesAno = useMemo(() => {
    const anos = Array.from(
      new Set(
        concursos
          .map((c) => c.ano_edital)
          .filter((ano): ano is number => ano !== null && ano !== undefined)
      )
    ).sort((a, b) => b - a);
    return anos.map((ano) => ({ value: ano, label: String(ano) }));
  }, [concursos]);

  const opcoesCodigoCargo = useMemo(() => {
    const cargosPorCodigo = new Map<number, string>();
    concursos.forEach((c) =>
      c.cargos?.forEach((cargo) => {
        if (cargo.codigo !== null && cargo.codigo !== undefined) {
          cargosPorCodigo.set(cargo.codigo, cargo.nome);
        }
      })
    );
    return Array.from(cargosPorCodigo.entries())
      .sort(([a], [b]) => a - b)
      .map(([codigo, nome]) => ({
        value: codigo,
        label: nome ? `${codigo} - ${nome}` : String(codigo),
      }));
  }, [concursos]);

  const limpar = () => {
    reset({});
    onLimpar();
  };

  const buscar = handleSubmit((valores) => {
    onBuscar(removerVazios(valores));
  });

  return (
    <SearchFieldsContainer>
      <FilterInlineRow gutter={[16, 0]}>
        <FilterFieldCol xs={24} md={6}>
          <Controller
            control={control}
            name="codigo_cargo"
            render={({ field }) => (
              <AppFormItem
                label={<FieldLabel>Código do cargo</FieldLabel>}
                labelCol={{ span: 24 }}
              >
                <FilterSelect
                  {...field}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Selecione o código do cargo..."
                  options={opcoesCodigoCargo}
                />
              </AppFormItem>
            )}
          />
        </FilterFieldCol>
        <FilterFieldCol xs={24} md={6}>
          <Controller
            control={control}
            name="nome"
            render={({ field }) => (
              <AppFormItem
                label={<FieldLabel>Nome do concurso</FieldLabel>}
                labelCol={{ span: 24 }}
              >
                <FilterInput {...field} placeholder="Digite o nome do concurso..." />
              </AppFormItem>
            )}
          />
        </FilterFieldCol>
        <FilterFieldCol xs={24} md={6}>
          <Controller
            control={control}
            name="descricao_cargo"
            render={({ field }) => (
              <AppFormItem
                label={<FieldLabel>Descrição do cargo</FieldLabel>}
                labelCol={{ span: 24 }}
              >
                <FilterInput {...field} placeholder="Digite a descrição do cargo..." />
              </AppFormItem>
            )}
          />
        </FilterFieldCol>
        <FilterFieldCol xs={24} md={6}>
          <Controller
            control={control}
            name="numero_processo"
            render={({ field }) => (
              <AppFormItem
                label={<FieldLabel>Número do processo</FieldLabel>}
                labelCol={{ span: 24 }}
              >
                <FilterInput {...field} placeholder="Digite o número do processo..." />
              </AppFormItem>
            )}
          />
        </FilterFieldCol>
      </FilterInlineRow>

      <FilterInlineRow gutter={[16, 8]}>
        <FilterFieldCol xs={24} md={6}>
          <Controller
            control={control}
            name="ano_edital"
            render={({ field }) => (
              <AppFormItem
                label={<FieldLabel>Ano do edital</FieldLabel>}
                labelCol={{ span: 24 }}
              >
                <FilterSelect
                  {...field}
                  allowClear
                  placeholder="Selecione"
                  options={opcoesAno}
                />
              </AppFormItem>
            )}
          />
        </FilterFieldCol>
        <FilterFieldCol xs={24} md={6}>
          <Controller
            control={control}
            name="banca_responsavel"
            render={({ field }) => (
              <AppFormItem
                label={<FieldLabel>Banca responsável</FieldLabel>}
                labelCol={{ span: 24 }}
              >
                <FilterSelect
                  {...field}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Selecione"
                  options={opcoesBanca}
                />
              </AppFormItem>
            )}
          />
        </FilterFieldCol>
        <FilterFieldCol xs={24} md={6}>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <AppFormItem
                label={<FieldLabel>Status</FieldLabel>}
                labelCol={{ span: 24 }}
              >
                <FilterSelect
                  {...field}
                  allowClear
                  placeholder="Selecione"
                  options={[
                    { value: "ATIVO", label: "Ativo" },
                    { value: "INATIVO", label: "Inativo" },
                  ]}
                />
              </AppFormItem>
            )}
          />
        </FilterFieldCol>
        <FilterActionCol xs={24} md={6}>
          <FilterActionSlot>
            <FilterActionsGroup>
              <ClearButton size="large" onClick={limpar}>
                Limpar filtros
              </ClearButton>
              <SearchButton
                size="large"
                icon={<SearchOutlined />}
                onClick={buscar}
              >
                Buscar
              </SearchButton>
            </FilterActionsGroup>
          </FilterActionSlot>
        </FilterActionCol>
      </FilterInlineRow>
    </SearchFieldsContainer>
  );
};

export default FiltrosBuscaConcurso;
