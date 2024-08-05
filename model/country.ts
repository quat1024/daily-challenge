import z from "zod";

export const ZCountryCode = z.string();
export type CountryCode = z.infer<typeof ZCountryCode>;

export const ZCountry = z.object({
  code: ZCountryCode,
  name: z.string()
});
export interface Country extends z.infer<typeof ZCountry>{};