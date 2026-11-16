import { act, renderHook } from "@testing-library/react";
import {
  useConcursoForm,
  type IConcursoFormFields,
} from "../useConcursoForm";

const preencherValido = (): IConcursoFormFields => ({
  cargos_ids: ["11111111-1111-1111-1111-111111111111"],
  nome: "Concurso 2026",
  numero_processo: "6016202200779764",
  banca_responsavel: "FGV",
  status: "ATIVO",
});

describe("useConcursoForm", () => {
  it("usa os valores padrão esperados", () => {
    const { result } = renderHook(() => useConcursoForm());

    const valores = result.current.getValues();
    expect(valores).toEqual({
      cargos_ids: [],
      nome: "",
      numero_processo: "",
      banca_responsavel: "",
      status: "ATIVO",
    });
  });

  it("faz merge de defaultValues parciais sobre os padrões", () => {
    const { result } = renderHook(() =>
      useConcursoForm({ nome: "Pré-preenchido", status: "INATIVO" })
    );

    const valores = result.current.getValues();
    expect(valores.nome).toBe("Pré-preenchido");
    expect(valores.status).toBe("INATIVO");
    expect(valores.cargos_ids).toEqual([]);
  });

  it("é inválido e reporta erro por campo quando vazio", async () => {
    const { result } = renderHook(() => useConcursoForm());

    const onValid = jest.fn();
    const onInvalid = jest.fn();
    await act(async () => {
      await result.current.handleSubmit(onValid, onInvalid)();
    });

    expect(onValid).not.toHaveBeenCalled();
    const errors = onInvalid.mock.calls[0][0];
    expect(errors.cargos_ids?.message).toBe("Selecione ao menos um cargo");
    expect(errors.nome?.message).toBe("Informe o nome do concurso");
    expect(errors.numero_processo?.message).toBe(
      "Informe o número do processo"
    );
    expect(errors.banca_responsavel?.message).toBe(
      "Informe a banca responsável"
    );
  });

  it("é válido quando todos os campos estão preenchidos", async () => {
    const { result } = renderHook(() =>
      useConcursoForm(preencherValido())
    );

    let valido = false;
    await act(async () => {
      valido = await result.current.trigger();
    });

    expect(valido).toBe(true);
  });

  it("rejeita status fora de ATIVO/INATIVO", async () => {
    const { result } = renderHook(() =>
      useConcursoForm({
        ...preencherValido(),
        status: "OUTRO" as IConcursoFormFields["status"],
      })
    );

    const onValid = jest.fn();
    const onInvalid = jest.fn();
    await act(async () => {
      await result.current.handleSubmit(onValid, onInvalid)();
    });

    expect(onValid).not.toHaveBeenCalled();
    expect(onInvalid.mock.calls[0][0].status).toBeDefined();
  });
});
