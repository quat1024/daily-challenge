import z from "zod";

//TODO need to double check this list
const modAcronyms = ["EZ" , "NF" , "HT" , "DC" , "HR" , "SD" , "PF" , "DT" , "NC" , "HD" , "FL" , "BL" , "ST" , "AC" , "TP" , "DA" , "CL" , "MR" , "AL" , "SG" , "RX" , "AP" , "SO" , "TR" , "WG" , "SI" , "GR" , "DF" , "WU" , "WD" , "TC" , "BR" , "AD" , "MU" , "NS" , "MG" , "RP" , "AS" , "FR" , "BU" , "SY" , "DP", "RD", "SW", "CS"] as const;

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
  settings: z.object({}).passthrough()
})
export interface ConfiguredMod extends z.infer<typeof ZConfiguredMod>{};

export function printConfiguredMod(cmod: ConfiguredMod): string {
  let result = cmod.acronym.toString();
  if(Object.keys(cmod.settings).length >= 1) {
    result += JSON.stringify(cmod.settings);
  }
  return result;
}

export function printConfiguredMods(cmods: ConfiguredMod[]): string {
  if(cmods.length == 0) {
    return "(none)";
  } else {
    return cmods.map(cmod => printConfiguredMod(cmod)).join(", ");
  }
}