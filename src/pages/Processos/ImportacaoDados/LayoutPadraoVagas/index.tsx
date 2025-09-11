import React from "react";
import { Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import BaseScreen, { type TitleItem } from "../../../BaseScreen";
 
import LayoutPadrao from "../Habilitados/components/LayoutPadrao";

const { Text } = Typography;

const breadcrumbItems = [
  { title: <Link to="/"><Text strong>Home</Text></Link> },
  { title: <Link to="/processos"><Text strong>Processos</Text></Link> },
  { title: "Importação de dados" },
] as TitleItem[];

const LayoutPadraoVagas: React.FC = () => {
 
 

  const dataSourceDefault = [
    {
      key: "1",
      ordem: 1,
      campo: "Data de fechamento do módulo",
      tipoDado: "Data",
      tamanho: 10,
      regrasValidacao: "Campo obrigatório",
    },
    {
      key: "2",
      ordem: 2,
      campo: "Código do cargo",
      tipoDado: "Numérico",
      tamanho: '-',
      regrasValidacao: "Campo obrigatório",
    },
    {
      key: "3",
      ordem: 3,
      campo: "Descrição do cargo",
      tipoDado: "String",
      tamanho: 200,
      regrasValidacao: "",
    },
    {
      key: "4",
      ordem: 4,
      campo: "Código da escola (EOL)",
      tipoDado: "String",
      tamanho: 6,
      regrasValidacao: "",
    },
    {
      key: "5",
      ordem: 5,
      campo: "Quantidade de vagas precárias",
      tipoDado: "Quantidade de vagas precárias",
      tamanho: '-',
      regrasValidacao: "Campo obrigatório",
    },
    {
      key: "6",
      ordem: 6,
      campo: "Quantidade de vagas definitivas",
      tipoDado: "Numérico",
      tamanho: '-',
      regrasValidacao: "",
    },
    {
      key: "7",
      ordem: 7,
      campo: "Status",
      tipoDado: "String",
      tamanho: 1,
      regrasValidacao: "",
    },     
  ];
  const navigate = useNavigate();

    return (
      <BaseScreen
        breadcrumbItems={breadcrumbItems}
        title="Importação de dados"
      >
        <LayoutPadrao title={'Layout: Arquivo de Vagas'} onVoltar={()=> navigate(-1)}  dataSource={dataSourceDefault} />
      </BaseScreen>
    ); 
};

export default LayoutPadraoVagas;