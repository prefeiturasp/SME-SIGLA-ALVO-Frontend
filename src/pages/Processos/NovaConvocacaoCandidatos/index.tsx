import React, { useState } from "react";
import {
	Select,
	Row,
	Col,
	Space,
	Typography,
	Divider,
	DatePicker,
	Input,
	Card,
} from "antd";

import {
	PlusOutlined,
} from "@ant-design/icons";

import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ApprovalIcon from '@mui/icons-material/Approval';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CampaignIcon from '@mui/icons-material/Campaign';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import {
	StyledCardPequeno,
	StyledCardGrande,
	CardIconContainer,
	CardContentContainer,
	ActionButton,
	PrimaryButton,
	AddButton,
	CustomFormItem,
} from "./styles";

import BaseScreen, { type TitleItem } from "../../BaseScreen";
import { Controller, useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import { useConcursos } from "./hooks/useConcursos";
import SelecionarCandidatos from "./components/SelecionarCandidatos";



const { Title, Text } = Typography;

const breadcrumbItems = [
	{ title: <Link to="/">Home</Link> },
	{ title: <Link to="/processos">Processos</Link> },
	{ title: <Link to="/processos/convocacao">Convocação de candidatos</Link> },
	{ title: "Nova Convocação" },
] as TitleItem[];

type ConcursoOption = { value: string; label: string; cargos?: { value: string; label: string }[] };

type FormFields = {
	concurso: string;
	tipo_processo: string;
	descricao: string;
	cargo: string;
	data_convocacao: string;
	data_corte_vagas: string;
};

export const NovaConvocacaoCandidatos: React.FC = () => {
	const { concursosData, concursosIsLoading } = useConcursos();
	const [cargoSelecionado, setCargoSelecionado] = useState<string | undefined>();
	const [cargosDisponiveis, setCargosDisponiveis] = useState<{ value: string; label: string }[]>([]);
	const [cardData, setCardData] = useState({
		vagas: 0,
		autorizacoes: 0,
		reservas: 0,
		convocar: 0,
	});
	const [popupSelecionarCandidatos, setPopupSelecionarCandidatos] = useState(false);
	const [candidatosSelecionados, setCandidatosSelecionados] = useState(0);

	const {
		control,
		reset,
	} = useForm<FormFields>({
		defaultValues: {
			concurso: undefined,
			tipo_processo: undefined,
			descricao: undefined,
			cargo: "",
			data_convocacao: "",
			data_corte_vagas: "",
		},
	});

	const watchFields = useWatch({ control });

	const isCargoLiberado = watchFields.concurso;

	const buscarCargosDoConcurso = (concursoValue: string) => {
		if (!concursoValue) {
			setCargosDisponiveis([]);
			return;
		}

		const concursoSelecionado = concursosData.find(
			(c) => c.value === concursoValue
		);

		if (concursoSelecionado && concursoSelecionado.cargos) {
			setCargosDisponiveis(concursoSelecionado.cargos);
		}

		setCargoSelecionado(undefined);

		setCardData({
			vagas: 0,
			autorizacoes: 0,
			reservas: 0,
			convocar: 0,
		});
	};

	const handleSub = (data: FormFields) => {
		console.log("Enviando dados para o backend:", {
			...data,
			page: 1,
			page_size: 10,
		});
	};

	const handleReset = () => {
		reset({
			concurso: "",
			tipo_processo: "",
			descricao: "",
			cargo: "",
			data_convocacao: "",
			data_corte_vagas: "",
		});
		setCargoSelecionado(undefined);
		setCargosDisponiveis([]);
	};

	const handleAbrirPopupSelecionarCandidatos = () => {
		setPopupSelecionarCandidatos(true);
	};

	const handleCandidatosSelecionados = (quantidade: number) => {
		setCandidatosSelecionados(quantidade);
	};

	const buscarDadosDoCargo = () => {
		if (!cargoSelecionado) return;

		setTimeout(() => {
				setCardData({
					vagas: 385,
					autorizacoes: 0,
					reservas: 407,
					convocar: 0,
				});
		}, 1000);
	};

	return (
		<BaseScreen
			breadcrumbItems={breadcrumbItems}
			title="Processo de convocação de candidatos"
		>
			<Card style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: 24 }}>
				<Typography.Title level={4}>Busca Processos</Typography.Title>

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
											options={(concursosData as unknown as ConcursoOption[]) || []}
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
											style={{ fontSize:12, color: 'gray', marginTop: 2, display: 'block' }}
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
											{ value: "Reconvocação", label: "Reconvocação" }
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
			</Card>

			<Card style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
				<Space direction="vertical" size="small" style={{ width: "100%" }}>
					<Title level={3}>Cargos</Title>
					<Text strong>Cargo</Text>

					<Select
						placeholder="Selecione o cargo"
						style={{ width: "32%" }}
						value={cargoSelecionado}
						onChange={setCargoSelecionado}
						disabled={!isCargoLiberado}
						options={cargosDisponiveis}
					/>

					<PrimaryButton
						type="primary"
						size="large"
						onClick={buscarDadosDoCargo}
						disabled={!cargoSelecionado}
					>
						Buscar
					</PrimaryButton>

					<Row gutter={16} justify="start">
						<Col>
							<div style={{ marginBottom: 20 }}>
								<Text strong style={{ fontSize: 16 }}>Número de Vagas</Text>
							</div>
							<StyledCardPequeno styles={{ body: { padding: 0 } }}>
								<div style={{ display: "flex", height: 64 }}>
									<CardIconContainer>{<CampaignIcon />}</CardIconContainer>
									<CardContentContainer>
										<div style={{ fontSize: 14, fontWeight: "bold" }}>Vagas</div>
										<div style={{ fontSize: 18, fontWeight: "bold", color: "#05409A" }}>{cardData.vagas}</div>
									</CardContentContainer>
								</div>
							</StyledCardPequeno>
						</Col>
						
						<Col>
							<div style={{ marginBottom: 8 }}>
								<Text strong style={{ fontSize: 16 }}>Candidatos a convocar</Text>
							</div>
							<Row gutter={16} justify="start">
								<Col>
									<div style={{ display: "flex", gap: 8 }}>
										<StyledCardPequeno styles={{ body: { padding: 0 } }}>
											<div style={{ display: "flex", height: 64 }}>
												<CardIconContainer>{<GroupAddIcon />}</CardIconContainer>
												<CardContentContainer>
													<div style={{ fontSize: 14, fontWeight: "bold" }}>Ampla</div>
													<div style={{ fontSize: 18, fontWeight: "bold", color: "#05409A" }}>{cardData.autorizacoes}</div>
												</CardContentContainer>
											</div>
										</StyledCardPequeno>
										<StyledCardPequeno styles={{ body: { padding: 0 } }}>
											<div style={{ display: "flex", height: 64 }}>
												<CardIconContainer>{<ApprovalIcon />}</CardIconContainer>
												<CardContentContainer>
													<div style={{ fontSize: 14, fontWeight: "bold" }}>NNA</div>
													<div style={{ fontSize: 18, fontWeight: "bold", color: "#05409A" }}>{cardData.reservas}</div>
												</CardContentContainer>
											</div>
										</StyledCardPequeno>
										<StyledCardPequeno styles={{ body: { padding: 0 } }}>
											<div style={{ display: "flex", height: 64 }}>
												<CardIconContainer>{<ApprovalIcon />}</CardIconContainer>
												<CardContentContainer>
													<div style={{ fontSize: 14, fontWeight: "bold" }}>PcD</div>
													<div style={{ fontSize: 18, fontWeight: "bold", color: "#05409A" }}>{cardData.convocar}</div>
												</CardContentContainer>
											</div>
										</StyledCardPequeno>
									</div>
								</Col>
							</Row>
					</Col>
				</Row>

				<Divider style={{ margin: "0px" }} />

				<Title level={3}>Configuração do cargo</Title>

				<Space wrap>
					<ActionButton
						icon={
							<VisibilityIcon
								style={{
									color: "#05409A",
								}}
							/>
						}
						style={{
							border: "1px solid #05409A",
							color: "#05409A",
							backgroundColor: "#fff",
						}}
					>
						Visualizar vagas
					</ActionButton>

					<ActionButton
						icon={
							<AdsClickIcon
								style={{
									color: "#05409A",
								}}
							/>
						}
						style={{
							border: "1px solid #05409A",
							color: "#05409A",
							backgroundColor: "#fff",
						}}
						onClick={handleAbrirPopupSelecionarCandidatos}
					>
						Selecionar candidatos
					</ActionButton>

					<ActionButton icon={<UploadFileIcon style={{ color: "gray" }} />} disabled>
						Exportação de convocados
					</ActionButton>

					<ActionButton icon={<UploadFileIcon style={{ color: "gray" }} />} disabled>
						Exportação de vagas
					</ActionButton>
				</Space>

				<Row gutter={16} justify="start">
					{[
						{ title: "Escolas selecionadas", value: 0, icon: <SchoolIcon /> },
						{ title: "Candidatos selecionados", value: candidatosSelecionados, icon: <GroupIcon />  },
					].map(({ title, value, icon }) => (
						<Col key={title}>
							<StyledCardGrande styles={{ body: { padding: 0 } }}>
								<div style={{ display: "flex", height: 64 }}>
									<CardIconContainer>{icon}</CardIconContainer>
									<CardContentContainer>
										<div style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", textAlign: "center" }}>{title}</div>
										<div style={{ fontSize: 18, fontWeight: "bold", color: "#05409A" }}>{value}</div>
									</CardContentContainer>
								</div>
							</StyledCardGrande>
						</Col>
					))}
				</Row>

				<AddButton type="primary" icon={<PlusOutlined />} size="large">
					Adicionar Cargo
				</AddButton>
			</Space>
			</Card>

			<SelecionarCandidatos
				visible={popupSelecionarCandidatos}
				onClose={() => setPopupSelecionarCandidatos(false)}
				concurso={watchFields.concurso}
				cargo={cargoSelecionado}
				vagas={cardData.vagas}
				autorizacoes={cardData.autorizacoes}
				onCandidatosSelecionados={handleCandidatosSelecionados}
			/>
		</BaseScreen>
	);
};

export default NovaConvocacaoCandidatos;