import { encUri } from "./web.ts";
import {
  exchangeOauthCodeForToken,
  OauthApp,
  OauthCode,
  OauthToken,
  promptForOauthCode,
  tokenToHeader,
  ZOauthApp,
  ZOauthToken,
} from "./oauth.ts";
import { MultiplayerRoom, ZMultiplayerRoom } from "./model/multiplayer_room.ts";
import { printConfiguredMods } from "./model/mod.ts";

async function sleep(ms: number): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}

async function saveToken(token: OauthToken) {
  await Deno.writeTextFile("private/auth-token.json", JSON.stringify(token));
}

async function loadOrPromptToken(app: OauthApp): Promise<OauthToken> {
  return await Deno.readTextFile("private/auth-token.json")
    .then((t) => ZOauthToken.parse(JSON.parse(t)))
    .catch(async (error) => {
      if (error.code == "ENOENT") {
        const code: OauthCode = await promptForOauthCode(app);
        const token: OauthToken = await exchangeOauthCodeForToken(app, code);
        saveToken(token);
        return token;
      }
      throw error;
    });
}

async function getRooms(
  token: OauthToken,
  limit: number,
): Promise<MultiplayerRoom[]> {
  const resp = await fetch(
    "https://osu.ppy.sh/api/v2/rooms" + encUri({
      limit: limit.toString(),
      mode: "active",
      type_group: "playlists",
      sort: "created",
    }),
    {
      headers: {
        "Authorization": tokenToHeader(token),
        "Accept": "application/json",
        "Content-Type": "application/json",
        //this api version header is req'd to see rooms with daily_challenge category
        //see https://osu.ppy.sh/docs/index.html#endpoint
        "x-api-version": "20240529",
      },
    },
  );
  const json = await resp.json();
  return ZMultiplayerRoom.array().parse(json);
}

async function main() {
  const app: OauthApp = ZOauthApp.parse(
    JSON.parse(await Deno.readTextFile("private/oauth-app.json")),
  );

  const token: OauthToken = await loadOrPromptToken(app);
  console.log("Got oauth token");

  let dcRoom = undefined;

  let limit = 10;
  const HARD_LIMIT = 100; //Don't ever request more than this many rooms from the api
  while (true) {
    console.log("Asking for", limit, "rooms...");
    const rooms: MultiplayerRoom[] = await getRooms(token, limit);
    console.log("Received", rooms.length, "rooms.");

    const foundRoom: MultiplayerRoom | undefined = rooms.find((r) => r.category == "daily_challenge");
    if (foundRoom !== undefined) {
      console.log("Got daily challenge room! Room ID:", foundRoom.id);
      dcRoom = foundRoom;
      break;
    } else {
      console.log("Didn't find it in first", rooms.length, "rooms.");

      if (limit != rooms.length) {
        console.log("Ran out of rooms!");
        return;
      }

      limit *= 2;
      if (limit > HARD_LIMIT) {
        console.log("Giving up!");
        return;
      }

      console.log("Trying again!");
      await sleep(1000);
    }
  }

  const item = dcRoom.current_playlist_item;
  const map = item.beatmap;
  const set = map.beatmapset;
  console.log("   Title:", set.title);
  console.log("  Artist:", set.artist);
  console.log("  Mapper:", set.creator);
  console.log("    Diff:", map.version);
  console.log("  Rating:", map.difficulty_rating);
  console.log(" Diff ID:", map.id);
  console.log("  Free mods:", printConfiguredMods(item.allowed_mods));
  console.log("Forced mods:", printConfiguredMods(item.required_mods));

  await Deno.mkdir("out", { recursive: true });
  await Deno.writeTextFile(
    "out/daily-challenge-room.json",
    JSON.stringify(dcRoom, undefined, "\t"),
  );
}

if (import.meta.main) {
  await main();
}
