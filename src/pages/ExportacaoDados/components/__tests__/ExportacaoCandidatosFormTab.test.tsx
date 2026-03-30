import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import ExportacaoCandidatosFormTab from "../ExportacaoCandidatosFormTab";

const mockHandleSubmit = jest.fn((cb) => cb);
const mockHandleExportar = jest.fn();
const mockHandleProcessoChange = jest.fn();
const mockHandleDownload = jest.fn();
const mockOnAntTableChange = jest.fn();

jest.mock("../../hooks/useExportacaoCandidatos", () => ({
  useExportacaoCandidatos: jest.fn(() => ({
    control: {},
    formErrors: {},
    handleSubmit: mockHandleSubmit,
    handleExportar: mockHandleExportar,
    handleProcessoChange: mockHandleProcessoChange,
    handleDownload: mockHandleDownload,
    processosOptions: [
      { value: "proc-1", label: "Processo 1" },
      { value: "proc-2", label: "Processo 2" },
    ],
    processosOptionsLoading: false,
    cargosOptions: [
      { value: "cargo-1", label: "Cargo 1" },
      { value: "cargo-2", label: "Cargo 2" },
    ],
    cargosOptionsLoading: false,
    processoUuid: "proc-1",
    listData: { results: [], count: 0 },
    listLoading: false,
    listRequest: { pagination: { page: 1, page_size: 10 } },
    onAntTableChange: mockOnAntTableChange,
    isCreating: false,
  })),
}));

jest.mock("react-hook-form", () => ({
  Controller: ({ render, name }: any) => (
    <div data-testid={`controller-${name}`}>
      {render({ field: { value: undefined, onChange: jest.fn() } })}
    </div>
  ),
}));

jest.mock("../../../../components/EstilosCompartilhados", () => ({
  TabContentContainer: ({ children }: any) => (
    <div data-testid="tab-content">{children}</div>
  ),
  ActionButtonsContainer: ({ children }: any) => (
    <div data-testid="action-buttons">{children}</div>
  ),
  StyledSelect: ({ children, onChange, value, disabled }: any) => (
    <select
      aria-label="select"
      value={value ?? ""}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="" />
      {children}
    </select>
  ),
  StyledTable: ({ columns, dataSource }: any) => (
    <table data-testid="styled-table">
      <thead>
        <tr>
          {columns.map((col: any) => (
            <th key={col.key || col.dataIndex}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((row: any, index: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <tr key={index}>
            {columns.map((col: any) => (
              <td key={col.key || col.dataIndex}>
                {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

jest.mock("../../../../components/FormStyle", () => ({
  CustomFormItem: ({ children, label, help }: any) => (
    <div data-testid="custom-form-item">
      {label && <label>{label}</label>}
      {help && <span data-testid="help">{help}</span>}
      {children}
    </div>
  ),
}));

jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  return {
    ...actual,
    Row: ({ children }: any) => <div data-testid="row">{children}</div>,
    Col: ({ children }: any) => <div data-testid="col">{children}</div>,
    Modal: ({ open, children }: any) => (open ? <div data-testid="modal">{children}</div> : null),
    Button: ({ children, onClick, disabled, ...props }: any) => (
      <button type="button" onClick={onClick} disabled={disabled} {...props}>
        {children}
      </button>
    ),
    Typography: {
      Text: ({ children }: any) => <span>{children}</span>,
      Title: ({ children }: any) => <h1>{children}</h1>,
    },
    Select: {
      Option: ({ children, value }: any) => <option value={value}>{children}</option>,
    },
  };
});

const renderComponent = (
  props?: Partial<React.ComponentProps<typeof ExportacaoCandidatosFormTab>>,
) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ExportacaoCandidatosFormTab {...props} />
      </BrowserRouter>
    </QueryClientProvider>,
  );
};

describe("ExportacaoCandidatosFormTab", () => {
  const defaultProps: Partial<React.ComponentProps<typeof ExportacaoCandidatosFormTab>> = {
    canViewExportacaoCandidatosProcesso: true,
    canAddExportacaoCandidatosProcesso: true,
  };

  it("deve renderizar estrutura básica da aba", () => {
    renderComponent(defaultProps);

    expect(screen.getByTestId("tab-content")).toBeInTheDocument();
    expect(
      screen.getByText(/Selecione o processo e o cargo para exportar os candidatos/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Processo de convocação", { selector: "label" })).toBeInTheDocument();
    expect(screen.getByText("Cargo", { selector: "label" })).toBeInTheDocument();
  });

  it("deve renderizar opções de processo e cargo", () => {
    renderComponent(defaultProps);

    const processoOptions = screen.getAllByText(/Processo 1|Processo 2/);
    const cargoOptions = screen.getAllByText(/Cargo 1|Cargo 2/);

    expect(processoOptions.length).toBeGreaterThan(0);
    expect(cargoOptions.length).toBeGreaterThan(0);
  });

  it("deve chamar handleProcessoChange ao mudar processo", async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps);

    const selectProcesso = screen.getAllByLabelText("select")[0];
    await user.selectOptions(selectProcesso, "proc-2");

    expect(mockHandleProcessoChange).toHaveBeenCalledWith("proc-2");
  });

  it("deve chamar handleSubmit(handleExportar) ao clicar em Exportar", async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps);

    const exportarBtn = screen.getByText("Exportar").closest("button")!;
    await user.click(exportarBtn);

    expect(mockHandleSubmit).toHaveBeenCalledWith(mockHandleExportar);
  });

  it("deve abrir o modal de histórico ao clicar em Histórico", async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps);

    await user.click(screen.getByText("Histórico"));

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("styled-table")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });
});

