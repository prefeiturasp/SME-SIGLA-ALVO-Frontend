import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {Dashboard} from "../pages/Dashboard";
import ProtectedRoute from "./protected";



import { Home } from "../pages/Home/Home";
import ConvocacaoCandidatos from "../pages/ConvocacaoCandidatos";
import NovaConvocacaoCandidatos from "../pages/NovaConvocacaoCandidatos";
import ImportacaoDados from "../pages/ImportacaoDados";
import LayoutPadraoVagas from "../pages/ImportacaoDados/LayoutPadraoVagas";
import HistoricoVagas from "../pages/ImportacaoDados/HistoricoVagas";
import PageNotFound from "../pages/NotFound";

//TODO ADD FEATURE FLAG

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/processos/convocacao",
    element: <ConvocacaoCandidatos />,
  },
  {
    path: "/processos/convocacao/nova",
    element: <NovaConvocacaoCandidatos />,
  },
  {
    path: "/processos/importacao-dados",
    element: <ImportacaoDados />,
  },
  {
    path: "/processos/importacao-dados/layout-padrao-vagas",
    element: <LayoutPadraoVagas tipo={'VAGAS'}/>,
  },
    {
    path: "/processos/importacao-dados/layout-padrao-habilitados",
    element: <LayoutPadraoVagas tipo={'HABILITADOS'}/>,
  },
    {
    path: "/processos/importacao-dados/historico-vagas",
    element: <HistoricoVagas />,
  }, 
  
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <PageNotFound />, 
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
