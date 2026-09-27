import Link from "next/link";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {db} from "@/lib/db";
import {archiveWorkspaceAction,createWorkspaceAction,renameWorkspaceAction} from "@/app/actions/workspaces";
import {withTenantTransaction} from "@/lib/tenant/transaction";
import {getSetupCompleteness} from "@/lib/workspace/completeness";
import {selectOrganizationMembership} from "@/lib/organization/selection";
import {AppHeader} from "@/components/app-header";

export default async function Portfolio({searchParams}:{searchParams:Promise<{organizationId?:string}>}){
 const session=await auth();
 if(!session?.user?.email)redirect("/login");
 const identity=await db.user.findUnique({where:{email:session.user.email}});
 if(!identity)redirect("/login");
 const user=await withTenantTransaction({userId:identity.id},tx=>tx.user.findUnique({where:{id:identity.id},include:{memberships:{include:{organization:{include:{workspaces:{where:{archivedAt:null},orderBy:{name:"asc"},include:{businessProfile:true,_count:{select:{topics:true,queries:true}}}}}}}}}}));
 const memberships=[...(user?.memberships??[])].sort((left,right)=>left.organization.name.localeCompare(right.organization.name));
 const requested=(await searchParams).organizationId;
 const active=selectOrganizationMembership(memberships,requested);
 const workspaces=active?.organization.workspaces??[];
 const canManage=active&&["OWNER","ADMIN"].includes(active.role);

 return <main><AppHeader email={session.user.email} context={active?.organization.name??"Client portfolio"}/><section className="portfolio"><article><small>CLIENT PORTFOLIO</small><h1>WORKSPACES</h1>
  {memberships.length>1&&<nav className="org-switcher" aria-label="Organizations">{memberships.map(membership=><Link className={membership.id===active?.id?"active":undefined} key={membership.id} href={`/portfolio?organizationId=${encodeURIComponent(membership.organizationId)}`}>{membership.organization.name}<span>{membership.role}</span></Link>)}</nav>}
  {!active?<div className="notice">Your account has no organizations yet.</div>:workspaces.length?<ul className="workspace-list">{workspaces.map(workspace=>{const setup=getSetupCompleteness({businessProfile:workspace.businessProfile,topicCount:workspace._count.topics,queryCount:workspace._count.queries});return <li key={workspace.id}><div className="workspace-summary"><Link href={`/workspaces/${workspace.id}/setup`}>{workspace.name}</Link><span>{active.organization.name}</span><span className={`setup-status ${setup.status.toLowerCase().replace("_","-")}`} title={setup.missing.length?`Missing: ${setup.missing.join(", ")}`:"Assessment baseline is ready"}>{setup.label} - {setup.percent}%</span></div>{canManage&&<details className="workspace-actions"><summary>Manage</summary><form action={renameWorkspaceAction}><input type="hidden" name="workspaceId" value={workspace.id}/><label>Workspace name<input name="name" required minLength={2} maxLength={100} defaultValue={workspace.name}/></label><button type="submit">Rename</button></form><form action={archiveWorkspaceAction}><input type="hidden" name="workspaceId" value={workspace.id}/><p>Archiving hides this workspace without deleting its data.</p><button className="danger" type="submit">Archive workspace</button></form></details>}</li>})}</ul>:<div className="notice">This organization has no active client workspaces yet.</div>}
  {active&&canManage&&<form action={createWorkspaceAction} className="form"><h2>New client workspace</h2><input type="hidden" name="organizationId" value={active.organizationId}/><label>Client name<input name="name" required minLength={2} maxLength={100}/></label><button type="submit">Create for {active.organization.name}</button></form>}
 </article></section></main>;
}
