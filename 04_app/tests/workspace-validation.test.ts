import {describe,expect,it} from "vitest";
import {archiveWorkspaceSchema,baselineSchema,renameWorkspaceSchema,slugify,workspaceSchema} from "@/lib/validation/workspace";

describe("workspace validation",()=>{
 it("normalizes a slug",()=>expect(slugify("Acme & Sons — Denver")).toBe("acme-sons-denver"));
 it("rejects short names",()=>expect(()=>workspaceSchema.parse({organizationId:"o1",name:"x"})).toThrow());
 it("validates rename and archive targets",()=>{
  expect(renameWorkspaceSchema.parse({workspaceId:"w1",name:"Renamed"}).name).toBe("Renamed");
  expect(archiveWorkspaceSchema.parse({workspaceId:"w1"}).workspaceId).toBe("w1");
 });
 it("parses bounded baseline lists",()=>{
  const parsed=baselineSchema.parse({workspaceId:"w1",canonicalName:"Acme",websiteUrl:"https://example.com",aliases:"Acme\nAcme Co",locale:"en-US",market:"Denver",competitors:"One\nTwo",topics:"Graph SEO",queries:"best graph seo"});
  expect(parsed.competitors).toEqual(["One","Two"]);
  expect(parsed.aliases).toHaveLength(2);
 });
});
