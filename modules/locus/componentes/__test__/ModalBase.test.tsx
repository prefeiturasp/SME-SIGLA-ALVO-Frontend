import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalBase } from "../ModalBase";
import { ComProvedores } from "@locus/testes/renderizarComTema";

interface Opcoes {
  aberto?: boolean;
  confirmando?: boolean;
  aoConfirmar?: jest.Mock;
  aoCancelar?: jest.Mock;
}

function renderizarModal({
  aberto = true,
  confirmando = false,
  aoConfirmar = jest.fn(),
  aoCancelar = jest.fn(),
}: Opcoes = {}) {
  render(
    <ComProvedores>
      <ModalBase
        aberto={aberto}
        titulo="Excluir Unidade Educacional"
        mensagem="A ação não poderá ser desfeita e as informações serão deletadas. Tem certeza que deseja continuar?"
        textoConfirmar="Excluir UE"
        perigo
        confirmando={confirmando}
        aoConfirmar={aoConfirmar}
        aoCancelar={aoCancelar}
      />
    </ComProvedores>,
  );
  return { aoConfirmar, aoCancelar };
}

describe("ModalBase", () => {
  it("nao renderiza quando fechado", () => {
    renderizarModal({ aberto: false });
    expect(
      screen.queryByText("Excluir Unidade Educacional"),
    ).not.toBeInTheDocument();
  });

  it("renderiza titulo e mensagem quando aberto", () => {
    renderizarModal();

    expect(screen.getByText("Excluir Unidade Educacional")).toBeInTheDocument();
    expect(
      screen.getByText(
        "A ação não poderá ser desfeita e as informações serão deletadas. Tem certeza que deseja continuar?",
      ),
    ).toBeInTheDocument();
  });

  it("dispara os callbacks de confirmar e cancelar", async () => {
    const { aoConfirmar, aoCancelar } = renderizarModal();

    await userEvent.click(screen.getByRole("button", { name: "Excluir UE" }));
    expect(aoConfirmar).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(aoCancelar).toHaveBeenCalledTimes(1);
  });

  it("exibe o botao de confirmacao carregando", () => {
    renderizarModal({ confirmando: true });

    expect(
      screen.getByRole("button", { name: /Excluir UE/ }),
    ).toHaveClass("ant-btn-loading");
  });
});
