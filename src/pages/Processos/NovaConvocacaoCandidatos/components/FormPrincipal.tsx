import React from "react";
import { Row, Col, Select, Input, DatePicker, Typography } from "antd";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import { CustomFormItem } from "../styles";

const { Text } = Typography;

export type ConcursoOption = { value: string; label: string; cargos?: { value: string; label: string }[] };
export type FormFields = {
	concurso: string;
	tipo_processo: string;
	descricao: string;
	cargo: string;
	data_convocacao: string;
	data_corte_vagas: string;
};

interface FormPrincipalProps {
	control: Control<FormFields>;
	concursosData: ConcursoOption[];
	concursosIsLoading: boolean;
	isCargoLiberado: string | undefined;
	buscarCargosDoConcurso: (value: string) => void;
}

const FormPrincipal: React.FC<FormPrincipalProps> = ({
	control,
	concursosData,
	concursosIsLoading,
	isCargoLiberado,
	buscarCargosDoConcurso,
}) => {
	return (
		<Row gutter={16}>
			<Col xs={24} md={12}>
				<Controller
					control={control}
					name="concurso"
					render={({ field }) => (
						<CustomFormItem label={<strong>Concurso 2</strong>}>
							<div style={{ width: "100%" }}>
								<Select
									{...field}
									data-testid="concurso-select2"
									placeholder="Selecione o concurso 2"
									style={{ width: "65%" }}
									options={concursosData || []}
									loading={concursosIsLoading}
									onChange={(value) => {
										field.onChange(value as string);
										buscarCargosDoConcurso(value as string);
									}}
								/>
							</div>
							{!isCargoLiberado && (
								<Text
									type="secondary"
									style={{
										fontSize: 12,
										color: "gray",
										marginTop: 2,
										display: "block",
									}}
								>
									* Selecione o concurso para liberar a opção de Cargo.
								</Text>
							)}
						</CustomFormItem>
					)}
				/>
				<Controller
					control={control}
					name="tipo_processo"
					render={({ field }) => (
						<CustomFormItem label={<strong>Tipo de Escolha</strong>}>
							<Select
								{...field}
								placeholder="Selecione o tipo de escolha"
								style={{ width: "65%" }}
								options={[
									{ value: "Nova Autorização", label: "Nova Autorização" },
									{ value: "Reposição", label: "Reposição" },
									{ value: "Reconvocação", label: "Reconvocação" },
								]}
							/>
						</CustomFormItem>
					)}
				/>
				<Controller
					control={control}
					name="descricao"
					render={({ field }) => (
						<CustomFormItem label={<strong>Descrição</strong>}>
							<Input
								{...field}
								placeholder="Digite a descrição"
								style={{ width: "65%" }}
							/>
						</CustomFormItem>
					)}
				/>
				<Controller
					control={control}
					name="data_convocacao"
					render={({ field }) => (
						<CustomFormItem label={<strong>Data da convocação</strong>}>
							<DatePicker
								{...field}
								placeholder="Selecione a data da convocação"
								style={{ width: "65%" }}
								format="DD/MM/YYYY"
								suffixIcon={<CalendarMonthIcon style={{ color: "#05409A" }} />}
								value={field.value ? dayjs(field.value) : undefined}
								onChange={(date) => field.onChange(date ? date.toISOString() : "")}
							/>
						</CustomFormItem>
					)}
				/>
				<Controller
					control={control}
					name="data_corte_vagas"
					render={({ field }) => (
						<CustomFormItem label={<strong>Data corte de Vagas</strong>}>
							<DatePicker
								{...field}
								placeholder="Selecione a data corte de vagas"
								style={{ width: "65%" }}
								format="DD/MM/YYYY"
								suffixIcon={<CalendarMonthIcon style={{ color: "#05409A" }} />}
								value={field.value ? dayjs(field.value) : undefined}
								onChange={(date) => field.onChange(date ? date.toISOString() : "")}
							/>
						</CustomFormItem>
					)}
				/>
			</Col>
		</Row>
	);
};

export default FormPrincipal; 