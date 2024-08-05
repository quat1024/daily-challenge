import { OauthToken, tokenToHeader } from "./oauth.ts";

export function encUri(parms: { [key: string]: string }): string {
  let first = true;
  let result = "";
  for (const key of Object.keys(parms)) {
    result += `${first ? "?" : "&"}${key}=${encodeURIComponent(parms[key])}`;
    first = false;
  }
  return result;
}

export function encForm(parms: { [key: string]: string }): string {
  let first = true;
  let result = "";
  for (const key of Object.keys(parms)) {
    result += `${first ? "" : "&"}${key}=${encodeURIComponent(parms[key])}`;
    first = false;
  }
  return result;
}

export function defaultHeaders(token?: OauthToken): { [key: string]: string } {
  const headers: {[key: string] : string} = {
    "User-Agent": "quaternary's janky code",
    "X-API-Version": "20240529",
  };
  
  if(token !== undefined) {
    headers["Authorization"] = tokenToHeader(token);
  }
  
  return headers;
}
