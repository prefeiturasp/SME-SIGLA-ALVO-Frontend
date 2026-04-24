import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Checkbox, Spin, App } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import QuillEditor from "./QuillEditor";
import { ModalInfoCard, ModalInfoItem, ModalInfoLabel, ModalInfoValue } from "../../EscolhaCandidatos/styles";
import { getPersonalizacaoRelatorio } from "../hooks/useGetPersonalizacaoRelatorio";
import { patchPersonalizacaoRelatorio } from "../hooks/usePatchPersonalizacaoRelatorio";
import type { PersonalizacaoModalProps } from "../../../services/resources/relatorios/IRelatorios";

const RELATORIOS_COM_CABECALHO_GABARITO = new Set([
  "LAUDA_VAGAS",
  "LAUDA_CONVOCACAO",
  "SUMULA_ESCOLHAS",
  "SUMULA_RECONVOCACAO",
  "SUMULA_NAO_ESCOLHAS",
  "ATA_ESCOLHA",
]);

const RELATORIOS_COM_LOGOTIPO_LATERAL = new Set([
  "LAUDA_VAGAS",
  "RELACAO_VAGAS",
  "LISTAGEM_ESCOLHAS_DRES",
  "RESULTADO_ESCOLHA",
  "LISTA_CANDIDATOS_SESSAO",
]);

const PersonalizacaoModal: React.FC<PersonalizacaoModalProps> = ({
  open,
  onCancel,
  selectedRelatorio,
  processoNome,
  processoUuid,
}) => {
  const { notification } = App.useApp();
  const usaCabecalhoGabarito = RELATORIOS_COM_CABECALHO_GABARITO.has(
    selectedRelatorio?.key ?? ""
  );
  const usaLogotipoLateral = RELATORIOS_COM_LOGOTIPO_LATERAL.has(
    selectedRelatorio?.key ?? ""
  );
  const [usarLogotipo, setUsarLogotipo] = useState(true);
  const [cabecalhoGabaritoHtml, setCabecalhoGabaritoHtml] = useState<string>("");
  const [cabecalhoHtml, setCabecalhoHtml] = useState<string>("");
  const [textoPadraoFinalHtml, setTextoPadraoFinalHtml] = useState<string>("");
  const [cabecalhoCapaAtaHtml, setCabecalhoCapaAtaHtml] = useState<string>("");
  const [personalizacaoUuid, setPersonalizacaoUuid] = useState<string | null>(null);
  const [isLoadingPersonalizacao, setIsLoadingPersonalizacao] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const hasFetchedRef = useRef<boolean>(false);
  
  const [valoresIniciais, setValoresIniciais] = useState({
    usarLogotipo: true,
    cabecalhoGabaritoHtml: "",
    cabecalhoHtml: "",
    textoPadraoFinalHtml: "",
    cabecalhoCapaAtaHtml: "",
  });

  useEffect(() => {
    if (!open || !processoUuid || !selectedRelatorio?.key) {
      return;
    }

    if (hasFetchedRef.current) {
      return;
    }

    const fetchPersonalizacao = async () => {
      hasFetchedRef.current = true;
      setIsLoadingPersonalizacao(true);
      try {
        const personalizacaoData = await getPersonalizacaoRelatorio(
          selectedRelatorio.key
        );
        
        // Armazenar UUID (sempre vem, mesmo que seja null - similar ao logo da parametrização)
        setPersonalizacaoUuid(personalizacaoData?.uuid ?? null);
        const usarLogotipo = personalizacaoData?.usar_logotipo ?? true;
        const cabecalhoGabarito = personalizacaoData?.cabecalho_gabarito ?? "";
        const cabecalho = personalizacaoData?.cabecalho ?? "";
        const textoFinal = personalizacaoData?.texto_final ?? "";
        const cabecalhoCapaAta = personalizacaoData?.cabecalho_capa_ata ?? "";
        
        setUsarLogotipo(usarLogotipo);
        setCabecalhoGabaritoHtml(cabecalhoGabarito);
        setCabecalhoHtml(cabecalho);
        setTextoPadraoFinalHtml(textoFinal);
        setCabecalhoCapaAtaHtml(cabecalhoCapaAta);
        
        // Armazenar valores iniciais para comparação (sempre definir, mesmo se não houver dados)
        setValoresIniciais({
          usarLogotipo: usarLogotipo,
          cabecalhoGabaritoHtml: cabecalhoGabarito,
          cabecalhoHtml: cabecalho,
          textoPadraoFinalHtml: textoFinal,
          cabecalhoCapaAtaHtml: cabecalhoCapaAta,
        });
      } catch (error) {
        console.error("Erro ao buscar personalização do relatório:", error);
      } finally {
        setIsLoadingPersonalizacao(false);
      }
    };

    fetchPersonalizacao();
  }, [open, processoUuid, selectedRelatorio?.key]);

  useEffect(() => {
    if (!open) {
      hasFetchedRef.current = false;
      setPersonalizacaoUuid(null);
      setUsarLogotipo(true);
      setCabecalhoGabaritoHtml("");
      setCabecalhoHtml("");
      setTextoPadraoFinalHtml("");
      setCabecalhoCapaAtaHtml("");
      setValoresIniciais({
        usarLogotipo: true,
        cabecalhoGabaritoHtml: "",
        cabecalhoHtml: "",
        textoPadraoFinalHtml: "",
        cabecalhoCapaAtaHtml: "",
      });
    }
  }, [open]);
  
  const hasChanges = () => {
    const isAtaEscolha = selectedRelatorio?.key === "ATA_ESCOLHA";
    return (
      usarLogotipo !== valoresIniciais.usarLogotipo ||
      (usaCabecalhoGabarito &&
        cabecalhoGabaritoHtml !== valoresIniciais.cabecalhoGabaritoHtml) ||
      cabecalhoHtml !== valoresIniciais.cabecalhoHtml ||
      textoPadraoFinalHtml !== valoresIniciais.textoPadraoFinalHtml ||
      (isAtaEscolha && cabecalhoCapaAtaHtml !== valoresIniciais.cabecalhoCapaAtaHtml)
    );
  };

  const handleCopyCabecalhoGabarito = () => {
    setCabecalhoHtml(cabecalhoGabaritoHtml);
  };

  const handleSave = async () => {
    if (!selectedRelatorio?.key || !processoUuid) {
      return;
    }

    if (!hasChanges()) {
      notification.info({
        message: "Nenhuma Personalização realizada.",
        placement: "top",
        duration: 2,
      });
      return;
    }

    setIsSaving(true);
    try {
      await patchPersonalizacaoRelatorio({
        tipoRelatorio: selectedRelatorio.key,
        usar_logotipo: usarLogotipo,
        ...(usaCabecalhoGabarito
          ? { cabecalho_gabarito: cabecalhoGabaritoHtml }
          : {}),
        cabecalho: cabecalhoHtml,
        texto_final: textoPadraoFinalHtml,
        // Enviar somente quando for do tipo ATA_ESCOLHA
        ...(selectedRelatorio.key === "ATA_ESCOLHA"
          ? { cabecalho_capa_ata: cabecalhoCapaAtaHtml }
          : {}),
        uuid: personalizacaoUuid ?? null,
      });

      setIsSaving(false);
      onCancel();
    } catch (error) {
      console.error("Erro ao salvar personalização do relatório:", error);
      setIsSaving(false);
      onCancel();
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={handleCancel}
        title={selectedRelatorio ? `Personalizar ${selectedRelatorio.tipo}` : "Personalização"}
        width={1200}
        styles={{
          footer: {
            paddingTop: 16,
          },
        }}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            disabled={isSaving || isLoadingPersonalizacao}
          >
            Salvar
          </Button>,
        ]}
      >
      <Spin spinning={isLoadingPersonalizacao || isSaving}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Seção Processo */}
        <div
          style={
            usaLogotipoLateral
              ? {
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 24,
                }
              : { width: "100%" }
          }
        >
          <ModalInfoCard
            style={
              usaLogotipoLateral
                ? {
                    width: "50%",
                    minWidth: 320,
                  }
                : undefined
            }
          >
            <ModalInfoItem>
              <ModalInfoLabel style={{ color: "#000000" }}>Processo</ModalInfoLabel>
              <ModalInfoValue style={{ color: "#515151" }}>
                {processoNome || "—"}
              </ModalInfoValue>
            </ModalInfoItem>
          </ModalInfoCard>
          {usaLogotipoLateral && (
            <div
              style={{
                width: "50%",
                minWidth: 320,
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
                padding: "1.5rem 1.75rem",
              }}
            >
              <ModalInfoLabel style={{ color: "#000000" }}>Usar logotipo?</ModalInfoLabel>
              <Checkbox
                checked={usarLogotipo}
                onChange={(e) => setUsarLogotipo(e.target.checked)}
              >
                Sim
              </Checkbox>
            </div>
          )}
        </div>

        {!usaCabecalhoGabarito && (
          <div>
            <div style={{ display: "flex", gap: 150, alignItems: "flex-start", flexWrap: "wrap" }}>
              {!usaLogotipoLateral && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <ModalInfoLabel style={{ color: "#000000" }}>Usar logotipo?</ModalInfoLabel>
                  <Checkbox
                    checked={usarLogotipo}
                    onChange={(e) => setUsarLogotipo(e.target.checked)}
                  >
                    Sim
                  </Checkbox>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Seção Cabeçalho da capa (somente para ATA_ESCOLHA) */}
        {selectedRelatorio?.key === "ATA_ESCOLHA" && (
          <div>
            <ModalInfoLabel style={{ display: "block", marginBottom: 12, color: "#000000" }}>
              Cabeçalho da capa (Ata):
            </ModalInfoLabel>
            <QuillEditor
              value={cabecalhoCapaAtaHtml}
              onChange={setCabecalhoCapaAtaHtml}
              placeholder="Digite o cabeçalho da capa da ata"
              height={140}
            />
          </div>
        )}

        {/* Seção Cabeçalho padrão */}
        {usaCabecalhoGabarito && (
          <>
            <div>
              <ModalInfoLabel style={{ display: "block", marginBottom: 12, color: "#000000" }}>Cabeçalho gabarito:</ModalInfoLabel>
              <QuillEditor
                value={cabecalhoGabaritoHtml}
                onChange={setCabecalhoGabaritoHtml}
                placeholder="Digite o cabeçalho"
                height={140}
              />
            </div>

            <div style={{ marginTop: 4, marginBottom: 0, position: "relative", zIndex: 1 }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleCopyCabecalhoGabarito}
                disabled={isSaving || isLoadingPersonalizacao}
              >
                Copiar cabeçalho gabarito
              </Button>
            </div>
          </>
        )}

        <div style={{ marginTop: 4 }}>
          <ModalInfoLabel style={{ display: "block", marginBottom: 12, color: "#000000" }}>Cabeçalho:</ModalInfoLabel>
          <QuillEditor
            value={cabecalhoHtml}
            onChange={setCabecalhoHtml}
            placeholder="Digite o cabeçalho"
            height={140}
            showToolbar={usaCabecalhoGabarito ? false : true}
          />
        </div>

        {/* Seção Texto padrão final */}
        <div>
          <ModalInfoLabel style={{ display: "block", marginBottom: 12, color: "#000000" }}>Texto final:</ModalInfoLabel>
          <QuillEditor
            value={textoPadraoFinalHtml}
            onChange={setTextoPadraoFinalHtml}
            placeholder="Digite o texto final"
            height={140}
          />
        </div>

      </div>
      </Spin>
    </Modal>
    </>
  );
};

export default PersonalizacaoModal;

