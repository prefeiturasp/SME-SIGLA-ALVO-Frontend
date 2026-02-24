import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DetalheCartaConvocacaoModal from "../DetalheCartaConvocacaoModal";
import ConteudoEmailModal from "../ConteudoEmailModal";

const mockGetDetalheCartaConvocacao = jest.fn();
jest.mock("../../../../../services", () => ({
  API: {
    Convocacao: {
      getDetalheCartaConvocacao: (...args: unknown[]) =>
        mockGetDetalheCartaConvocacao(...args),
    },
  },
}));

jest.mock("../../../../../components/EstilosCompartilhados", () => ({
  CustomModal2: ({
    children,
    open,
    onCancel,
    title,
  }: {
    children: React.ReactNode;
    open: boolean;
    onCancel: () => void;
    title?: string;
  }) =>
    open ? (
      <div data-testid="custom-modal">
        <span data-testid="modal-title">{title}</span>
        <button type="button" onClick={onCancel} aria-label="Fechar modal">
          Fechar
        </button>
        {children}
      </div>
    ) : null,
}));

const registroBase = {
  uuid: "reg-uuid-1",
  processo_nome: "Processo Teste",
  processo_uuid: "proc-uuid",
  data: "15-01-2025",
  quantidade_convocados: 2,
};

const detalheBase = {
  ...registroBase,
  data: "15-01-2025",
  criado_em: "2025-01-15T10:30:00Z",
  candidatos: [
    {
      nome: "Candidato A",
      rf: "123456",
      email: "a@test.com",
      status: "Enviado",
      conteudo: "<p>Olá</p>",
    },
    {
      nome: "Candidato B",
      rf: "789",
      email: "b@test.com",
      status: null as unknown as string,
      conteudo: '<p>src="cid:logo_sigla"</p>',
    },
  ],
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("DetalheCartaConvocacaoModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDetalheCartaConvocacao.mockReturnValue({
      response: Promise.resolve(detalheBase),
      abort: () => {},
    });
  });

  it("não exibe conteúdo quando registro é null", () => {
    render(
      <DetalheCartaConvocacaoModal
        open={true}
        onClose={jest.fn()}
        registro={null}
      />,
      { wrapper }
    );
    expect(screen.getByTestId("custom-modal")).toBeInTheDocument();
    expect(screen.queryByText("Processo")).not.toBeInTheDocument();
    expect(mockGetDetalheCartaConvocacao).not.toHaveBeenCalled();
  });

  it("exibe loading enquanto busca detalhe", async () => {
    let resolvePromise: (v: unknown) => void;
    mockGetDetalheCartaConvocacao.mockReturnValue({
      response: new Promise((r) => {
        resolvePromise = r;
      }),
      abort: () => {},
    });

    render(
      <DetalheCartaConvocacaoModal
        open={true}
        onClose={jest.fn()}
        registro={registroBase}
      />,
      { wrapper }
    );

    expect(document.querySelector(".ant-spin")).toBeInTheDocument();
    resolvePromise!(detalheBase);
  });

  it("exibe Descriptions com dados do detalhe após carregar", async () => {
    render(
      <DetalheCartaConvocacaoModal
        open={true}
        onClose={jest.fn()}
        registro={registroBase}
      />,
      { wrapper }
    );

    expect(await screen.findByText("Processo Teste")).toBeInTheDocument();
    expect(screen.getByText("15/01/2025")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/Enviado em/)).toBeInTheDocument();
    expect(screen.getByText("Candidatos")).toBeInTheDocument();
    expect(screen.getByText("Candidato A")).toBeInTheDocument();
    expect(screen.getByText("Candidato B")).toBeInTheDocument();
  });

  it("exibe travessão quando data do detalhe é undefined", async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    mockGetDetalheCartaConvocacao.mockReturnValue({
      response: Promise.resolve({
        ...detalheBase,
        data: undefined as unknown as string,
        candidatos: [],
      }),
      abort: () => {},
    });

    render(
      <QueryClientProvider client={client}>
        <DetalheCartaConvocacaoModal
          open={true}
          onClose={jest.fn()}
          registro={registroBase}
        />
      </QueryClientProvider>
    );

    await screen.findByText("Processo Teste");
    const items = document.querySelectorAll(".ant-descriptions-item-content");
    const dataItem = Array.from(items).find(
      (el) => el.previousElementSibling?.textContent === "Data"
    );
    expect(dataItem?.textContent).toBe("—");
  });

  it("usa processo_nome e quantidade do registro quando detalhe não tem", async () => {
    mockGetDetalheCartaConvocacao.mockReturnValue({
      response: Promise.resolve({
        uuid: registroBase.uuid,
        processo_nome: "",
        processo_uuid: registroBase.processo_uuid,
        data: "20-02-2025",
        quantidade_convocados: undefined as unknown as number,
        candidatos: [],
      }),
      abort: () => {},
    });

    render(
      <DetalheCartaConvocacaoModal
        open={true}
        onClose={jest.fn()}
        registro={registroBase}
      />,
      { wrapper }
    );

    await screen.findByText("Processo Teste");
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("não exibe tabela de candidatos quando lista é vazia", async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    mockGetDetalheCartaConvocacao.mockReturnValue({
      response: Promise.resolve({ ...detalheBase, candidatos: [] }),
      abort: () => {},
    });

    render(
      <QueryClientProvider client={client}>
        <DetalheCartaConvocacaoModal
          open={true}
          onClose={jest.fn()}
          registro={{ ...registroBase, uuid: "reg-uuid-vazio" }}
        />
      </QueryClientProvider>
    );

    await screen.findByText("Processo Teste");
    expect(screen.queryByText("Candidatos")).not.toBeInTheDocument();
  });

  it("coluna Status exibe travessão quando valor é nulo", async () => {
    render(
      <DetalheCartaConvocacaoModal
        open={true}
        onClose={jest.fn()}
        registro={registroBase}
      />,
      { wrapper }
    );

    await screen.findByText("Candidato A");
    const cells = document.querySelectorAll(".ant-table-cell");
    const travessoes = Array.from(cells).filter((c) => c.textContent === "—");
    expect(travessoes.length).toBeGreaterThanOrEqual(1);
  });

  it("abre ConteudoEmailModal ao clicar no ícone de visualizar e-mail", async () => {
    render(
      <DetalheCartaConvocacaoModal
        open={true}
        onClose={jest.fn()}
        registro={registroBase}
      />,
      { wrapper }
    );

    await screen.findByText("Candidato A");
    const icones = document.querySelectorAll(".anticon-eye");
    fireEvent.click(icones[0]);

    expect(screen.getByText("E-mail enviado para Candidato A")).toBeInTheDocument();
  });

  it("chama onClose ao fechar o modal", async () => {
    const onClose = jest.fn();
    render(
      <DetalheCartaConvocacaoModal
        open={true}
        onClose={onClose}
        registro={registroBase}
      />,
      { wrapper }
    );

    await screen.findByText("Processo Teste");
    fireEvent.click(screen.getByLabelText("Fechar modal"));
    expect(onClose).toHaveBeenCalled();
  });
});

describe("ConteudoEmailModal", () => {
  it("exibe título com nome do candidato quando nomeCandidato é informado", () => {
    render(
      <ConteudoEmailModal
        open={true}
        onClose={jest.fn()}
        nomeCandidato="João Silva"
        conteudo="<p>Corpo</p>"
      />
    );
    expect(screen.getByText("E-mail enviado para João Silva")).toBeInTheDocument();
  });

  it("exibe título genérico quando nomeCandidato não é informado", () => {
    render(
      <ConteudoEmailModal
        open={true}
        onClose={jest.fn()}
        conteudo="<p>Corpo</p>"
      />
    );
    expect(screen.getByText("Conteúdo do e-mail")).toBeInTheDocument();
  });

  it("substitui src=\"cid:logo_sigla\" pelo logo no conteúdo", () => {
    const { container } = render(
      <ConteudoEmailModal
        open={true}
        onClose={jest.fn()}
        conteudo='<img src="cid:logo_sigla" />'
      />
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBeTruthy();
    expect(img?.getAttribute("src")).not.toBe("cid:logo_sigla");
  });

  it("substitui src='cid:logo_sigla' (aspas simples) pelo logo no conteúdo", () => {
    const { container } = render(
      <ConteudoEmailModal
        open={true}
        onClose={jest.fn()}
        conteudo={"<img src='cid:logo_sigla' />"}
      />
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBeTruthy();
    expect(img?.getAttribute("src")).not.toContain("cid:logo_sigla");
  });

  it("exibe mensagem quando conteúdo está vazio", () => {
    render(
      <ConteudoEmailModal open={true} onClose={jest.fn()} conteudo="" />
    );
    expect(screen.getByText("Nenhum conteúdo disponível.")).toBeInTheDocument();
  });

  it("exibe mensagem quando conteúdo não é string", () => {
    render(
      <ConteudoEmailModal
        open={true}
        onClose={jest.fn()}
        conteudo={null as unknown as string}
      />
    );
    expect(screen.getByText("Nenhum conteúdo disponível.")).toBeInTheDocument();
  });

  it("não renderiza conteúdo do modal quando open é false", () => {
    const { container } = render(
      <ConteudoEmailModal
        open={false}
        onClose={jest.fn()}
        conteudo="<p>Oculto</p>"
      />
    );
    expect(container.querySelector(".ant-modal")).toBeNull();
  });

  it("chama onClose ao cancelar", () => {
    const onClose = jest.fn();
    render(
      <ConteudoEmailModal
        open={true}
        onClose={onClose}
        conteudo="<p>x</p>"
      />
    );
    fireEvent.click(screen.getByLabelText("Fechar modal"));
    expect(onClose).toHaveBeenCalled();
  });
});
