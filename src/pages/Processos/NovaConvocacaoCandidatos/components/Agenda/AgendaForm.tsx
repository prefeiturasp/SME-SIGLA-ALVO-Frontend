import React from "react";
import { Space, Typography, Select, Row, Col, DatePicker, TimePicker, Checkbox, Radio, Flex, InputNumber } from "antd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { PlusOutlined } from "@ant-design/icons";
import { AppButton } from '@/components/ui';
import {
  fullWidth,
  fieldColumn,
  standardWideControlWithMargin,
  standardWideControl,
  standardNarrowControl,
  formErrorText,
  formErrorTextInline,
  brandHighlightText,
} from "@/design-system/estilos";

const styles = {
  fullWidth,
  fieldColumn,
  fieldControlWide: standardWideControlWithMargin,
  radioGroup: { width: standardWideControl.width },
  fieldControlNarrow: standardNarrowControl,
  sectionSpacing: { marginTop: 16 },
  timeRow: { marginTop: 4 },
  timePicker: { width: "17.3125rem", height: standardWideControl.height },
  timeSeparatorCol: { display: "flex", alignItems: "center", paddingBottom: 0 },
  errorRow: { marginTop: 8 },
  errorMessage: formErrorText,
  errorMessageInline: formErrorTextInline,
  iconPrimary: brandHighlightText,
  addButton: { marginTop: 16 },
};
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
      <Space direction="vertical" size="middle" style={styles.fullWidth}>
        <div style={styles.fieldColumn}>
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
                  style={styles.radioGroup}
                />
              </Flex>
            )}
          />
          {formErrors.tipoEscolha && (
            <Text style={styles.errorMessage}>
              {getErrorMessage(formErrors.tipoEscolha)}
            </Text>
          )}
        </div>
        
        <div style={styles.fieldColumn}>
          <Text strong>Cargo</Text>
          <Controller
            name="cargoAgenda"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Selecione o cargo"
                style={styles.fieldControlWide}
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
            <Text style={styles.errorMessage}>
              {getErrorMessage(formErrors.cargoAgenda)}
            </Text>
          )}
        </div>

        <div style={styles.fieldColumn}>
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
                  style={styles.fieldControlWide}
                  suffixIcon={<CalendarMonthIcon style={styles.iconPrimary} />}
                  format="DD/MM/YYYY"
                  status={formErrors.escolhaEm ? 'error' : undefined}
                />
              ) : (
                <DatePicker
                  {...field}
                  placeholder="Insira a data"
                  style={styles.fieldControlWide}
                  suffixIcon={<CalendarMonthIcon style={styles.iconPrimary} />}
                  format="DD/MM/YYYY"
                  status={formErrors.escolhaEm ? 'error' : undefined}
                />
              )
            )}
          />
          {formErrors.escolhaEm && (
            <Text style={styles.errorMessage}>
              {getErrorMessage(formErrors.escolhaEm)}
            </Text>
          )}
        </div>

        <div style={styles.fieldColumn}>
          <Text strong>Nomeação em</Text>
          <Controller
            name="nomeacaoEm"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                placeholder="Insira a data"
                style={styles.fieldControlWide}
                suffixIcon={<CalendarMonthIcon style={styles.iconPrimary} />}
                format="DD/MM/YYYY"
                status={formErrors.nomeacaoEm ? 'error' : undefined}
              />
            )}
          />
          {formErrors.nomeacaoEm && (
            <Text style={styles.errorMessage}>
              {getErrorMessage(formErrors.nomeacaoEm)}
            </Text>
          )}
        </div>
      </Space>

      <div style={styles.sectionSpacing}>
        <div style={styles.fieldColumn}>
          <Text strong>Classificação</Text>
          <Controller
            name="quantidadeClassificados"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                placeholder="Quantidade de classificados"
                style={styles.fieldControlNarrow}
                min={1}
                status={formErrors.quantidadeClassificados ? 'error' : undefined}
              />
            )}
          />
          {formErrors.quantidadeClassificados && (
            <Text style={styles.errorMessage}>
              {getErrorMessage(formErrors.quantidadeClassificados)}
            </Text>
          )}
        </div>
        
        <div style={{ ...styles.fieldColumn, ...styles.sectionSpacing }}>
          <Text strong>Sessão</Text>
          <Controller
            name="sessao"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                placeholder="Quantidade de sessões"
                style={styles.fieldControlNarrow}
                min={1}
                status={formErrors.sessao ? 'error' : undefined}
              />
            )}
          />
          {formErrors.sessao && (
            <Text style={styles.errorMessage}>
              {getErrorMessage(formErrors.sessao)}
            </Text>
          )}
        </div>
      </div>

      {tipoEscolha === "Presencial" && (
        <div style={styles.sectionSpacing}>
          <Text strong>Hora da convocação</Text>
          <Row gutter={[8, 8]} style={styles.timeRow}>
            <Col>
              <Controller
                name="horaInicio"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    placeholder="Início"
                    style={styles.timePicker}
                    suffixIcon={<AccessTimeIcon style={styles.iconPrimary} />}
                    format="HH:mm"
                    status={formErrors.horaInicio ? 'error' : undefined}
                  />
                )}
              />
            </Col>
            <Col style={styles.timeSeparatorCol}>
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
                    style={styles.timePicker}
                    suffixIcon={<AccessTimeIcon style={styles.iconPrimary} />}
                    format="HH:mm"
                    status={formErrors.horaFim ? 'error' : undefined}
                  />
                )}
              />
            </Col>
            <Col style={styles.timeSeparatorCol}>
              <Checkbox
                checked={isRetardatario}
                onChange={(e) => setIsRetardatario(e.target.checked)}
              >
                Retardatário
              </Checkbox>
            </Col>
          </Row>
          <Row style={styles.errorRow}>
            {formErrors.horaInicio && (
              <Col span={12}>
                <Text style={styles.errorMessageInline}>
                  {getErrorMessage(formErrors.horaInicio)}
                </Text>
              </Col>
            )}
            {formErrors.horaFim && (
              <Col span={12}>
                <Text style={styles.errorMessageInline}>
                  {getErrorMessage(formErrors.horaFim)}
                </Text>
              </Col>
            )}
          </Row>
        </div>
      )}

      <AppButton 
        variant="primary"
        icon={<PlusOutlined />} 
        size="large" 
        style={styles.addButton}
        disabled={!isAgendaComplete()}
        onClick={handleAdicionarPeriodo}
      >
        Adicionar Agenda
      </AppButton>
    </>
  );
};

export default AgendaForm;
