import React, { useCallback, useMemo, useRef, useState } from "react";
import { Col, Modal, Spin, message } from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { DefaultOptionType } from "antd/es/select";
import type {
  ISalvarEscolhaPayload,
  SituacaoEscolha,
  TipoVagaEscolha,
} from "../../../services/resources/escolhas/IEscolhas";
import type { IEscolasResponse } from "../../../services/resources/escolhas/IEscolhas";
import type { IVagasResponse } from "../../../services/resources/convocacao/IConvocacao";
import type { EscolhaCandidatosModalProps } from "../hooks/types";
import { API } from "../../../services";
import { useGetVagasPorProcessoECargo } from "../../CriarEditarConvocacao/SelecaoCargos/hooks/useGetVagasPorProcessoECargo";
import {
  ModalButtonContainer,
  modalInlineStyles,
} from "../../CriarEditarConvocacao/SelecaoCargos/styles";
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
  ModalCheckbox,
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
  selectedAgendaData,
  cargoCodigoNumericoParam,
  onClose,
  onSuccess,
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
      setModalDreCodigo(initialValues.dreCodigo);
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

  const dreOptions = useMemo(() => {
    if (!vagasData?.dres || !Array.isArray(vagasData.dres)) {
      return [];
    }
    return vagasData.dres.map((dre) => ({
      value: dre.uuid,
      label: dre.nome,
      codigo: dre.codigo,
      raw: dre,
    }));
  }, [vagasData?.dres]);

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
    if (!visible || !modalDre) {
      return undefined;
    }
    const matchedDre = dreOptions.find((option) => option.value === modalDre);
    return matchedDre?.codigo;
  }, [visible, modalDre, dreOptions]);

  const syncModalDreCodigoCallback = useCallback(() => {
    if (calculatedDreCodigo !== modalDreCodigo && visible) {
      setModalDreCodigo(calculatedDreCodigo);
    }
  }, [calculatedDreCodigo, modalDreCodigo, visible]);

  const needsModalDreCodigoSync = calculatedDreCodigo !== modalDreCodigo && visible;
  if (needsModalDreCodigoSync) {
    requestAnimationFrame(() => {
      syncModalDreCodigoCallback();
    });
  }

  const escolasQuery = useQuery<IEscolasResponse>({
    queryKey: ["modal-escolas", modalDreCodigo],
    queryFn: ({ signal }) =>
      API.Escolhas.getEscolas(
        { dre__codigo: modalDreCodigo!, page_size: 200 },
        { signal }
      ).response,
    enabled:
      visible && Boolean(modalDreCodigo && modalDreCodigo.length),
    staleTime: 1000 * 60 * 2,
    retry: 0,
  });

  const escolaOptions = useMemo(
    () =>
      (escolasQuery.data?.results ?? []).map((escola) => ({
        value: escola.uuid,
        label: escola.nome_oficial,
        raw: escola,
      })),
    [escolasQuery.data?.results]
  );

  const validatedUnidadeEscolar = useMemo(() => {
    if (!visible) {
      return undefined;
    }

    if (
      modalUnidadeEscolar &&
      escolaOptions.every((option) => option.value !== modalUnidadeEscolar)
    ) {
      return undefined;
    }

    return modalUnidadeEscolar;
  }, [visible, modalUnidadeEscolar, escolaOptions]);

  const syncModalUnidadeEscolarCallback = useCallback(() => {
    if (validatedUnidadeEscolar !== modalUnidadeEscolar) {
      setModalUnidadeEscolar(validatedUnidadeEscolar);
    }
  }, [validatedUnidadeEscolar, modalUnidadeEscolar]);

  const needsModalUnidadeEscolarSync = validatedUnidadeEscolar !== modalUnidadeEscolar;
  if (needsModalUnidadeEscolarSync) {
    requestAnimationFrame(() => {
      syncModalUnidadeEscolarCallback();
    });
  }

  const vagasTotals = vagasData as
    | (IVagasResponse & {
        total_vagas_definitivas?: number | null;
        total_vagas_precarias?: number | null;
      })
    | undefined;

  const modalVagasDefinitivas = useMemo(
    () =>
      formatVacancyValue(
        vagasTotals?.total_vagas_definitivas ??
          context?.vagasDefinitivas
      ),
    [context?.vagasDefinitivas, vagasTotals?.total_vagas_definitivas]
  );

  const modalVagasPrecarias = useMemo(
    () =>
      formatVacancyValue(
        vagasTotals?.total_vagas_precarias ??
          context?.vagasPrecarias
      ),
    [context?.vagasPrecarias, vagasTotals?.total_vagas_precarias]
  );

  const modalVagasTotais = useMemo(
    () =>
      formatVacancyValue(
        vagasTotals?.total_vagas ?? context?.vagas
      ),
    [context?.vagas, vagasTotals?.total_vagas]
  );

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

  const salvarEscolhaMutation = useMutation<
    unknown,
    unknown,
    ISalvarEscolhaPayload
  >({
    mutationFn: (payload) => API.Escolhas.postEscolha(payload).response,
  });
  const { mutateAsync: salvarEscolhaMutateAsync, isPending: salvarEscolhaIsPending } =
    salvarEscolhaMutation;

  const handleSalvarEscolha = useCallback(async () => {
    if (!context?.candidatoUuid) {
      message.error("Não foi possível identificar o candidato selecionado.");
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
    };

    try {
      await salvarEscolhaMutateAsync(payload);
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
            Cancelar
          </ModalCancelButton>
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
        </ModalButtonContainer>
      }
      width={900}
      style={modalInlineStyles.modalMaxSize}
      styles={{ body: { padding: "24px 32px 32px" } }}
      title={null}
    >
      <ModalWrapper>
        <ModalHeading>Efetuar escolha de candidato</ModalHeading>

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
            <ModalInfoLabel>Vagas</ModalInfoLabel>
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
          >
            <ModalRadio value="escolha">Escolha</ModalRadio>
            <ModalRadio value="reconvocacao">Reconvocação</ModalRadio>
            <ModalRadio value="nao-escolha">Não escolha</ModalRadio>
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
                    disabled={vagasIsLoading || !cargoCodigoNumericoParam}
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
                    options={escolaOptions}
                    allowClear
                    disabled={!modalDreCodigo}
                    loading={escolasQuery.isLoading}
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
                  >
                    <ModalRadio value="precaria">Precária</ModalRadio>
                    <ModalRadio value="definitiva">Definitiva</ModalRadio>
                  </ModalRadioGroup>
                </Col>
                <Col xs={24} md={12}>
                  <ModalFieldLabel>Retardatário</ModalFieldLabel>
                  <ModalCheckbox
                    checked={modalRetardatario}
                    onChange={(event) =>
                      setModalRetardatario(event.target.checked)
                    }
                  >
                    Sim
                  </ModalCheckbox>
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

