import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComProvedores } from "@locus/testes/renderizarComTema";
import { historicoExemplo } from "../dados/dadosEstaticos";
import {
  PainelHistorico,
  formatarDataHistorico,
} from "../componentes/PainelHistorico";

describe("formatarDataHistorico", () => {
  it("formata a data ISO no padrao brasileiro", () => {
    expect(formatarDataHistorico("2026-08-07T12:02:00")).toBe(
      "07/08/2026 12:02",
    );
  });

  it("preenche com zero a esquerda", () => {
    expect(formatarDataHistorico("2026-01-05T09:07:00")).toBe(
      "05/01/2026 09:07",
    );
  });

  it("devolve a entrada quando a data e invalida", () => {
    expect(formatarDataHistorico("data-invalida")).toBe("data-invalida");
  });
});

describe("PainelHistorico", () => {
  it("lista os registros com responsavel e data formatada", () => {
    render(
      <ComProvedores>
        <PainelHistorico
          aberto
          registros={historicoExemplo}
          aoFechar={jest.fn()}
          aoVisualizar={jest.fn()}
        />
      </ComProvedores>,
    );

    expect(
      screen.getByText("Alteração de módulo de biologia"),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Maria Cecília Guimarães"),
    ).toHaveLength(3);
    expect(screen.getByText("07/08/2026 12:02")).toBeInTheDocument();
  });

  it("dispara aoVisualizar com o registro da linha", async () => {
    const aoVisualizar = jest.fn();
    render(
      <ComProvedores>
        <PainelHistorico
          aberto
          registros={historicoExemplo}
          aoFechar={jest.fn()}
          aoVisualizar={aoVisualizar}
        />
      </ComProvedores>,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Visualizar versão de 07/08/2026 11:58",
      }),
    );

    expect(aoVisualizar).toHaveBeenCalledWith(
      expect.objectContaining({ id: "h2" }),
    );
  });
});
