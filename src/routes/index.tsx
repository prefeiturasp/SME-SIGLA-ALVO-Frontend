import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardTela } from "../pages/Dashboard/DashboardTela";
import ProtectedRoute from "./protected";

import { HomeTela } from "../pages/Home/HomeTela";
import ConvocacaoCandidatosTela from "../pages/Processos/ConvocacaoCandidatos/ConvocacaoCandidatosTela";
import NovaConvocacaoCandidatosTela from "../pages/Processos/NovaConvocacaoCandidatos/NovaConvocacaoCandidatosTela";
import ImportacaoDadosTela from "../pages/Processos/ImportacaoDados/ImportacaoDadosTela";
import LayoutPadraoVagasTela from "../pages/Processos/ImportacaoDados/LayoutPadraoVagas/LayoutPadraoVagasTela";
import HistoricoVagasTela from "../pages/Processos/ImportacaoDados/HistoricoVagas/HistoricoVagasTela";
import NotFoundTela from "../pages/NotFound/NotFoundTela";
import LoginTela from "../pages/Login/LoginTela";
import EsqueceuSenhaTela from "../pages/Login/EsqueceuSenhaTela";
import EsqueceuSenhaSucesso from "../pages/Login/EsqueceuSenhaSucesso";
import NovaSenhaTela from "../pages/Login/NovaSenhaTela";
import RouteError from "./RouteError";
import DadosDoProcesso from "../pages/CriarEditarConvocacao/DadosDoProcesso";
import SelecaoCargosTela from "../pages/CriarEditarConvocacao/SelecaoCargos/SelecaoCargosTela";
import Agenda from "../pages/CriarEditarConvocacao/Agenda";
import Resumo from "../pages/CriarEditarConvocacao/Resumo";

//TODO ADD FEATURE FLAG

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomeTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/login",
    element: <LoginTela />,
    errorElement: <RouteError />,
  },
  {
    path: "/esqueci-minha-senha",
    element: <EsqueceuSenhaTela />,
    errorElement: <RouteError />,
  },
  {
    path: "/esqueci-minha-senha-sucesso",
    element: <EsqueceuSenhaSucesso />,
    errorElement: <RouteError />,
  },
  {
    path: "/criar-nova-senha/:uid/:token",
    element: <NovaSenhaTela />,
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao",
    element: (
      <ProtectedRoute>
        <ConvocacaoCandidatosTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },

  {
    path: "/processos/convocacao/dados-processo/criar",
    element: (
      <ProtectedRoute>
        <DadosDoProcesso />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao/nova/:uuid/selecao-cargos",
    element: (
      <ProtectedRoute>
        <SelecaoCargosTela />
      </ProtectedRoute>
    ),
  },
  {
    path: "/processos/convocacao/editar/:uuid/selecao-cargos",
    element: (
      <ProtectedRoute>
        <SelecaoCargosTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao/editar/:uuid/agenda",
    element: (
      <ProtectedRoute>
        <Agenda />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao/editar/:uuid/resumo",
    element: (
      <ProtectedRoute>
        <Resumo />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao/editar/:uuid/dados-processo",
    element: (
      <ProtectedRoute>
        <DadosDoProcesso />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/importacao-dados",
    element: (
      <ProtectedRoute>
        <ImportacaoDadosTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/importacao-dados/layout-padrao-vagas",
    element: (
      <ProtectedRoute>
        <LayoutPadraoVagasTela tipo={"VAGAS"} />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/importacao-dados/layout-padrao-habilitados",
    element: (
      <ProtectedRoute>
        <LayoutPadraoVagasTela tipo={"HABILITADOS"} />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/importacao-dados/historico-vagas",
    element: (
      <ProtectedRoute>
        <HistoricoVagasTela />
      </ProtectedRoute>
    ),
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
