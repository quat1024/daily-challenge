import z from "zod";

//TODO use https://github.com/ppy/osu-web/blob/master/database/mods.json
// maybe type them better too..!
const modAcronyms = [
  "EZ", //easy
  "NF", //no fail
  "HT", //halftime
  "DC", //daycore
  "HR", //hard rock
  "SD", //sudden death
  "PF", //perfect
  "DT", //double time
  "NC", //nightcore
  "HD", //hidden
  "FL", //flashlight
  "BL", //blinds
  "ST", //strict tracking
  "AC", //accuracy challenge
  "TP", //target practice
  "DA", //difficulty adjust
  "CL", //classic
  "RD", //random
  "MR", //mirror
  "AL", //alternate
  "SG", //single tap
  "AT", //auto
  "CN", //cinema
  "RX", //relax
  "AP", //autopilot
  "SO", //spun out
  "TR", //transform
  "WG", //wiggle
  "SI", //spin in
  "GR", //grow
  "DF", //deflate
  "WU", //wind up
  "WD", //wind down
  "TC", //traceable
  "BR", //barrel roll
  "AD", //approach different
  "MU", //muted
  "NS", //no scope
  "MG", //magnetized
  "RP", //repel
  "AS", //adaptive speed
  "FR", //freeze frame
  "BU", //bubbles
  "SY", //synesthesia
  "DP", //depth
  "TD", //touch device
  "SV2", //scorev2 (legacy)
  "SW", //swap (taiko)
  "CS", //constant speed (taiko/mania)
  "FF", //floating fruits (fruits)
  "FI", //fade in (mania)
  "CO", //cover (mania)
  "IN", //invert (mania)
  "HO", //hold off (mania)
  "DS", //dual stage (mania)
  "1K", //mania keymods
  "2K",
  "3K",
  "4K",
  "5K",
  "6K",
  "7K",
  "8K",
  "9K",
  "10K",
] as const;

export const ZMod = z.enum(modAcronyms);
export type Mod = z.infer<typeof ZMod>;

//This is all undocumented :pensive:
//i've seen this in the wild
//      "required_mods": [
//        { "acronym": "DT", "settings": { "speed_change": 1.2 } },
//        { "acronym": "HD", "settings": {} },
//        { "acronym": "RX", "settings": {} }
//      ],

export const ZConfiguredMod = z.object({
  acronym: ZMod,
  settings: z.object({}).passthrough(),
});
export interface ConfiguredMod extends z.infer<typeof ZConfiguredMod> {}

export function printConfiguredMod(cmod: ConfiguredMod): string {
  let result = cmod.acronym.toString();
  if (Object.keys(cmod.settings).length >= 1) {
    result += JSON.stringify(cmod.settings);
  }
  return result;
}

export function printConfiguredMods(cmods: ConfiguredMod[]): string {
  if (cmods.length == 0) {
    return "(none)";
  } else {
    return cmods.map((cmod) => printConfiguredMod(cmod)).join(", ");
  }
}
