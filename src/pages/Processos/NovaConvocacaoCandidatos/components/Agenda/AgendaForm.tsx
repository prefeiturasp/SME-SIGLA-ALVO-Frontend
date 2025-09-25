import React from "react";
import { Space, Typography, Select, Row, Col, Button, DatePicker, TimePicker, Checkbox, Radio, Flex, InputNumber } from "antd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { PlusOutlined } from "@ant-design/icons";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { type Option } from "../../hooks/useAgenda";

const { RangePicker } = DatePicker;

const { Text } = Typography;

interface AgendaFormProps {
  control: Control<any>;
  formErrors: FieldErrors<any>;
  cargosDisponiveis: Option[];
  isRetardatario: boolean;
  setIsRetardatario: (value: boolean) => void;
  getErrorMessage: (error: any) => string;
  isAgendaComplete: () => boolean;
  handleAdicionarPeriodo: () => void;
  tipoEscolha: string;
}

const AgendaForm: React.FC<AgendaFormProps> = ({
  control,
  formErrors,
  cargosDisponiveis,
  isRetardatario,
  setIsRetardatario,
  getErrorMessage,
  isAgendaComplete,
  handleAdicionarPeriodo,
  tipoEscolha,
}) => {
  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text strong>Modalidade da Escolha</Text>
          <Controller
            name="tipoEscolha"
            control={control}
            render={({ field }) => (
              <Flex vertical gap="middle" style={{ marginTop: 8 }}>
                <Radio.Group 
                  {...field} 
                  options={[
                    { label: 'Presencial', value: 'Presencial' },
                    { label: 'Online', value: 'Online' }
                  ]}
                  style={{ width: "36.875rem" }}
                />
              </Flex>
            )}
          />
          {formErrors.tipoEscolha && (
            <Text style={{ color: "#ff4d4f", fontSize: "12px", marginTop: 4 }}>
              {getErrorMessage(formErrors.tipoEscolha)}
            </Text>
          )}
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text strong>Cargo</Text>
          <Controller
            name="cargoAgenda"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Selecione o cargo"
                style={{ width: "36.875rem", height: "2.5rem", marginTop: 4 }}
                options={cargosDisponiveis}
                allowClear={false}
                showSearch={false}
                suffixIcon={
                  <KeyboardArrowDownRoundedIcon sx={{ color: "#032B68" }} />
                }
                status={formErrors.cargoAgenda ? 'error' : undefined}
              />
            )}
          />
          {formErrors.cargoAgenda && (
            <Text style={{ color: "#ff4d4f", fontSize: "12px", marginTop: 4 }}>
              {getErrorMessage(formErrors.cargoAgenda)}
            </Text>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text strong>Escolha em</Text>
          <Controller
            name="escolhaEm"
            control={control}
            render={({ field }) => (
              tipoEscolha === "Online" ? (
                <RangePicker
                  {...field}
                  value={field.value}
                  onChange={(dates) => field.onChange(dates)}
                  placeholder={["Data início", "Data fim"]}
                  style={{ width: "36.875rem", height: "2.5rem", marginTop: 4 }}
                  suffixIcon={<CalendarMonthIcon style={{ color: "#05409A" }} />}
                  format="DD/MM/YYYY"
                  status={formErrors.escolhaEm ? 'error' : undefined}
                />
              ) : (
                <DatePicker
                  {...field}
                  placeholder="Insira a data"
                  style={{ width: "36.875rem", height: "2.5rem", marginTop: 4 }}
                  suffixIcon={<CalendarMonthIcon style={{ color: "#05409A" }} />}
                  format="DD/MM/YYYY"
                  status={formErrors.escolhaEm ? 'error' : undefined}
                />
              )
            )}
          />
          {formErrors.escolhaEm && (
            <Text style={{ color: "#ff4d4f", fontSize: "12px", marginTop: 4 }}>
              {getErrorMessage(formErrors.escolhaEm)}
            </Text>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text strong>Nomeação em</Text>
          <Controller
            name="nomeacaoEm"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                placeholder="Insira a data"
                style={{ width: "36.875rem", height: "2.5rem", marginTop: 4 }}
                suffixIcon={<CalendarMonthIcon style={{ color: "#05409A" }} />}
                format="DD/MM/YYYY"
                status={formErrors.nomeacaoEm ? 'error' : undefined}
              />
            )}
          />
          {formErrors.nomeacaoEm && (
            <Text style={{ color: "#ff4d4f", fontSize: "12px", marginTop: 4 }}>
              {getErrorMessage(formErrors.nomeacaoEm)}
            </Text>
          )}
        </div>
      </Space>

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text strong>Classificação</Text>
          <Controller
            name="quantidadeClassificados"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                placeholder="Quantidade de classificados"
                style={{ width: "16rem", height: "2.5rem", marginTop: 4 }}
                min={1}
                status={formErrors.quantidadeClassificados ? 'error' : undefined}
              />
            )}
          />
          {formErrors.quantidadeClassificados && (
            <Text style={{ color: "#ff4d4f", fontSize: "12px", marginTop: 4 }}>
              {getErrorMessage(formErrors.quantidadeClassificados)}
            </Text>
          )}
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: 16 }}>
          <Text strong>Sessão</Text>
          <Controller
            name="sessao"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                placeholder="Quantidade de sessões"
                style={{ width: "16rem", height: "2.5rem", marginTop: 4 }}
                min={1}
                status={formErrors.sessao ? 'error' : undefined}
              />
            )}
          />
          {formErrors.sessao && (
            <Text style={{ color: "#ff4d4f", fontSize: "12px", marginTop: 4 }}>
              {getErrorMessage(formErrors.sessao)}
            </Text>
          )}
        </div>
      </div>

      {tipoEscolha === "Presencial" && (
        <div style={{ marginTop: 16 }}>
          <Text strong>Hora da convocação</Text>
          <Row gutter={[8, 8]} style={{ marginTop: 4 }}>
            <Col>
              <Controller
                name="horaInicio"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    placeholder="Início"
                    style={{ width: "17.3125rem", height: "2.5rem" }}
                    suffixIcon={<AccessTimeIcon style={{ color: "#05409A" }} />}
                    format="HH:mm"
                    status={formErrors.horaInicio ? 'error' : undefined}
                  />
                )}
              />
            </Col>
            <Col style={{ display: "flex", alignItems: "center", paddingBottom: 0 }}>
              <Text strong>às</Text>
            </Col>
            <Col>
              <Controller
                name="horaFim"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    placeholder="Fim"
                    style={{ width: "17.3125rem", height: "2.5rem" }}
                    suffixIcon={<AccessTimeIcon style={{ color: "#05409A" }} />}
                    format="HH:mm"
                    status={formErrors.horaFim ? 'error' : undefined}
                  />
                )}
              />
            </Col>
            <Col style={{ display: "flex", alignItems: "center", paddingBottom: 0 }}>
              <Checkbox
                checked={isRetardatario}
                onChange={(e) => setIsRetardatario(e.target.checked)}
              >
                Retardatário
              </Checkbox>
            </Col>
          </Row>
          {/* Mensagens de erro para horários */}
          <Row style={{ marginTop: 8 }}>
            {formErrors.horaInicio && (
              <Col span={12}>
                <Text style={{ color: "#ff4d4f", fontSize: "12px" }}>
                  {getErrorMessage(formErrors.horaInicio)}
                </Text>
              </Col>
            )}
            {formErrors.horaFim && (
              <Col span={12}>
                <Text style={{ color: "#ff4d4f", fontSize: "12px" }}>
                  {getErrorMessage(formErrors.horaFim)}
                </Text>
              </Col>
            )}
          </Row>
        </div>
      )}

      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        size="large" 
        style={{ marginTop: 16 }}
        disabled={!isAgendaComplete()}
        onClick={handleAdicionarPeriodo}
      >
        Adicionar Agenda
      </Button>
    </>
  );
};

export default AgendaForm;
