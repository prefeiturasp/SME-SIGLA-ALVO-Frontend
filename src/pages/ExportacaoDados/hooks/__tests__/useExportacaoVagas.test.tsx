import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { App } from "antd";
import { useExportacaoVagas } from "../useExportacaoVagas";
import { API } from "../../../../services";

const listRequestMock = { pagination: { page: 1, page_size: 10 } };

jest.mock("../../../Processos/ConvocacaoCandidatos/hooks/useConvocacao.tsx", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    processosConvocacaoData: {
      results: [
        {
          uuid: "proc-1",
          descricao: "Processo 1",
          concurso_uuid: "conc-1",
          concurso_nome: "Concurso 1",
        },
      ],
    },
    processosConvocacaoIsLoading: false,
  })),
}));

jest.mock("../../../../hooks/useListRequest", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    listRequest: listRequestMock,
    onAntTableChange: jest.fn(),
  })),
}));

jest.mock("../../../../services", () => ({
  API: {
    Convocacao: {
      getCargosProcesso: jest.fn(),
    },
    ExportacaoDados: {
      getListExportacaoVagasProcesso: jest.fn(),
      getListExportacaoVagasSigpec: jest.fn(),
      postCreateExportacaoVagasProcesso: jest.fn(),
      postCreateExportacaoVagasSigpec: jest.fn(),
      downloadExportacao: jest.fn(),
    },
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <App>{children}</App>
    </QueryClientProvider>
  );

  return AppWrapper;
};

describe("useExportacaoVagas", () => {
  const mockNotification = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const cargosResponse = [
    { cargo_uuid: "cargo-1", cargo_nome: "Cargo 1", cargo_codigo: 123 },
  ];

  const listResponse = { results: [], count: 0 };

  const createResponse = {
    blob: new Blob(["test"], { type: "text/csv" }),
    filename: "vagas.csv",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(App, "useApp").mockReturnValue({
      notification: mockNotification,
    } as any);

    (API.Convocacao.getCargosProcesso as jest.Mock).mockReturnValue({
      response: Promise.resolve(cargosResponse),
      abort: jest.fn(),
    });

    (API.ExportacaoDados.getListExportacaoVagasProcesso as jest.Mock).mockReturnValue({
      response: Promise.resolve(listResponse),
      abort: jest.fn(),
    });

    (API.ExportacaoDados.getListExportacaoVagasSigpec as jest.Mock).mockReturnValue({
      response: Promise.resolve(listResponse),
      abort: jest.fn(),
    });

    (API.ExportacaoDados.postCreateExportacaoVagasProcesso as jest.Mock).mockReturnValue({
      response: Promise.resolve(createResponse),
      abort: jest.fn(),
    });

    (API.ExportacaoDados.postCreateExportacaoVagasSigpec as jest.Mock).mockReturnValue({
      response: Promise.resolve({
        blob: new Blob(["test"], { type: "text/csv" }),
        filename: "vagas-sigpec.csv",
      }),
      abort: jest.fn(),
    });

    (API.ExportacaoDados.downloadExportacao as jest.Mock).mockReturnValue({
      response: Promise.resolve({
        blob: new Blob(["test"], { type: "text/csv" }),
        filename: "download.csv",
      }),
      abort: jest.fn(),
    });

    Object.defineProperty(URL, "createObjectURL", {
      value: jest.fn(() => "blob:url"),
      writable: true,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: jest.fn(),
      writable: true,
    });
  });

  const setup = (tipo: "vagas-processo" | "vagas-sigpec" = "vagas-processo") => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useExportacaoVagas(tipo), { wrapper });
    return result;
  };

  it("inicializa com valores padrão e expõe propriedades esperadas", () => {
    const result = setup();

    expect(result.current.control).toBeDefined();
    expect(result.current.handleSubmit).toBeDefined();
    expect(result.current.formErrors).toBeDefined();
    expect(result.current.processosOptions).toHaveLength(1);
    expect(result.current.cargosOptions).toEqual([]);
    expect(result.current.listData).toBeUndefined();
    expect(result.current.listLoading).toBe(true);
    expect(result.current.onAntTableChange).toBeDefined();
  });

  it("monta processosOptions a partir de processosConvocacaoData", () => {
    const result = setup();

    expect(result.current.processosOptions[0]).toMatchObject({
      value: "proc-1",
      label: "Processo 1",
      concurso_uuid: "conc-1",
      concurso_nome: "Concurso 1",
    });
  });

  it("retorna cargosOptions vazios quando API retorna não-array", async () => {
    (API.Convocacao.getCargosProcesso as jest.Mock).mockReturnValueOnce({
      response: Promise.resolve(null),
      abort: jest.fn(),
    });

    const result = setup();

    await act(async () => {
      result.current.handleProcessoChange("proc-1");
    });

    await waitFor(() => {
      expect(result.current.cargosOptions).toEqual([]);
    });
  });

  it("monta cargosOptions quando API retorna lista de cargos", async () => {
    const result = setup();

    await act(async () => {
      result.current.handleProcessoChange("proc-1");
    });

    await waitFor(() => {
      expect(result.current.cargosOptions[0]).toMatchObject({
        value: "cargo-1",
        label: "Cargo 1",
        cargo_codigo: 123,
      });
    });
  });

  it("atualiza processoUuid ao trocar processo", () => {
    const result = setup();

    act(() => {
      result.current.handleProcessoChange("proc-2");
    });

    expect(result.current.processoUuid).toBe("proc-2");
  });

  it("não chama mutate quando processo ou cargo estão vazios", () => {
    const result = setup();

    act(() => {
      result.current.handleExportar({
        processo_uuid: undefined,
        cargo_uuid: undefined,
      });
    });

    expect(API.ExportacaoDados.postCreateExportacaoVagasProcesso).not.toHaveBeenCalled();
  });

  it("monta payload e chama mutate para vagas-processo", async () => {
    const result = setup("vagas-processo");

    await act(async () => {
      result.current.handleProcessoChange("proc-1");
    });

    await waitFor(() => {
      expect(result.current.cargosOptions.length).toBeGreaterThan(0);
    });

    await act(async () => {
      result.current.handleExportar({
        processo_uuid: "proc-1",
        cargo_uuid: "cargo-1",
      });
    });

    expect(API.ExportacaoDados.postCreateExportacaoVagasProcesso).toHaveBeenCalledWith(
      expect.objectContaining({
        processo_uuid: "proc-1",
        cargo_uuid: "cargo-1",
        processo_nome: "Processo 1",
        concurso_uuid: "conc-1",
        concurso_nome: "Concurso 1",
        cargo_nome: "Cargo 1",
        cargo_codigo: 123,
      }),
    );
    expect(mockNotification.success).toHaveBeenCalled();
  });

  it("usa endpoint vagas-sigpec quando tipo for vagas-sigpec", async () => {
    const result = setup("vagas-sigpec");

    await act(async () => {
      result.current.handleProcessoChange("proc-1");
    });

    await waitFor(() => {
      expect(result.current.cargosOptions.length).toBeGreaterThan(0);
    });

    await act(async () => {
      result.current.handleExportar({
        processo_uuid: "proc-1",
        cargo_uuid: "cargo-1",
      });
    });

    expect(API.ExportacaoDados.postCreateExportacaoVagasSigpec).toHaveBeenCalled();
  });

  it("exibe erro 404 ao falhar criação", async () => {
    (API.ExportacaoDados.postCreateExportacaoVagasProcesso as jest.Mock).mockReturnValue({
      response: Promise.reject({ response: { status: 404 } }),
      abort: jest.fn(),
    });

    const result = setup();
    await act(async () => {
      result.current.handleProcessoChange("proc-1");
    });
    await waitFor(() => {
      expect(result.current.cargosOptions.length).toBeGreaterThan(0);
    });

    await act(async () => {
      result.current.handleExportar({
        processo_uuid: "proc-1",
        cargo_uuid: "cargo-1",
      });
    });

    await waitFor(() => {
      expect(mockNotification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Erro na exportação",
          description: "Processo ou cargo não encontrado.",
        }),
      );
    });
  });

  it("exibe erro 502 e detail ao falhar criação", async () => {
    (API.ExportacaoDados.postCreateExportacaoVagasProcesso as jest.Mock).mockReturnValue({
      response: Promise.reject({
        response: { status: 502, data: { detail: "Mensagem específica" } },
      }),
      abort: jest.fn(),
    });

    const result = setup();
    await act(async () => {
      result.current.handleProcessoChange("proc-1");
    });
    await waitFor(() => {
      expect(result.current.cargosOptions.length).toBeGreaterThan(0);
    });

    await act(async () => {
      result.current.handleExportar({
        processo_uuid: "proc-1",
        cargo_uuid: "cargo-1",
      });
    });

    await waitFor(() => {
      expect(mockNotification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Serviço temporariamente indisponível. Tente novamente mais tarde.",
        }),
      );
    });
  });

  it("realiza download com sucesso", async () => {
    const result = setup();

    await act(async () => {
      await result.current.handleDownload("uuid-1");
    });

    expect(API.ExportacaoDados.downloadExportacao).toHaveBeenCalledWith(
      "vagas-processo",
      "uuid-1",
    );
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });

  it("chama download com tipo vagas-sigpec", async () => {
    const result = setup("vagas-sigpec");

    await act(async () => {
      await result.current.handleDownload("uuid-2");
    });

    expect(API.ExportacaoDados.downloadExportacao).toHaveBeenCalledWith(
      "vagas-sigpec",
      "uuid-2",
    );
  });

  it("exibe erro ao falhar download quando response.data tem detail", async () => {
    (API.ExportacaoDados.downloadExportacao as jest.Mock).mockReturnValue({
      response: Promise.reject({
        response: { data: { detail: "Erro detalhado" } },
      }),
      abort: jest.fn(),
    });

    const result = setup();

    await act(async () => {
      await result.current.handleDownload("uuid-erro");
    });

    await waitFor(() => {
      expect(mockNotification.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Erro no download",
          description: "Erro detalhado",
        }),
      );
    });
  });
});
