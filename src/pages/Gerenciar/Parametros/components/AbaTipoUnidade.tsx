import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col, App } from "antd";
import { ModalSaveButton } from "../../../EscolhaCandidatos/styles";
import {
  ColumnContainer,
  CheckboxItem,
  ButtonContainer,
} from "../styles";
import { getParametrizacaoEscolhas, type ParametrizacaoTipoUnidade } from "../hooks/getParametrizacaoEscolhas";
import { patchParametrizacaoEscolhas } from "../hooks/patchParametrizacaoEscolhas";

type TipoUnidadeItem = ParametrizacaoTipoUnidade;

const dividirEmTresColunas = <T,>(array: T[]): [T[], T[], T[]] => {
  const tamanho = array.length;
  const tamanhoPorColuna = Math.ceil(tamanho / 3);
  
  return [
    array.slice(0, tamanhoPorColuna),
    array.slice(tamanhoPorColuna, tamanhoPorColuna * 2),
    array.slice(tamanhoPorColuna * 2),
  ];
};

const AbaTipoUnidade: React.FC = () => {
  const { notification } = App.useApp();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tiposUnidade, setTiposUnidade] = useState<TipoUnidadeItem[]>([]);
  const [tiposUnidadeInicial, setTiposUnidadeInicial] = useState<TipoUnidadeItem[]>([]);
  const hasFetchedRef = useRef<boolean>(false);

  useEffect(() => {
    // Evita múltiplas chamadas (React StrictMode ou remontagens)
    if (hasFetchedRef.current) {
      return;
    }

    const fetchData = async () => {
      hasFetchedRef.current = true;
      try {
        setIsLoading(true);
        const data = await getParametrizacaoEscolhas();
        setTiposUnidade(data);
        setTiposUnidadeInicial(data);
      } catch (error) {
        notification.error({
          message: "Erro ao carregar tipos de unidade.",
          placement: "top",
          duration: 3.5,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [notification]);

  const handleCheckboxChange = (uuid: string, usar: boolean) => {
    setTiposUnidade((prev) =>
      prev.map((item) =>
        item.uuid === uuid ? { ...item, usar } : item
      )
    );
  };

  const [coluna1, coluna2, coluna3] = dividirEmTresColunas(tiposUnidade);

  const handleSalvar = async () => {
    // Filtrar apenas os itens que foram alterados
    const itensAlterados = tiposUnidade
      .map((item) => {
        const itemInicial = tiposUnidadeInicial.find((ini) => ini.uuid === item.uuid);
        if (item.usar !== itemInicial?.usar) {
          return {
            uuid: item.uuid,
            usar: item.usar,
          };
        }
        return null;
      })
      .filter((item): item is { uuid: string; usar: boolean } => item !== null);
    
    // Se não houve alterações, não fazer request
    if (itensAlterados.length === 0) {
      notification.info({
        message: "Nenhuma alteração realizada!",
        placement: "top",
        duration: 2,
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Enviar apenas os itens alterados para o backend
      await patchParametrizacaoEscolhas(itensAlterados);
      
      // Atualizar valores iniciais após salvar
      setTiposUnidadeInicial([...tiposUnidade]);
      
      notification.success({
        message: "Tipos de unidade salvos com sucesso!",
        placement: "top",
        duration: 2,
      });
    } catch (error) {
      console.error("Erro ao salvar tipos de unidade:", error);
      notification.error({
        message: "Erro ao salvar os tipos de unidade.",
        placement: "top",
        duration: 3.5,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card style={{ border: "none", borderRadius: 12 }}>
        <div style={{ textAlign: "center", padding: "40px 0" }}>Carregando...</div>
      </Card>
    );
  }

  return (
    <Card style={{ border: "none", borderRadius: 12 }}>
      <Row gutter={[32, 24]}>
        {/* Coluna 1 */}
        <Col xs={24} md={8}>
          <ColumnContainer>
            {coluna1.map((item) => (
              <CheckboxItem
                key={item.uuid}
                checked={item.usar}
                onChange={(e) => handleCheckboxChange(item.uuid, e.target.checked)}
              >
                {item.tipo_ue}
              </CheckboxItem>
            ))}
          </ColumnContainer>
        </Col>

        {/* Coluna 2 */}
        <Col xs={24} md={8}>
          <ColumnContainer>
            {coluna2.map((item) => (
              <CheckboxItem
                key={item.uuid}
                checked={item.usar}
                onChange={(e) => handleCheckboxChange(item.uuid, e.target.checked)}
              >
                {item.tipo_ue}
              </CheckboxItem>
            ))}
          </ColumnContainer>
        </Col>

        {/* Coluna 3 */}
        <Col xs={24} md={8}>
          <ColumnContainer>
            {coluna3.map((item) => (
              <CheckboxItem
                key={item.uuid}
                checked={item.usar}
                onChange={(e) => handleCheckboxChange(item.uuid, e.target.checked)}
              >
                {item.tipo_ue}
              </CheckboxItem>
            ))}
          </ColumnContainer>
        </Col>
      </Row>

      {/* Botão Salvar */}
      <ButtonContainer>
        <ModalSaveButton
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

export default AbaTipoUnidade;

