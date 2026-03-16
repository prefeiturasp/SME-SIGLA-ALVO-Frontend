import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HistoricoExportacaoCandidatosModal from "../HistoricoExportacaoCandidatosModal";
import type { IExportacaoCandidatosListItem } from "../../../../services/resources/exportacaoDados/types";

const mockHandleDownload = jest.fn();

jest.mock("../../hooks/useExportacaoCandidatos", () => ({
  useExportacaoCandidatos: jest.fn(() => ({
    listData: {
      count: 2,
      results: [
        {
          uuid: "1",
          criado_em: "2024-01-01T10:00:00Z",
          processo_nome: "Processo 1",
          concurso_nome: "Concurso 1",
          cargo_nome: "Cargo 1",
        } as IExportacaoCandidatosListItem,
        {
          uuid: "2",
          criado_em: null,
          processo_nome: null,
          concurso_nome: null,
          cargo_nome: null,
        } as unknown as IExportacaoCandidatosListItem,
      ],
    },
    listLoading: false,
    listRequest: { pagination: { page: 1, page_size: 10 } },
    onAntTableChange: jest.fn(),
    handleDownload: mockHandleDownload,
  })),
}));

jest.mock("../../../../components/EstilosCompartilhados", () => ({
  StyledTable: ({ columns, dataSource, rowClassName, ...props }: any) => (
    <table data-testid="styled-table" {...props}>
      <thead>
        <tr>
          {columns.map((col: any) => (
            <th key={col.key || col.dataIndex}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((record: any, rowIndex: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <tr key={rowIndex} data-testid={`row-${rowIndex}`} className={rowClassName(record, rowIndex)}>
            {columns.map((col: any, colIndex: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <td key={colIndex}>
                {col.render ? col.render(record[col.dataIndex], record) : record[col.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

jest.mock("antd", () => {
  const original = jest.requireActual("antd");
  return {
    ...original,
    Modal: ({ open, children, title, onCancel }: any) =>
      open ? (
        <div data-testid="modal">
          <button type="button" onClick={onCancel}>
            close
          </button>
          <div data-testid="modal-title">{title}</div>
          {children}
        </div>
      ) : null,
    Typography: {
      Text: ({ children, ...rest }: any) => (
        <span data-testid="typography-text" {...rest}>
          {children}
        </span>
      ),
    },
    Button: ({ children, onClick, "aria-label": ariaLabel }: any) => (
      <button type="button" onClick={onClick} aria-label={ariaLabel}>
        {children}
      </button>
    ),
  };
});

jest.mock("@ant-design/icons", () => ({
  CloudDownloadOutlined: () => <span data-testid="download-icon" />,
}));

describe("HistoricoExportacaoCandidatosModal", () => {
  it("deve renderizar título correto", () => {
    render(<HistoricoExportacaoCandidatosModal open onClose={jest.fn()} />);

    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Histórico de exportações - Candidatos Processo",
    );
  });

  it("deve renderizar tabela com linhas alternadas e dados formatados", () => {
    render(<HistoricoExportacaoCandidatosModal open onClose={jest.fn()} />);

    expect(screen.getByTestId("styled-table")).toBeInTheDocument();

    const row0 = screen.getByTestId("row-0");
    const row1 = screen.getByTestId("row-1");

    expect(row0).toHaveClass("row-white");
    expect(row1).toHaveClass("row-gray");

    expect(screen.getByText("Processo 1")).toBeInTheDocument();
    expect(screen.getByText("Concurso 1")).toBeInTheDocument();
    expect(screen.getByText("Cargo 1")).toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("deve chamar handleDownload ao clicar no botão de download", async () => {
    const user = userEvent.setup();
    render(<HistoricoExportacaoCandidatosModal open onClose={jest.fn()} />);

    const buttons = screen.getAllByLabelText("Download");
    await user.click(buttons[0]);

    expect(mockHandleDownload).toHaveBeenCalledWith("1");
  });

  it("deve chamar onClose ao fechar o modal", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(<HistoricoExportacaoCandidatosModal open onClose={onClose} />);

    await user.click(screen.getByText("close"));
    expect(onClose).toHaveBeenCalled();
  });
});

