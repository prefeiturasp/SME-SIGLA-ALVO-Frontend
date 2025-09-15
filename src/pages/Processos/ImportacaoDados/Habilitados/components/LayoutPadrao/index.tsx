import React from "react";
import { Table, Typography } from "antd";
import { LayoutContainer, HeaderSection, TableContainer, ButtonContainer } from "./styles";
import { SecondaryButton, PrimaryButton } from "../../../../../../components/estilosCompartilhados/styles";
import type { ILayout } from "../../../../../../services/resources/importacaoDados/IImportacaoArquivos";

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
      <span style={{ color: text?.includes("obrigatório") ? "#ff4d4f" : "inherit" }}>
        {text}
      </span>
    ),
  },
];

 
const { Title } = Typography;

interface LayoutPadraoProps {
  loading:boolean;
  onVoltar: () => void;
  dataSource: ILayout[],
  title: string,
}

const LayoutPadrao: React.FC<LayoutPadraoProps> = ({ loading,onVoltar, dataSource, title }) => {


  const handleSalvarArquivo = () => {
    // Implementar lógica para salvar arquivo
    console.log("Salvar arquivo");
  };

  return (
    <div>
      <LayoutContainer>
        <HeaderSection>
          <Title level={3}>{title}</Title>
        </HeaderSection>

        <TableContainer>
          <Table
          loading={loading}
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
