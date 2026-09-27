import {describe,expect,it} from "vitest";
import {selectOrganizationMembership} from "@/lib/organization/selection";

const memberships=[{organizationId:"org-a",name:"A"},{organizationId:"org-b",name:"B"}];

describe("organization selection",()=>{
 it("selects an authorized requested organization",()=>expect(selectOrganizationMembership(memberships,"org-b")?.name).toBe("B"));
 it("falls back without exposing an unauthorized organization",()=>expect(selectOrganizationMembership(memberships,"org-x")?.name).toBe("A"));
 it("handles accounts without an organization",()=>expect(selectOrganizationMembership([],undefined)).toBeUndefined());
});
