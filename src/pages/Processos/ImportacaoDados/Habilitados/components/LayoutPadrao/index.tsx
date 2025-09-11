import React from "react";
import { Table, Button, Typography } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { 
  LayoutContainer, 
  HeaderSection, 
  TableContainer, 
  ButtonContainer,
  SecondaryButton, 
  PrimaryButton 
} from "../../../../../../components/estilosCompartilhados/styles";

const { Title } = Typography;

interface LayoutPadraoProps {
  onVoltar: () => void;
}

const LayoutPadrao: React.FC<LayoutPadraoProps> = ({ onVoltar }) => {
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

  const dataSource = [
    {
      key: "1",
      ordem: 1,
      campo: "Código de inscrição",
      tipoDado: "Texto",
      tamanho: 8,
      regrasValidacao: "Campo obrigatório",
    },
    {
      key: "2",
      ordem: 2,
      campo: "Nome",
      tipoDado: "Texto",
      tamanho: 40,
      regrasValidacao: "Campo obrigatório",
    },
    {
      key: "3",
      ordem: 3,
      campo: "Data de nascimento",
      tipoDado: "Texto",
      tamanho: 10,
      regrasValidacao: "Campo no formato dd/mm/aaaa",
    },
    {
      key: "4",
      ordem: 4,
      campo: "Sexo",
      tipoDado: "Texto",
      tamanho: 1,
      regrasValidacao: "Aceita apenas M para masculino ou F para feminino",
    },
    {
      key: "5",
      ordem: 5,
      campo: "RG",
      tipoDado: "Texto",
      tamanho: 10,
      regrasValidacao: "Campo obrigatório",
    },
    {
      key: "6",
      ordem: 6,
      campo: "CPF",
      tipoDado: "Numérico",
      tamanho: 11,
      regrasValidacao: "Campo no formato 99999999999, apenas números",
    },
    {
      key: "7",
      ordem: 7,
      campo: "Registro Funcional",
      tipoDado: "Texto",
      tamanho: 9,
      regrasValidacao: "",
    },
    {
      key: "8",
      ordem: 8,
      campo: "Vínculo",
      tipoDado: "Texto",
      tamanho: 1,
      regrasValidacao: "",
    },
    {
      key: "9",
      ordem: 9,
      campo: "Endereço",
      tipoDado: "Texto",
      tamanho: 25,
      regrasValidacao: "",
    },
    {
      key: "10",
      ordem: 10,
      campo: "Número",
      tipoDado: "Texto",
      tamanho: 4,
      regrasValidacao: "",
    },
    {
      key: "11",
      ordem: 11,
      campo: "Complemento",
      tipoDado: "Texto",
      tamanho: 7,
      regrasValidacao: "",
    },
    {
      key: "12",
      ordem: 12,
      campo: "Bairro",
      tipoDado: "Texto",
      tamanho: 25,
      regrasValidacao: "",
    },
    {
      key: "13",
      ordem: 13,
      campo: "CEP",
      tipoDado: "Texto",
      tamanho: 8,
      regrasValidacao: "",
    },
    {
      key: "14",
      ordem: 14,
      campo: "Cidade",
      tipoDado: "Texto",
      tamanho: 30,
      regrasValidacao: "Campo obrigatório",
    },
    {
      key: "15",
      ordem: 15,
      campo: "UF",
      tipoDado: "Texto",
      tamanho: 2,
      regrasValidacao: "Campo obrigatório",
    },
    {
      key: "16",
      ordem: 16,
      campo: "Telefone",
      tipoDado: "Texto",
      tamanho: 14,
      regrasValidacao: "",
    },
    {
      key: "17",
      ordem: 17,
      campo: "Celular",
      tipoDado: "Texto",
      tamanho: 14,
      regrasValidacao: "",
    },
    {
      key: "18",
      ordem: 18,
      campo: "Email",
      tipoDado: "Texto",
      tamanho: 50,
      regrasValidacao: "",
    },
    {
      key: "19",
      ordem: 19,
      campo: "Pontos",
      tipoDado: "Texto",
      tamanho: 9,
      regrasValidacao: "",
    },
    {
      key: "20",
      ordem: 20,
      campo: "Classificação",
      tipoDado: "Texto",
      tamanho: 5,
      regrasValidacao: "Campo obrigatório",
    },
    {
      key: "21",
      ordem: 21,
      campo: "Classificação deficiente",
      tipoDado: "Texto",
      tamanho: 5,
      regrasValidacao: "",
    },
    {
      key: "22",
      ordem: 22,
      campo: "Opção de concurso",
      tipoDado: "Texto",
      tamanho: 8,
      regrasValidacao: "Campo obrigatório, aceita apenas Acesso ou Ingresso",
    },
    {
      key: "23",
      ordem: 23,
      campo: "Código do cargo",
      tipoDado: "Texto",
      tamanho: 9,
      regrasValidacao: "Campo obrigatório",
    },
    {
      key: "24",
      ordem: 24,
      campo: "Descrição do cargo",
      tipoDado: "Texto",
      tamanho: 50,
      regrasValidacao: "Campo obrigatório",
    },
  ];

  const handleSalvarArquivo = () => {
    // Implementar lógica para salvar arquivo
    console.log("Salvar arquivo");
  };

  return (
    <div>
      <LayoutContainer>
        <HeaderSection>
          <Title level={3}>Layout: Arquivo de Aprovados (HABILITADOS)</Title>
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
