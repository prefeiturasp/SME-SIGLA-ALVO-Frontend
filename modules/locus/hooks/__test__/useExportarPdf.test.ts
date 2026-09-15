import { act, renderHook } from "@testing-library/react";
import { createRef } from "react";
import { useExportarPdf } from "../useExportarPdf";

const mockSave = jest.fn();
const mockAddImage = jest.fn();
const mockAddPage = jest.fn();

jest.mock("html2canvas", () => jest.fn());
jest.mock("jspdf", () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    addImage: mockAddImage,
    addPage: mockAddPage,
    save: mockSave,
  })),
}));

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const html2canvasMock = html2canvas as jest.MockedFunction<typeof html2canvas>;

function criarCanvasMock(larguraPx: number, alturaPx: number) {
  return {
    width: larguraPx,
    height: alturaPx,
    toDataURL: jest.fn(() => "data:image/jpeg;base64,fake"),
  } as unknown as HTMLCanvasElement;
}

describe("useExportarPdf", () => {
  const OriginalImage = global.Image;

  beforeEach(() => {
    jest.clearAllMocks();
    class ImageMock {
      onload: (() => void) | null = null;
      set src(_valor: string) {
        queueMicrotask(() => this.onload?.());
      }
    }
    global.Image = ImageMock as unknown as typeof Image;
  });

  afterEach(() => {
    global.Image = OriginalImage;
  });

  it("nao exporta quando o container e nulo", async () => {
    const { result } = renderHook(() => useExportarPdf());
    const ref = createRef<HTMLElement>();

    await act(async () => {
      await result.current.exportarPdf(ref);
    });

    expect(html2canvasMock).not.toHaveBeenCalled();
    expect(mockSave).not.toHaveBeenCalled();
    expect(result.current.exportando).toBe(false);
  });

  it("gera PDF de uma pagina e usa o nome padrao", async () => {
    html2canvasMock.mockResolvedValue(criarCanvasMock(1900, 1000));
    const { result } = renderHook(() => useExportarPdf());
    const container = document.createElement("div");
    const ref = { current: container };

    await act(async () => {
      await result.current.exportarPdf(ref);
    });

    expect(html2canvasMock).toHaveBeenCalledWith(
      container,
      expect.objectContaining({
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      }),
    );
    expect(jsPDF).toHaveBeenCalledWith({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    expect(mockAddImage).toHaveBeenCalledTimes(1);
    expect(mockAddPage).not.toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalledWith(
      expect.stringMatching(/^relatorio-\d{4}-\d{2}-\d{2}\.pdf$/),
    );
    expect(result.current.exportando).toBe(false);
  });

  it("usa o nome de arquivo informado", async () => {
    html2canvasMock.mockResolvedValue(criarCanvasMock(1900, 800));
    const { result } = renderHook(() => useExportarPdf());
    const ref = { current: document.createElement("div") };

    await act(async () => {
      await result.current.exportarPdf(ref, "relatorio-gestao-unidades");
    });

    expect(mockSave).toHaveBeenCalledWith(
      expect.stringMatching(
        /^relatorio-gestao-unidades-\d{4}-\d{2}-\d{2}\.pdf$/,
      ),
    );
  });

  it("fatia em varias paginas quando o conteudo e alto", async () => {
    html2canvasMock.mockResolvedValue(criarCanvasMock(1900, 5000));
    const fillRect = jest.fn();
    const drawImage = jest.fn();
    const toDataURL = jest.fn(() => "data:image/jpeg;base64,fatia");
    const getContext = jest.fn(() => ({
      fillStyle: "",
      fillRect,
      drawImage,
    }));

    const createElementOriginal = document.createElement.bind(document);
    const createElementSpy = jest
      .spyOn(document, "createElement")
      .mockImplementation(((tagName: string, options?: ElementCreationOptions) => {
        if (tagName === "canvas") {
          return {
            width: 0,
            height: 0,
            getContext,
            toDataURL,
          } as unknown as HTMLCanvasElement;
        }
        return createElementOriginal(tagName, options);
      }) as typeof document.createElement);

    const { result } = renderHook(() => useExportarPdf());
    const ref = { current: createElementOriginal("div") };

    await act(async () => {
      await result.current.exportarPdf(ref, "relatorio-ue-123");
    });

    expect(mockAddImage).toHaveBeenCalled();
    expect(mockAddImage.mock.calls.length).toBeGreaterThan(1);
    expect(mockAddPage).toHaveBeenCalled();
    expect(fillRect).toHaveBeenCalled();
    expect(drawImage).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalledWith(
      expect.stringMatching(/^relatorio-ue-123-\d{4}-\d{2}-\d{2}\.pdf$/),
    );

    createElementSpy.mockRestore();
  });

  it("ignora nova exportacao enquanto uma esta em andamento", async () => {
    let liberarCaptura: (canvas: HTMLCanvasElement) => void = () => undefined;
    html2canvasMock.mockImplementation(
      () =>
        new Promise<HTMLCanvasElement>((resolve) => {
          liberarCaptura = resolve;
        }),
    );

    const { result } = renderHook(() => useExportarPdf());
    const ref = { current: document.createElement("div") };

    let primeira: Promise<void>;
    await act(async () => {
      primeira = result.current.exportarPdf(ref);
    });

    expect(result.current.exportando).toBe(true);

    await act(async () => {
      await result.current.exportarPdf(ref);
    });

    expect(html2canvasMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      liberarCaptura(criarCanvasMock(1900, 500));
      await primeira;
    });

    expect(result.current.exportando).toBe(false);
  });

  it("fatia o PDF mesmo quando o canvas nao tem contexto 2d", async () => {
    html2canvasMock.mockResolvedValue(criarCanvasMock(1900, 5000));
    const toDataURL = jest.fn(() => "data:image/jpeg;base64,fatia");
    const getContext = jest.fn(() => null);

    const createElementOriginal = document.createElement.bind(document);
    const createElementSpy = jest
      .spyOn(document, "createElement")
      .mockImplementation(((tagName: string, options?: ElementCreationOptions) => {
        if (tagName === "canvas") {
          return {
            width: 0,
            height: 0,
            getContext,
            toDataURL,
          } as unknown as HTMLCanvasElement;
        }
        return createElementOriginal(tagName, options);
      }) as typeof document.createElement);

    const { result } = renderHook(() => useExportarPdf());
    const ref = { current: createElementOriginal("div") };

    await act(async () => {
      await result.current.exportarPdf(ref);
    });

    expect(mockAddImage).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalled();

    createElementSpy.mockRestore();
  });
});
