import { z } from "zod";
const optionalUrl=z.union([z.literal(""),z.string().url()]).transform(v=>v||undefined);
const lines=(value:unknown)=>String(value??"").split(/\r?\n/).map(v=>v.trim()).filter(Boolean);
export const workspaceSchema=z.object({organizationId:z.string().min(1),name:z.string().trim().min(2).max(100)});
export const renameWorkspaceSchema=z.object({workspaceId:z.string().min(1),name:z.string().trim().min(2).max(100)});
export const archiveWorkspaceSchema=z.object({workspaceId:z.string().min(1)});
export const baselineSchema=z.object({
  workspaceId:z.string().min(1),canonicalName:z.string().trim().min(2).max(160),websiteUrl:optionalUrl,
  aliases:z.preprocess(lines,z.array(z.string()).max(20)),locale:z.string().trim().min(2).max(20),market:z.string().trim().max(80).optional(),
  competitors:z.preprocess(lines,z.array(z.string()).max(5)),topics:z.preprocess(lines,z.array(z.string()).max(25)),queries:z.preprocess(lines,z.array(z.string()).max(100)),
});
export const slugify=(value:string)=>value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"").slice(0,72);
