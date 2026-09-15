import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutBase } from "@locus/componentes/layout/LayoutBase";
import { DetalheUnidadeEducacional } from "@locus/paginas/DetalheUnidadeEducacional";
import { GestaoUnidadesEducacionais } from "@locus/paginas/GestaoUnidadesEducacionais";
import { RegistrarUnidadeEducacional } from "@locus/paginas/RegistrarUnidadeEducacional";
import { NaoEncontrado } from "@locus/paginas/NaoEncontrado";
import { CAMINHOS, ROTAS_RELATIVAS } from "./caminhos";

export function RotasApp() {
  return (
    <Routes>
      <Route element={<LayoutBase />}>
        <Route
          path={ROTAS_RELATIVAS.cadastroGestaoUnidades}
          element={<GestaoUnidadesEducacionais />}
        />
        <Route
          path={ROTAS_RELATIVAS.cadastroRegistrarUE}
          element={<RegistrarUnidadeEducacional />}
        />
        <Route
          path={ROTAS_RELATIVAS.cadastroDetalheUE}
          element={<DetalheUnidadeEducacional />}
        />
        <Route
          index
          element={
            <Navigate to={CAMINHOS.cadastroGestaoUnidades} replace />
          }
        />
        <Route
          path={ROTAS_RELATIVAS.naoEncontrado}
          element={<NaoEncontrado />}
        />
        <Route
          path="*"
          element={<Navigate to={CAMINHOS.naoEncontrado} replace />}
        />
      </Route>
    </Routes>
  );
}

export default RotasApp;
