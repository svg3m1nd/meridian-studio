import { z } from "zod";
const postgresUrl=z.string().url().refine(value=>["postgres:","postgresql:"].includes(new URL(value).protocol),"Expected a PostgreSQL connection URL");
const envSchema=z.object({DATABASE_URL:postgresUrl,DIRECT_URL:postgresUrl.optional(),APP_BASE_URL:z.string().url().default("http://localhost:3000"),LOG_LEVEL:z.enum(["debug","info","warn","error"]).default("info")});
export type AppEnvironment=z.infer<typeof envSchema>;
export const parseEnvironment=(source:Record<string,string|undefined>):AppEnvironment=>envSchema.parse(source);
