 

import { Controller } from "react-hook-form";
import { Typography, Select, Button, Row, Col, Space } from "antd";
import { TextField } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { CustomFormItem, SeparatorCol } from "./styles";
import ConvocacaoTable from "./components/ConvocacaoTable";
import dayjs from "dayjs";
import type { IFiltroProcessos } from "../../services/resources/convocacao/IConvocacao";
import type { UseFormReturn } from "react-hook-form";
import type { IBackendWithSubOptions } from "../../types/IListRequest";
import { Form } from "react-router-dom";
interface Props {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onReset: () => void;
}

export default function ProcessosConvocacaoView({ form, onSubmit, onReset }: Props) {
  const { control, handleSubmit } = form;

  return (
    <form>
      <Row gutter={8}>
       
              <Col xs={24}>
                 <Controller
                   control={control}
                   name="concurso"
                   data-testid="concurso"
                   render={({ field }) => (
                     <CustomFormItem
                       label="Concurso"
 
                       labelCol={{ span: 24 }}
                     >
                       <Select {...field} options={[]} />
                     </CustomFormItem>
                   )}
                 />
               </Col>
       
               <Col xs={24} sm={11}>
                 <Controller
                   control={control}
                   name="data_inicial"
                   data-testid="data_inicial"
                   render={({ field }) => (
                     <CustomFormItem
                       label="Data de Convocação"
 
                       labelCol={{ span: 24 }}
                     >
                       <TextField
                         {...field}
                         type="date"
                         fullWidth
                         onChange={(e) => field.onChange(e.target.value)}
                        />
                     </CustomFormItem>
                   )}
                 />
               </Col>
 
       
               <Col xs={24} sm={11}>
                 <Controller
                   control={control}
                   name="data_final"
                   data-testid="data_final"
                   render={({ field }) => (
                     <CustomFormItem
                       label=" "
 
                       labelCol={{ span: 24 }}
                     >
                       <TextField
                         {...field}
                         type="date"
                         fullWidth
                         InputProps={{
                           endAdornment: <CalendarMonthRoundedIcon sx={{ color: "#032B68" }} />,
                         }}
                         onChange={(e) => field.onChange(e.target.value)}
                        />
                     </CustomFormItem>
                   )}
                 />
               </Col>
       
               <Col xs={24}>
                 <Controller
                   control={control}
                   name="cargo"
                   data-testid="cargo"
                   render={({ field }) => (
                     <CustomFormItem
                       label="Cargo"
 
                       labelCol={{ span: 24 }}
                     >
                       <Select {...field} options={[]} />
                     </CustomFormItem>
                   )}
                 />
               </Col>
        <Space>
          <Button onClick={onReset}>Limpar filtros</Button>
          <Button type="primary" onClick={handleSubmit(onSubmit)} data-testid="submit">
            Pesquisar
          </Button>
        </Space>
      </Row>
    </form>
  );
}
