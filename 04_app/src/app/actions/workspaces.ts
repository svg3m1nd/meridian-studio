"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {db} from "@/lib/db";
import {roleMeetsMinimum} from "@/lib/auth/roles";
import {archiveWorkspaceSchema,baselineSchema,renameWorkspaceSchema,slugify,workspaceSchema} from "@/lib/validation/workspace";
import {requireWorkspaceAccess} from "@/lib/tenant/dal";
import {withTenantTransaction} from "@/lib/tenant/transaction";

export type BaselineFormState={
 status:"idle"|"success"|"error";
 message:string;
 fieldErrors:Record<string,string[]|undefined>;
};

async function currentUser(){
 const session=await auth();
 if(!session?.user?.email)redirect("/login");
 const user=await db.user.findUnique({where:{email:session.user.email}});
 if(!user)redirect("/login");
 return user;
}

export async function createWorkspaceAction(formData:FormData){
 const user=await currentUser();
 const input=workspaceSchema.parse(Object.fromEntries(formData));
 const base=slugify(input.name)||"workspace";
 const workspace=await withTenantTransaction({userId:user.id,organizationId:input.organizationId},async tx=>{
  const membership=await tx.membership.findUnique({where:{organizationId_userId:{organizationId:input.organizationId,userId:user.id}}});
  if(!membership||!roleMeetsMinimum(membership.role,"ADMIN"))throw new Error("Workspace unavailable.");
  const created=await tx.workspace.create({data:{organizationId:input.organizationId,name:input.name,slug:`${base}-${crypto.randomUUID().slice(0,8)}`}});
  await tx.workspaceGrant.create({data:{membershipId:membership.id,userId:user.id,workspaceId:created.id}});
  await tx.auditEvent.create({data:{organizationId:input.organizationId,workspaceId:created.id,actorUserId:user.id,action:"workspace.created",aggregateType:"Workspace",aggregateId:created.id}});
  return created;
 });
 revalidatePath("/portfolio");
 redirect(`/workspaces/${workspace.id}/setup`);
}

export async function renameWorkspaceAction(formData:FormData){
 const user=await currentUser();
 const input=renameWorkspaceSchema.parse(Object.fromEntries(formData));
 const context=await requireWorkspaceAccess(user.id,input.workspaceId,"ADMIN");
 await withTenantTransaction({userId:user.id,organizationId:context.organizationId,workspaceId:context.workspaceId},async tx=>{
  await tx.workspace.update({where:{id:context.workspaceId},data:{name:input.name}});
  await tx.auditEvent.create({data:{organizationId:context.organizationId,workspaceId:context.workspaceId,actorUserId:user.id,action:"workspace.renamed",aggregateType:"Workspace",aggregateId:context.workspaceId,metadata:{name:input.name}}});
 });
 revalidatePath("/portfolio");
 redirect(`/portfolio?organizationId=${encodeURIComponent(context.organizationId)}`);
}

export async function archiveWorkspaceAction(formData:FormData){
 const user=await currentUser();
 const input=archiveWorkspaceSchema.parse(Object.fromEntries(formData));
 const context=await requireWorkspaceAccess(user.id,input.workspaceId,"ADMIN");
 await withTenantTransaction({userId:user.id,organizationId:context.organizationId,workspaceId:context.workspaceId},async tx=>{
  await tx.workspace.update({where:{id:context.workspaceId},data:{archivedAt:new Date()}});
  await tx.auditEvent.create({data:{organizationId:context.organizationId,workspaceId:context.workspaceId,actorUserId:user.id,action:"workspace.archived",aggregateType:"Workspace",aggregateId:context.workspaceId}});
 });
 revalidatePath("/portfolio");
 redirect(`/portfolio?organizationId=${encodeURIComponent(context.organizationId)}`);
}

export async function updateBaselineAction(_previousState:BaselineFormState,formData:FormData):Promise<BaselineFormState>{
 const parsed=baselineSchema.safeParse(Object.fromEntries(formData));
 if(!parsed.success){
  const flattened=parsed.error.flatten();
  return {status:"error",message:"Review the highlighted baseline fields.",fieldErrors:flattened.fieldErrors};
 }
 const input=parsed.data;
 const user=await currentUser();
 try{
  const context=await requireWorkspaceAccess(user.id,input.workspaceId,"ANALYST");
  await withTenantTransaction({userId:user.id,organizationId:context.organizationId,workspaceId:context.workspaceId},async tx=>{
   await tx.businessProfile.upsert({where:{workspaceId:context.workspaceId},create:{workspaceId:context.workspaceId,canonicalName:input.canonicalName,websiteUrl:input.websiteUrl,aliases:input.aliases,locale:input.locale,market:input.market||null},update:{canonicalName:input.canonicalName,websiteUrl:input.websiteUrl,aliases:input.aliases,locale:input.locale,market:input.market||null}});
   await tx.competitor.deleteMany({where:{workspaceId:context.workspaceId}});
   await tx.topic.deleteMany({where:{workspaceId:context.workspaceId}});
   await tx.searchQuery.deleteMany({where:{workspaceId:context.workspaceId}});
   if(input.competitors.length)await tx.competitor.createMany({data:input.competitors.map(name=>({workspaceId:context.workspaceId,name}))});
   if(input.topics.length)await tx.topic.createMany({data:input.topics.map(name=>({workspaceId:context.workspaceId,name}))});
   if(input.queries.length)await tx.searchQuery.createMany({data:input.queries.map(text=>({workspaceId:context.workspaceId,text,locale:input.locale,market:input.market||null}))});
   await tx.auditEvent.create({data:{organizationId:context.organizationId,workspaceId:context.workspaceId,actorUserId:user.id,action:"workspace.baseline.updated",aggregateType:"Workspace",aggregateId:context.workspaceId}});
  });
  revalidatePath(`/workspaces/${input.workspaceId}/setup`);
  revalidatePath("/portfolio");
  return {status:"success",message:"Baseline saved successfully.",fieldErrors:{}};
 }catch(error){
  console.error("baseline.save.failed",{workspaceId:input.workspaceId,error:error instanceof Error?error.message:"unknown"});
  return {status:"error",message:"The baseline could not be saved. Please try again.",fieldErrors:{}};
 }
}
