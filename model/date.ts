import z from "zod";

//dates look like this
//"starts_at": "2024-08-03T11:52:35+00:00",
//"ends_at": "2024-08-10T11:52:35+00:00",

export const ZStringyDate = z.string().datetime({offset: true});
export type StringyDate = z.infer<typeof ZStringyDate>;