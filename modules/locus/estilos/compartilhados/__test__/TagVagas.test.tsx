import { render, screen } from "@testing-library/react";
import { TagVagas } from "@locus/estilos";
import { ComTema } from "@locus/testes/renderizarComTema";

describe("TagVagas", () => {
  it("mostra '+N disponíveis' em verde quando o saldo e positivo", () => {
    render(
      <ComTema>
        <TagVagas saldo={5} />
      </ComTema>,
    );
    const chip = screen.getByText("+5 disponíveis");
    expect(chip).toBeInTheDocument();
    expect(chip.closest("[data-situacao]")).toHaveAttribute(
      "data-situacao",
      "disponivel",
    );
  });

  it("mostra '-N excedentes' quando o saldo e negativo", () => {
    render(
      <ComTema>
        <TagVagas saldo={-4} />
      </ComTema>,
    );
    const chip = screen.getByText("-4 excedentes");
    expect(chip).toBeInTheDocument();
    expect(chip.closest("[data-situacao]")).toHaveAttribute(
      "data-situacao",
      "excedente",
    );
  });

  it("mostra 'Completo' quando o saldo e zero", () => {
    render(
      <ComTema>
        <TagVagas saldo={0} />
      </ComTema>,
    );
    const chip = screen.getByText("Completo");
    expect(chip).toBeInTheDocument();
    expect(chip.closest("[data-situacao]")).toHaveAttribute(
      "data-situacao",
      "completo",
    );
  });
});
