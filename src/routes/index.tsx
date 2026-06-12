import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { DashboardTela } from "../pages/Dashboard/DashboardTela";
import ProtectedRoute from "./AuthGuard";

import ConvocacaoCandidatosTela from "../pages/Processos/ConvocacaoCandidatos/ConvocacaoCandidatosTela";
import ImportacaoDadosTela from "../pages/ImportacaoDados/ImportacaoDadosTela";
import ExportacaoDadosTela from "../pages/ExportacaoDados/ExportacaoDadosTela";
import ImportacaoDados2 from "../pages/Processos/ImportacaoDados/ImportacaoDados2";
import LayoutPadraoTela from "../pages/LayoutPadraoTela/LayoutPadraoTela";
import HistoricoVagasTela from "../pages/HistoricoVagas/HistoricoVagasTela";
import HistoricoEscolhasTela from "../pages/ImportacaoDados/Escolhas/HistoricoEscolhasTela";
import HistoricoHabilitadosTela from "../pages/ImportacaoDados/Habilitados/HistoricoHabilitadosTela";
import HistoricoLotesTela from "../pages/ImportacaoDados/Lotes/HistoricoLotesTela";
import NotFoundTela from "../pages/NotFound/NotFoundTela";
import LoginTela from "../pages/Login/LoginTela";
import EsqueceuSenhaTela from "../pages/Login/EsqueceuSenhaTela";
import EsqueceuSenhaSucesso from "../pages/Login/EsqueceuSenhaSucesso";
import NovaSenhaTela from "../pages/Login/NovaSenhaTela";
import RouteError from "./RouteError";
import GerenciamentoVagasTela from "../pages/GerenciamentoVagas/GerenciamentoVagasTela";
import EscolhaCandidatosTela from "../pages/EscolhaCandidatos/EscolhaCandidatosTela";
import PermissaoUsuarioTela from "../pages/Gerenciar/PermissaoUsuario/PermissaoUsuarioTela";
import AdicionarUsuarioTela from "../pages/Gerenciar/AdicionarUsuario/AdicionarUsuarioTela";
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
import EnvioEmailsTela from "../pages/Gerenciar/EnvioEmails/EnvioEmailsTela";
import HistoricoEnvioEmailsTela from "../pages/Gerenciar/EnvioEmails/HistoricoEnvioEmailsTela";
import PesquisarConcursadosTela from "../pages/Processos/PesquisarConcursados/PesquisarConcursadosTela";
import MeusDadosTela from "../pages/MeusDados/MeusDadosTela";
import ExtracaoDadosTela from "../pages/Gerenciar/ExtracaoDados/ExtracaoDadosTela";


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
    path: "/gerenciar/autorizacoes-publicadas",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="autorizacaopublicada" permissaoDeExibirATELA="view_autorizacaopublicada">
        <AutorizacoesPublicadasTela />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/gerenciar/autorizacoes-publicadas-gerenciar",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="autorizacaopublicada" permissaoDeExibirATELA="view_autorizacaopublicada">
        <AutorizacoesPublicadasGerenciarTela />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/gerenciar/eliminiacao-e-reclassificacao-candidato",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="concursocandidatoreclassificacao,concursocandidatoeliminacao" permissaoDeExibirATELA="view_concursocandidatoreclassificacao">
        <EliminacaoReclassificacaoCandidatoTela />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/gerenciar/disparo-emails",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="cartaconvocacaocandidato" permissaoDeExibirATELA="view_cartaconvocacaocandidato">
          <EnvioEmailsTela />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/gerenciar/disparo-emails/historico",
    element: (
      <ProtectedRoute>
        <HistoricoEnvioEmailsTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/gerenciar/extracao-dados",
    element: (
      <ProtectedRoute>
        <ExtracaoDadosTela />
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
        <PermissionContextGuard model="processoconvocacao,importacaoarquivovagas" permissaoDeExibirATELA="view_processoconvocacao">
        <ConvocacaoCandidatosTela />
        </PermissionContextGuard>        
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },  
  {
    path: "/gerenciar/gerenciamento-usuarios",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="group" permissaoDeExibirATELA="view_group">
          <PermissaoUsuarioTela />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/gerenciar/adicao-usuario",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="user" permissaoDeExibirATELA="add_user">
          <AdicionarUsuarioTela />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/gerenciar/parametrizacao",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="parametrizacao" permissaoDeExibirATELA="view_parametrizacao">
          <CadastroParametrosTela />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/escolha-candidato/",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="processoconvocacao,escolha" permissaoDeExibirATELA="view_escolha">
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
    path: "/processos/convocacao/visualizar/:uuid/resumo",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="processoconvocacao,convocacao,candidato,importacaoarquivovagas" permissaoDeExibirATELA="view_processoconvocacao">
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
    path: "/meus-dados",
    element: (
      <ProtectedRoute>
        <MeusDadosTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/importacao-dados",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="layoutarquivoimportacao,importacaoarquivovagas,importacaoarquivohabilitado,importacaoescolhas" permissaoDeExibirATELA="view_importacaoarquivovagas">
        <ImportacaoDadosTela />
        </PermissionContextGuard>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processos/exportacao-dados",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="exportacaovagasprocesso,exportacaocandidatosprocesso,exportacaovagassigpec" permissaoDeExibirATELA="view_exportacaovagasprocesso">
        <ExportacaoDadosTela />
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
    path: "/processos/importacao-dados/historico-habilitados",
    element: (
      <ProtectedRoute>
        <PermissionContextGuard model="importacaoarquivohabilitado" permissaoDeExibirATELA="view_importacaoarquivohabilitado">
          <HistoricoHabilitadosTela />
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
    path: "/processos/importacao-dados/historico-lotes",
    element: (
      <ProtectedRoute>
        <HistoricoLotesTela />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/processo/pesquisar-concursado",
    element: (
      <ProtectedRoute>
        <PesquisarConcursadosTela />
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
