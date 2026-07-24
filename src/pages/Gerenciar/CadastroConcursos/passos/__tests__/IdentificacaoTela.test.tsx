import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import IdentificacaoTela from "../IdentificacaoTela";
import type { IConcursoDetalhe } from "../../../../../services/resources/concursos/IConcursos";

const mockNavigate = jest.fn();
const mockPost = jest.fn();
const mockPatch = jest.fn();
let mockConcursoRetornado: IConcursoDetalhe | undefined;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../hooks/usePostConcurso", () => ({
  usePostConcurso: () => ({ mutate: mockPost, isPending: false }),
}));

jest.mock("../../hooks/usePatchConcurso", () => ({
  usePatchConcurso: () => ({ mutate: mockPatch, isPending: false }),
}));

jest.mock(
  "../../../../GerenciamentoVagas/hooks/useGetConcursoPorUuid",
  () => ({
    useGetConcursoByUuid: (uuid: string) => ({
      concursoData: uuid ? mockConcursoRetornado : undefined,
      concursoIsLoading: false,
    }),
  })
);

jest.mock("../../../../Base/BaseTela", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="base-tela">{children}</div>
  ),
}));

// Formulário simplificado: expõe os valores do react-hook-form como texto e
// permite editar a banca, sem depender dos componentes do antd.
jest.mock("../../components/FormConcurso", () => {
  const { Controller } = jest.requireActual("react-hook-form");
  return {
    __esModule: true,
    default: ({ control }: { control: Record<string, unknown> }) => (
      <>
        <pre data-testid="valores-form">
          {JSON.stringify((control as { _formValues: unknown })._formValues)}
        </pre>
        <Controller
          control={control}
          name="banca_responsavel"
          render={({ field }: { field: Record<string, unknown> }) => (
            <input aria-label="Banca responsável" {...field} />
          )}
        />
      </>
    ),
  };
});

jest.mock("../../components/StepActionsConcurso", () => ({
  StepActionsConcurso: ({
    next,
    prev,
  }: {
    next: () => void;
    prev: () => void;
  }) => (
    <>
      <button onClick={next}>Próximo</button>
      <button onClick={prev}>Anterior</button>
    </>
  ),
}));

const concurso: IConcursoDetalhe = {
  uuid: "u1",
  nome: "Concurso 2026",
  cargos: [{ uuid: "c1", nome: "Professor", codigo: 10 }],
  numero_processo: "6016202200779764",
  codigo: null,
  banca_responsavel: "FGV",
  status: "ATIVO",
  situacao: "INCOMPLETO",
  data_autorizacao: null,
  data_abertura: null,
  classificacao_final: null,
  link_edital: "",
  habilitados_geral: null,
  habilitados_nna: null,
  habilitados_pcd: null,
  retificacoes: "",
  data_homologacao: null,
  data_prorrogacao: null,
  vigencia_inicio: null,
  vigencia_fim: null,
};

const renderizarEm = (rota: string, padraoRota: string) =>
  render(
    <MemoryRouter initialEntries={[rota]}>
      <Routes>
        <Route path={padraoRota} element={<IdentificacaoTela />} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
  mockConcursoRetornado = concurso;
});

const esperarFormularioCarregado = async () =>
  waitFor(() =>
    expect(screen.getByTestId("valores-form").textContent).toContain(
      "Concurso 2026"
    )
  );

describe("IdentificacaoTela — retorno ao passo 1 durante a adição", () => {
  it("preenche o formulário com o rascunho já salvo", async () => {
    renderizarEm(
      "/gerenciar/concursos/adicionar/u1/passo-1",
      "/gerenciar/concursos/adicionar/:uuid/passo-1"
    );

    await waitFor(() => {
      const valores = JSON.parse(
        screen.getByTestId("valores-form").textContent ?? "{}"
      );
      expect(valores).toEqual({
        cargos_ids: ["c1"],
        nome: "Concurso 2026",
        numero_processo: "6016202200779764",
        banca_responsavel: "FGV",
        status: "ATIVO",
      });
    });
  });

  it("atualiza o rascunho via PATCH, sem criar outro concurso", async () => {
    renderizarEm(
      "/gerenciar/concursos/adicionar/u1/passo-1",
      "/gerenciar/concursos/adicionar/:uuid/passo-1"
    );
    await esperarFormularioCarregado();

    await userEvent.clear(screen.getByLabelText("Banca responsável"));
    await userEvent.type(
      screen.getByLabelText("Banca responsável"),
      "Vunesp"
    );
    await userEvent.click(screen.getByText("Próximo"));

    await waitFor(() => expect(mockPatch).toHaveBeenCalled());
    expect(mockPost).not.toHaveBeenCalled();

    const [args] = mockPatch.mock.calls[0];
    expect(args.uuid).toBe("u1");
    expect(args.payload).toEqual({
      nome: "Concurso 2026",
      cargos_ids: ["c1"],
      numero_processo: "6016202200779764",
      banca_responsavel: "Vunesp",
      status: "ATIVO",
    });
    expect(args.payload).not.toHaveProperty("situacao");
  });

  it("navega direto ao passo 2 quando nada foi alterado", async () => {
    renderizarEm(
      "/gerenciar/concursos/adicionar/u1/passo-1",
      "/gerenciar/concursos/adicionar/:uuid/passo-1"
    );
    await esperarFormularioCarregado();

    await userEvent.click(screen.getByText("Próximo"));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        "/gerenciar/concursos/adicionar/u1/passo-2",
        expect.anything()
      )
    );
    expect(mockPatch).not.toHaveBeenCalled();
    expect(mockPost).not.toHaveBeenCalled();
  });
});

describe("IdentificacaoTela — cadastro novo", () => {
  beforeEach(() => {
    mockConcursoRetornado = undefined;
  });

  it("mantém o formulário vazio quando não há uuid na rota", () => {
    renderizarEm(
      "/gerenciar/concursos/adicionar/passo-1",
      "/gerenciar/concursos/adicionar/passo-1"
    );

    const valores = JSON.parse(
      screen.getByTestId("valores-form").textContent ?? "{}"
    );
    expect(valores.nome).toBe("");
    expect(valores.cargos_ids).toEqual([]);
    expect(valores.banca_responsavel).toBe("");
  });

  it("não envia nada enquanto o formulário está inválido", async () => {
    renderizarEm(
      "/gerenciar/concursos/adicionar/passo-1",
      "/gerenciar/concursos/adicionar/passo-1"
    );

    await userEvent.click(screen.getByText("Próximo"));

    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockPatch).not.toHaveBeenCalled();
  });
});
