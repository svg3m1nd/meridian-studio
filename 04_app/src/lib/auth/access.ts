export function parseAllowedGitHubLogins(source:string|undefined):Set<string>{
 return new Set((source??"").split(",").map(value=>value.trim().toLowerCase()).filter(Boolean));
}

export function isAllowedGitHubLogin(login:unknown,source:string|undefined,isProduction:boolean):boolean{
 const allowed=parseAllowedGitHubLogins(source);
 if(allowed.size===0)return !isProduction;
 return typeof login==="string"&&allowed.has(login.trim().toLowerCase());
}
