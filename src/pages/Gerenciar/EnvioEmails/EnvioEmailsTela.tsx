import React, { useMemo, useState, useEffect } from "react";
import { Row, Col, Button, Typography, Select, Card, Alert } from "antd";
import { TextTitulo, TextTituloSecundario } from "../../../components/EstilosCompartilhados";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { CustomFormItem } from "../../../components/FormStyle";
import { TabContentContainer, StyledSelect, ActionButtonsContainer } from "../../../components/EstilosCompartilhados";
import useEnvioEmails, { type TipoEnvio } from "./hooks/useEnvioEmails";
import useGetEnvioEmailConteudo from "./hooks/useGetEnvioEmailConteudo";
import QuillEditor from "../../Relatorios/components/QuillEditor";

const { Text } = Typography;

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
  } = useEnvioEmails();

  const breadcrumbItems = useMemo(
    () => [
      {
        title: (
          <Text strong style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            Home
          </Text>
        ),
      },
      { title: "Envio de e-mails" },
    ] as TitleItem[],
    [navigate]
  );

  const tipoSelecionado = watch("tipo");
  const processoSelecionado = watch("processo_convocacao");
  const canFilter = Boolean(tipoSelecionado && processoSelecionado);
  const { refetch: refetchConteudo } = useGetEnvioEmailConteudo(tipoSelecionado, false);
  const [conteudoVisivel, setConteudoVisivel] = useState(false);

  // Ao trocar o tipo, esconder o textarea até novo filtro
  useEffect(() => {
    setConteudoVisivel(false);
  }, [tipoSelecionado]);
  const onShowHistorico = () => {
    // Reutiliza a tela de histórico existente
    navigate("/gerenciar/disparo-emails/historico");
  };

  return (
    <BaseTela breadcrumbItems={breadcrumbItems} title="Envio de e-mails">
      <>
        <TabContentContainer>
          <Card style={{ marginBottom: 16 }}>
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
            <Row style={{ marginBottom: "1.5rem" }}>
              <Col span={24}>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "end",
                    width: "100%",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      name="processo_convocacao"
                      render={({ field }) => (
                        <CustomFormItem
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
                            suffixIcon={<ExpandMoreIcon style={{ fontSize: "1.5rem", color: "#032B68" }} />}
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
                        </CustomFormItem>
                      )}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      name="tipo"
                      render={({ field }) => (
                        <CustomFormItem
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
                            suffixIcon={<ExpandMoreIcon style={{ fontSize: "1.5rem", color: "#032B68" }} />}
                          >
                            <Select.Option value="CONVOCACAO">Convocação</Select.Option>
                            <Select.Option value="VAGAS">Vagas</Select.Option>
                            <Select.Option value="RESULTADOS">Resultados</Select.Option>
                          </StyledSelect>
                        </CustomFormItem>
                      )}
                    />
                  </div>
                  <div>
                    <Button
                      type="primary"
                      ghost
                      disabled={!canFilter}
                      onClick={async () => {
                        if (!canFilter) return;
                        try {
                          setConteudoVisivel(false);
                          const res = await refetchConteudo();
                          const data = (res?.data ?? []) as Array<{ conteudo?: string }>;
                          const html = Array.isArray(data) && data.length > 0 ? String(data[0]?.conteudo || "") : "";
                          setValue("conteudo", html, { shouldDirty: true, shouldTouch: true, shouldValidate: false });
                          setConteudoVisivel(true);
                        } catch {
                        }
                      }}
                    >
                      Filtrar
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
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
                  <Button
                    type="primary"
                    ghost
                    size="large"
                    onClick={() => navigate("/processos/convocacao")}
                  >
                    Voltar
                  </Button>
                )}
                <Button type="primary" ghost size="large" onClick={onShowHistorico}>
                  Histórico
                </Button>
              </Col>
            </Row>
          </Card>

          {conteudoVisivel && (
            <Card>
              <Row gutter={24}>
                <Col span={24}>
                  <Controller
                    control={control}
                    name="conteudo"
                    render={({ field }) => (
                      <CustomFormItem
                        label={`E-mail de ${
                          tipoSelecionado === "CONVOCACAO"
                            ? "Convocação"
                            : tipoSelecionado === "VAGAS"
                            ? "Vagas"
                            : tipoSelecionado === "RESULTADOS"
                            ? "Resultados"
                            : ""
                        }`}
                        validateStatus={formErrors.conteudo ? "error" : undefined}
                        help={formErrors.conteudo?.message}
                        labelCol={{ span: 24 }}
                      >
                        <TextTituloSecundario style={{ marginBottom: 16 }}>
                          Este é o e-mail que será enviado a todas as pessoas que prestaram o concurso selecionado. Você pode conferir as informações e realizar as alterações que considerar necessárias.
                        </TextTituloSecundario>
                        <br />
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
                        <br />
                        <div style={{ marginTop: 12 }}>
                          <QuillEditor
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Digite o conteúdo do e-mail..."
                          />
                        </div>
                      </CustomFormItem>
                    )}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </TabContentContainer>

        {conteudoVisivel && (
          <ActionButtonsContainer>
            <Button type="primary" ghost size="large" onClick={() => navigate("/processos/convocacao")}>
              Voltar
            </Button>
            <Button type="primary" size="large" onClick={handleSubmit(handleEnviarForm)}>
              Enviar
            </Button>
          </ActionButtonsContainer>
        )}
      </>
    </BaseTela>
  );
};

export default EnvioEmailsTela;

