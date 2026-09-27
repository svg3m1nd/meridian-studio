import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe,expect,it} from "vitest";

describe("Auth.js Prisma schema",()=>{
 it("exposes the adapter-compatible user name while preserving the database column",()=>{
  const schema=readFileSync(resolve(process.cwd(),"prisma/schema.prisma"),"utf8");
  expect(schema).toMatch(/model User \{[\s\S]*?\bname String\? @map\("displayName"\)/);
 });
});
