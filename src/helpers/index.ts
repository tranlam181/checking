export function getFullUrl(number: string) {
  const requestUrl = process.env.REQUEST_URL ?? "";
  return requestUrl.replace("{number}", number);
}

export const delay = async (ms: number) =>
  new Promise((resl) => setTimeout(resl, ms));
