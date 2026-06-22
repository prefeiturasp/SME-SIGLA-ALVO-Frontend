export function capitalizeText(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

 
const queryCapitalizeCases = ['sort'];

function queryCaptalization(key: string, param: any) {
  return queryCapitalizeCases.includes(key)
    ? capitalizeText(`${param}`)
    : param;
}

function queryByEntries(key: string, param: any) {
  if (param === null) return [];

  if (!Array.isArray(param)) {
    return [`${key}=${queryCaptalization(key, param)}`];
  }

  if (!param.length) {
    return [];
  }

  const value = param.map((p) => queryCaptalization(key, p)).join(",");
  return [`${key}=${value}`];
}

export default function queryParamsSerializer<T extends {}>(params: T) {
  return Object.entries(params)
    .reduce<string[]>(
      (acc, [key, param]) => [...acc, ...queryByEntries(key, param)],
      []
    )
    .join('&');
}

export function notNullParamsSerializer<T extends {}>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== null)
  );
}
