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

  it("não mostra o checkbox quando o registro mais recente (não o mais antigo) já foi revertido por mandado", () => {
    render(
      <AlterarSituacaoCandidatoModal
        {...baseProps}
        reclassificacoes={[
          { desclassificado_de: "GERAL", nova_classificacao: "NNA", mandado_judicial: true },
          { desclassificado_de: "NNA", nova_classificacao: "GERAL", mandado_judicial: false },
        ]}
      />
    );
    expect(screen.queryByText("Mandado judicial")).not.toBeInTheDocument();
  });

  it("mostra o checkbox quando o registro mais recente é uma nova desclassificação após reversão anterior", () => {
    render(
      <AlterarSituacaoCandidatoModal
        {...baseProps}
        reclassificacoes={[
          { desclassificado_de: "NNA", nova_classificacao: "GERAL", mandado_judicial: false },
          { desclassificado_de: "GERAL", nova_classificacao: "NNA", mandado_judicial: true },
          { desclassificado_de: "NNA", nova_classificacao: "GERAL", mandado_judicial: false },
        ]}
      />
    );
    expect(screen.getByText("Mandado judicial")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Mandado judicial"));
    abrirSelect();
    expect(screen.getByText("Reclassificar para NNA")).toBeInTheDocument();
  });

  it("candidato com NNA e PCD: checkbox aparece mesmo quando o evento mais recente é de PCD, se NNA ainda tem desclassificação ativa", () => {
    // H1 (mais antigo): desclassifica NNA, ainda ativo.
    // H2 (mais recente): desclassifica PCD, também ativo.
    // A categoria mais recente entre TODAS (PCD) não deve "esconder"
    // a reversibilidade de NNA.
    render(
      <AlterarSituacaoCandidatoModal
        {...baseProps}
        reclassificacoes={[
          { desclassificado_de: "PCD", nova_classificacao: "GERAL", mandado_judicial: false },
          { desclassificado_de: "NNA", nova_classificacao: "GERAL", mandado_judicial: false },
        ]}
      />
    );
    expect(screen.getByText("Mandado judicial")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Mandado judicial"));
    abrirSelect();
    expect(screen.getByText("Reclassificar para NNA")).toBeInTheDocument();
    expect(screen.getByText("Reclassificar para PCD")).toBeInTheDocument();
  });

  it("candidato com NNA e PCD: oferece reverter só a categoria ainda ativa quando a outra já foi revertida por mandado", () => {
    // NNA foi revertido por mandado (H2, mais recente para NNA).
    // PCD segue com desclassificação ativa (H1).
    render(
      <AlterarSituacaoCandidatoModal
        {...baseProps}
        reclassificacoes={[
          { desclassificado_de: "GERAL", nova_classificacao: "NNA", mandado_judicial: true },
          { desclassificado_de: "PCD", nova_classificacao: "GERAL", mandado_judicial: false },
          { desclassificado_de: "NNA", nova_classificacao: "GERAL", mandado_judicial: false },
        ]}
      />
    );
    fireEvent.click(screen.getByText("Mandado judicial"));
    abrirSelect();
    expect(screen.getByText("Reclassificar para PCD")).toBeInTheDocument();
    expect(screen.queryByText("Reclassificar para NNA")).not.toBeInTheDocument();
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
