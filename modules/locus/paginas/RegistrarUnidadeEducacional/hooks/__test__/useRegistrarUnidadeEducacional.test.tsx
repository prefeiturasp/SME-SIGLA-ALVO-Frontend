import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App as AntdApp } from "antd";
import { useRegistrarUnidadeEducacional } from "../useRegistrarUnidadeEducacional";

function wrapper({ children }: { children: ReactNode }) {
  return (
    <AntdApp>
      <MemoryRouter>{children}</MemoryRouter>
    </AntdApp>
  );
}

describe("useRegistrarUnidadeEducacional", () => {
  it("marca componente curricular como obrigatorio ao registrar sem itens", async () => {
    const { result } = renderHook(() => useRegistrarUnidadeEducacional(), {
      wrapper,
    });

    await act(async () => {
      result.current.atualizarDados("codigoLotacao", "123");
    });
    await act(async () => {
      await result.current.consultarLotacao();
    });
    await act(async () => {
      await result.current.registrar();
    });

    expect(result.current.erroComponenteCurricular).toBe("Campo obrigatório");
    expect(result.current.erroCodigoLotacao).toBeUndefined();
  });

  it("registra com sucesso apos consultar lotacao e adicionar componente", async () => {
    const { result } = renderHook(() => useRegistrarUnidadeEducacional(), {
      wrapper,
    });

    await act(async () => {
      result.current.atualizarDados("codigoLotacao", "123");
    });
    await act(async () => {
      await result.current.consultarLotacao();
    });
    await act(async () => {
      result.current.definirComponenteSelecionado("Arte");
    });
    await act(async () => {
      result.current.definirQuantidadeModulos("10");
    });
    await act(async () => {
      result.current.adicionarComponente();
    });

    expect(result.current.componentes).toHaveLength(1);

    await act(async () => {
      await result.current.registrar();
    });

    await waitFor(() => {
      expect(result.current.erroComponenteCurricular).toBeUndefined();
      expect(result.current.erroCodigoLotacao).toBeUndefined();
      expect(result.current.salvando).toBe(false);
    });
  });
});
