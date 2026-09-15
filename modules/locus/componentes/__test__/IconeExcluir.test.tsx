import { render } from "@testing-library/react";
import { IconeExcluir } from "../IconeExcluir";
import { ComTema } from "@locus/testes/renderizarComTema";

describe("IconeExcluir", () => {
  it("renderiza o icone de lixeira outline do MUI", () => {
    const { container } = render(
      <ComTema>
        <IconeExcluir />
      </ComTema>,
    );
    expect(
      container.querySelector('[data-testid="DeleteOutlineIcon"]'),
    ).toBeInTheDocument();
  });

  it("aceita fontSize inherit para uso no menu", () => {
    const { container } = render(
      <ComTema>
        <IconeExcluir fontSize="inherit" />
      </ComTema>,
    );
    expect(
      container.querySelector('[data-testid="DeleteOutlineIcon"]'),
    ).toBeInTheDocument();
  });
});
