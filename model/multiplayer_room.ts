import z from "zod";

import { ZBeatmap } from "./beatmap.ts";
import { ZStringyDate } from "./date.ts";
import { ZConfiguredMod } from "./mod.ts";
import { ZUser } from "./user.ts"

export const ZMultiplayerRoomCategory = z.enum(["normal", "daily_challenge"] as const);
export type MultiplayerRoomCategory = z.infer<typeof ZMultiplayerRoomCategory>;

//TODO: double check this
export const ZMultiplayerRoomType = z.enum(["realtime", "playlists"] as const);
export type MultiplayerRoomType = z.infer<typeof ZMultiplayerRoomType>;

//TODO: more queue modes
export const ZMultiplayerQueueMode = z.enum(["host_only"]);
export type MultiplayerQueueMode = z.infer<typeof ZMultiplayerQueueMode>;

export const ZCurrentPlaylistItem = z.object({
  id: z.number(),
  room_id: z.number(),
  beatmap_id: z.number(),
  ruleset_id: z.number(),
  allowed_mods: ZConfiguredMod.array(),
  required_mods: ZConfiguredMod.array(),
  expired: z.boolean(),
  owner_id: z.number(),
  //TODO: playlist_order
  //TODO: played_at
  beatmap: ZBeatmap,
});
export interface CurrentPlaylistItem extends z.infer<typeof ZCurrentPlaylistItem>{};

export const ZPlaylistItemStats = z.object({
  count_active: z.number(),
  count_total: z.number(),
  ruleset_ids: z.number().array()
});
export interface PlaylistItemStats extends z.infer<typeof ZPlaylistItemStats>{};

export const ZDifficultyRange = z.object({
  min: z.number(),
  max: z.number()
});
export interface DifficultyRange extends z.infer<typeof ZDifficultyRange>{};

export const ZMultiplayerRoom = z.object({
  id: z.number(),
  name: z.string(),
  category: ZMultiplayerRoomCategory,
  user_id: z.number(),
  starts_at: ZStringyDate,
  ends_at: ZStringyDate,
  max_attempts: z.number().nullish(),
  participant_count: z.number(),
  channel_id: z.number(),
  active: z.boolean(),
  has_password: z.boolean(),
  queue_mode: ZMultiplayerQueueMode,
  auto_skip: z.boolean(),
  current_playlist_item: ZCurrentPlaylistItem,
  difficulty_range: ZDifficultyRange,
  host: ZUser,
  playlist_item_stats: ZPlaylistItemStats,
  recent_participants: ZUser.array()
});
export interface MultiplayerRoom extends z.infer<typeof ZMultiplayerRoom>{};