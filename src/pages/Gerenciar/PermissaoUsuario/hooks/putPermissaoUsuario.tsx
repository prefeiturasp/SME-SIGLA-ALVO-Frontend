import { API } from "../../../../services";

export async function putAtualizarPermissoesUsuario(params: {
  username: string;
  currentGroups: string[];
  nextGroups: string[];
}) {
  const { username, currentGroups, nextGroups } = params;

  const current = (currentGroups || []).filter(Boolean);
  const next = (nextGroups || []).filter(Boolean);

  const toRemove = current.filter((g) => !next.includes(g));
  const toAdd = next.filter((g) => !current.includes(g));

  await Promise.all(
    toRemove.map((grupo) =>
      API.Permissoes.putGerenciarUsuariosGrupo({
        grupo,
        remover_usuarios: [username],
      }).response
    )
  );

  await Promise.all(
    toAdd.map((grupo) =>
      API.Permissoes.putGerenciarUsuariosGrupo({
        grupo,
        adicionar_usuarios: [username],
      }).response
    )
  );
}
