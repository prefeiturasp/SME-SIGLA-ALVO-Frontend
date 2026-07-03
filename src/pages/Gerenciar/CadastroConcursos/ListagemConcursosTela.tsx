import React, { useState } from "react";
import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import FiltrosBuscaConcurso from "./components/FiltrosBuscaConcurso";
import TabelaConcursos from "./components/TabelaConcursos";
import { useListarConcursos } from "./hooks/useListarConcursos";
import { CardBusca, TabelaWrapper } from "./styles";
import type { IConcursoFiltros } from "../../../services/resources/concursos/IConcursos";

const { Text } = Typography;

const ListagemConcursosTela: React.FC = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<IConcursoFiltros>({});
  const [page, setPage] = useState(1);

  const { concursos, total, isLoading } = useListarConcursos(filtros, page);

  const breadcrumbItems = [
    { title: <Text strong>Gerenciar</Text> },
    { title: "Cadastro de concurso" },
  ] as TitleItem[];

  const aoBuscar = (novosFiltros: IConcursoFiltros) => {
    setPage(1);
    setFiltros(novosFiltros);
  };

  const aoLimpar = () => {
    setPage(1);
    setFiltros({});
  };

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Cadastro de concursos"
      buttons={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/gerenciar/concursos/adicionar")}
        >
          Adicionar concurso
        </Button>
      }
    >
      <CardBusca>
        <Typography.Title level={5}>Buscar concursos</Typography.Title>
        <FiltrosBuscaConcurso onBuscar={aoBuscar} onLimpar={aoLimpar} />
      </CardBusca>

      <TabelaWrapper>
        <TabelaConcursos
          dados={concursos}
          total={total}
          page={page}
          loading={isLoading}
          onPageChange={setPage}
          onEditar={(uuid) => navigate(`/gerenciar/concursos/editar/${uuid}`)}
        />
      </TabelaWrapper>
    </BaseTela>
  );
};

export default ListagemConcursosTela;
