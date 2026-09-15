import { render, screen } from "@testing-library/react";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { CardDados } from "../CardDados";
import { ComTema } from "@locus/testes/renderizarComTema";

describe("CardDados", () => {
  it("renderiza valor, titulo e descricao", () => {
    render(
      <ComTema>
        <CardDados
          valor={105}
          titulo="Módulos"
          descricao="Quantidade de vagas disponibilizadas"
          icone={<GroupsOutlinedIcon />}
        />
      </ComTema>,
    );

    expect(screen.getByText("105")).toBeInTheDocument();
    expect(screen.getByText("Módulos")).toBeInTheDocument();
    expect(
      screen.getByText("Quantidade de vagas disponibilizadas"),
    ).toBeInTheDocument();
  });
});
