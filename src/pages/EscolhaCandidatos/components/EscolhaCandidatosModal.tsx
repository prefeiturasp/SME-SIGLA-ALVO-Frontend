import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Col, Modal, Spin, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DefaultOptionType } from "antd/es/select";
import type {
  ISalvarEscolhaPayload,
  SituacaoEscolha,
  TipoVagaEscolha,
} from "../../../services/resources/escolhas/IEscolhas";
import type { IVagasResponse } from "../../../services/resources/convocacao/IConvocacao";
import type { EscolhaCandidatosModalProps } from "../hooks/types";
import { API } from "../../../services";
import { useGetVagasPorProcessoECargo } from "../../CriarEditarConvocacao/SelecaoCargos/hooks/useGetVagasPorProcessoECargo";
import type { IAgenda } from "../../../services/resources/agenda/IAgenda";
import {
  ModalButtonContainer,
  modalInlineStyles,
} from "../../CriarEditarConvocacao/SelecaoCargos/styles";
import { usePatchStatusProcessoConvocacao } from "../hooks/usePatchStatusProcessoConvocacao";
import {
  ModalWrapper,
  ModalHeading,
  ModalInfoCard,
  ModalInfoItem,
  ModalInfoLabel,
  ModalInfoValue,
  ModalSection,
  ModalSectionTitle,
  ModalRadioGroup,
  ModalFieldsRow,
  ModalFieldLabel,
  ModalSelect,
  ModalRadio,
  ModalSaveButton,
  ModalCancelButton,
} from "../styles";

const formatVacancyValue = (value: unknown): string => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return "0";
};

const filterOptionByLabel = (input: string, option?: DefaultOptionType) => {
  const label = option?.label;

  if (typeof label === "string") {
    return label.toLowerCase().includes(input.toLowerCase());
  }

  if (Array.isArray(label)) {
    return label.join(" ").toLowerCase().includes(input.toLowerCase());
  }

  if (label && typeof label === "object" && "props" in label) {
    const children = (label as { props?: { children?: unknown } }).props?.children;
    if (typeof children === "string") {
      return children.toLowerCase().includes(input.toLowerCase());
    }
  }

  if (typeof option?.value === "string") {
    return option.value.toLowerCase().includes(input.toLowerCase());
  }

  return false;
};

const EscolhaCandidatosModal: React.FC<EscolhaCandidatosModalProps> = ({
  visible,
  context,
  selectedProcesso,
  selectedProcessoStatus,
  selectedConcursoUuid,
  selectedAgendaData,
  cargoCodigoNumericoParam,
  onClose,
  onSuccess,
  canViewEscolha,
  canAddEscolha,
}) => {
  const [modalSituacao, setModalSituacao] = useState<SituacaoEscolha>("escolha");
  const [modalTipoVaga, setModalTipoVaga] = useState<TipoVagaEscolha>("precaria");
  const [modalRetardatario, setModalRetardatario] = useState(false);
  const [modalDre, setModalDre] = useState<string | undefined>(undefined);
  const [modalDreCodigo, setModalDreCodigo] = useState<string | undefined>(
    undefined
  );
  const [modalUnidadeEscolar, setModalUnidadeEscolar] = useState<
    string | undefined
  >(undefined);

  const previousVisibleRef = useRef(visible);
  const previousContextRef = useRef(context);
  const syncPendingRef = useRef(false);
  const processosComStatusAtualizadoRef = useRef<Set<string>>(new Set());

  const initialValues = useMemo(() => {
    if (!visible) {
      return {
        situacao: "escolha" as SituacaoEscolha,
        tipoVaga: "precaria" as TipoVagaEscolha,
        retardatario: false,
        dre: undefined as string | undefined,
        dreCodigo: undefined as string | undefined,
        unidadeEscolar: undefined as string | undefined,
      };
    }

    const situacaoFromContext = context?.situacaoCodigo;
    const tipoVagaFromContext = context?.tipoVagaCodigo;

    return {
      situacao:
        situacaoFromContext && situacaoFromContext !== "pendente"
          ? situacaoFromContext
          : ("escolha" as SituacaoEscolha),
      tipoVaga:
        tipoVagaFromContext === "definitiva"
          ? ("definitiva" as TipoVagaEscolha)
          : ("precaria" as TipoVagaEscolha),
      retardatario: Boolean(context?.retardatario),
      dre: context?.dreUuid,
      dreCodigo: context?.dreCodigo,
      unidadeEscolar: context?.vagaEscolaUuid,
    };
  }, [visible, context]);

  const syncInitialValues = useCallback(() => {
    if (
      (visible !== previousVisibleRef.current ||
        context !== previousContextRef.current) &&
      !syncPendingRef.current
    ) {
      syncPendingRef.current = true;
      previousVisibleRef.current = visible;
      previousContextRef.current = context;
      setModalSituacao(initialValues.situacao);
      setModalTipoVaga(initialValues.tipoVaga);
      setModalRetardatario(initialValues.retardatario);
      setModalDre(initialValues.dre);
      // Usar dreCodigo do context diretamente se disponível (modo somente leitura)
      setModalDreCodigo(context?.dreCodigo || initialValues.dreCodigo);
      setModalUnidadeEscolar(initialValues.unidadeEscolar);
      Promise.resolve().then(() => {
        syncPendingRef.current = false;
      });
    }
  }, [visible, context, initialValues]);

  const needsInitialSync =
    visible !== previousVisibleRef.current ||
    context !== previousContextRef.current;

  if (needsInitialSync) {
    requestAnimationFrame(() => {
      syncInitialValues();
    });
  }

  const shouldFetchVagas = useMemo(
    () =>
      visible &&
      Boolean(selectedProcesso && cargoCodigoNumericoParam),
    [visible, selectedProcesso, cargoCodigoNumericoParam]
  );

  const { vagasData, vagasIsLoading } = useGetVagasPorProcessoECargo(
    selectedProcesso,
    cargoCodigoNumericoParam,
    shouldFetchVagas
  );

  // Verifica se o modal está em modo somente leitura (candidato já tem escolha feita)
  const isReadOnly = useMemo(() => {
    return context?.situacaoCodigo !== "pendente";
  }, [context?.situacaoCodigo]);

  const dreOptions = useMemo(() => {
    const options: Array<{ value: string; label: string; codigo: string; raw: any }> = [];
    
    if (vagasData?.dres && Array.isArray(vagasData.dres)) {
      vagasData.dres.forEach((dre) => {
        options.push({
          value: dre.uuid,
          label: dre.nome,
          codigo: dre.codigo,
          raw: dre,
        });
      });
    }
    
    // Se estiver em modo somente leitura e tiver dreUuid no context mas não estiver nas opções, adicionar
    if (isReadOnly && context?.dreUuid && context?.dreCodigo) {
      const exists = options.some((opt) => opt.value === context.dreUuid);
      if (!exists) {
        // Tentar encontrar a DRE nas opções por código primeiro
        const foundByCodigo = options.find((opt) => opt.codigo === context.dreCodigo);
        if (!foundByCodigo) {
          // Se não encontrou, adicionar uma opção temporária (será substituída quando os dados carregarem)
          options.push({
            value: context.dreUuid,
            label: `DRE ${context.dreCodigo}`, // Fallback label
            codigo: context.dreCodigo,
            raw: { uuid: context.dreUuid, codigo: context.dreCodigo },
          });
        }
      }
    }
    
    return options;
  }, [vagasData?.dres, isReadOnly, context?.dreUuid, context?.dreCodigo]);

  // Lista de escolas filtradas por DRE com estrutura { uuid, escola, vagas restantes, disabled }
  const escolasPorDre = useMemo(() => {
    if (!vagasData?.vagas || !Array.isArray(vagasData.vagas)) {
      return [];
    }
    
    // Se estiver em modo somente leitura e tiver uma escola selecionada, incluir ela mesmo que não esteja na DRE filtrada
    let escolasFiltradas: any[] = [];
    
    if (modalDreCodigo) {
      escolasFiltradas = vagasData.vagas.filter(
        (vaga: any) => vaga?.escola?.dre?.codigo === modalDreCodigo
      );
    }
    
    // Se estiver em modo somente leitura e tiver vagaEscolaUuid, garantir que a escola esteja na lista
    if (isReadOnly && context?.vagaEscolaUuid && vagasData.vagas.length > 0) {
      const escolaSelecionada = vagasData.vagas.find(
        (vaga: any) => vaga.uuid === context.vagaEscolaUuid
      );
      if (escolaSelecionada && !escolasFiltradas.some((v: any) => v.uuid === escolaSelecionada.uuid)) {
        escolasFiltradas.push(escolaSelecionada);
      }
    }
    
    return escolasFiltradas.map((vaga: any) => {
      const vagasPrecariasRestantes = vaga.vagas_precarias_restantes ?? 0;
      const vagasDefinitivasRestantes = vaga.vagas_definitivas_restantes ?? 0;
      
      // Desabilita escola se não tem vagas restantes do tipo selecionado (apenas se não estiver em modo somente leitura)
      const isDisabled = !isReadOnly && (modalTipoVaga === "definitiva" 
        ? vagasDefinitivasRestantes <= 0
        : vagasPrecariasRestantes <= 0);
      
      return {
        value: vaga.uuid,
        label: vaga?.escola?.nome_oficial || '',
        disabled: isDisabled,
        vagasPrecariasRestantes,
        vagasDefinitivasRestantes,
        vagaData: vaga,
      };
    });
  }, [vagasData?.vagas, modalDreCodigo, modalTipoVaga, isReadOnly, context?.vagaEscolaUuid]);

  const syncedModalDre = useMemo(() => {
    if (!visible) {
      return modalDre;
    }
    if (!modalDre && context?.dreUuid) {
      return context.dreUuid;
    }
    return modalDre;
  }, [visible, modalDre, context?.dreUuid]);

  const syncModalDreCallback = useCallback(() => {
    if (syncedModalDre !== modalDre && visible) {
      setModalDre(syncedModalDre);
    }
  }, [syncedModalDre, modalDre, visible]);

  const needsModalDreSync = syncedModalDre !== modalDre && visible;
  if (needsModalDreSync) {
    requestAnimationFrame(() => {
      syncModalDreCallback();
    });
  }

  const calculatedDreCodigo = useMemo(() => {
    if (!visible) {
      return undefined;
    }
    // Se tiver dreCodigo no context, usar ele diretamente
    if (context?.dreCodigo) {
      return context.dreCodigo;
    }
    // Caso contrário, buscar nas opções
    if (!modalDre) {
      return undefined;
    }
    const matchedDre = dreOptions.find((option) => option.value === modalDre);
    return matchedDre?.codigo;
  }, [visible, modalDre, dreOptions, context?.dreCodigo]);

  const syncModalDreCodigoCallback = useCallback(() => {
    // Priorizar dreCodigo do context se disponível (modo somente leitura)
    const targetDreCodigo = context?.dreCodigo || calculatedDreCodigo;
    if (targetDreCodigo !== modalDreCodigo && visible && targetDreCodigo) {
      setModalDreCodigo(targetDreCodigo);
    }
  }, [calculatedDreCodigo, modalDreCodigo, visible, context?.dreCodigo]);

  const needsModalDreCodigoSync = (context?.dreCodigo || calculatedDreCodigo) !== modalDreCodigo && visible;
  if (needsModalDreCodigoSync) {
    requestAnimationFrame(() => {
      syncModalDreCodigoCallback();
    });
  }


  const vagasTotals = vagasData as
    | (IVagasResponse & {
        total_vagas_definitivas?: number | null;
        total_vagas_precarias?: number | null;
      })
    | undefined;

  // Busca a vaga selecionada para obter vagas restantes
  const vagaSelecionada = useMemo(() => {
    if (!modalUnidadeEscolar || !vagasData?.vagas || !Array.isArray(vagasData.vagas)) {
      return null;
    }
    return vagasData.vagas.find((vaga: any) => vaga.uuid === modalUnidadeEscolar) || null;
  }, [modalUnidadeEscolar, vagasData?.vagas]);

  // Atualiza vagas no card: mostra restantes da escola selecionada ou totais gerais
  const modalVagasDefinitivas = useMemo(() => {
    // Se uma escola está selecionada, mostra vagas restantes dessa escola
    if (vagaSelecionada && vagaSelecionada.vagas_definitivas_restantes !== undefined) {
      return formatVacancyValue(vagaSelecionada.vagas_definitivas_restantes);
    }
    // Caso contrário, mostra totais gerais
    return formatVacancyValue(
      vagasTotals?.total_vagas_definitivas ?? context?.vagasDefinitivas
    );
  }, [vagaSelecionada, context?.vagasDefinitivas, vagasTotals?.total_vagas_definitivas]);

  const modalVagasPrecarias = useMemo(() => {
    // Se uma escola está selecionada, mostra vagas restantes dessa escola
    if (vagaSelecionada && vagaSelecionada.vagas_precarias_restantes !== undefined) {
      return formatVacancyValue(vagaSelecionada.vagas_precarias_restantes);
    }
    // Caso contrário, mostra totais gerais
    return formatVacancyValue(
      vagasTotals?.total_vagas_precarias ?? context?.vagasPrecarias
    );
  }, [vagaSelecionada, context?.vagasPrecarias, vagasTotals?.total_vagas_precarias]);

  const modalVagasTotais = useMemo(
    () =>
      formatVacancyValue(
        vagasTotals?.total_vagas ?? context?.vagas
      ),
    [context?.vagas, vagasTotals?.total_vagas]
  );

  // Verifica se deve desabilitar os radios de tipo de vaga baseado na escola selecionada
  const tipoVagaDisabled = useMemo(() => {
    if (!vagaSelecionada) {
      // Se não há escola selecionada, nenhum radio é desabilitado
      return {
        precaria: false,
        definitiva: false,
      };
    }

    // Verifica vagas restantes da escola selecionada
    const vagasDefinitivasRestantes = vagaSelecionada.vagas_definitivas_restantes ?? 0;
    const vagasPrecariasRestantes = vagaSelecionada.vagas_precarias_restantes ?? 0;

    return {
      // Desabilita "Precária" se não houver vagas precárias restantes
      precaria: vagasPrecariasRestantes <= 0,
      // Desabilita "Definitiva" se não houver vagas definitivas restantes
      definitiva: vagasDefinitivasRestantes <= 0,
    };
  }, [vagaSelecionada]);

  const handleModalDreChange = useCallback(
    (value?: string) => {
      setModalDre(value);
      setModalUnidadeEscolar(undefined);
      if (!value) {
        setModalDreCodigo(undefined);
        return;
      }
      const matched = dreOptions.find((option) => option.value === value);
      setModalDreCodigo(matched?.codigo);
    },
    [dreOptions]
  );

  // Limpa a seleção da escola se ela não tiver vagas do tipo selecionado
  // (apenas quando não estiver em modo somente leitura)
  useEffect(() => {
    if (isReadOnly || !modalUnidadeEscolar || !vagasData?.vagas || !Array.isArray(vagasData.vagas)) {
      return;
    }
    
    const escolaSelecionada = vagasData.vagas.find(
      (vaga: any) => vaga.uuid === modalUnidadeEscolar
    );
    
    if (escolaSelecionada) {
      const temVagas = modalTipoVaga === "definitiva"
        ? (escolaSelecionada.vagas_definitivas_restantes ?? 0) > 0
        : (escolaSelecionada.vagas_precarias_restantes ?? 0) > 0;
      
      if (!temVagas) {
        setModalUnidadeEscolar(undefined);
      }
    }
  }, [modalTipoVaga, modalUnidadeEscolar, vagasData?.vagas, isReadOnly]);

  const queryClient = useQueryClient();

  const salvarEscolhaMutation = useMutation<
    unknown,
    unknown,
    ISalvarEscolhaPayload
  >({
    mutationFn: (payload) => API.Escolhas.postEscolha(payload).response,
  });
  const { mutateAsync: salvarEscolhaMutateAsync, isPending: salvarEscolhaIsPending } =
    salvarEscolhaMutation;
  const patchStatusProcessoMutation = usePatchStatusProcessoConvocacao();
  const { mutateAsync: patchStatusProcessoMutateAsync } = patchStatusProcessoMutation;

  const atualizarStatusProcessoAoIniciarEscolha = useCallback(async () => {
    if (!selectedProcesso || selectedProcessoStatus !== "PENDENTE") {
      return;
    }

    if (processosComStatusAtualizadoRef.current.has(selectedProcesso)) {
      return;
    }

    try {
      await patchStatusProcessoMutateAsync(selectedProcesso);
      processosComStatusAtualizadoRef.current.add(selectedProcesso);
    } catch {
      message.warning(
        "Escolha salva, mas não foi possível atualizar o status do processo para Em Andamento."
      );
    }
  }, [
    patchStatusProcessoMutateAsync,
    selectedProcesso,
    selectedProcessoStatus,
  ]);

  // Função para sincronizar agendas após salvar escolha
  const sincronizarAgendas = useCallback(async (
    candidatoUuid: string,
    processoUuid?: string,
    agendaAtual?: IAgenda
  ) => {
    if (!processoUuid || !agendaAtual) {
      return;
    }

    try {
      // Buscar todas as agendas do processo
      const todasAgendas = await API.Agenda.getAgendas({
        pagination: { page: 1, page_size: 100 },
        filters: { processo_convocacao_uuid: processoUuid },
      }).response;

      const agendasList: IAgenda[] = Array.isArray(todasAgendas)
        ? todasAgendas
        : todasAgendas?.results || [];

      // Filtrar apenas agendas do mesmo cargo
      const agendasMesmoCargo = agendasList.filter(
        (agenda) => agenda.cargo_uuid === agendaAtual.cargo_uuid
      );

      const isAgendaRetardatario = agendaAtual.retardatario === true;

      if (isAgendaRetardatario) {
        // Caso 1: Escolha feita na agenda de retardatários
        // Encontrar a agenda normal que contém o candidato
        const agendaNormalComCandidato = agendasMesmoCargo.find(
          (agenda) =>
            !agenda.retardatario &&
            agenda.candidatos_uuids?.includes(candidatoUuid)
        );

        // Atualizar a escolha na agenda normal (se encontrada)
        if (agendaNormalComCandidato) {
          // A escolha já foi salva, então apenas precisamos garantir que está atualizada
          // O backend já deve ter atualizado a escolha, mas podemos invalidar a query
          queryClient.invalidateQueries({
            queryKey: ["postEscolhasPorCandidatos"],
          });
        }

        // Remover candidato da agenda de retardatários
        const candidatosAtualizados = (agendaAtual.candidatos_uuids || []).filter(
          (uuid) => uuid !== candidatoUuid
        );

        await API.Agenda.patchAgenda(agendaAtual.uuid, {
          candidatos_uuids: candidatosAtualizados,
        }).response;
      } else {
        // Caso 2: Escolha feita em agenda normal
        // Encontrar e atualizar a agenda de retardatários
        const agendaRetardatarios = agendasMesmoCargo.find(
          (agenda) => agenda.retardatario === true
        );

        if (agendaRetardatarios && agendaRetardatarios.candidatos_uuids?.includes(candidatoUuid)) {
          // Remover candidato da agenda de retardatários
          const candidatosAtualizados = (agendaRetardatarios.candidatos_uuids || []).filter(
            (uuid) => uuid !== candidatoUuid
          );

          await API.Agenda.patchAgenda(agendaRetardatarios.uuid, {
            candidatos_uuids: candidatosAtualizados,
          }).response;
        }
      }

      // Invalidar queries de agendas para atualizar a UI
      queryClient.invalidateQueries({
        queryKey: ["getAgendasPorProcessoConvocacao"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getAgendas"],
      });
    } catch (error) {
      console.error("Erro ao sincronizar agendas:", error);
      // Não mostrar erro ao usuário aqui, pois a escolha já foi salva
      // Apenas logar o erro
    }
  }, [queryClient]);

  const handleSalvarEscolha = useCallback(async () => {
    if (!context?.candidatoUuid) {
      message.error("Não foi possível identificar o candidato selecionado.");
      return;
    }

    // Não permitir salvar se estiver em modo somente leitura
    if (isReadOnly) {
      return;
    }

    // Validação apenas quando a situação for "escolha"
    if (modalSituacao === "escolha" && !modalUnidadeEscolar) {
      message.warning("Selecione a unidade escolar para salvar a escolha.");
      return;
    }

    // Quando não for "escolha", enviar null para os campos não visíveis
    const payload: ISalvarEscolhaPayload = {
      candidato_uuid: context.candidatoUuid,
      situacao: modalSituacao,
      vaga_escola_uuid: modalSituacao === "escolha" 
        ? (modalUnidadeEscolar || null) 
        : null,
      tipo_vaga: modalSituacao === "escolha" 
        ? modalTipoVaga 
        : null,
      e_retardatario: modalSituacao === "escolha" 
        ? modalRetardatario 
        : false,
      concurso_uuid: selectedConcursoUuid,
    };

    try {
      await salvarEscolhaMutateAsync(payload);
      
      // Sincronizar agendas após salvar a escolha (para escolha, reconvocação e não escolha)
      if (selectedProcesso && selectedAgendaData) {
        await sincronizarAgendas(
          context.candidatoUuid,
          selectedProcesso,
          selectedAgendaData
        );
      }

      await atualizarStatusProcessoAoIniciarEscolha();
      
      message.success("Escolha salva com sucesso.");
      onClose();
      onSuccess();
    } catch (error: unknown) {
      const fallbackMessage = "Não foi possível salvar a escolha do candidato.";
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof (error as any).response === "object" &&
        "data" in (error as any).response &&
        (error as any).response.data &&
        typeof (error as any).response.data === "object"
      ) {
        const detail =
          (error as any).response.data.detail ??
          (error as any).response.data.message;
        if (typeof detail === "string" && detail.trim().length > 0) {
          message.error(detail);
          return;
        }
      }
      if (error instanceof Error && error.message) {
        message.error(error.message);
        return;
      }
      message.error(fallbackMessage);
    }
  }, [
    context?.candidatoUuid,
    modalRetardatario,
    modalSituacao,
    modalTipoVaga,
    modalUnidadeEscolar,
    onClose,
    onSuccess,
    salvarEscolhaMutateAsync,
    atualizarStatusProcessoAoIniciarEscolha,
    selectedConcursoUuid,
    selectedProcesso,
    selectedAgendaData,
    sincronizarAgendas,
    isReadOnly,
  ]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={
        <ModalButtonContainer>
          <ModalCancelButton
            size="large"
            onClick={onClose}
          >
            {isReadOnly ? "Fechar" : "Cancelar"}
          </ModalCancelButton>
          {!isReadOnly && canAddEscolha && (
            <ModalSaveButton
              size="large"
              type="primary"
              onClick={handleSalvarEscolha}
              loading={salvarEscolhaIsPending}
              disabled={
                salvarEscolhaIsPending || 
                (modalSituacao === "escolha" && !modalUnidadeEscolar)
              }
            >
              Salvar
            </ModalSaveButton>
          )}
        </ModalButtonContainer>
      }
      width={900}
      style={modalInlineStyles.modalMaxSize}
      styles={{ body: { padding: "24px 32px 32px" } }}
      title={null}
    >
      <ModalWrapper>
        <ModalHeading>
          {isReadOnly ? "Visualizar escolha de candidato" : "Efetuar escolha de candidato"}
        </ModalHeading>

        <ModalInfoCard>
          <ModalInfoItem>
            <ModalInfoLabel>Cargo</ModalInfoLabel>
            <ModalInfoValue>
              {context?.cargo ??
                selectedAgendaData?.cargo_nome ??
                "—"}
            </ModalInfoValue>
          </ModalInfoItem>
          <ModalInfoItem>
            <ModalInfoLabel>Candidato</ModalInfoLabel>
            <ModalInfoValue>
              {context?.nome ?? "—"}
            </ModalInfoValue>
          </ModalInfoItem>
          <ModalInfoItem>
            <ModalInfoLabel>Classificação</ModalInfoLabel>
            <ModalInfoValue>
              {context?.classificacao ?? "—"}
            </ModalInfoValue>
          </ModalInfoItem>
          <ModalInfoItem>
            <ModalInfoLabel>Vagas definitivas</ModalInfoLabel>
            <ModalInfoValue>
              {vagasIsLoading ? <Spin size="small" /> : modalVagasDefinitivas}
            </ModalInfoValue>
          </ModalInfoItem>
          <ModalInfoItem>
            <ModalInfoLabel>Vagas precárias</ModalInfoLabel>
            <ModalInfoValue>
              {vagasIsLoading ? <Spin size="small" /> : modalVagasPrecarias}
            </ModalInfoValue>
          </ModalInfoItem>
          <ModalInfoItem>
            <ModalInfoLabel>Vagas Publicadas</ModalInfoLabel>
            <ModalInfoValue>
              {vagasIsLoading ? <Spin size="small" /> : modalVagasTotais}
            </ModalInfoValue>
          </ModalInfoItem>
        </ModalInfoCard>

        <ModalSection>
          <ModalSectionTitle>Situação</ModalSectionTitle>
          <ModalRadioGroup
            value={modalSituacao}
            onChange={(event) =>
              setModalSituacao(
                event.target.value as "escolha" | "reconvocacao" | "nao-escolha"
              )
            }
            disabled={isReadOnly}
          >
            <ModalRadio value="escolha" disabled={isReadOnly}>Escolha</ModalRadio>
            <ModalRadio value="reconvocacao" disabled={isReadOnly}>Reconvocação</ModalRadio>
            <ModalRadio value="nao-escolha" disabled={isReadOnly}>Não escolha</ModalRadio>
          </ModalRadioGroup>
        </ModalSection>

        {modalSituacao === "escolha" && (
          <>
            <ModalSection>
              <ModalFieldsRow gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <ModalFieldLabel>DRE</ModalFieldLabel>
                  <ModalSelect
                    value={modalDre}
                    placeholder="Selecione a DRE"
                    onChange={(value) =>
                      handleModalDreChange(value as string | undefined)
                    }
                    options={dreOptions}
                    allowClear
                    loading={vagasIsLoading}
                    disabled={!canAddEscolha || isReadOnly || vagasIsLoading || !cargoCodigoNumericoParam}
                    showSearch
                    optionFilterProp="label"
                    filterOption={filterOptionByLabel}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <ModalFieldLabel>Unidade escolar</ModalFieldLabel>
                  <ModalSelect
                    value={modalUnidadeEscolar}
                    placeholder="Selecione a unidade escolar"
                    onChange={(value) =>
                      setModalUnidadeEscolar(value as string | undefined)
                    }
                    options={escolasPorDre}
                    allowClear
                    disabled={isReadOnly || !modalDreCodigo}
                    showSearch
                    optionFilterProp="label"
                    filterOption={filterOptionByLabel}
                  />
                </Col>
              </ModalFieldsRow>
            </ModalSection>

            <ModalSection>
              <ModalFieldsRow gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <ModalFieldLabel>Tipo de vaga</ModalFieldLabel>
                  <ModalRadioGroup
                    value={modalTipoVaga}
                    onChange={(event) =>
                      setModalTipoVaga(
                        event.target.value as "precaria" | "definitiva"
                      )
                    }
                    disabled={isReadOnly}
                  >
                    <ModalRadio value="precaria" disabled={isReadOnly || tipoVagaDisabled.precaria}>
                      Precária
                    </ModalRadio>
                    <ModalRadio value="definitiva" disabled={isReadOnly || tipoVagaDisabled.definitiva}>
                      Definitiva
                    </ModalRadio>
                  </ModalRadioGroup>
                </Col>
              </ModalFieldsRow>
            </ModalSection>
          </>
        )}
      </ModalWrapper>
    </Modal>
  );
};

export default EscolhaCandidatosModal;

