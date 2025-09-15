import React from "react";
import { Table, Typography, Spin } from "antd";
import { 
  LayoutContainer, 
  HeaderSection, 
  TableContainer, 
  ButtonContainer,
  SecondaryButton, 
  PrimaryButton 
} from "../../../../../../components/estilosCompartilhados/styles";
import type { ILayoutPadrao } from "../../../../../../services/resources/importacaoDados/IImportacaoArquivos";

const { Title } = Typography;

interface LayoutPadraoProps {
  onVoltar: () => void;
  layoutData?: ILayoutPadrao;
  isLoading?: boolean;
}

const LayoutPadrao: React.FC<LayoutPadraoProps> = ({ onVoltar, layoutData, isLoading = false }) => {
  const columns = [
    {
      title: "Ordem",
      dataIndex: "ordem",
      key: "ordem",
      width: "10%",
      align: "center" as const,
    },
    {
      title: "Campo",
      dataIndex: "campo",
      key: "campo",
      width: "25%",
    },
    {
      title: "Tipo de dado",
      dataIndex: "tipoDado",
      key: "tipoDado",
      width: "15%",
    },
    {
      title: "Tamanho",
      dataIndex: "tamanho",
      key: "tamanho",
      width: "10%",
      align: "center" as const,
    },
    {
      title: "Regras de validação",
      dataIndex: "regrasValidacao",
      key: "regrasValidacao",
      width: "40%",
      render: (text: string) => (
        <span style={{ color: text.includes("obrigatório") ? "#ff4d4f" : "inherit" }}>
          {text}
        </span>
      ),
    },
  ];

  // Converter os dados dinâmicos para o formato da tabela
  const dataSource = layoutData?.results?.[0]?.estrutura?.map((campo, index) => ({
    key: campo.key || index.toString(),
    ordem: campo.ordem,
    campo: campo.campo,
    tipoDado: campo.tipoDado,
    tamanho: campo.tamanho,
    regrasValidacao: campo.regrasValidacao,
  })) || [];

  const handleSalvarArquivo = () => {
    // Implementar lógica para salvar arquivo
    console.log("Salvar arquivo");
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <LayoutContainer>
        <HeaderSection>
          <Title level={3}>
            Layout: Arquivo de Aprovados ({layoutData?.results?.[0]?.tipo || "HABILITADOS"})
          </Title>
        </HeaderSection>
        
        <TableContainer>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size="middle"
            scroll={{ x: "100%" }}
          />
        </TableContainer>
      </LayoutContainer>

      <ButtonContainer>
        <SecondaryButton
          size="large"
          onClick={onVoltar}
        >
          Voltar
        </SecondaryButton>
        <PrimaryButton
          size="large"
          onClick={handleSalvarArquivo}
        >
          Exportar
        </PrimaryButton>
      </ButtonContainer>
    </div>
  );
};

export default LayoutPadrao;
