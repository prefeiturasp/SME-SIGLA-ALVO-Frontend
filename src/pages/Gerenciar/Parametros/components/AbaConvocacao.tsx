import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col, message, Spin, App } from "antd";
import { ModalSaveButton } from "../../../EscolhaCandidatos/styles";
import { getParametrizacaoCandidatos } from "../hooks/getParametrizacaoCandidatos";
import { patchParametrizacaoCandidatos } from "../hooks/patchParametrizacaoCandidatos";
import {
  StyledCustomFormItem,
  StyledInputNumber,
  ButtonContainer,
  ErrorMessage,
} from "../styles";

const AbaConvocacao: React.FC = () => {
  const { notification } = App.useApp();
  
  // Valores padrão conforme a lei
  const DEFAULT_PORCENTAGEM_PCD = 0.05;
  const DEFAULT_PORCENTAGEM_NNA = 0.2;

  const [porcentagemDef, setPorcentagemDef] = useState<number | null>(DEFAULT_PORCENTAGEM_PCD);
  const [porcentagemNna, setPorcentagemNna] = useState<number | null>(DEFAULT_PORCENTAGEM_NNA);
  const [porcentagemDefInicial, setPorcentagemDefInicial] = useState<number | null>(DEFAULT_PORCENTAGEM_PCD);
  const [porcentagemNnaInicial, setPorcentagemNnaInicial] = useState<number | null>(DEFAULT_PORCENTAGEM_NNA);
  const [parametrizacaoUuid, setParametrizacaoUuid] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasFetchedRef = useRef<boolean>(false);

  // Buscar dados do backend ao carregar o componente (apenas uma vez)
  useEffect(() => {
    // Evita múltiplas chamadas (React StrictMode ou remontagens)
    if (hasFetchedRef.current) {
      return;
    }

    const fetchParametrizacao = async () => {
      hasFetchedRef.current = true;
      setIsLoading(true);
      try {
        const data = await getParametrizacaoCandidatos();
        
        // O GET retorna um array, pegar o primeiro item
        const parametrizacao = Array.isArray(data) ? data[0] : data;
        
        // Se o backend retornar dados, usar eles; caso contrário, usar valores padrão
        if (parametrizacao) {
          // Armazenar UUID
          setParametrizacaoUuid(parametrizacao.uuid);
          
          const pcdValue = parametrizacao.porcentagem_pcd ?? DEFAULT_PORCENTAGEM_PCD;
          const nnaValue = parametrizacao.porcentagem_nna ?? DEFAULT_PORCENTAGEM_NNA;
          
          setPorcentagemDef(pcdValue);
          setPorcentagemNna(nnaValue);
          // Armazenar valores iniciais para comparação
          setPorcentagemDefInicial(pcdValue);
          setPorcentagemNnaInicial(nnaValue);
        } else {
          // Se não houver dados, usar valores padrão
          setPorcentagemDef(DEFAULT_PORCENTAGEM_PCD);
          setPorcentagemNna(DEFAULT_PORCENTAGEM_NNA);
          setPorcentagemDefInicial(DEFAULT_PORCENTAGEM_PCD);
          setPorcentagemNnaInicial(DEFAULT_PORCENTAGEM_NNA);
        }
      } catch (error) {
        console.error("Erro ao buscar parâmetros de convocação:", error);
        message.warning("Não foi possível carregar os parâmetros. Usando valores padrão.");
        // Em caso de erro, usar valores padrão
        setPorcentagemDef(DEFAULT_PORCENTAGEM_PCD);
        setPorcentagemNna(DEFAULT_PORCENTAGEM_NNA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParametrizacao();
  }, []);

  const handleSalvar = async () => {
    // Verificar se houve alterações
    const porcentagemDefAlterada = porcentagemDef !== porcentagemDefInicial;
    const porcentagemNnaAlterada = porcentagemNna !== porcentagemNnaInicial;
    
    // Se não houve alterações, não fazer PATCH
    if (!porcentagemDefAlterada && !porcentagemNnaAlterada) {
      notification.info({
        message: "Nenhuma alteração realizada!",
        placement: "top",
        duration: 2,
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Enviar porcentagem_pcd e porcentagem_nna para o backend
      const payload = {
        porcentagem_pcd: porcentagemDef || 0,
        porcentagem_nna: porcentagemNna || 0,
      };

      // Usar o UUID na URL do PATCH
      await patchParametrizacaoCandidatos(payload, parametrizacaoUuid || undefined);
      
      // Atualizar valores iniciais após salvar
      setPorcentagemDefInicial(porcentagemDef);
      setPorcentagemNnaInicial(porcentagemNna);
      
      notification.success({
        message: "Parâmetros de Convocação atualizados com sucesso!",
        placement: "top",
        duration: 2,
      });
    } catch (error) {
      console.error("Erro ao salvar parâmetros de convocação:", error);
      notification.error({
        message: "Erro na atualização dos Parâmetros de Convocação",
        placement: "top",
        duration: 3.5,
      });
    } finally {
      setIsSaving(false);
    }
  };


  // Validação: soma das porcentagens não pode ser maior que 1
  const somaPorcentagens = (porcentagemDef || 0) + (porcentagemNna || 0);
  const isSomaInvalida = somaPorcentagens > 1;

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
        {/* Porcentagem DEF */}
        <Col xs={24} md={12}>
          <StyledCustomFormItem label="Porcentagem DEF">
            <StyledInputNumber
              value={porcentagemDef}
              onChange={(value) => {
                const numValue = typeof value === 'number' ? value : null;
                setPorcentagemDef(numValue);
              }}
              min={0}
              max={1}
              step={0.01}
              placeholder="0,00"
              controls={false}
            />
          </StyledCustomFormItem>
        </Col>

        {/* Porcentagem NNA */}
        <Col xs={24} md={12}>
          <StyledCustomFormItem label="Porcentagem NNA">
            <StyledInputNumber
              value={porcentagemNna}
              onChange={(value) => {
                const numValue = typeof value === 'number' ? value : null;
                setPorcentagemNna(numValue);
              }}
              min={0}
              max={1}
              step={0.01}
              placeholder="0,00"
              controls={false}
            />
          </StyledCustomFormItem>
        </Col>
      </Row>

      {/* Mensagem de erro de validação */}
      {isSomaInvalida && (
        <Row>
          <Col xs={24}>
            <ErrorMessage>
              A soma das porcentagens DEF e NNA não pode ser maior que 1
            </ErrorMessage>
          </Col>
        </Row>
      )}

      {/* Botão Salvar */}
      <ButtonContainer>
        <ModalSaveButton
          size="large"
          type="primary"
          onClick={handleSalvar}
          loading={isSaving}
          disabled={isSomaInvalida}
        >
          Salvar
        </ModalSaveButton>
      </ButtonContainer>
    </Card>
  );
};

export default AbaConvocacao;

