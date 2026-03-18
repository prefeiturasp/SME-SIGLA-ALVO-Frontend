import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock dos serviços para evitar axios/import.meta
jest.mock("../../../../../services", () => ({
  __esModule: true,
  API: {
    Candidatos: {
      getCandidatos: () => {
        const { signal } = new AbortController();
        return { response: Promise.resolve([{ id: 1 }]), abort: () => {} };
      },
      getCandidatosHabilitados: (params: any) => {
        const { signal } = new AbortController();
        return { response: Promise.resolve([{ id: 2, params }]), abort: () => {} };
      },
      getCandidatosHabilitadosCalculados: (params: any) => {
        const { signal } = new AbortController();
        return { response: Promise.resolve([{ id: 3, params }]), abort: () => {} };
      },
      getCandidatosHabilitadosReposicao: (params: any) => {
        const { signal } = new AbortController();
        return { response: Promise.resolve([{ id: 4, params }]), abort: () => {} };
      },
      getCandidatosHabilitadosReconvocacao: (params: any) => {
        const { signal } = new AbortController();
        return { response: Promise.resolve([{ id: 5, params }]), abort: () => {} };
      },
    },
  },
}));

import { useGetCandidatos } from "../useGetCandidatos";
import { useGetCandidatosCalculados } from "../useGetCandidatosCalculados";
import { useGetCandidatosReposicao } from "../useGetCandidatosReposicao";
import { useGetCandidatosReconvocacao } from "../useGetCandidatosReconvocacao";

function wrapperFc(children: React.ReactNode) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("Hooks de busca de candidatos (SelecaoCargos)", () => {
  it("useGetCandidatos: não busca quando buscarCandidatos=false", async () => {
    const { result } = renderHook(() => useGetCandidatos(false), {
      wrapper: ({ children }) => wrapperFc(children),
    });
    expect(result.current.candidatosData).toBeUndefined();
  });

  it("useGetCandidatos: busca lista geral quando buscarCandidatos=true sem params", async () => {
    const { result } = renderHook(() => useGetCandidatos(true), {
      wrapper: ({ children }) => wrapperFc(children),
    });
    await waitFor(() => {
      expect(Array.isArray(result.current.candidatosData as any)).toBe(true);
    });
  });

  it("useGetCandidatos: busca habilitados quando params presentes", async () => {
    const { result } = renderHook(
      () =>
        useGetCandidatos(true, {
          geral: 10,
          pcd: 2,
          nna: 1,
          concurso_uuid: "c-1",
        }),
      { wrapper: ({ children }) => wrapperFc(children) }
    );
    await waitFor(() => {
      expect(Array.isArray(result.current.candidatosData as any)).toBe(true);
    });
    // Testa fetchCandidatosNow também
    const resp = await result.current.fetchCandidatosNow({
      geral: 1,
      pcd: 0,
      nna: 0,
      concurso_uuid: "c-2",
    });
    expect(Array.isArray(resp as any)).toBe(true);
  });

  it("useGetCandidatosCalculados: só busca com enabled e params", async () => {
    const { result, rerender } = renderHook(
      ({ enabled, params }: any) => useGetCandidatosCalculados(enabled, params),
      {
        initialProps: { enabled: false, params: undefined },
        wrapper: ({ children }) => wrapperFc(children),
      }
    );
    expect(result.current.candidatosData).toBeUndefined();
    rerender({
      enabled: true,
      params: { concurso_uuid: "c-1", quantidade: 5, codigo_cargo: "X" },
    });
    await waitFor(() => {
      expect(Array.isArray(result.current.candidatosData as any)).toBe(true);
    });
    const resp = await result.current.fetchCandidatosNow({
      concurso_uuid: "c-1",
      quantidade: 1,
    });
    expect(Array.isArray(resp as any)).toBe(true);
  });

  it("useGetCandidatosReposicao: só busca com enabled e params", async () => {
    const { result, rerender } = renderHook(
      ({ enabled, params }: any) => useGetCandidatosReposicao(enabled, params),
      {
        initialProps: { enabled: false, params: undefined },
        wrapper: ({ children }) => wrapperFc(children),
      }
    );
    expect(result.current.candidatosData).toBeUndefined();
    rerender({
      enabled: true,
      params: { concurso_uuid: "c-1", geral: 1 },
    });
    await waitFor(() => {
      expect(Array.isArray(result.current.candidatosData as any)).toBe(true);
    });
    const resp = await result.current.fetchCandidatosNow({
      concurso_uuid: "c-1",
      pcd: 1,
    });
    expect(Array.isArray(resp as any)).toBe(true);
  });

  it("useGetCandidatosReconvocacao: só busca com enabled e params", async () => {
    const { result, rerender } = renderHook(
      ({ enabled, params }: any) => useGetCandidatosReconvocacao(enabled, params),
      {
        initialProps: { enabled: false, params: undefined },
        wrapper: ({ children }) => wrapperFc(children),
      }
    );
    expect(result.current.candidatosData).toBeUndefined();
    rerender({
      enabled: true,
      params: { concurso_uuid: "c-1", quantidade: 2 },
    });
    await waitFor(() => {
      expect(Array.isArray(result.current.candidatosData as any)).toBe(true);
    });
  });
});

