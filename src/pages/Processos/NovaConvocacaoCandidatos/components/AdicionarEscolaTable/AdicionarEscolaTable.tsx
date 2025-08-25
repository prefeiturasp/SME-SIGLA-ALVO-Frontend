import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import CheckIcon from "@mui/icons-material/Check";
import React, { useState } from "react";
import type { TableProps } from "antd";
import {
  Button,
  Flex,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useTheme } from "styled-components";
import type { IUnidadeEscolar } from "../../../../../services/resources/convocacao/IConvocacao";
import { StyledTable } from "../../../../../components/estilosCompartilhados/styles";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  dataIndex: keyof IUnidadeEscolar;
  title: any;
  record: IUnidadeEscolar;
  control: any;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  dataIndex,
  title,
  record,
  control,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      <Controller
        name={`${record.uuid}.${dataIndex}`}
        control={control}
        rules={{ required: `${title} é obrigatório` }}
        render={({ field }) => (
          <InputNumber {...field} min={0} style={{ width: "100%" }} />
        )}
      />
    </td>
  );
};

interface AdicionarEscolaTableProps extends TableProps<IUnidadeEscolar> {}

const AdicionarEscolaTable: React.FC<AdicionarEscolaTableProps> = ({
  ...rest
}) => {
  const { control, getValues } = useForm({});
  const [data, setData] = useState<IUnidadeEscolar[]>([
    {
      uuid: "1",
      eol: "string",
      dre: "string",
      tipo: "string",
      unidade: "string",
      vagas_definitivas: 1,
      vagas_precarias: 1,
    },
    {
      uuid: "2",
      eol: "string",
      dre: "string",
      tipo: "string",
      unidade: "string",
      vagas_definitivas: 1,
      vagas_precarias: 1,
    },
  ]);
  const theme = useTheme();

  const adicionarEscola = () => {
    const values = getValues();
    console.log("Chamou adicionarEscola:", values);

    // Exemplo: adiciona um novo item com valores default
    const novaEscola: IUnidadeEscolar = {
      uuid: String(Date.now()),
      eol: "novo eol",
      dre: "nova dre",
      tipo: "nova tipo",
      unidade: "nova unidade",
      vagas_definitivas: 0,
      vagas_precarias: 0,
    };
    setData((prev) => [...prev, novaEscola]);
  };

  const columns: TableColumnsType<IUnidadeEscolar> = [
    { title: "DRE", dataIndex: "dre" },
    { title: "Tipo de unidade", dataIndex: "tipo" },
    { title: "Unidade Escolar", dataIndex: "unidade" },
    {
      title: "Vagas definitivas",
      dataIndex: "vagas_definitivas",
      editable: true,
    },
    {
      title: "Vagas precárias",
      dataIndex: "vagas_precarias",
      editable: true,
    },
  ];

 

  return (
    <Flex gap="middle" vertical>
      <Button
        type="primary"
        icon={<CheckIcon style={{ color: "white" }} />}
        onClick={adicionarEscola}
        style={{ width: "fit-content" }}
      >
        Adicionar Escola
      </Button>

      <StyledTable<IUnidadeEscolar>
        {...rest}
        rowKey="uuid"
        style={{ margin: "1.5rem 0" }}
        // components={{
        //   body: { cell: EditableCell },
        // }}
        bordered
        dataSource={data}
        columns={columns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Flex>
  );
};

export default AdicionarEscolaTable;
