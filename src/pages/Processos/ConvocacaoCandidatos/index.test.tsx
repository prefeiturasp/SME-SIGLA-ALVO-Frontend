// src/pages/ProcessosConvocacao/ProcessosConvocacaoContainer.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// 📌 Mock do hook
vi.mock("./hooks/useProcessosConvocacao", () => ({
  useProcessosConvocacao: vi.fn()
}));

// 📌 Mock da View
vi.mock("./view/ProcessosConvocacaoView", () => ({
  __esModule: true,
  default: vi.fn(() => <div>Mocked View</div>)
}));

import { useProcessosConvocacao } from "./hooks/useProcessosConvocacao";
import ProcessosConvocacaoView from "./view/ProcessosConvocacaoView";
import ProcessosConvocacaoContainer from "./index";

describe("ProcessosConvocacaoContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("chama o hook e renderiza a view com as props corretas", () => {
    const mockData = {
      concursosOptions: [{ value: "1", label: "Concurso 1" }],
      concursosIsLoading: false,
      processosConvocacaoData: { results: [], count: 0 },
      processosConvocacaoIsLoading: false,
      listRequest: { pagination: { page: 1, page_size: 10 } },
      onAntTableChange: vi.fn(),
      handleSub: vi.fn()
    };

    (useProcessosConvocacao as vi.Mock).mockReturnValue(mockData);

    render(<ProcessosConvocacaoContainer />);

    expect(useProcessosConvocacao).toHaveBeenCalledTimes(1);
    expect(ProcessosConvocacaoView).toHaveBeenCalledWith(
      {
        handleSub: mockData.handleSub,
        concursosIsLoading: mockData.concursosIsLoading,
        concursosOptions: mockData.concursosOptions,
        onAntTableChange: mockData.onAntTableChange,
        processosConvocacaoData: mockData.processosConvocacaoData,
        processosLoading: mockData.processosConvocacaoIsLoading,
        listRequest: mockData.listRequest
      },
      undefined
    );

    expect(screen.getByText("Mocked View")).toBeInTheDocument();
  });
});
