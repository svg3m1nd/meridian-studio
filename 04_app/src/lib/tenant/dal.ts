import "server-only";
import { authorizeWorkspace,type TenantContext } from "@/lib/tenant/context";
import type { MembershipRole } from "@/lib/auth/roles";
import { withTenantTransaction } from "@/lib/tenant/transaction";
export async function requireWorkspaceAccess(userId:string,workspaceId:string,minimumRole:MembershipRole="VIEWER"):Promise<TenantContext>{
 return withTenantTransaction({userId},async tx=>{const workspace=await tx.workspace.findFirst({where:{id:workspaceId,archivedAt:null},select:{organizationId:true}});if(!workspace)return authorizeWorkspace({userId,requestedOrganizationId:"",requestedWorkspaceId:workspaceId,workspaceOrganizationId:"",membership:null,minimumRole});const membership=await tx.membership.findUnique({where:{organizationId_userId:{organizationId:workspace.organizationId,userId}},include:{grants:true}});return authorizeWorkspace({userId,requestedOrganizationId:workspace.organizationId,requestedWorkspaceId:workspaceId,workspaceOrganizationId:workspace.organizationId,membership:membership?{id:membership.id,userId:membership.userId,organizationId:membership.organizationId,role:membership.role,workspaceIds:["OWNER","ADMIN"].includes(membership.role)?null:membership.grants.map(g=>g.workspaceId)}:null,minimumRole})});
}
