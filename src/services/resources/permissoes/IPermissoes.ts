import type React from "react";
import type { TableProps } from "antd/es/table";

export interface IUsuarioPermissoesRequest {
  usuario: string;
  model?: string;
}



export interface IUsuarioPermissoesItem {
  id: number;
  codename: string;
  name: string;
  app_label: string;
  model: string;
}

export interface IUsuarioPermissoes {
  usuario: string;
  permissoes: IUsuarioPermissoesItem[];
}


// ===== Tipos migrados de pages/Gerenciar/PermissaoUsuario/hooks/types.ts =====

export type AtivacaoModalMode = "ativar" | "desativar";
export type AtivacaoModalStep = "confirm" | "success";

export interface AtivacaoModalProps {
  open: boolean;
  mode: AtivacaoModalMode;
  nomeUsuario?: string;
  permissao?: string;
  step?: AtivacaoModalStep;
  onCancel: () => void;
  onConfirm: () => void;
  onOk?: () => void;
}

export type EditarPermissaoModalMode = "edit" | "view";

export interface EditarPermissaoModalData {
  login?: string;
  nome?: string;
  email?: string;
  permissoes?: string[];
}

export interface EditarPermissaoModalSavePayload {
  permissoes?: string[];
  nome?: string;
  email?: string;
}

export interface PatchUsuarioFieldErrors {
  nome?: string;
  email?: string;
}

export class PatchUsuario400Error extends Error {
  fieldErrors: PatchUsuarioFieldErrors;
  raw: unknown;
  constructor(fieldErrors: PatchUsuarioFieldErrors, raw: unknown) {
    super("PatchUsuario400Error");
    this.name = "PatchUsuario400Error";
    this.fieldErrors = fieldErrors;
    this.raw = raw;
  }
}

export interface EditarPermissaoModalProps {
  open: boolean;
  mode: EditarPermissaoModalMode;
  data?: EditarPermissaoModalData;
  permissoesOptions?: Array<{ value: string; label: string }>;
  onClose: () => void;
  onSave?: (next?: EditarPermissaoModalSavePayload) => void | Promise<void>;
}

export interface IPermissaoUsuarioRow {
  uuid: string;
  username?: string;
  login?: string;
  nome?: string;
  permissoes?: string;
  email?: string;
  grupos?: string[];
  ativo?: boolean;
}

export interface PermissaoUsuarioTableProps extends TableProps<IPermissaoUsuarioRow> {
  data: IPermissaoUsuarioRow[];
  onEdit?: (row: IPermissaoUsuarioRow) => void;
  onView?: (row: IPermissaoUsuarioRow) => void;
  onToggleAtivacao?: (row: IPermissaoUsuarioRow, nextChecked: boolean) => void;
}

export interface SucessoModalProps {
  open: boolean;
  texto: React.ReactNode;
  onOk: () => void;
}

export type PermissaoUsuarioGrupoOption = { value: string; label: string };

export interface IUsuarioComGrupos {
  usuario: string;
  nome?: string | null;
  email?: string | null;
  is_active?: boolean;
  grupos: string[];
}

export interface IUsuariosComGruposResponse {
  count: number;
  results: IUsuarioComGrupos[];
}

export interface IGrupoDisponivel {
  id: number;
  name: string;
}

export type IGruposDisponiveisResponse = Array<{
  id: number;
  name: string;
  permissoes?: unknown[];
}>;

export interface IUpdateGrupoUsuariosRequest {
  grupo: string;
  adicionar_usuarios?: string[];
  remover_usuarios?: string[];
}

export interface IPatchUsuarioRequest {
  usuario: string;
  is_active?: boolean;
  nome?: string;
  email?: string;
  grupos?: string[];
}

export interface IPatchUsuarioResponse {
  usuario: string;
  nome?: string | null;
  email?: string | null;
  is_active: boolean;
  grupos: string[];
}