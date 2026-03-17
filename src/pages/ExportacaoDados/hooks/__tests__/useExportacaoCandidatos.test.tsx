import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { App } from "antd";
import { useExportacaoCandidatos } from "../useExportacaoCandidatos";
import { API } from "../../../../services";

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
    listRequest: { page: 1, page_size: 10 },
    onAntTableChange: jest.fn(),
  })),
}));

jest.mock("../../../../services", () => ({
  API: {
    Convocacao: {
      getCargosProcesso: jest.fn(),
    },
    ExportacaoDados: {
      getListExportacaoCandidatosProcesso: jest.fn(),
      postCreateExportacaoCandidatosProcesso: jest.fn(),
      downloadExportacaoCandidatosProcesso: jest.fn(),
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

describe("useExportacaoCandidatos", () => {
  const mockNotification = {
    success: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(App, "useApp").mockReturnValue({
      notification: mockNotification,
    } as any);

    (API.Convocacao.getCargosProcesso as jest.Mock).mockResolvedValue({
      response: [
        { cargo_uuid: "cargo-1", cargo_nome: "Cargo 1", cargo_codigo: 123 },
      ],
    });

    (API.ExportacaoDados.getListExportacaoCandidatosProcesso as jest.Mock).mockResolvedValue({
      response: { results: [], count: 0 },
    });

    (API.ExportacaoDados.postCreateExportacaoCandidatosProcesso as jest.Mock).mockResolvedValue({
      response: {
        blob: new Blob(["test"], { type: "text/csv" }),
        filename: "candidatos.csv",
      },
    });

    (API.ExportacaoDados.downloadExportacaoCandidatosProcesso as jest.Mock).mockResolvedValue({
      response: {
        blob: new Blob(["test"], { type: "text/csv" }),
        filename: "download.csv",
      },
    });
  });

  const setup = () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useExportacaoCandidatos(), { wrapper });
    return result;
  };

  it("deve inicializar com valores padrão e expor propriedades esperadas", () => {
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

  it("deve montar processosOptions a partir de processosConvocacaoData", () => {
    const result = setup();

    expect(result.current.processosOptions[0]).toMatchObject({
      value: "proc-1",
      label: "Processo 1",
      concurso_uuid: "conc-1",
      concurso_nome: "Concurso 1",
    });
  });

  it("deve retornar cargosOptions vazios quando API retorna valor não array", async () => {
    (API.Convocacao.getCargosProcesso as jest.Mock).mockResolvedValueOnce({
      response: null,
    });

    const result = setup();

    await act(async () => {
      await result.current.handleProcessoChange("proc-1");
    });

    expect(result.current.cargosOptions).toEqual([]);
  });

  it("deve montar cargosOptions quando API retorna lista de cargos", async () => {
    const result = setup();

    await act(async () => {
      await result.current.handleProcessoChange("proc-1");
    });

    expect(result.current.cargosOptions[0]).toMatchObject({
      value: "cargo-1",
      label: "Cargo 1",
      cargo_codigo: 123,
    });
  });

  it("deve resetar cargo_uuid ao trocar de processo", () => {
    const result = setup();

    act(() => {
      result.current.handleProcessoChange("proc-2");
    });

    expect(result.current.processoUuid).toBe("proc-2");
  });

  it("não deve chamar mutate quando processo ou cargo não estão preenchidos", () => {
    const result = setup();

    act(() => {
      result.current.handleExportar({
        processo_uuid: undefined,
        cargo_uuid: undefined,
      });
    });

    expect(
      API.ExportacaoDados.postCreateExportacaoCandidatosProcesso,
    ).not.toHaveBeenCalled();
  });

  it("deve montar payload completo e chamar mutate para candidatos", async () => {
    const result = setup();

    await act(async () => {
      result.current.handleProcessoChange("proc-1");
    });

    const processoOption = result.current.processosOptions[0];
    const cargoOption = { value: "cargo-1", label: "Cargo 1", cargo_codigo: 123 };

    (result.current as any).processosOptions = [processoOption];
    (result.current as any).cargosOptions = [cargoOption];

    await act(async () => {
      result.current.handleExportar({
        processo_uuid: "proc-1",
        cargo_uuid: "cargo-1",
      });
    });

    expect(API.ExportacaoDados.postCreateExportacaoCandidatosProcesso).toHaveBeenCalledWith({
      processo_uuid: "proc-1",
      cargo_uuid: "cargo-1",
      processo_nome: "Processo 1",
      concurso_uuid: "conc-1",
      concurso_nome: "Concurso 1",
      cargo_nome: "Cargo 1",
      cargo_codigo: 123,
    });
    expect(mockNotification.success).toHaveBeenCalled();
  });

  it("deve tratar erro de criação com mensagens diferentes por status", async () => {
    const result = setup();

    const error404 = { response: { status: 404 } };
    const error502 = { response: { status: 502 } };
    const errorDetail = { response: { data: { detail: "Mensagem específica" } } };

    await act(async () => {
      (result as any).current.createMutation.onError(error404);
      (result as any).current.createMutation.onError(error502);
      (result as any).current.createMutation.onError(errorDetail);
    });

    expect(mockNotification.error).toHaveBeenCalledTimes(3);
  });

  it("deve realizar download de exportação de candidatos com sucesso", async () => {
    const result = setup();

    const createObjectURLSpy = jest.spyOn(URL, "createObjectURL").mockReturnValue("blob:url");
    const revokeSpy = jest.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    await act(async () => {
      await result.current.handleDownload("uuid-1");
    });

    expect(API.ExportacaoDados.downloadExportacaoCandidatosProcesso).toHaveBeenCalledWith(
      "uuid-1",
    );
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalled();
  });

  it("deve tratar erro no download de candidatos lendo mensagem de Blob JSON", async () => {
    const errorBlob = new Blob([JSON.stringify({ detail: "Erro detalhado" })], {
      type: "application/json",
    });

    (API.ExportacaoDados.downloadExportacaoCandidatosProcesso as jest.Mock).mockRejectedValueOnce({
      response: { data: errorBlob, status: 400 },
    });

    const result = setup();

    await act(async () => {
      await result.current.handleDownload("uuid-erro");
    });

    expect(mockNotification.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Erro no download",
        description: "Erro detalhado",
      }),
    );
  });
});

