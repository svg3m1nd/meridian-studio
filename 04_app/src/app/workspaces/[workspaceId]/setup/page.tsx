import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {db} from "@/lib/db";
import {requireWorkspaceAccess} from "@/lib/tenant/dal";
import {updateBaselineAction} from "@/app/actions/workspaces";
import {withTenantTransaction} from "@/lib/tenant/transaction";

export default async function Setup({params,searchParams}:{params:Promise<{workspaceId:string}>;searchParams:Promise<{saved?:string}>}){
 const [{workspaceId},{saved}]=await Promise.all([params,searchParams]);
 const session=await auth();
 if(!session?.user?.email)redirect("/login");
 const user=await db.user.findUnique({where:{email:session.user.email}});
 if(!user)redirect("/login");
 const context=await requireWorkspaceAccess(user.id,workspaceId,"ANALYST");
 const workspace=await withTenantTransaction({userId:user.id,organizationId:context.organizationId,workspaceId},tx=>tx.workspace.findUniqueOrThrow({where:{id:workspaceId},include:{businessProfile:true,competitors:true,topics:true,queries:true}}));
 return <main><header><b>MERIDIAN STUDIO</b><span>{workspace.name}</span></header><section className="portfolio"><article><small>BASELINE SETUP</small><h1>{workspace.name}</h1>{saved==="1"&&<p className="notice success" role="status">Baseline saved successfully.</p>}<form action={updateBaselineAction} className="form"><input type="hidden" name="workspaceId" value={workspace.id}/><label>Canonical business name<input name="canonicalName" required defaultValue={workspace.businessProfile?.canonicalName??workspace.name}/></label><label>Website URL<input name="websiteUrl" type="url" defaultValue={workspace.businessProfile?.websiteUrl??""}/></label><label>Aliases, one per line<textarea name="aliases" defaultValue={workspace.businessProfile?.aliases.join("\n")}/></label><div className="fields"><label>Locale<input name="locale" required defaultValue={workspace.businessProfile?.locale??"en-US"}/></label><label>Market<input name="market" defaultValue={workspace.businessProfile?.market??""}/></label></div><label>Competitors, one per line<textarea name="competitors" defaultValue={workspace.competitors.map(x=>x.name).join("\n")}/></label><label>Topics, one per line<textarea name="topics" defaultValue={workspace.topics.map(x=>x.name).join("\n")}/></label><label>Target searches and AI prompts, one per line<span className="field-help" id="query-help">Concrete questions Meridian should test across search engines and AI systems.</span><textarea aria-describedby="query-help" name="queries" placeholder={'best digital marketing agency for small businesses\nwho offers SEO strategy in Denver'} defaultValue={workspace.queries.map(x=>x.text).join("\n")}/></label><button type="submit">Save baseline</button></form></article></section></main>;
}
