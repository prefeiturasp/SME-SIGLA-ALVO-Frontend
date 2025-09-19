import React from "react";
import { Space, Typography, Select, Row, Col, Button, DatePicker, TimePicker, Checkbox } from "antd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { PlusOutlined } from "@ant-design/icons";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { type Option } from "../../hooks/useAgenda";

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
}) => {
  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text strong>Tipo de Escolha</Text>
          <Controller
            name="tipoEscolha"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Selecione o tipo da escolha"
                style={{ width: "36.875rem", height: "2.5rem", marginTop: 4 }}
                options={[
                  { value: "Presencial", label: "Presencial" },
                  { value: "Online", label: "Online" }
                ]}
                suffixIcon={
                  <KeyboardArrowDownRoundedIcon sx={{ color: "#032B68" }} />
                }
                status={formErrors.tipoEscolha ? 'error' : undefined}
              />
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
              <DatePicker
                {...field}
                placeholder="Insira a data"
                style={{ width: "36.875rem", height: "2.5rem", marginTop: 4 }}
                suffixIcon={<CalendarMonthIcon style={{ color: "#05409A" }} />}
                format="DD/MM/YYYY"
                status={formErrors.escolhaEm ? 'error' : undefined}
              />
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
        <Text strong>Classificação</Text>
        <Row gutter={[8, 8]} style={{ marginTop: 4 }}>
          <Col>
            <Controller
              name="classificacaoInicio"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  placeholder="Início"
                  style={{ width: "17.3125rem", height: "2.5rem" }}
                  suffixIcon={<CalendarMonthIcon style={{ color: "#05409A" }} />}
                  format="DD/MM/YYYY"
                  status={formErrors.classificacaoInicio ? 'error' : undefined}
                />
              )}
            />
          </Col>
          <Col style={{ display: "flex", alignItems: "center", paddingBottom: 0 }}>
            <Text strong>até</Text>
          </Col>
          <Col>
            <Controller
              name="classificacaoFim"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  placeholder="Fim"
                  style={{ width: "17.3125rem", height: "2.5rem" }}
                  suffixIcon={<CalendarMonthIcon style={{ color: "#05409A" }} />}
                  format="DD/MM/YYYY"
                  status={formErrors.classificacaoFim ? 'error' : undefined}
                />
              )}
            />
          </Col>
          <Col style={{ display: "flex", alignItems: "center", paddingBottom: 0 }}>
            <Space direction="horizontal" size="small">
              <Checkbox>
                LEI 13.308/02
              </Checkbox>
              <Checkbox>
                LEI 16.989/13
              </Checkbox>
            </Space>
          </Col>
        </Row>
        {/* Mensagens de erro para classificação */}
        <Row style={{ marginTop: 8 }}>
          {formErrors.classificacaoInicio && (
            <Col span={12}>
              <Text style={{ color: "#ff4d4f", fontSize: "12px" }}>
                {getErrorMessage(formErrors.classificacaoInicio)}
              </Text>
            </Col>
          )}
          {formErrors.classificacaoFim && (
            <Col span={12}>
              <Text style={{ color: "#ff4d4f", fontSize: "12px" }}>
                {getErrorMessage(formErrors.classificacaoFim)}
              </Text>
            </Col>
          )}
        </Row>
      </div>

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

      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        size="large" 
        style={{ marginTop: 16 }}
        disabled={!isAgendaComplete()}
        onClick={handleAdicionarPeriodo}
      >
        Adicionar Período
      </Button>
    </>
  );
};

export default AgendaForm;
