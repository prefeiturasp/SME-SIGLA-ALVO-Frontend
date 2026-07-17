import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useGetConcursoByUuid } from "../../GerenciamentoVagas/hooks/useGetConcursoPorUuid";

/**
 * Redireciona `/gerenciar/concursos/editar/:uuid` para o primeiro passo do
 * wizard de edição, resolvendo o `:uuid` da rota.
 *
 * Defesa em profundidade: concursos `EM_ANDAMENTO` têm a edição bloqueada
 * (o ícone de editar já fica desabilitado na listagem); aqui evitamos que o
 * acesso direto por URL contorne o bloqueio.
 */
const RedirecionarEdicaoConcurso: React.FC = () => {
  const { uuid } = useParams();
  const { concursoData, concursoIsLoading } = useGetConcursoByUuid(uuid ?? "");

  if (!uuid) {
    return <Navigate to="/gerenciar/concursos" replace />;
  }

  // Aguarda o carregamento antes de decidir o destino.
  if (concursoIsLoading) {
    return null;
  }

  if (concursoData?.situacao === "EM_ANDAMENTO") {
    return <Navigate to="/gerenciar/concursos" replace />;
  }

  return (
    <Navigate
      to={`/gerenciar/concursos/editar/${uuid}/passo-1`}
      replace
    />
  );
};

export default RedirecionarEdicaoConcurso;
