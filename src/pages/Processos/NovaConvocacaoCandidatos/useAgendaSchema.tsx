import * as yup from "yup";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

// Extend dayjs with isSameOrAfter plugin
dayjs.extend(isSameOrAfter);

// Tipo TypeScript para os dados da agenda
export interface IAgendaFields {
  tipoEscolha: string;
  cargoAgenda: string;
  escolhaEm: any;
  nomeacaoEm: any;
  classificacaoInicio: any;
  classificacaoFim: any;
  horaInicio: any;
  horaFim: any;
}

// Schema de validação para os campos da Agenda seguindo o padrão do projeto
const useAgendaSchema = () => {
  return yup.object({
    tipoEscolha: yup
      .string()
      .required("campo obrigatório")
      .oneOf(["Presencial", "Online"], "Tipo de Escolha deve ser Presencial ou Online"),
    
    cargoAgenda: yup
      .string()
      .required("campo obrigatório"),
    
    escolhaEm: yup
      .mixed()
      .required("campo obrigatório")
      .test("is-valid-date", "Data de escolha inválida", (value) => {
        return value && dayjs(value as any).isValid();
      })
      .test("is-future-date", "Data de escolha deve ser futura ou hoje", (value) => {
        if (!value) return true;
        const today = dayjs().startOf("day");
        const selectedDate = dayjs(value as any).startOf("day");
        return selectedDate.isSameOrAfter(today);
      }),
    
    nomeacaoEm: yup
      .mixed()
      .required("campo obrigatório")
      .test("is-valid-date", "Data de nomeação inválida", (value) => {
        return value && dayjs(value as any).isValid();
      })
      .test("is-future-date", "Data de nomeação deve ser futura ou hoje", (value) => {
        if (!value) return true;
        const today = dayjs().startOf("day");
        const selectedDate = dayjs(value as any).startOf("day");
        return selectedDate.isSameOrAfter(today);
      })
      .test("is-after-escolha", "Data de nomeação deve ser posterior ou igual à data de escolha", function(value) {
        const { escolhaEm } = this.parent;
        if (!value || !escolhaEm) return true;
        const nomeacaoDate = dayjs(value as any).startOf("day");
        const escolhaDate = dayjs(escolhaEm as any).startOf("day");
        return nomeacaoDate.isSameOrAfter(escolhaDate);
      }),
    
    classificacaoInicio: yup
      .mixed()
      .required("campo obrigatório")
      .test("is-valid-date", "Data de início da classificação inválida", (value) => {
        return value && dayjs(value as any).isValid();
      })
      .test("is-future-date", "Data de início da classificação deve ser futura ou hoje", (value) => {
        if (!value) return true;
        const today = dayjs().startOf("day");
        const selectedDate = dayjs(value as any).startOf("day");
        return selectedDate.isSameOrAfter(today);
      }),
    
    classificacaoFim: yup
      .mixed()
      .required("campo obrigatório")
      .test("is-valid-date", "Data de fim da classificação inválida", (value) => {
        return value && dayjs(value as any).isValid();
      })
      .test("is-after-inicio", "Data de fim deve ser posterior ou igual à data de início", function(value) {
        const { classificacaoInicio } = this.parent;
        if (!value || !classificacaoInicio) return true;
        const fimDate = dayjs(value as any).startOf("day");
        const inicioDate = dayjs(classificacaoInicio as any).startOf("day");
        return fimDate.isSameOrAfter(inicioDate);
      }),
    
    horaInicio: yup
      .mixed()
      .required("campo obrigatório")
      .test("is-valid-time", "Hora de início inválida", (value) => {
        return value && dayjs(value as any).isValid();
      }),
    
    horaFim: yup
      .mixed()
      .required("campo obrigatório")
      .test("is-valid-time", "Hora de fim inválida", (value) => {
        return value && dayjs(value as any).isValid();
      })
      .test("is-after-hora-inicio", "Hora de fim deve ser posterior à hora de início", function(value) {
        const { horaInicio } = this.parent;
        if (!value || !horaInicio) return true;
        const horaFim = dayjs(value as any);
        const horaInicioTime = dayjs(horaInicio as any);
        return horaFim.isAfter(horaInicioTime);
      }),
  });
};

export default useAgendaSchema;
