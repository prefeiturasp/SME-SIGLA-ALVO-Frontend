import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {DashboardTela} from "../pages/Dashboard/DashboardTela";
import ProtectedRoute from "./protected";



import { HomeTela } from "../pages/Home/HomeTela";
import ConvocacaoCandidatosTela from "../pages/Processos/ConvocacaoCandidatos/ConvocacaoCandidatosTela";
import NovaConvocacaoCandidatosTela from "../pages/Processos/NovaConvocacaoCandidatos/NovaConvocacaoCandidatosTela";
import ImportacaoDadosTela from "../pages/Processos/ImportacaoDados/ImportacaoDadosTela"; 
import LayoutPadraoVagasTela from "../pages/Processos/ImportacaoDados/LayoutPadraoVagas/LayoutPadraoVagasTela";
import HistoricoVagasTela from "../pages/Processos/ImportacaoDados/HistoricoVagas/HistoricoVagasTela";
import NotFoundTela from "../pages/NotFound/NotFoundTela";
import RouteError from "./RouteError";

//TODO ADD FEATURE FLAG

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeTela />,
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
        <DashboardTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "*",
    element: <NotFoundTela />, 
    errorElement: <RouteError />,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
