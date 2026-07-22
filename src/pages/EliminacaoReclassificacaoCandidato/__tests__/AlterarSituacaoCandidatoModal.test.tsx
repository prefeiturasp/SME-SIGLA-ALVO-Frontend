import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AlterarSituacaoCandidatoModal from "../components/AlterarSituacaoCandidatoModal";

const mockEliminar = jest.fn();
const mockReclassificar = jest.fn();

jest.mock("../hooks/usePostHabilitadoEliminar", () => ({
  usePostHabilitadoEliminar: () => ({ mutateAsync: (...a: unknown[]) => mockEliminar(...a) }),
}));
jest.mock("../hooks/usePostReclassificarCandidato", () => ({
  usePostReclassificarCandidato: () => ({ mutateAsync: (...a: unknown[]) => mockReclassificar(...a) }),
}));

const baseProps = {
  open: true,
  nomeCandidato: "João",
  candidatoUuid: "cand-1",
  situacaoInicial: "Ativo",
  onCancel: jest.fn(),
  onSave: jest.fn(),
};

const abrirSelect = () => {
  // O select do antd expõe o combobox; abrir para revelar as opções.
  fireEvent.mouseDown(screen.getByRole("combobox"));
};

describe("AlterarSituacaoCandidatoModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReclassificar.mockResolvedValue({});
    mockEliminar.mockResolvedValue({});
  });

  it("não mostra o checkbox 'Mandado judicial' sem reclassificação", () => {
    render(<AlterarSituacaoCandidatoModal {...baseProps} />);
    expect(screen.queryByText("Mandado judicial")).not.toBeInTheDocument();
  });

  it("mostra o checkbox quando há reclassificação reversível", () => {
    render(
      <AlterarSituacaoCandidatoModal
        {...baseProps}
        reclassificacoes={[{ desclassificado_de: "NNA", mandado_judicial: false }]}
      />
    );
    expect(screen.getByText("Mandado judicial")).toBeInTheDocument();
  });

  it("não mostra o checkbox se todas reclassificações já foram revertidas por mandado", () => {
    render(
      <AlterarSituacaoCandidatoModal
        {...baseProps}
        reclassificacoes={[{ desclassificado_de: "NNA", mandado_judicial: true }]}
      />
    );
    expect(screen.queryByText("Mandado judicial")).not.toBeInTheDocument();
  });

  it("ao marcar mandado, o select mostra 'Reclassificar para {categoria}'", () => {
    render(
      <AlterarSituacaoCandidatoModal
        {...baseProps}
        reclassificacoes={[{ desclassificado_de: "NNA", mandado_judicial: false }]}
      />
    );
    fireEvent.click(screen.getByText("Mandado judicial"));
    abrirSelect();
    expect(screen.getByText("Reclassificar para NNA")).toBeInTheDocument();
    expect(screen.queryByText("Eliminar")).not.toBeInTheDocument();
  });

  it("salvar com mandado envia mandado_judicial=true", async () => {
    render(
      <AlterarSituacaoCandidatoModal
        {...baseProps}
        reclassificacoes={[{ desclassificado_de: "NNA", mandado_judicial: false }]}
      />
    );
    fireEvent.click(screen.getByText("Mandado judicial"));
    abrirSelect();
    fireEvent.click(screen.getByText("Reclassificar para NNA"));
    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() =>
      expect(mockReclassificar).toHaveBeenCalledWith(
        expect.objectContaining({
          candidato_uuid: "cand-1",
          desclassificar_de: "NNA",
          mandado_judicial: true,
        })
      )
    );
  });

  it("sem mandado, desclassificar NNA envia sem mandado_judicial", async () => {
    render(<AlterarSituacaoCandidatoModal {...baseProps} hasNNA />);
    abrirSelect();
    fireEvent.click(screen.getByText("Desclassificar NNA"));
    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() =>
      expect(mockReclassificar).toHaveBeenCalledWith(
        expect.objectContaining({ candidato_uuid: "cand-1", desclassificar_de: "NNA" })
      )
    );
    expect(mockReclassificar.mock.calls[0][0]).not.toHaveProperty("mandado_judicial");
  });
});
