import {describe,expect,it} from "vitest";
import {getSetupCompleteness} from "@/lib/workspace/completeness";

describe("workspace setup completeness",()=>{
 it("marks an untouched workspace as not started",()=>{
  const result=getSetupCompleteness({businessProfile:null,topicCount:0,queryCount:0});
  expect(result).toMatchObject({status:"NOT_STARTED",percent:0,completed:0});
 });

 it("lists missing requirements for partial setup",()=>{
  const result=getSetupCompleteness({businessProfile:{canonicalName:"Acme",websiteUrl:null,locale:"en-US"},topicCount:1,queryCount:0});
  expect(result).toMatchObject({status:"IN_PROGRESS",percent:60});
  expect(result.missing).toEqual(["website URL","at least one target query"]);
 });

 it("marks the minimum assessment baseline ready",()=>{
  const result=getSetupCompleteness({businessProfile:{canonicalName:"Acme",websiteUrl:"https://example.com",locale:"en-US"},topicCount:1,queryCount:1});
  expect(result).toMatchObject({status:"READY",percent:100,missing:[]});
 });
});
