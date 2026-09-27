import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {db} from "@/lib/db";
import {requireWorkspaceAccess} from "@/lib/tenant/dal";
import {withTenantTransaction} from "@/lib/tenant/transaction";
import {BaselineForm} from "./baseline-form";

export default async function Setup({params}:{params:Promise<{workspaceId:string}>}){
 const {workspaceId}=await params;
 const session=await auth();
 if(!session?.user?.email)redirect("/login");
 const user=await db.user.findUnique({where:{email:session.user.email}});
 if(!user)redirect("/login");
 const context=await requireWorkspaceAccess(user.id,workspaceId,"ANALYST");
 const workspace=await withTenantTransaction({userId:user.id,organizationId:context.organizationId,workspaceId},tx=>tx.workspace.findFirstOrThrow({where:{id:workspaceId,archivedAt:null},include:{businessProfile:true,competitors:{orderBy:{name:"asc"}},topics:{orderBy:{name:"asc"}},queries:{orderBy:{text:"asc"}}}}));
 return <main><header><b>MERIDIAN STUDIO</b><span>{workspace.name}</span></header><section className="portfolio"><article><small>BASELINE SETUP</small><h1>{workspace.name}</h1><BaselineForm values={{workspaceId:workspace.id,canonicalName:workspace.businessProfile?.canonicalName??workspace.name,websiteUrl:workspace.businessProfile?.websiteUrl??"",aliases:workspace.businessProfile?.aliases??[],locale:workspace.businessProfile?.locale??"en-US",market:workspace.businessProfile?.market??"",competitors:workspace.competitors.map(item=>item.name),topics:workspace.topics.map(item=>item.name),queries:workspace.queries.map(item=>item.text)}}/></article></section></main>;
}
