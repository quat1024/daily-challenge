import z from "zod";

import { ZCountry } from "./country.ts"
import { ZStringyDate } from "./date.ts"

export const ZUser = z.object({
  avatar_url: z.string(),
  country_code: z.string(),
  default_group: z.string(),
  id: z.number(),
  is_active: z.boolean(),
  is_bot: z.boolean(),
  is_deleted: z.boolean(),
  is_online: z.boolean(),
  is_supporter: z.boolean(),
  last_visit: ZStringyDate.nullish(),
  pm_friends_only: z.boolean(),
  profile_colour: z.string().nullish(),
  username: z.string(),
  country: ZCountry.nullish()
});
export interface User extends z.infer<typeof ZUser>{};