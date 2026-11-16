import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { theme as appTheme } from "../../../../theme";
import { renderWithProviders } from "../../../../test-utils";
import ConvocacaoCandidatosTela from "../ConvocacaoCandidatosTela";

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  const reactActual = jest.requireActual("react");
  return {
    __esModule: true,
    ...actual,
    Controller: ({ render }: any) => {
      const [value, setValue] = reactActual.useState("");
      return render({ field: { value, onChange: setValue } });
    },
  };
});

jest.mock("../hooks/useProcessosConvocacao", () => {
  const dayjs = require("dayjs");
  const concursosOptions = {
    concursos: [{ value: "c1", label: "Concurso 1" }],
    cargos: [{ value: "cg1", label: "Cargo 1" }],
  };
  return {
    __esModule: true,
    useProcessosConvocacao: () => ({
      control: {},
      handleSubmit: (fn: any) => fn,
      formErrors: {},
      concursosOptions,
      concursosOptionsIsLoading: false,
      processosConvocacaoData: { results: [{ uuid: "uuid-1" }], count: 1 },
      processosConvocacaoIsLoading: false,
      listRequest: { pagination: { page: 1 } },
      onAntTableChange: jest.fn(),
      handleSub: jest.fn(),
      handleReset: jest.fn(),
      dayjs: (v?: any) => dayjs(v),
    }),
  };
});

jest.mock("../hooks/usePostFinalizarProcessoConvocacao", () => ({
  usePostFinalizarProcessoConvocacao: () => ({
    mutateAsync: jest.fn(),
  }),
}));

jest.mock("../../../../routes/PermissionContextGuard", () => ({
  useGetPermissions: () => ({
    can: () => true,
  }),
}));

jest.mock("../components/ConvocacaoTable", () => ({
  __esModule: true,
  default: ({ data, onSelectedRowKeysChange }: any) => (
    <div>
      <span>ConvocacaoTable Mock - {data.length} itens</span>
      <button
        type="button"
        data-testid="selecionar-processos"
        onClick={() => onSelectedRowKeysChange?.(["uuid-1", "uuid-2"])}
      >
        Selecionar
      </button>
    </div>
  ),
}));

jest.mock("../components/ConvocacaoFiltros", () => ({
  __esModule: true,
  default: () => <div data-testid="convocacao-filtros" />,
}));

jest.mock("../components/FinalizarProcessoModal", () => ({
  __esModule: true,
  default: () => null,
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ConvocacaoCandidatosTela", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    renderWithProviders(
      <SCThemeProvider theme={appTheme as any}>
        <ConvocacaoCandidatosTela />
      </SCThemeProvider>,
    );

  it("não exibe card de histórico sem processos selecionados", () => {
    renderComponent();

    expect(
      screen.queryByText(
        "Acesse o histórico de convocações dos processos selecionados.",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /histórico de candidatos/i }),
    ).not.toBeInTheDocument();
  });

  it("exibe card de histórico ao selecionar processos e navega ao clicar", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByTestId("selecionar-processos"));

    expect(
      screen.getByText(
        "Acesse o histórico de convocações dos processos selecionados.",
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /histórico de candidatos/i }),
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/processos/convocacao/historico-candidatos",
      { state: { processos_uuids: ["uuid-1", "uuid-2"] } },
    );
  });
});
