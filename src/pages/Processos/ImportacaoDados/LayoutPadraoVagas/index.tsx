import React from "react";
import { Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import BaseScreen, { type TitleItem } from "../../../BaseScreen";
 
import LayoutPadrao from "../Habilitados/components/LayoutPadrao";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";

const { Text } = Typography;

const breadcrumbItems = [
  { title: <Link to="/"><Text strong>Home</Text></Link> },
  { title: <Link to="/processos"><Text strong>Processos</Text></Link> },
  { title: "Importação de dados" },
] as TitleItem[];

const LayoutPadraoVagas: React.FC = () => {
 
   const { data: dataLayout, isLoading: importacoesArquivosIsLoading } = useQuery({
    queryKey: ["getLayout"],
    queryFn: ({ signal }) =>
      API.ImportacaoDados.getLayout(
        {
          tipo: "VAGAS",
        },
        { signal }
      ).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });


  const navigate = useNavigate();

    return (
      <BaseScreen
        breadcrumbItems={breadcrumbItems}
        title="Importação de dados"
      >
        <LayoutPadrao title={'Layout: Arquivo de Vagas'} onVoltar={()=> navigate(-1)}  dataSource={dataLayout||[]} />
      </BaseScreen>
    ); 
};

export default LayoutPadraoVagas;