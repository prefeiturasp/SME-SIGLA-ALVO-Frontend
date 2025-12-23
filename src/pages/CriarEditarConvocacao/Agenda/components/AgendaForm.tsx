import React from "react";
import {
  Button,
  Card,
  Form,
  DatePicker,
  Radio,
  Checkbox,
  TimePicker,
  InputNumber,
  Row,
  Col,
  Typography,
} from "antd";
import { CalendarOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { agendaFormStyles } from "../styles";

const { Text } = Typography;

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
  setValue: (name: string, value: any) => void;
  totalCandidatos?: number;
  trigger: (name?: string | string[]) => Promise<boolean>;
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
  setValue,
  totalCandidatos,
  trigger,
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
          <Button
            type="text"
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
                {agendaAberto.cargo.nome}
              </Text>
            </div>
          </Col>
          <Col span={6}>
            <Form.Item label="Modalidade da Escolha" style={agendaFormStyles.formItemNoMargin}>
              <Controller
                name="tipoEscolha"
                control={control}
                render={({ field }) => (
                  <Radio.Group 
                    {...field} 
                    options={[
                      { label: 'Presencial', value: 'Presencial' },
                      { label: 'Online', value: 'Online' }
                    ]}
                  />
                )}
              />
              {formErrors.tipoEscolha && (
                <Text style={agendaFormStyles.errorMessage}>
                  {getErrorMessage(formErrors.tipoEscolha)}
                </Text>
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            {watchedFields.tipoEscolha === "Presencial" ? (
              <Form.Item label="Retardatário?" style={agendaFormStyles.formItemNoMargin}>
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
              </Form.Item>
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
            <Form.Item label="*Escolha em" style={agendaFormStyles.formItemNoMargin}>
              <Controller
                name="escolhaEm"
                control={control}
                render={({ field }) => (
                  watchedFields.tipoEscolha === "Online" ? (
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
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="*Nomeação em" style={agendaFormStyles.formItemNoMargin}>
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
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="*Classificação" style={agendaFormStyles.formItemNoMargin}>
              <Controller
                name="quantidadeClassificados"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    placeholder="Digite a classificação"
                    className="agenda-input"
                    min={1}
                    disabled={isRetardatario}
                    status={formErrors.quantidadeClassificados ? 'error' : undefined}
                  />
                )}
              />
              {candidatosDisponiveis !== undefined && candidatosDisponiveis >= 0 && (
                <Text style={agendaFormStyles.candidatosDisponiveis}>
                  {isRetardatario && totalCandidatos !== undefined
                    ? `Total de candidatos: ${totalCandidatos}`
                    : `Candidatos disponíveis: ${candidatosDisponiveis}`}
                </Text>
              )}
              {formErrors.quantidadeClassificados && (
                <Text style={agendaFormStyles.errorMessage}>
                  {getErrorMessage(formErrors.quantidadeClassificados)}
                </Text>
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="*Sessão" style={agendaFormStyles.formItemNoMargin}>
              <Controller
                name="sessao"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    placeholder="Digite a sessão"
                    className="agenda-input"
                    min={1}
                    disabled={isRetardatario}
                    status={formErrors.sessao ? 'error' : undefined}
                  />
                )}
              />
              {formErrors.sessao && (
                <Text style={agendaFormStyles.errorMessage}>
                  {getErrorMessage(formErrors.sessao)}
                </Text>
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Linha com Hora da convocação, Retardatário e Botão Adicionar período */}
        <Row gutter={16} align="middle">
          <Col span={6}>
            {watchedFields.tipoEscolha === "Presencial" ? (
              <Form.Item label="*Hora da convocação" style={agendaFormStyles.formItemNoMargin}>
                <Controller
                  name="horaInicio"
                  control={control}
                  render={({ field }) => (
                    <Controller
                      name="horaFim"
                      control={control}
                      render={({ field: fieldFim }) => (
                        <TimePicker.RangePicker
                          placeholder={["Início", "Fim"]}
                          style={agendaFormStyles.timePickerRange}
                          format="HH:mm"
                          onChange={async (times) => {
                            if (times && times.length === 2) {
                              field.onChange(times[0]);
                              fieldFim.onChange(times[1]);
                              // Disparar validação quando o horário mudar, especialmente para retardatário
                              if (isRetardatario) {
                                await trigger(['horaInicio', 'horaFim']);
                              }
                            } else {
                              field.onChange(null);
                              fieldFim.onChange(null);
                            }
                          }}
                          value={field.value && fieldFim.value ? [field.value, fieldFim.value] : null}
                          status={(formErrors.horaInicio || formErrors.horaFim) ? 'error' : undefined}
                        />
                      )}
                    />
                  )}
                />
                {/* Mensagens de erro para horários */}
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
              </Form.Item>
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
            <Button 
              className="gerenciamento-vagas-btn adicionar-periodo-btn"
              icon={<PlusOutlined style={agendaFormStyles.addPeriodButtonIcon(!isBotaoAdicionarHabilitado())} />}
              disabled={!isBotaoAdicionarHabilitado()}
              onClick={handleAdicionarPeriodo}
            >
              Adicionar período
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AgendaForm;
