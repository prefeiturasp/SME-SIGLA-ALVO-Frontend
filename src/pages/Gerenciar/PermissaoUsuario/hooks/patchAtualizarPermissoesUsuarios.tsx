import { API } from "../../../../services";

export async function patchUsuario(params: {
  username: string;
  nome?: string;
  email?: string;
  grupos?: string[];
  is_active?: boolean;
}) {
  const { username, ...rest } = params;
  const payload = {
    usuario: username,
    ...rest,
  };
  const { response } = API.Permissoes.patchUsuario(payload);
  return await response;
}
