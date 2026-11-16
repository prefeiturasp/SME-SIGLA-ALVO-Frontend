import React from "react";
import { Navigate, useParams } from "react-router-dom";

const RedirecionarEdicaoConcurso: React.FC = () => {
  const { uuid } = useParams();

  if (!uuid) {
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
