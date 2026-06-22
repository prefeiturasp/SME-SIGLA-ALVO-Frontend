import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RelatoriosDetalhados from "../../components/RelatoriosDetalhados";
import type { RelatorioDetalhadoItem } from "../../utils/mapRelatoriosDetalhados";

const relatoriosMock: RelatorioDetalhadoItem[] = [
  {
    key: "1",
    concursoUuid: "uuid-1",
    concurso: "Concurso A",
    cargo: "Professor",
    codigoCargo: 101,
    dre: "Butantã",
    dreOriginal: "Diretoria Regional de Educação Butantã",
    escolhas: 10,
    naoEscolhas: 5,
  },
  {
    key: "2",
    concursoUuid: "uuid-1",
    concurso: "Concurso A",
    cargo: "Coordenador",
    codigoCargo: 102,
    dre: "Centro",
    dreOriginal: "Diretoria Regional de Educação Centro",
    escolhas: 8,
    naoEscolhas: 2,
  },
];

describe("RelatoriosDetalhados", () => {
  it("renderiza tabela com todos os registros e ações de filtro", () => {
    render(<RelatoriosDetalhados data={relatoriosMock} />);

    expect(screen.getByText("Relatórios detalhados")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Professor" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Coordenador" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /filtrar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /limpar filtros/i })).toBeInTheDocument();
  });

  it("não exibe mais as colunas de autorização", () => {
    render(<RelatoriosDetalhados data={relatoriosMock} />);

    expect(screen.queryByRole("columnheader", { name: "Autorizações" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: "Última atualização" })
    ).not.toBeInTheDocument();
  });

  it("mantém todos os registros ao limpar filtros", async () => {
    const user = userEvent.setup();
    render(<RelatoriosDetalhados data={relatoriosMock} />);

    await user.click(screen.getByRole("button", { name: /limpar filtros/i }));

    expect(screen.getByRole("cell", { name: "Professor" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Coordenador" })).toBeInTheDocument();
  });
});
