import { z } from "zod";
const envSchema=z.object({DATABASE_URL:z.string().url(),APP_BASE_URL:z.string().url().default("http://localhost:3000"),LOG_LEVEL:z.enum(["debug","info","warn","error"]).default("info")});
export type AppEnvironment=z.infer<typeof envSchema>;
export const parseEnvironment=(source:Record<string,string|undefined>):AppEnvironment=>envSchema.parse(source);
