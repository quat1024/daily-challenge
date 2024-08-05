import z from "zod";

export const ZBeatmapset = z.object({
  artist: z.string(),
  artist_unicode: z.string(),
  creator: z.string(),
  favourite_count: z.number(),
  //hype TODO
  id: z.number(),
  nsfw: z.boolean(),
  offset: z.number(),
  play_count: z.number(),
  preview_url: z.string(),
  source: z.string(),
  spotlight: z.boolean(),
  status: z.string(), //TODO strongly typed
  title: z.string(),
  title_unicode: z.string(),
  track_id: z.number().nullish(),
  user_id: z.number(),
  video: z.boolean()
});
export interface Beatmapset extends z.infer<typeof ZBeatmapset> {};

export const ZBeatmap = z.object({
  beatmapset_id: z.number(),
  difficulty_rating: z.number(),
  id: z.number(),
  mode: z.string(),
  status: z.string(),
  total_length: z.number(),
  user_id: z.number(),
  version: z.string(),
  beatmapset: ZBeatmapset
});
export interface Beatmap extends z.infer<typeof ZBeatmap> {};
