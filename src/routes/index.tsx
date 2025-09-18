import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {Dashboard} from "../pages/Dashboard";
import ProtectedRoute from "./protected";



import { Home } from "../pages/Home/Home";
import ConvocacaoCandidatosTela from "../pages/ConvocacaoCandidatos/ConvocacaoCandidatosTela";
import NovaConvocacaoCandidatosTela from "../pages/NovaConvocacaoCandidatos/NovaConvocacaoCandidatosTela";
import ImportacaoDadosTela from "../pages/ImportacaoDados";
import LayoutPadraoVagasTela from "../pages/ImportacaoDados/LayoutPadraoVagas/LayoutPadraoVagasTela";
import HistoricoVagasTela from "../pages/ImportacaoDados/HistoricoVagas/HistoricoVagasTela";
import PageNotFound from "../pages/NotFound";
import RouteError from "./RouteError";

//TODO ADD FEATURE FLAG

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao",
    element: <ConvocacaoCandidatosTela />,
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao/nova",
    element: <NovaConvocacaoCandidatosTela />,
    errorElement: <RouteError />,
  },
  {
    path: "/processos/importacao-dados",
    element: <ImportacaoDadosTela />,
    errorElement: <RouteError />,
  },
  {
    path: "/processos/importacao-dados/layout-padrao-vagas",
    element: <LayoutPadraoVagasTela tipo={'VAGAS'}/>,
    errorElement: <RouteError />,
  },
    {
    path: "/processos/importacao-dados/layout-padrao-habilitados",
    element: <LayoutPadraoVagasTela tipo={'HABILITADOS'}/>,
    errorElement: <RouteError />,
  },
    {
    path: "/processos/importacao-dados/historico-vagas",
    element: <HistoricoVagasTela />,
    errorElement: <RouteError />,
  }, 
  
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "*",
    element: <PageNotFound />, 
    errorElement: <RouteError />,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
