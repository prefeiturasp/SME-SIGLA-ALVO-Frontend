import React, { useMemo, useState, useEffect } from "react";
import { Row, Col, Typography, Select, Card, Alert, Spin } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { ModalInfoLabel } from "@/components/ui";
import useEnvioEmails, { type TipoEnvio } from "./hooks/useEnvioEmails";
import useGetEnvioEmailConteudo, {
  type EnvioEmailConteudoRegistro,
} from "./hooks/useGetEnvioEmailConteudo";
import { AppButton, TextTitulo, TextTituloSecundario, AppFormItem, TabContentContainer, StyledSelect, ActionButtonsContainer, StandardInput, FilterActionSlot, FilterInlineRow, FilterFieldCol, FilterActionCol, FilterActionsGroup } from '@/components/ui';
import { cardSpacing, selectSuffixIcon } from '@/design-system/estilos';
import QuillEditor from "@/components/QuillEditor";

const { Text } = Typography;

const obterRegistroConteudo = (
  raw: unknown
): EnvioEmailConteudoRegistro | null => {
  if (Array.isArray(raw)) {
    return raw.length > 0 ? (raw[0] as EnvioEmailConteudoRegistro) : null;
  }
  if (raw && typeof raw === "object") {
    return raw as EnvioEmailConteudoRegistro;
  }
  return null;
};

const EnvioEmailsTela: React.FC = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    handleEnviarForm,
    processosConvocacaoOptions,
    processosConvocacaoIsLoading,
    formErrors,
    watch,
    setValue,
    enviando,
  } = useEnvioEmails();

  const breadcrumbItems = useMemo(
    () => [
      {
        title: (
          <Text strong>
            Gerenciar
          </Text>
        ),
      },
      { title: (
        <Text strong>
          Disparo de e-mails
        </Text>
      ) },
    ] as TitleItem[],
    [navigate]
  );

  const tipoSelecionado = watch("tipo");
  const processoSelecionado = watch("processo_convocacao");
  const canFilter = Boolean(tipoSelecionado && processoSelecionado);
  const tipoEmailLabel = useMemo(() => {
    if (tipoSelecionado === "CONVOCACAO") return "Convocação";
    if (tipoSelecionado === "VAGAS") return "Vagas";
    if (tipoSelecionado === "RESULTADOS") return "Resultados";
    return "";
  }, [tipoSelecionado]);
  const { refetch: refetchConteudo } = useGetEnvioEmailConteudo(tipoSelecionado, false);
  const [conteudoVisivel, setConteudoVisivel] = useState(false);

  const handleCopyConteudoGabarito = () => {
    const gabarito = watch("conteudo_gabarito") || "";
    setValue("conteudo", gabarito, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
  };

  // Ao trocar o tipo, esconder o textarea até novo filtro
  useEffect(() => {
    setConteudoVisivel(false);
    setValue("assunto", "");
    setValue("conteudo_gabarito", "");
    setValue("conteudo", "");
  }, [tipoSelecionado, setValue]);
  const onShowHistorico = () => {
    // Reutiliza a tela de histórico existente
    navigate("/gerenciar/disparo-emails/historico");
  };

  return (
    <BaseTela breadcrumbItems={breadcrumbItems} title="Disparo de e-mails">
      <>
        <Spin spinning={enviando}>
        <TabContentContainer>
          <Card style={cardSpacing.marginBottom16}>
            <Row>
              <Col span={24}>
                <TextTitulo>
                  Selecione o e-mail
                </TextTitulo>
                <br />
                <TextTituloSecundario>
                  Selecione o processo e o modelo de e-mail que deseja enviar.
                </TextTituloSecundario>
              </Col>
            </Row>
            <br />
            <FilterInlineRow gutter={[16, 8]} style={{ marginBottom: "1.5rem" }}>
              <FilterFieldCol xs={24} md={11}>
                <Controller
                  control={control}
                  name="processo_convocacao"
                  render={({ field }) => (
                    <AppFormItem
                      label="Processo de convocação"
                      validateStatus={formErrors.processo_convocacao ? "error" : undefined}
                      help={formErrors.processo_convocacao?.message}
                      labelCol={{ span: 24 }}
                    >
                      <StyledSelect
                        value={field.value}
                        onChange={(value: unknown) => field.onChange(value as string | undefined)}
                        placeholder="Selecione o processo"
                        loading={processosConvocacaoIsLoading}
                        allowClear
                        suffixIcon={<ExpandMoreIcon style={selectSuffixIcon} />}
                      >
                        {Array.isArray(processosConvocacaoOptions) &&
                          processosConvocacaoOptions.map(
                            (processoConvocacao: { value: string; label: string }) => (
                              <Select.Option key={processoConvocacao.value} value={processoConvocacao.value}>
                                {processoConvocacao.label}
                              </Select.Option>
                            )
                          )}
                      </StyledSelect>
                    </AppFormItem>
                  )}
                />
              </FilterFieldCol>
              <FilterFieldCol xs={24} md={11}>
                <Controller
                  control={control}
                  name="tipo"
                  render={({ field }) => (
                    <AppFormItem
                      label="Tipo"
                      validateStatus={formErrors.tipo ? "error" : undefined}
                      help={formErrors.tipo?.message}
                      labelCol={{ span: 24 }}
                    >
                      <StyledSelect
                        value={field.value}
                        onChange={(value: unknown) => field.onChange(value as TipoEnvio | undefined)}
                        placeholder="Selecione o tipo"
                        allowClear
                        suffixIcon={<ExpandMoreIcon style={selectSuffixIcon} />}
                      >
                        <Select.Option value="CONVOCACAO">Convocação</Select.Option>
                        <Select.Option value="VAGAS">Vagas</Select.Option>
                        <Select.Option value="RESULTADOS">Resultados</Select.Option>
                      </StyledSelect>
                    </AppFormItem>
                  )}
                />
              </FilterFieldCol>
              <FilterActionCol xs={24} md={2} style={{ minWidth: "auto" }}>
                <FilterActionSlot>
                  <FilterActionsGroup>
                    <AppButton
                      variant="secondary"
                      disabled={!canFilter}
                      onClick={async () => {
                        if (!canFilter) return;
                        try {
                          setConteudoVisivel(false);
                          const res = await refetchConteudo();
                          const registro = obterRegistroConteudo(res?.data);
                          setValue(
                            "conteudo_gabarito",
                            registro?.conteudo_gabarito ? String(registro.conteudo_gabarito) : "",
                            { shouldDirty: true, shouldTouch: true, shouldValidate: false }
                          );
                          setValue(
                            "conteudo",
                            registro?.conteudo ? String(registro.conteudo) : "",
                            { shouldDirty: true, shouldTouch: true, shouldValidate: false }
                          );
                          setValue("assunto", "", {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: false,
                          });
                          setConteudoVisivel(true);
                        } catch {
                        }
                      }}
                      loading={enviando}
                    >
                      Filtrar
                    </AppButton>
                  </FilterActionsGroup>
                </FilterActionSlot>
              </FilterActionCol>
            </FilterInlineRow>
            <Row style={{ marginBottom: 8 }}>
              <Col span={24}>
                <Alert
                  type="info"
                  showIcon
                  message={
                    <Text style={{ fontWeight: 700 }}>
                      Revise as informações antes do envio
                    </Text>
                  }
                  description={
                    <Text>
                      Confira o conteúdo do e-mail e atualize as informações necessárias antes do envio. Revise com atenção principalmente{" "}
                      <span style={{ fontWeight: 600 }}>datas, prazos e nomes</span>,{" "}
                      e demais dados variáveis.
                    </Text>
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col
                span={24}
                style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 8 }}
              >
                {!conteudoVisivel && (
                  <AppButton
                    variant="secondary"
                    size="large"
                    onClick={() => navigate("/processos/convocacao")}
                  >
                    Voltar
                  </AppButton>
                )}
                <AppButton variant="secondary" size="large" onClick={onShowHistorico}>
                  Histórico
                </AppButton>
              </Col>
            </Row>
          </Card>

          {conteudoVisivel && (
            <Card>
              <Row gutter={24}>
                <Col span={24}>
                  <AppFormItem
                    label={`E-mail de ${tipoEmailLabel}`}
                    labelCol={{ span: 24 }}
                  >
                    <TextTituloSecundario style={{ marginBottom: 16 }}>
                      Este é o e-mail que será enviado a todas as pessoas que prestaram o concurso selecionado. Você pode conferir as informações e realizar as alterações que considerar necessárias.
                    </TextTituloSecundario>
                    <Alert
                      type="info"
                      showIcon
                      message={
                        <Text style={{ fontWeight: 700 }}>
                          Verifique o tamanho da imagem antes do envio
                        </Text>
                      }
                      description="A imagem anexada não pode ser redimensionada pela plataforma. Certifique-se de enviar o arquivo já no tamanho final recomendado."
                      style={{ marginTop: 16 }}
                    />
                    <Controller
                      control={control}
                      name="assunto"
                      render={({ field }) => (
                        <div style={{ width: "100%", marginTop: 16, marginBottom: 16 }}>
                          <ModalInfoLabel style={{ display: "block", marginBottom: 12 }}>
                            Assunto do E-mail:
                          </ModalInfoLabel>
                          <StandardInput
                            aria-label="assunto"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="E-mail de vagas"
                          />
                        </div>
                      )}
                    />
                    <Controller
                      control={control}
                      name="conteudo_gabarito"
                      render={({ field }) => (
                        <div
                          style={{
                            width: "100%",
                            marginTop: 16,
                            marginBottom: 8,
                            position: "relative",
                            isolation: "isolate",
                          }}
                        >
                          <ModalInfoLabel style={{ display: "block", marginBottom: 12 }}>
                            Conteúdo gabarito:
                          </ModalInfoLabel>
                          <QuillEditor
                            editorId="conteudo-gabarito"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Digite o conteúdo do e-mail..."
                          />
                        </div>
                      )}
                    />
                    <div
                      style={{
                        marginTop: 16,
                        marginBottom: 8,
                        position: "relative",
                        zIndex: 2,
                        isolation: "isolate",
                        background: "#fff",
                      }}
                    >
                      <AppButton
                        variant="primary"
                        icon={<SaveOutlined />}
                        onClick={handleCopyConteudoGabarito}
                      >
                        Copiar conteúdo gabarito
                      </AppButton>
                    </div>
                    <Controller
                      control={control}
                      name="conteudo"
                      render={({ field }) => (
                        <div
                          style={{
                            width: "100%",
                            marginTop: 16,
                            marginBottom: 16,
                            position: "relative",
                            isolation: "isolate",
                          }}
                        >
                          <ModalInfoLabel
                            style={{
                              display: "block",
                              marginBottom: 12,
                              position: "relative",
                              zIndex: 2,
                              background: "#fff",
                            }}
                          >
                            Conteúdo:
                          </ModalInfoLabel>
                          <QuillEditor
                            editorId="conteudo"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Digite o conteúdo do e-mail..."
                          />
                          {formErrors.conteudo?.message && (
                            <Text type="danger" style={{ display: "block", marginTop: 8 }}>
                              {formErrors.conteudo.message}
                            </Text>
                          )}
                        </div>
                      )}
                    />
                  </AppFormItem>
                </Col>
              </Row>
            </Card>
          )}
        </TabContentContainer>
        </Spin>
        {conteudoVisivel && (
          <ActionButtonsContainer>
            <AppButton variant="secondary" size="large" onClick={() => navigate("/processos/convocacao")}>
              Voltar
            </AppButton>
            <AppButton variant="primary" size="large" onClick={handleSubmit(handleEnviarForm)} loading={enviando} disabled={enviando}>
              Enviar
            </AppButton>
          </ActionButtonsContainer>
        )}
      </>
    </BaseTela>
  );
};

export default EnvioEmailsTela;

