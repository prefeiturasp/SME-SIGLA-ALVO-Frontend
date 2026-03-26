import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Typography, Button, Upload, Spin, App } from "antd";
import ImageIcon from "@mui/icons-material/Image";
import QuillEditor from "../../../Relatorios/components/QuillEditor";
import type { UploadFile } from "antd/es/upload/interface";
import { ModalSaveButton } from "../../../EscolhaCandidatos/styles";
import { getParametrizacaoRelatorios } from "../hooks/getParametrizacaoRelatorios";
import { patchParametrizacaoRelatorios } from "../hooks/patchParametrizacaoRelatorios";
import {
  LabelText,
  ButtonContainer,
  QuillEditorWrapper,
} from "../styles";

const { Text } = Typography;

const AbaRelatorios: React.FC<{ 
  canAddParametrizacao: boolean }> = ({ canAddParametrizacao }) => {
  const { notification } = App.useApp();
  
  const [logoFile, setLogoFile] = useState<UploadFile | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null); // URL da logo do backend
  const [cabecalhoHtml, setCabecalhoHtml] = useState<string>("");
  const [parametrizacaoUuid, setParametrizacaoUuid] = useState<string | null>(null);
  const [cabecalhoInicial, setCabecalhoInicial] = useState<string>(""); // Valor inicial do cabeçalho
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasFetchedRef = useRef<boolean>(false);

  // Buscar dados do backend ao carregar o componente (apenas uma vez)
  useEffect(() => {
    if (hasFetchedRef.current) {
      return;
    }

    const fetchParametrizacao = async () => {
      hasFetchedRef.current = true;
      setIsLoading(true);
      try {
        const data = await getParametrizacaoRelatorios();
        
        // O GET retorna um array, pegar o primeiro item
        const parametrizacao = Array.isArray(data) ? data[0] : data;
        console.log(parametrizacao);
        if (parametrizacao) {
          // Armazenar UUID
          setParametrizacaoUuid(parametrizacao.uuid);
          
          // Carregar cabeçalho (corrigir nome do campo: cabecalho sem acento)
          const cabecalhoValue = parametrizacao.cabecalho || parametrizacao.cabeçalho || "";
          setCabecalhoHtml(cabecalhoValue);
          setCabecalhoInicial(cabecalhoValue); // Armazenar valor inicial para comparação
          
          // Carregar logo se existir
          if (parametrizacao.logo) {
            setLogoUrl(parametrizacao.logo);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar parâmetros de relatórios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParametrizacao();
  }, []);

  const handleSalvar = async () => {
    // Verificar se houve alterações
    const cabecalhoAlterado = cabecalhoHtml !== cabecalhoInicial;
    const logoAlterada = logoFile && logoFile.originFileObj !== null;
    
    // Se não houve alterações, não fazer PATCH
    if (!cabecalhoAlterado && !logoAlterada) {
      notification.info({
        message: "Nenhuma alteração realizada!",
        placement: "top",
        duration: 2,
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Criar FormData para enviar logo (se houver) e cabeçalho
      const formData = new FormData();
      
      // Adicionar cabeçalho apenas se foi alterado
      if (cabecalhoAlterado) {
        formData.append('cabecalho', cabecalhoHtml);
      }
      
      // Adicionar logo apenas se uma nova imagem foi selecionada
      if (logoAlterada && logoFile && logoFile.originFileObj) {
        formData.append('logo', logoFile.originFileObj);
      }
      
      // Usar o UUID na URL do PATCH
      await patchParametrizacaoRelatorios(formData, parametrizacaoUuid || undefined);
      
      notification.success({
        message: "Parâmetros de Relatórios atualizados com sucesso!",
        placement: "top",
        duration: 2,
      });
      
      // Atualizar valores iniciais após salvar
      setCabecalhoInicial(cabecalhoHtml);
      
      // Atualizar logoUrl se uma nova logo foi enviada
      if (logoAlterada && logoFile && logoFile.originFileObj) {
        const newLogoUrl = URL.createObjectURL(logoFile.originFileObj);
        setLogoUrl(newLogoUrl);
        // Limpar logoFile para não considerar como alterada na próxima vez
        setLogoFile(null);
      }
    } catch (error) {
      console.error("Erro ao salvar parâmetros de relatórios:", error);
      notification.error({
        message: "Erro na atualização dos Parâmetros de Relatórios",
        placement: "top",
        duration: 3.5,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getImagePreview = (file: UploadFile | null, backendUrl: string | null = null) => {
    // Prioridade: arquivo selecionado > URL do backend
    if (file && file.originFileObj) {
      return URL.createObjectURL(file.originFileObj);
    }
    if (backendUrl) {
      return backendUrl;
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card style={{ border: "none", borderRadius: 12 }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ border: "none", borderRadius: 12 }}>
      <Row gutter={[24, 24]}>
        {/* Seção Logo */}
        <Col xs={24} md={12}>
          <div>
            <LabelText>Logo</LabelText>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {getImagePreview(logoFile, logoUrl) ? (
                  <img
                    src={getImagePreview(logoFile, logoUrl)!}
                    alt="Logo preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <ImageIcon style={{ fontSize: "48px", color: "#8c8c8c" }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    display: "block",
                    marginBottom: "12px",
                  }}
                >
                  Envie uma imagem com um tamanho inferior a 2MB.
                </Text>
                <Upload
                  beforeUpload={(file) => {
                    // Validar tamanho (2MB = 2 * 1024 * 1024 bytes)
                    if (file.size > 2 * 1024 * 1024) {
                      notification.error({
                        message: "O arquivo deve ter um tamanho inferior a 2MB.",
                        placement: "top",
                        duration: 3,
                      });
                      return Upload.LIST_IGNORE;
                    }
                    setLogoFile({
                      uid: file.uid,
                      name: file.name,
                      status: "done",
                      originFileObj: file,
                    } as UploadFile);
                    return false; // Impede upload automático
                  }}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button type="default" style={{ borderColor: "#0F59C8", color: "#0F59C8" }}>
                    Escolher imagem
                  </Button>
                </Upload>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Seção Cabeçalho padrão */}
      <div style={{ marginTop: "32px" }}>
        <LabelText>Cabeçalho padrão:</LabelText>
        <QuillEditorWrapper>
          <QuillEditor
            value={cabecalhoHtml}
            onChange={setCabecalhoHtml}
            placeholder="Digite o cabeçalho padrão"
            height={240}
          />
        </QuillEditorWrapper>
      </div>

      {/* Botão Salvar */}
      <ButtonContainer>
        <ModalSaveButton
          disabled={!canAddParametrizacao}
          size="large"
          type="primary"
          onClick={handleSalvar}
          loading={isSaving}
        >
          Salvar
        </ModalSaveButton>
      </ButtonContainer>
    </Card>
  );
};

export default AbaRelatorios;

