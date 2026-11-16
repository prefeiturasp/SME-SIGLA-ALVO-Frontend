import React from "react";
import {
  Card,
  Form,
  DatePicker,
  Radio,
  Checkbox,
  Select,
  InputNumber,
  Row,
  Col,
  Typography,
} from "antd";
import { CalendarOutlined, ClockCircleOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { AppButton, AppIconButton, AppFormItem } from '@/components/ui';
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { agendaFormStyles } from "@/design-system/estilos";
import dayjs from "dayjs";

const { Text } = Typography;

const HORA_INICIO_MIN = 10;
const HORA_FIM_MAX = 17;

const HORA_OPTIONS = Array.from(
  { length: HORA_FIM_MAX - HORA_INICIO_MIN },
  (_, i) => {
    const hora = HORA_INICIO_MIN + i;
    return {
      value: hora,
      label: String(hora).padStart(2, "0"),
    };
  }
);

interface AgendaFormProps {
  agendaAberto: any;
  handleFecharAgenda: () => void;
  control: Control<any>;
  formErrors: FieldErrors<any>;
  isRetardatario: boolean;
  setIsRetardatario: (value: boolean) => void;
  watchedFields: any;
  getErrorMessage: (error: any) => string;
  isBotaoAdicionarHabilitado: () => boolean;
  handleAdicionarPeriodo: () => void;
  candidatosDisponiveis?: number;
  candidatosFaltantesCount?: number;
  setValue: (name: string, value: any) => void;
  totalCandidatos?: number;
  trigger: (name?: string | string[]) => Promise<boolean>;
  hasAgendas: boolean;
}

const AgendaForm: React.FC<AgendaFormProps> = ({
  agendaAberto,
  handleFecharAgenda,
  control,
  formErrors,
  isRetardatario,
  setIsRetardatario,
  watchedFields,
  getErrorMessage,
  isBotaoAdicionarHabilitado,
  handleAdicionarPeriodo,
  candidatosDisponiveis,
  candidatosFaltantesCount,
  setValue,
  totalCandidatos,
  trigger,
  hasAgendas,
}) => {
  if (!agendaAberto) return null;

  return (
    <Card
      style={agendaFormStyles.agendaCard}
      title={
        <div style={agendaFormStyles.agendaCardHeader}>
          <div style={agendaFormStyles.agendaCardHeaderLeft}>
            <CalendarOutlined style={agendaFormStyles.agendaCardIcon} />
            <Text strong style={agendaFormStyles.agendaCardTitle}>Agenda</Text>
          </div>
          <AppIconButton
            type="text"
            tooltip="Fechar"
            icon={<CloseOutlined />}
            onClick={handleFecharAgenda}
            style={agendaFormStyles.agendaCardCloseButton}
          />
        </div>
      }
      styles={{
        header: { 
          borderBottom: '1px solid #F0F0F0',
          padding: '12px 16px'
        },
        body: { 
          padding: '16px' 
        }
      }}
    >
      <Form layout="vertical" style={agendaFormStyles.agendaForm}>
        {/* Linha com Cargo e Modalidade da Escolha */}
        <Row gutter={8} style={agendaFormStyles.formRowFirst}>
          <Col span={6}>
            <div>
              <Text strong style={agendaFormStyles.cargoInfoLabel}>
                Cargo:
              </Text>
              <Text style={agendaFormStyles.cargoInfoValue}>
                {agendaAberto?.cargo?.nome || "—"}
              </Text>
            </div>
          </Col>
          <Col span={6}>
            <AppFormItem label="Modalidade da Escolha" style={agendaFormStyles.formItemNoMargin}>
              <Controller
                name="tipoEscolha"
                control={control}
                render={({ field }) => (
                  <Radio.Group 
                    {...field} 
                    options={[
                      { label: 'Presencial', value: 'PRESENCIAL' },
                      { label: 'Online', value: 'ONLINE', disabled: hasAgendas }
                    ]}
                  />
                )}
              />
              {formErrors.tipoEscolha && (
                <Text style={agendaFormStyles.errorMessage}>
                  {getErrorMessage(formErrors.tipoEscolha)}
                </Text>
              )}
            </AppFormItem>
          </Col>
          <Col span={6}>
            {watchedFields.tipoEscolha === "PRESENCIAL" ? (
              <AppFormItem label="Retardatário?" style={agendaFormStyles.formItemNoMargin}>
                <Checkbox
                  checked={isRetardatario}
                  onChange={(e) => {
                    setIsRetardatario(e.target.checked);
                    if (e.target.checked) {
                      // Limpar valores dos campos quando marcado como retardatário
                      setValue('quantidadeClassificados', null);
                      setValue('sessao', null);
                    }
                  }}
                  style={agendaFormStyles.retardatarioCheckbox}
                >
                  Sim
                </Checkbox>
              </AppFormItem>
            ) : (
              <div></div>
            )}
          </Col>
          <Col span={6}>
            {/* Espaço vazio para alinhar com Classificação */}
          </Col>
          <Col span={6}>
            {/* Espaço vazio para alinhar com Sessão */}
          </Col>
        </Row>

        {/* Linha única com todos os 4 campos */}
        <Row gutter={16} style={agendaFormStyles.formRowSecond}>
          <Col span={6}>
            <AppFormItem label="*Escolha em" style={agendaFormStyles.formItemNoMargin}>
              <Controller
                name="escolhaEm"
                control={control}
                render={({ field }) => (
                  watchedFields.tipoEscolha === "ONLINE" ? (
                    <DatePicker.RangePicker
                      {...field}
                      value={field.value}
                      onChange={(dates) => field.onChange(dates)}
                      placeholder={["Data início", "Data fim"]}
                      className="agenda-picker"
                      format="DD/MM/YYYY"
                      status={formErrors.escolhaEm ? 'error' : undefined}
                    />
                  ) : (
                    <DatePicker
                      {...field}
                      placeholder="Insira a data"
                      className="agenda-picker"
                      format="DD/MM/YYYY"
                      status={formErrors.escolhaEm ? 'error' : undefined}
                    />
                  )
                )}
              />
              {formErrors.escolhaEm && (
                <Text style={agendaFormStyles.errorMessage}>
                  {getErrorMessage(formErrors.escolhaEm)}
                </Text>
              )}
            </AppFormItem>
          </Col>
          <Col span={6}>
            <AppFormItem label="*Nomeação em" style={agendaFormStyles.formItemNoMargin}>
              <Controller
                name="nomeacaoEm"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    placeholder="Insira a data"
                    className="agenda-picker"
                    format="DD/MM/YYYY"
                    status={formErrors.nomeacaoEm ? 'error' : undefined}
                  />
                )}
              />
              {formErrors.nomeacaoEm && (
                <Text style={agendaFormStyles.errorMessage}>
                  {getErrorMessage(formErrors.nomeacaoEm)}
                </Text>
              )}
            </AppFormItem>
          </Col>
          <Col span={6}>
            <AppFormItem label="*Candidatos" style={agendaFormStyles.formItemNoMargin}>
              <Controller
                name="quantidadeClassificados"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    placeholder="Digite a classificação"
                    className="agenda-input"
                    min={1}
                    disabled={isRetardatario || watchedFields.tipoEscolha === "ONLINE"}
                    status={formErrors.quantidadeClassificados ? 'error' : undefined}
                  />
                )}
              />
              {((typeof candidatosFaltantesCount === "number" && candidatosFaltantesCount >= 0) ||
                (candidatosDisponiveis !== undefined && candidatosDisponiveis >= 0)) && (
                <Text style={agendaFormStyles.candidatosDisponiveis}>
                  {isRetardatario && totalCandidatos !== undefined
                    ? `Total de candidatos: ${totalCandidatos}`
                    : `Candidatos disponíveis: ${
                        typeof candidatosFaltantesCount === "number" && candidatosFaltantesCount >= 0
                          ? candidatosFaltantesCount
                          : candidatosDisponiveis
                      }`}
                </Text>
              )}
              {formErrors.quantidadeClassificados && (
                <Text style={agendaFormStyles.errorMessage}>
                  {getErrorMessage(formErrors.quantidadeClassificados)}
                </Text>
              )}
            </AppFormItem>
          </Col>
          <Col span={6}>
            <AppFormItem label="*Sessão" style={agendaFormStyles.formItemNoMargin}>
              <Controller
                name="sessao"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    placeholder="Digite a sessão"
                    className="agenda-input"
                    min={1}
                    disabled={isRetardatario || watchedFields.tipoEscolha === "ONLINE"}
                    status={formErrors.sessao ? 'error' : undefined}
                  />
                )}
              />
              {formErrors.sessao && (
                <Text style={agendaFormStyles.errorMessage}>
                  {getErrorMessage(formErrors.sessao)}
                </Text>
              )}
            </AppFormItem>
          </Col>
        </Row>

        {/* Linha com Hora da convocação, Retardatário e Botão Adicionar período */}
        <Row gutter={16} align="middle">
          <Col span={6}>
            {watchedFields.tipoEscolha === "PRESENCIAL" ? (
              <AppFormItem label="*Hora da convocação" style={agendaFormStyles.formItemNoMargin}>
                <Controller
                  name="horaInicio"
                  control={control}
                  render={({ field }) => (
                    <Select
                      placeholder="Início"
                      style={agendaFormStyles.timePickerRange}
                      options={HORA_OPTIONS}
                      suffixIcon={<ClockCircleOutlined />}
                      allowClear
                      value={field.value ? dayjs(field.value).hour() : undefined}
                      onChange={async (hora) => {
                        if (hora != null) {
                          const horaInicio = dayjs().hour(hora).minute(0).second(0).millisecond(0);
                          const horaFim = horaInicio.clone().add(1, "hour");
                          field.onChange(horaInicio);
                          setValue("horaFim", horaFim);
                          if (isRetardatario) {
                            await trigger(["horaInicio", "horaFim"]);
                          }
                        } else {
                          field.onChange(null);
                          setValue("horaFim", null);
                        }
                      }}
                      status={(formErrors.horaInicio || formErrors.horaFim) ? "error" : undefined}
                    />
                  )}
                />
                {(formErrors.horaInicio || formErrors.horaFim) && (
                  <div style={agendaFormStyles.timeErrorContainer}>
                    {formErrors.horaInicio && (
                      <Text style={agendaFormStyles.errorMessageBlock}>
                        {getErrorMessage(formErrors.horaInicio)}
                      </Text>
                    )}
                    {formErrors.horaFim && (
                      <Text style={agendaFormStyles.errorMessageBlock}>
                        {getErrorMessage(formErrors.horaFim)}
                      </Text>
                    )}
                  </div>
                )}
              </AppFormItem>
            ) : (
              <div></div>
            )}
          </Col>
          <Col span={6}>
            {/* Espaço vazio para alinhar com Classificação */}
          </Col>
          <Col span={6}>
            {/* Espaço vazio para alinhar com Classificação */}
          </Col>
          <Col span={6} style={agendaFormStyles.addPeriodButtonCol}>
            <AppButton
              className="gerenciamento-vagas-btn adicionar-periodo-btn"
              icon={<PlusOutlined style={agendaFormStyles.addPeriodButtonIcon(!isBotaoAdicionarHabilitado())} />}
              disabled={!isBotaoAdicionarHabilitado()}
              onClick={handleAdicionarPeriodo}
            >
              Adicionar período
            </AppButton>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AgendaForm;
