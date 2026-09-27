export const roles=["OWNER","ADMIN","ANALYST","REVIEWER","VIEWER"] as const;
export type MembershipRole=(typeof roles)[number];
const rank:Record<MembershipRole,number>={OWNER:5,ADMIN:4,ANALYST:3,REVIEWER:2,VIEWER:1};
export const roleMeetsMinimum=(actual:MembershipRole,minimum:MembershipRole)=>rank[actual]>=rank[minimum];
