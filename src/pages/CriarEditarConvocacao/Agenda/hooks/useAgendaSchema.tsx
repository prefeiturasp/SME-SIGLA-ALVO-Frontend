import * as yup from "yup";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Extend dayjs with plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Tipo TypeScript para os dados da agenda
export interface IAgendaFields {
  tipoEscolha: string;
  cargoAgenda: string;
  escolhaEm: any;
  nomeacaoEm: any;
  quantidadeClassificados: number | null;
  sessao: number | null;
  horaInicio: any;
  horaFim: any;
}

// Schema de validação para os campos da Agenda seguindo o padrão do projeto
const useAgendaSchema = (
  getMaxCandidatos?: () => number | undefined,
  isRetardatario?: () => boolean,
  verificarHorarioRetardatario?: () => boolean
) => {
  return yup.object({
    tipoEscolha: yup
      .string()
      .required("Campo obrigatório")
      .oneOf(["PRESENCIAL", "ONLINE"], "Tipo de Escolha deve ser Presencial ou Online"),
    
    cargoAgenda: yup
      .string()
      .required("campo obrigatório"),
    
    escolhaEm: yup
      .mixed()
      .required("Data da Escolha é obrigatória")
      .test("is-valid-field", "campo obrigatório", function(value) {
        const { tipoEscolha } = this.parent;
        
        if (tipoEscolha === "ONLINE") {
          // Para Online, verificar se é um array com 2 datas válidas
          return value && Array.isArray(value) && value.length === 2 && 
                 value.every(date => date && dayjs(date as any).isValid());
        } else {
          // Para Presencial, verificar se é uma data válida
          return value && dayjs(value as any).isValid();
        }
      })
      .test("is-valid-date", "Data de escolha inválida", function(value) {
        const { tipoEscolha } = this.parent;
        
        if (tipoEscolha === "ONLINE") {
          // Para Online, esperamos um array de datas
          if (!value || !Array.isArray(value) || value.length !== 2) {
            return false;
          }
          // Verificar se ambas as datas são válidas e não são null/undefined
          return value.every(date => date && dayjs(date as any).isValid());
        } else {
          // Para Presencial, esperamos uma data única
          return value && dayjs(value as any).isValid();
        }
      })
      .test("is-future-date", "Data de escolha deve ser futura ou hoje", function(value) {
        const { tipoEscolha } = this.parent;
        
        if (!value) return true;
        const today = dayjs().startOf("day");
        
        if (tipoEscolha === "ONLINE") {
          // Para Online, validar ambas as datas do range
          if (!Array.isArray(value) || value.length !== 2) {
            return false;
          }
          return value.every(date => {
            if (!date) return false;
            const selectedDate = dayjs(date as any).startOf("day");
            return selectedDate.isSameOrAfter(today);
          });
        } else {
          // Para Presencial, validar data única
          const selectedDate = dayjs(value as any).startOf("day");
          return selectedDate.isSameOrAfter(today);
        }
      })
      .test("valid-range", "Data de início deve ser anterior ou igual à data de fim", function(value) {
        const { tipoEscolha } = this.parent;
        
        if (tipoEscolha === "ONLINE" && Array.isArray(value) && value.length === 2) {
          const [startDate, endDate] = value;
          if (startDate && endDate) {
            const start = dayjs(startDate as any).startOf("day");
            const end = dayjs(endDate as any).startOf("day");
            return start.isSameOrBefore(end);
          }
        }
        return true;
      }),
    
    nomeacaoEm: yup
      .mixed()
      .required("Data de Nomeação é obrigatória")
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
        const { escolhaEm, tipoEscolha } = this.parent;
        if (!value || !escolhaEm) return true;
        
        const nomeacaoDate = dayjs(value as any).startOf("day");
        
        if (tipoEscolha === "ONLINE" && Array.isArray(escolhaEm) && escolhaEm.length === 2) {
          // Para Online, usar a data de fim do range
          const escolhaDate = dayjs(escolhaEm[1] as any).startOf("day");
          return nomeacaoDate.isSameOrAfter(escolhaDate);
        } else {
          // Para Presencial, usar a data única
          const escolhaDate = dayjs(escolhaEm as any).startOf("day");
          return nomeacaoDate.isSameOrAfter(escolhaDate);
        }
      }),
    
    quantidadeClassificados: yup
      .number()
      .nullable()
      .test("required-if-not-retardatario", "Quantidade de Classificados é obrigatória", function(value) {
        const isRetardatarioValue = isRetardatario?.();
        if (isRetardatarioValue) {
          return true; // Não é obrigatório quando é retardatário
        }
        return value !== null && value !== undefined;
      })
      .test("min-value", "Quantidade deve ser maior que 0", function(value) {
        const isRetardatarioValue = isRetardatario?.();
        if (isRetardatarioValue || value === null || value === undefined) {
          return true;
        }
        return value >= 1;
      })
      .test("integer", "Quantidade deve ser um número inteiro", function(value) {
        const isRetardatarioValue = isRetardatario?.();
        if (isRetardatarioValue || value === null || value === undefined) {
          return true;
        }
        return Number.isInteger(value);
      })
      .test("max-candidatos", function(value) {
        const isRetardatarioValue = isRetardatario?.();
        if (isRetardatarioValue || value === null || value === undefined) {
          return true;
        }
        const maxCandidatos = getMaxCandidatos?.();
        
        // Se não há candidatos disponíveis (maxCandidatos é 0 ou undefined/null)
        if (maxCandidatos !== undefined && maxCandidatos <= 0) {
          return this.createError({
            message: "Quantidade de Candidatos excedida"
          });
        }
        
        // Se a quantidade excede os disponíveis
        if (maxCandidatos !== undefined && value && value > maxCandidatos) {
          return this.createError({
            message: `Quantidade superior a ${maxCandidatos} candidatos disponíveis`
          });
        }
        return true;
      }),
    
    sessao: yup
      .number()
      .nullable()
      .test("required-if-not-retardatario", "Sessão é obrigatória", function(value) {
        const isRetardatarioValue = isRetardatario?.();
        if (isRetardatarioValue) {
          return true; // Não é obrigatório quando é retardatário
        }
        return value !== null && value !== undefined;
      })
      .test("min-value", "Sessão deve ser maior que 0", function(value) {
        const isRetardatarioValue = isRetardatario?.();
        if (isRetardatarioValue || value === null || value === undefined) {
          return true;
        }
        return value >= 1;
      })
      .test("integer", "Sessão deve ser um número inteiro", function(value) {
        const isRetardatarioValue = isRetardatario?.();
        if (isRetardatarioValue || value === null || value === undefined) {
          return true;
        }
        return Number.isInteger(value);
      }),
    
    horaInicio: yup
      .mixed()
      .when("tipoEscolha", {
        is: "PRESENCIAL",
        then: (schema) => schema
          .required("Horário de início obrigatório")
          .test("is-valid-time", "Hora de início inválida", (value) => {
            return value && dayjs(value as any).isValid();
          })
          .test("retardatario-deve-ser-ultimo", "O horário do retardatário deve ser depois de todas as outras agendas", function(value) {
            const isRetardatarioValue = isRetardatario?.();
            if (!isRetardatarioValue || !value) {
              return true;
            }
            const horarioValido = verificarHorarioRetardatario?.();
            if (horarioValido === false) {
              return this.createError({
                message: "O horário do retardatário deve ser depois de todas as outras agendas do mesmo cargo"
              });
            }
            return true;
          }),
        otherwise: (schema) => schema.notRequired(),
      }),
    
    horaFim: yup
      .mixed()
      .when("tipoEscolha", {
        is: "PRESENCIAL",
        then: (schema) => schema
          .required("Horário de fim obrigatório")
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
        otherwise: (schema) => schema.notRequired(),
      }),
  });
};

export default useAgendaSchema;
