import { Typography, Select, DatePicker, Row, Col, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import BaseScreen, { type TitleItem } from "../BaseScreen";
import { Controller } from "react-hook-form";
import { CustomFormItem, SeparatorCol } from "./styles";
import { Content } from "antd/es/layout/layout";
import ConvocacaoTable from "./components/ConvocacaoTable";
import { useProcessosConvocacao } from "./hooks/useProcessosConvocacao";
import TextField from "@mui/material/TextField";
import ProcessosConvocacaoView from "./ProcessosConvocacaoView";

const { Text } = Typography;

const breadcrumbItems = [
  {
    title: (
      <a href="/">
        <Text strong>Home</Text>
      </a>
    ),
  },
  {
    title: (
      <a href="/processos">
        <Text strong>Processos</Text>
      </a>
    ),
  },
  { title: "Consulta de candidatos" },
] as TitleItem[];

const ProcessosConvocacao: React.FC = () => {
  const {
    onAntTableChange,
    handleSub,
    handleReset,
    form,
    concursosQuery,
    processosQuery
   } = useProcessosConvocacao();

  return (
    <ProcessosConvocacaoView
      form={form}
      concursosOptions={concursosQuery.data}
      processosData={processosQuery.data}
      processosLoading={processosQuery.isLoading}
      paginationPage={1}
      onSubmit={handleSub}
      onReset={handleReset}
      onAntTableChange={onAntTableChange}
    />
  );
 
};

export default ProcessosConvocacao;
