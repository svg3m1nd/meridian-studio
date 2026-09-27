export type SetupStatus="NOT_STARTED"|"IN_PROGRESS"|"READY";

export type SetupCompletenessInput={
 businessProfile:{canonicalName:string;websiteUrl:string|null;locale:string}|null;
 topicCount:number;
 queryCount:number;
};

export type SetupCompleteness={
 status:SetupStatus;
 label:"Not started"|"In progress"|"Ready";
 completed:number;
 total:5;
 percent:number;
 missing:string[];
};

export function getSetupCompleteness(input:SetupCompletenessInput):SetupCompleteness{
 const checks=[
  ["canonical business name",Boolean(input.businessProfile?.canonicalName.trim())],
  ["website URL",Boolean(input.businessProfile?.websiteUrl?.trim())],
  ["locale",Boolean(input.businessProfile?.locale.trim())],
  ["at least one topic",input.topicCount>0],
  ["at least one target query",input.queryCount>0]
 ] as const;
 const missing=checks.filter(([,complete])=>!complete).map(([label])=>label);
 const completed=checks.length-missing.length;
 const status:SetupStatus=!input.businessProfile?"NOT_STARTED":missing.length?"IN_PROGRESS":"READY";
 return {status,label:status==="READY"?"Ready":status==="IN_PROGRESS"?"In progress":"Not started",completed,total:5,percent:Math.round(completed/5*100),missing};
}
