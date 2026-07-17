import React from "react";
import { renderHook } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useModoConcurso } from "../useModoConcurso";

const wrapperPara = (initialPath: string, routePath: string) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path={routePath} element={<>{children}</>} />
      </Routes>
    </MemoryRouter>
  );
  return Wrapper;
};

describe("useModoConcurso", () => {
  it("modo adicionar: labels e paths sob /adicionar", () => {
    const { result } = renderHook(() => useModoConcurso(), {
      wrapper: wrapperPara(
        "/gerenciar/concursos/adicionar/passo-1",
        "/gerenciar/concursos/adicionar/passo-1"
      ),
    });

    expect(result.current.isEdicao).toBe(false);
    expect(result.current.labelTela).toBe("Adicionar concurso");
    expect(result.current.labelBotaoFinal).toBe("Adicionar concurso");
    expect(result.current.getStepPath(0)).toBe(
      "/gerenciar/concursos/adicionar/passo-1"
    );
    expect(result.current.getStepPath(1, "u1")).toBe(
      "/gerenciar/concursos/adicionar/u1/passo-2"
    );

    expect(result.current.getStepPath(1)).toBeNull();
  });

  it("modo editar: labels e paths sob /editar/:uuid", () => {
    const { result } = renderHook(() => useModoConcurso(), {
      wrapper: wrapperPara(
        "/gerenciar/concursos/editar/abc/passo-2",
        "/gerenciar/concursos/editar/:uuid/passo-2"
      ),
    });

    expect(result.current.isEdicao).toBe(true);
    expect(result.current.uuidRota).toBe("abc");
    expect(result.current.labelTela).toBe("Editar concurso");
    expect(result.current.labelBotaoFinal).toBe("Salvar");
    expect(result.current.getStepPath(0, "abc")).toBe(
      "/gerenciar/concursos/editar/abc/passo-1"
    );
    expect(result.current.getStepPath(2, "abc")).toBe(
      "/gerenciar/concursos/editar/abc/passo-3"
    );
  });
});
