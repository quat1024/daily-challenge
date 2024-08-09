import z from "zod";
import { encForm, encUri } from "./web.ts";

export const ZOauthApp = z.object({
  client_id: z.string(),
  client_secret: z.string(),
  redirect_uri: z.string(),
});
export interface OauthApp extends z.infer<typeof ZOauthApp> {};

export const ZOauthCode = z.string().brand("oauth-code");
export type OauthCode = z.infer<typeof ZOauthCode>;

export const ZOauthToken = z.object({
  token_type: z.string(),
  expires_in: z.number(),
  access_token: z.string(),
  refresh_token: z.string(),
});
export interface OauthToken extends z.infer<typeof ZOauthToken> {};

export function tokenToHeader(token: OauthToken): string {
  return `${token.token_type} ${token.access_token}`;
}

export async function promptForOauthCode(app: OauthApp): Promise<OauthCode> {
  //TODO: should be built like a Promise<String> that eventually resolves
  //not this janky thing where i actually just listen for the server shutdown
  let code = null;

  //Build the authorization url
  const responseType = "code";
  const scope = "public";
  const state = "" + Math.random();

  const authUrl = "https://osu.ppy.sh/oauth/authorize" + encUri({
    client_id: app.client_id,
    redirect_uri: app.redirect_uri,
    response_type: responseType,
    scope,
    state,
  });

  //Start the OAuth callback server
  console.log("Starting oauth redirect server");
  const abortController = new AbortController();
  const callbackServer = Deno.serve(
    {
      //TODO make this configurable, maybe parse them out of the app.redirect_url
      hostname: "localhost",
      port: 1237,
      signal: abortController.signal,
    },
    (req) => {
      //TODO: routing lol (doesnt really matter)
      const parms = new URL(req.url).searchParams;

      const recvCode = parms.get("code");
      const recvState = parms.get("state");

      if (recvCode !== null && recvState !== null && state === recvState) {
        console.log("Got code");
        code = recvCode;

        setTimeout(() => {
          console.log("Shutting down oauth redirect server");
          abortController.abort();
        }, 250);

        return new Response("You may now close the tab!");
      } else return new Response("Didn't get code/state or mismatched state");
    },
  );

  //Prompt for authorization
  console.log("Visit this URL to authorize: ", authUrl);

  await callbackServer.finished;

  if (code === null) {
    throw new Error("Oauth redirect server closed without getting code");
  }

  return code;
}

export async function exchangeOauthCodeForToken(
  app: OauthApp,
  code: OauthCode,
): Promise<OauthToken> {
  const response = await fetch("https://osu.ppy.sh/oauth/token/", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encForm({
      client_id: app.client_id,
      client_secret: app.client_secret,
      code,
      grant_type: "authorization_code",
      redirect_uri: app.redirect_uri,
    }),
  });
  const json = await response.json();
  return ZOauthToken.parse(json);
}
