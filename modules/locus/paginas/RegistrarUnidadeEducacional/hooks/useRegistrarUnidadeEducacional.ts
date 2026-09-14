import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CAMINHOS } from "@locus/rotas/caminhos";
import { useNotificacao } from "@locus/hooks/useNotificacao";
import { API } from "@locus/servicos";
import {
  LotacaoNaoEncontradaError,
  type PayloadRegistrarUnidade,
} from "@locus/servicos/recursos/unidadesEducacionais";
import {
  caracteristicasPadrao,
  type CaracteristicasPadrao,
} from "../dados/dadosEstaticos";
import {
  MENSAGENS_VALIDACAO,
  validarCodigoLotacaoObrigatorio,
  validarComponenteCurricular,
  validarFormularioRegistro,
} from "@locus/paginas/validacoes/registrarUnidadeEducacional";

export interface DadosUnidade {
  codigoLotacao: string;
  tipoUnidade?: string;
  dre?: string;
  nome: string;
  anoMunicipalizacao?: string;
  motivoNaoContabilizacao?: string;
}

export interface ComponenteCurricularAdicionado {
  id: string;
  componente: string;
  quantidadeModulos: number;
}

export interface EstadoRegistrarUnidadeEducacional {
  dados: DadosUnidade;
  caracteristicas: CaracteristicasPadrao;
  componentes: ComponenteCurricularAdicionado[];
  componenteSelecionado?: string;
  quantidadeModulos: string;
  erroMotivoNaoContabilizacao?: string;
  erroCodigoLotacao?: string;
  erroComponenteCurricular?: string;
  salvando: boolean;
  atualizarDados: (campo: keyof DadosUnidade, valor: string | undefined) => void;
  alternarCaracteristica: (chave: keyof CaracteristicasPadrao) => void;
  definirComponenteSelecionado: (valor?: string) => void;
  definirQuantidadeModulos: (valor: string) => void;
  adicionarComponente: () => void;
  removerComponente: (id: string) => void;
  consultarLotacao: () => Promise<void>;
  cancelar: () => void;
  registrar: () => Promise<void>;
}

let proximoId = 1;

function lotacaoFoiConsultada(dados: DadosUnidade): boolean {
  return Boolean(
    dados.codigoLotacao.trim() &&
      dados.tipoUnidade &&
      dados.dre &&
      dados.nome.trim(),
  );
}

function montarPayloadRegistro(
  dados: DadosUnidade,
  caracteristicas: CaracteristicasPadrao,
  componentes: ComponenteCurricularAdicionado[],
): PayloadRegistrarUnidade {
  return {
    codigoLotacao: dados.codigoLotacao.trim(),
    tipoUnidade: dados.tipoUnidade ?? "",
    dre: dados.dre ?? "",
    nome: dados.nome.trim(),
    anoMunicipalizacao: dados.anoMunicipalizacao,
    escolaMunicipalizada: caracteristicas.escolaMunicipalizada,
    ensinoFundamentalI: caracteristicas.ensinoFundamentalI,
    ejaModular: caracteristicas.ejaModular,
    saoPauloIntegral: caracteristicas.saoPauloIntegral,
    contabilizarUE: caracteristicas.contabilizarUE,
    motivoNaoContabilizacao: dados.motivoNaoContabilizacao,
    componentes: componentes.map(({ componente, quantidadeModulos }) => ({
      componente,
      quantidadeModulos,
    })),
  };
}

export function useRegistrarUnidadeEducacional(): EstadoRegistrarUnidadeEducacional {
  const navigate = useNavigate();
  const notificacao = useNotificacao();
  const [dados, setDados] = useState<DadosUnidade>({
    codigoLotacao: "",
    nome: "",
  });
  const [caracteristicas, setCaracteristicas] =
    useState<CaracteristicasPadrao>(caracteristicasPadrao);
  const [componentes, setComponentes] = useState<
    ComponenteCurricularAdicionado[]
  >([]);
  const [componenteSelecionado, setComponenteSelecionado] = useState<
    string | undefined
  >();
  const [quantidadeModulos, setQuantidadeModulos] = useState("");
  const [erroMotivoNaoContabilizacao, setErroMotivoNaoContabilizacao] =
    useState<string | undefined>();
  const [erroCodigoLotacao, setErroCodigoLotacao] = useState<
    string | undefined
  >();
  const [erroComponenteCurricular, setErroComponenteCurricular] = useState<
    string | undefined
  >();
  const [salvando, setSalvando] = useState(false);

  const limparDadosConsulta = useCallback(() => {
    setDados((atual) => ({
      ...atual,
      tipoUnidade: undefined,
      dre: undefined,
      nome: "",
    }));
  }, []);

  const atualizarDados = useCallback(
    (campo: keyof DadosUnidade, valor: string | undefined) => {
      setDados((atual) => {
        if (campo === "codigoLotacao") {
          return {
            ...atual,
            codigoLotacao: valor ?? "",
            tipoUnidade: undefined,
            dre: undefined,
            nome: "",
          };
        }

        return { ...atual, [campo]: valor };
      });

      if (campo === "codigoLotacao") {
        setErroCodigoLotacao(undefined);
      }

      if (campo === "motivoNaoContabilizacao" && valor?.trim()) {
        setErroMotivoNaoContabilizacao(undefined);
      }
    },
    [],
  );

  const definirComponenteSelecionado = useCallback((valor?: string) => {
    setComponenteSelecionado(valor);
    if (valor) {
      setErroComponenteCurricular(undefined);
    }
  }, []);

  const alternarCaracteristica = useCallback(
    (chave: keyof CaracteristicasPadrao) => {
      setCaracteristicas((atual) => {
        const novoValor = !atual[chave];

        if (chave === "contabilizarUE" && novoValor) {
          setDados((dadosAtuais) => ({
            ...dadosAtuais,
            motivoNaoContabilizacao: undefined,
          }));
          setErroMotivoNaoContabilizacao(undefined);
        }

        return { ...atual, [chave]: novoValor };
      });
    },
    [],
  );

  const adicionarComponente = useCallback(() => {
    const validacaoComponente = validarComponenteCurricular(
      componenteSelecionado,
    );

    if (!validacaoComponente.ok) {
      setErroComponenteCurricular(validacaoComponente.mensagem);
      return;
    }

    setErroComponenteCurricular(undefined);

    if (!componenteSelecionado || quantidadeModulos.trim() === "") return;

    const quantidade = Number(quantidadeModulos);
    if (Number.isNaN(quantidade) || quantidade < 0) return;

    setComponentes((atual) => [
      ...atual,
      {
        id: String(proximoId++),
        componente: componenteSelecionado,
        quantidadeModulos: quantidade,
      },
    ]);
    setComponenteSelecionado(undefined);
    setQuantidadeModulos("");
  }, [componenteSelecionado, quantidadeModulos]);

  const removerComponente = useCallback((id: string) => {
    setComponentes((atual) => atual.filter((item) => item.id !== id));
  }, []);

  const cancelar = useCallback(() => {
    navigate(CAMINHOS.cadastroGestaoUnidades);
  }, [navigate]);

  const consultarLotacao = useCallback(async () => {
    const validacao = validarCodigoLotacaoObrigatorio(dados.codigoLotacao);

    if (!validacao.ok) {
      setErroCodigoLotacao(validacao.mensagem);
      limparDadosConsulta();
      return;
    }

    try {
      const resultado =
        await API.UnidadesEducacionais.consultarLotacao(validacao.codigo!)
          .response;
      setErroCodigoLotacao(undefined);
      setDados((atual) => ({
        ...atual,
        codigoLotacao: resultado.codigoLotacao,
        tipoUnidade: resultado.tipoUnidade,
        dre: resultado.dre,
        nome: resultado.nome,
      }));
    } catch (erro) {
      limparDadosConsulta();
      setErroCodigoLotacao(
        erro instanceof LotacaoNaoEncontradaError
          ? erro.message
          : MENSAGENS_VALIDACAO.codigoLotacaoIncorreto,
      );
    }
  }, [dados.codigoLotacao, limparDadosConsulta]);

  const registrar = useCallback(async () => {
    const validacao = validarFormularioRegistro({
      codigoLotacao: dados.codigoLotacao,
      lotacaoConsultada: lotacaoFoiConsultada(dados),
      contabilizarUE: caracteristicas.contabilizarUE,
      motivoNaoContabilizacao: dados.motivoNaoContabilizacao,
      possuiComponenteCurricular: componentes.length > 0,
    });

    setErroCodigoLotacao(validacao.erroCodigoLotacao);
    setErroMotivoNaoContabilizacao(validacao.erroMotivoNaoContabilizacao);
    setErroComponenteCurricular(validacao.erroComponenteCurricular);

    if (!validacao.ok) {
      return;
    }

    setSalvando(true);
    try {
      const resposta = await API.UnidadesEducacionais.registrar(
        montarPayloadRegistro(dados, caracteristicas, componentes),
      ).response;

      notificacao.sucesso({
        titulo: "Sucesso!",
        texto:
          resposta.mensagem ?? "A unidade educacional foi registrada.",
      });
      navigate(CAMINHOS.cadastroGestaoUnidades);
    } catch {
      notificacao.erro({
        titulo: "Erro",
        texto:
          "Não conseguimos salvar as alterações. Por favor, tente novamente!",
      });
    } finally {
      setSalvando(false);
    }
  }, [dados, caracteristicas, componentes, notificacao, navigate]);

  return useMemo(
    () => ({
      dados,
      caracteristicas,
      componentes,
      componenteSelecionado,
      quantidadeModulos,
      erroMotivoNaoContabilizacao,
      erroCodigoLotacao,
      erroComponenteCurricular,
      salvando,
      atualizarDados,
      alternarCaracteristica,
      definirComponenteSelecionado,
      definirQuantidadeModulos: setQuantidadeModulos,
      adicionarComponente,
      removerComponente,
      consultarLotacao,
      cancelar,
      registrar,
    }),
    [
      dados,
      caracteristicas,
      componentes,
      componenteSelecionado,
      quantidadeModulos,
      erroMotivoNaoContabilizacao,
      erroCodigoLotacao,
      erroComponenteCurricular,
      salvando,
      atualizarDados,
      alternarCaracteristica,
      definirComponenteSelecionado,
      adicionarComponente,
      removerComponente,
      consultarLotacao,
      cancelar,
      registrar,
    ],
  );
}

export default useRegistrarUnidadeEducacional;
