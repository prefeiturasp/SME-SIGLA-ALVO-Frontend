import { notification } from "antd";
import axios from "axios";
import { API } from "../../../../services";
import {
  PatchUsuario400Error,
  type PatchUsuarioFieldErrors,
} from "../../../../services/resources/permissoes/IPermissoes";

function primeiraStringDeCampo(valor: unknown): string | undefined {
  if (typeof valor === "string" && valor.trim()) return valor;
  if (Array.isArray(valor)) {
    const txt = valor.find((v): v is string => typeof v === "string" && v.trim().length > 0);
    return txt;
  }
  return undefined;
}

function extrairErrosPorCampo(data: unknown): PatchUsuarioFieldErrors {
  if (!data || typeof data !== "object") return {};
  const obj = data as Record<string, unknown>;
  const result: PatchUsuarioFieldErrors = {};
  const nome = primeiraStringDeCampo(obj.nome);
  const email = primeiraStringDeCampo(obj.email);
  if (nome) result.nome = nome;
  if (email) result.email = email;
  return result;
}

function extrairMensagemErro(data: unknown): string | undefined {
  if (!data) return undefined;
  if (typeof data === "string") return data;
  if (typeof data !== "object") return undefined;

  const obj = data as Record<string, unknown>;
  const candidatos = [obj.detail, obj.message, obj.mensagem, obj.erro, obj.error];
  for (const c of candidatos) {
    if (typeof c === "string" && c.trim()) return c;
  }

  const partes: string[] = [];
  for (const [campo, valor] of Object.entries(obj)) {
    if (Array.isArray(valor)) {
      const textos = valor.filter((v): v is string => typeof v === "string");
      if (textos.length) partes.push(`${campo}: ${textos.join(" ")}`);
    } else if (typeof valor === "string" && valor.trim()) {
      partes.push(`${campo}: ${valor}`);
    }
  }
  return partes.length ? partes.join(" | ") : undefined;
}

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
  try {
    console.log(response)
    return await response;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      const fieldErrors = extrairErrosPorCampo(error.response.data);
      if (fieldErrors.nome || fieldErrors.email) {
        throw new PatchUsuario400Error(fieldErrors, error.response.data);
      }
      const descricao =
        extrairMensagemErro(error.response.data) ||
        "Não foi possível atualizar o usuário. Verifique os dados informados e tente novamente.";
      notification.error({
        message: "Erro ao atualizar usuário",
        description: descricao,
        placement: "top",
        duration: 4.5,
      });
    }
    throw error;
  }
}
