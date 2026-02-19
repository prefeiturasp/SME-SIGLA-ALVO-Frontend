import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { DashboardTela } from "../pages/Dashboard/DashboardTela";
import ProtectedRoute from "./AuthGuard";

import ConvocacaoCandidatosTela from "../pages/Processos/ConvocacaoCandidatos/ConvocacaoCandidatosTela";
import ImportacaoDadosTela from "../pages/ImportacaoDados/ImportacaoDadosTela";
import ImportacaoDados2 from "../pages/Processos/ImportacaoDados/ImportacaoDados2";
import LayoutPadraoTela from "../pages/LayoutPadraoTela/LayoutPadraoTela";
import HistoricoVagasTela from "../pages/HistoricoVagas/HistoricoVagasTela";
import HistoricoEscolhasTela from "../pages/ImportacaoDados/Escolhas/HistoricoEscolhasTela";
import NotFoundTela from "../pages/NotFound/NotFoundTela";
import LoginTela from "../pages/Login/LoginTela";
import EsqueceuSenhaTela from "../pages/Login/EsqueceuSenhaTela";
import EsqueceuSenhaSucesso from "../pages/Login/EsqueceuSenhaSucesso";
import NovaSenhaTela from "../pages/Login/NovaSenhaTela";
import RouteError from "./RouteError";
import GerenciamentoVagasTela from "../pages/GerenciamentoVagas/GerenciamentoVagasTela";
import EscolhaCandidatosTela from "../pages/EscolhaCandidatos/EscolhaCandidatosTela";
import PermissaoUsuarioTela from "../pages/Gerenciar/PermissaoUsuario/PermissaoUsuarioTela";
import CadastroParametrosTela from "../pages/Gerenciar/Parametros/CadastroParametrosTela";

import DadosDoProcesso from "../pages/CriarEditarConvocacao/DadosDoProcesso";
import SelecaoCargosTela from "../pages/CriarEditarConvocacao/SelecaoCargos/SelecaoCargosTela";
import Agenda from "../pages/CriarEditarConvocacao/Agenda";
import Resumo from "../pages/CriarEditarConvocacao/Resumo";
import PermissionContextGuard from "./PermissionContextGuard";
import ForbiddenTela from "../pages/Forbidden/ForbiddenTela";
import RelatoriosTela from "../pages/Relatorios/RelatoriosTela";
import AutorizacoesPublicadasTela from "../pages/Gerenciar/AutorizacoesPublicadas/AutorizacoesPublicadasTela";
import AutorizacoesPublicadasGerenciarTela from "../pages/Gerenciar/AutorizacoesPublicadas/AutorizacoesPublicadasGerenciarTela";
import { HomeTela } from "../pages/Home/HomeTela";
import EliminacaoReclassificacaoCandidatoTela from "../pages/EliminacaoReclassificacaoCandidato/EliminacaoReclassificacaoCandidatoTela";


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
    path: "/relatorios",
    element: (
      <ProtectedRoute>
        <RelatoriosTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/autorizacoes-publicadas",
    element: (
      <ProtectedRoute>
        <AutorizacoesPublicadasTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/autorizacoes-publicadas-gerenciar",
    element: (
      <ProtectedRoute>
        <AutorizacoesPublicadasGerenciarTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/eliminiacao-e-reclassificacao-candidato",
    element: (
      <ProtectedRoute>
        <EliminacaoReclassificacaoCandidatoTela />
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
    path: "/processos/gerenciamento-vagas",    
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="processoconvocacao,importacaoarquivovagas" permissaoDeExibirATELA="add_importacaoarquivovagas">
        <GerenciamentoVagasTela />
        </PermissionContextGuard>        
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="processoconvocacao,convocacao,candidato,importacaoarquivovagas" permissaoDeExibirATELA="view_processoconvocacao">
        <ConvocacaoCandidatosTela />
        </PermissionContextGuard>        
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },  
  {
    path: "/gerenciar/permissao-usuario",
    element: (
      <ProtectedRoute>
        <PermissaoUsuarioTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/parametrizacao",
    element: (
      <ProtectedRoute>
        <CadastroParametrosTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/escolha-candidato/",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="processoconvocacao,convocacao,candidato,importacaoarquivovagas" permissaoDeExibirATELA="view_processoconvocacao">
          <EscolhaCandidatosTela />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao/dados-processo/criar",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="processoconvocacao,convocacao,candidato,importacaoarquivovagas" permissaoDeExibirATELA="add_processoconvocacao">
        <DadosDoProcesso />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao/editar/:uuid/selecao-cargos",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="processoconvocacao,convocacao,candidato,importacaoarquivovagas" permissaoDeExibirATELA="change_processoconvocacao">
        <SelecaoCargosTela />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao/editar/:uuid/agenda",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="processoconvocacao,convocacao,candidato,importacaoarquivovagas" permissaoDeExibirATELA="change_processoconvocacao">
        <Agenda />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao/editar/:uuid/resumo",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="processoconvocacao,convocacao,candidato,importacaoarquivovagas" permissaoDeExibirATELA="change_processoconvocacao">                
        <Resumo />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/convocacao/editar/:uuid/dados-processo",    
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="processoconvocacao,convocacao,candidato,importacaoarquivovagas" permissaoDeExibirATELA="add_processoconvocacao">
        <DadosDoProcesso />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },

  {
    path: "/processos/importacao-dados",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="layoutarquivoimportacao,importacaoarquivovagas,importacaoarquivohabilitado" permissaoDeExibirATELA="add_importacaoarquivovagas">
        <ImportacaoDadosTela />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/importacao-dados/layout-padrao-vagas",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="layoutarquivoimportacao" permissaoDeExibirATELA="view_layoutarquivoimportacao">
        <LayoutPadraoTela tipo={"VAGAS"} />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/importacao-dados/layout-padrao-habilitados",
    element: (
      <PermissionContextGuard model="layoutarquivoimportacao" permissaoDeExibirATELA="view_layoutarquivoimportacao">
      <ProtectedRoute>
        <LayoutPadraoTela tipo={"HABILITADOS"} />
      </ProtectedRoute>
      </PermissionContextGuard>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/importacao-dados/historico-vagas",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="importacaoarquivovagas" permissaoDeExibirATELA="view_importacaoarquivovagas">
        <HistoricoVagasTela />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/importacao-dados/historico-escolhas",
    element: (
      <ProtectedRoute>
        <HistoricoEscolhasTela />
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
  // TODO remover esta rota
  {
    path: "/processos/importacao-dados2",
    element: (
      <ProtectedRoute>
        <ImportacaoDados2 />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  }, 
  {
    path: "*",
    element: <NotFoundTela />,
    errorElement: <RouteError />,
  },
  {
    path: "/403",
    element: <ForbiddenTela />,
    errorElement: <RouteError />,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
