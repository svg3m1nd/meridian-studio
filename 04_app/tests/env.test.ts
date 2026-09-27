import {describe,expect,it} from "vitest"; import {parseEnvironment} from "@/lib/env";
describe("environment",()=>{it("defaults safely",()=>expect(parseEnvironment({DATABASE_URL:"postgresql://localhost/meridian"}).LOG_LEVEL).toBe("info"));it("rejects invalid values",()=>expect(()=>parseEnvironment({DATABASE_URL:"bad"})).toThrow())});
