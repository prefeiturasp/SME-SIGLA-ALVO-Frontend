import { API } from "../../../../services";

export async function patchUsuario(params: {
  username: string;
  nome?: string;
  email?: string;
  grupos?: string[];
  is_active?: boolean;
}) {
  const { username, ...rest } = params;
  const { response } = API.Permissoes.patchUsuario({ usuario: username, ...rest });
  return await response;
}
