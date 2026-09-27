import { roleMeetsMinimum,type MembershipRole } from "@/lib/auth/roles";
export type MembershipRecord={id:string;userId:string;organizationId:string;role:MembershipRole;workspaceIds:readonly string[]|null};
export type TenantContext={userId:string;membershipId:string;organizationId:string;workspaceId:string;role:MembershipRole};
export class TenantAuthorizationError extends Error { readonly code="WORKSPACE_NOT_FOUND_OR_FORBIDDEN"; constructor(){super("The requested workspace is unavailable.");this.name="TenantAuthorizationError";} }
export function authorizeWorkspace(i:{userId:string;requestedOrganizationId:string;requestedWorkspaceId:string;workspaceOrganizationId:string;membership:MembershipRecord|null;minimumRole?:MembershipRole}):TenantContext{
 const {membership:m}=i; const ok=m&&m.userId===i.userId&&m.organizationId===i.requestedOrganizationId&&i.workspaceOrganizationId===i.requestedOrganizationId&&(m.workspaceIds===null||m.workspaceIds.includes(i.requestedWorkspaceId))&&roleMeetsMinimum(m.role,i.minimumRole??"VIEWER");
 if(!ok) throw new TenantAuthorizationError(); return {userId:i.userId,membershipId:m.id,organizationId:i.requestedOrganizationId,workspaceId:i.requestedWorkspaceId,role:m.role};
}
