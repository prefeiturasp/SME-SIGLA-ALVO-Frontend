import {
  criarPaginacaoPadrao,
  textoContagemPaginacao,
  TAMANHO_PAGINA_PADRAO,
} from "../EstiloCompartilhado";

describe("paginacao compartilhada", () => {
  it("formata o texto padrao de contagem em pt-BR", () => {
    expect(textoContagemPaginacao(5985, [1, 10])).toBe(
      "Mostrando 1-10 de 5.985 registro(s)",
    );
  });

  it("cria configuracao padrao com showTotal e tamanho de pagina", () => {
    const paginacao = criarPaginacaoPadrao({ total: 5985 });

    expect(paginacao.pageSize).toBe(TAMANHO_PAGINA_PADRAO);
    expect(paginacao.showSizeChanger).toBe(false);
    expect(paginacao.showTotal?.(5985, [1, 10])).toBe(
      "Mostrando 1-10 de 5.985 registro(s)",
    );
  });
});
