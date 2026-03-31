
import { useQuery } from '@tanstack/react-query';
import { useContext, useCallback, createContext, useMemo } from 'react';
import {  Navigate, useNavigate, useParams } from 'react-router-dom';


import type { IUsuarioPermissoes, IUsuarioPermissoesItem } from '../services/resources/permissoes/IPermissoes';
import { Spin } from 'antd';
import { API } from '../services';
import { LoadingContainer } from '../components/EstilosCompartilhados';



interface IAction {
  id: number;
  codename: string;
  name: string;
  app_label: string;
  model: string;
}



const PermissionContext = createContext(
  {} as {
    permissoes?: IAction[];    
    can: (codename: string) => boolean;    
  },
);

export function useGetPermissions() {
  const context = useContext(PermissionContext);
  return {
    ...context,
    can: (codename: string) =>
      context.can(codename),
  };
}

export interface PermissionContextGuardProps {
  redirectTo?: string ;
  children: React.ReactNode;
  model?: string;  
  permissaoDeExibirATELA: string;
}

 const PermissionContextGuard: React.FC<PermissionContextGuardProps> = ({  children, model, redirectTo, permissaoDeExibirATELA }) => {
  const params = useParams();
  const navigate = useNavigate();
  

  const { data: dataPermissions = {} as IUsuarioPermissoes, isError, isLoading } = useQuery({
    queryKey: ['permissions', 'guard', model || params.model],
    refetchOnWindowFocus: false,
    queryFn: () => API.Permissoes.getPermissoesPorUsuarioEModel({ model: model || "", usuario: localStorage.getItem("USUARIO") || "" }).response
  });

  const can = useCallback(
    (codename: string) =>
      dataPermissions?.permissoes?.some((permissao: IUsuarioPermissoesItem) => permissao.codename === codename),
    [dataPermissions],
  );

  const permissions = useMemo(
    () => ({
      permissoes: dataPermissions?.permissoes||[] as IUsuarioPermissoesItem[],
      can,
    }),
    [dataPermissions, can],
  );

  if (isLoading && !isError) {
    return  <LoadingContainer data-testid="@loading-element"><Spin size="large" spinning/></LoadingContainer>   
  }

  if (!can(permissaoDeExibirATELA) && !isLoading && !isError) {
    const to = redirectTo || '/403';
    return <Navigate to={to} replace />;
  }
  return <PermissionContext.Provider value={permissions}>{children}</PermissionContext.Provider>;
};

export default PermissionContextGuard;
