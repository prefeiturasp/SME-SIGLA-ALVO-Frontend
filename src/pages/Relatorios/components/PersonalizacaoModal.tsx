import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Checkbox, Spin, App } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import QuillEditor from "./QuillEditor";
import { ModalInfoCard, ModalInfoItem, ModalInfoLabel, ModalInfoValue } from "../../EscolhaCandidatos/styles";
import { getPersonalizacaoRelatorio } from "../hooks/useGetPersonalizacaoRelatorio";
import { patchPersonalizacaoRelatorio } from "../hooks/usePatchPersonalizacaoRelatorio";
import type { PersonalizacaoModalProps } from "../../../services/resources/relatorios/IRelatorios";

const PersonalizacaoModal: React.FC<PersonalizacaoModalProps> = ({
  open,
  onCancel,
  selectedRelatorio,
  processoNome,
  processoUuid,
}) => {
  const { notification } = App.useApp();
  const [usarCabecalhoPadrao, setUsarCabecalhoPadrao] = useState(false);
  const [usarLogotipo, setUsarLogotipo] = useState(true);
  const [cabecalhoPadraoHtml, setCabecalhoPadraoHtml] = useState<string>("");
  const [textoPadraoFinalHtml, setTextoPadraoFinalHtml] = useState<string>("");
  const [personalizacaoUuid, setPersonalizacaoUuid] = useState<string | null>(null);
  const [isLoadingPersonalizacao, setIsLoadingPersonalizacao] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const hasFetchedRef = useRef<boolean>(false);
  
  const [valoresIniciais, setValoresIniciais] = useState({
    usarCabecalhoPadrao: false,
    usarLogotipo: true,
    cabecalhoPadraoHtml: "",
    textoPadraoFinalHtml: "",
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
          processoUuid,
          selectedRelatorio.key
        );
        
        // Armazenar UUID (sempre vem, mesmo que seja null - similar ao logo da parametrização)
        setPersonalizacaoUuid(personalizacaoData?.uuid ?? null);
        const usarCabecalho = personalizacaoData?.usar_cabecalho ?? false;
        const usarLogotipo = personalizacaoData?.usar_logotipo ?? true;
        const cabecalho = personalizacaoData?.cabecalho ?? "";
        const textoFinal = personalizacaoData?.texto_final ?? "";
        
        setUsarCabecalhoPadrao(usarCabecalho);
        setUsarLogotipo(usarLogotipo);
        setCabecalhoPadraoHtml(cabecalho);
        setTextoPadraoFinalHtml(textoFinal);
        
        // Armazenar valores iniciais para comparação (sempre definir, mesmo se não houver dados)
        setValoresIniciais({
          usarCabecalhoPadrao: usarCabecalho,
          usarLogotipo: usarLogotipo,
          cabecalhoPadraoHtml: cabecalho,
          textoPadraoFinalHtml: textoFinal,
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
      setUsarCabecalhoPadrao(false);
      setUsarLogotipo(true);
      setCabecalhoPadraoHtml("");
      setTextoPadraoFinalHtml("");
      setValoresIniciais({
        usarCabecalhoPadrao: false,
        usarLogotipo: true,
        cabecalhoPadraoHtml: "",
        textoPadraoFinalHtml: "",
      });
    }
  }, [open]);
  
  const hasChanges = () => {
    return (
      usarCabecalhoPadrao !== valoresIniciais.usarCabecalhoPadrao ||
      usarLogotipo !== valoresIniciais.usarLogotipo ||
      cabecalhoPadraoHtml !== valoresIniciais.cabecalhoPadraoHtml ||
      textoPadraoFinalHtml !== valoresIniciais.textoPadraoFinalHtml
    );
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
        processoUuid,
        tipoRelatorio: selectedRelatorio.key,
        usar_cabecalho: usarCabecalhoPadrao,
        usar_logotipo: usarLogotipo,
        cabecalho: cabecalhoPadraoHtml,
        texto_final: textoPadraoFinalHtml,
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
        <ModalInfoCard>
          <ModalInfoItem>
            <ModalInfoLabel style={{ color: "#000000" }}>Processo</ModalInfoLabel>
            <ModalInfoValue style={{ color: "#515151" }}>
              {processoNome || "—"}
            </ModalInfoValue>
          </ModalInfoItem>
        </ModalInfoCard>

        {/* Seção Usar cabeçalho padrão */}
        <div>
          <div style={{ display: "flex", gap: 150, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <ModalInfoLabel style={{ color: "#000000" }}>Usar cabeçalho padrão?</ModalInfoLabel>
              <Checkbox
                checked={usarCabecalhoPadrao}
                onChange={(e) => setUsarCabecalhoPadrao(e.target.checked)}
              >
                Sim
              </Checkbox>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <ModalInfoLabel style={{ color: "#000000" }}>Usar logotipo?</ModalInfoLabel>
              <Checkbox
                checked={usarLogotipo}
                onChange={(e) => setUsarLogotipo(e.target.checked)}
              >
                Sim
              </Checkbox>
            </div>
          </div>
        </div>

        {/* Seção Cabeçalho padrão */}
        <div>
          <ModalInfoLabel style={{ display: "block", marginBottom: 12, color: "#000000" }}>Cabeçalho:</ModalInfoLabel>
          <QuillEditor
            value={cabecalhoPadraoHtml}
            onChange={setCabecalhoPadraoHtml}
            placeholder="Digite o cabeçalho"
            height={140}
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

