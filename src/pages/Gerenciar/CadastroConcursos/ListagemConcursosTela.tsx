import React, { useEffect, useRef, useState } from "react";
import { App, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import FiltrosBuscaConcurso from "./components/FiltrosBuscaConcurso";
import TabelaConcursos from "./components/TabelaConcursos";
import { useListarConcursos } from "./hooks/useListarConcursos";
import { AppButton, BuscaProcessosTitle, ConteudoPagina } from "@/components/ui";
import { ConcursoTabelaWrapper } from "@/design-system/estilos";
import type { IConcursoFiltros } from "../../../services/resources/concursos/IConcursos";
import { seHouveAlteracao } from "./hooks/useModoConcurso";

const { Text } = Typography;

const ListagemConcursosTela: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notification } = App.useApp();
  const [filtros, setFiltros] = useState<IConcursoFiltros>({});
  const [page, setPage] = useState(1);
  const notificacaoExibidaRef = useRef(false);

  useEffect(() => {
    if (!seHouveAlteracao(location.state) || notificacaoExibidaRef.current) {
      return;
    }
    notificacaoExibidaRef.current = true;

    notification.success({
      message: "Concurso atualizado",
      description: "As alterações foram salvas com sucesso!",
      placement: "top",
      duration: 3.5,
    });

    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate, notification]);

  const { concursos, total, isLoading } = useListarConcursos(filtros, 1, 1000);
  const { concursos: concursosParaFiltros } = useListarConcursos({}, 1, 1000);

  const breadcrumbItems = [
    { title: <Text strong>Gerenciar</Text> },
    { title: "Cadastro de concursos" },
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
        <AppButton
          variant="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/gerenciar/concursos/adicionar")}
        >
          Adicionar concurso
        </AppButton>
      }
    >
      <ConteudoPagina>
        <BuscaProcessosTitle>Buscar concursos</BuscaProcessosTitle>
        <FiltrosBuscaConcurso
          onBuscar={aoBuscar}
          onLimpar={aoLimpar}
          concursos={concursosParaFiltros}
        />
      </ConteudoPagina>

      <ConcursoTabelaWrapper>
        <TabelaConcursos
          dados={concursos}
          total={total}
          page={page}
          loading={isLoading}
          onPageChange={setPage}
          onEditar={(uuid) => navigate(`/gerenciar/concursos/editar/${uuid}`)}
        />
      </ConcursoTabelaWrapper>
    </BaseTela>
  );
};

export default ListagemConcursosTela;
