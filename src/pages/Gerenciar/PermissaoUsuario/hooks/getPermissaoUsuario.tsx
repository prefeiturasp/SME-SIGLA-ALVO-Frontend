import { API } from "../../../../services";
import type { PermissaoUsuarioGrupoOption } from "../../../../services/resources/permissoes/IPermissoes";

export async function getUsuariosComGrupos(params?: { usuario?: string }) {
  const { response } = API.Permissoes.getUsuariosComGrupos(params);
  return await response;
}

export async function getGruposDisponiveisOptions(): Promise<PermissaoUsuarioGrupoOption[]> {
  const { response } = API.Permissoes.getGruposDisponiveis();
  const grupos = await response;
  return (grupos || []).map((g) => ({ value: g.name, label: g.name }));
}
