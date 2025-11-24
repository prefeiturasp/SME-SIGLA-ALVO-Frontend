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

  return !Array.isArray(param)
    ? [`${key}=${queryCaptalization(key, param)}`]
    : param.map((p) => `${key}=${queryCaptalization(key, p)}`);
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
