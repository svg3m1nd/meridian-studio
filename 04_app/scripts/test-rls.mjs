import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

if(!process.argv.includes("--confirm-development-database")){
 throw new Error("Refusing to run without --confirm-development-database");
}

function loadLocalEnvironment(){
 const text=readFileSync(resolve(process.cwd(),".env"),"utf8");
 for(const line of text.split(/\r?\n/)){
  const match=line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*"(.*)"\s*$/);
  if(match&&!process.env[match[1]])process.env[match[1]]=match[2];
 }
}

loadLocalEnvironment();
const runtimeUrl=process.env.DATABASE_URL;
const migrationUrl=process.env.DIRECT_URL;
if(!runtimeUrl||!migrationUrl)throw new Error("DATABASE_URL and DIRECT_URL are required");

const runtime=new PrismaClient({datasources:{db:{url:runtimeUrl}}});
const admin=new PrismaClient({datasources:{db:{url:migrationUrl}}});
const marker=`rls-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const ids={
 orgA:`${marker}-org-a`,orgB:`${marker}-org-b`,
 owner:`${marker}-owner`,analyst:`${marker}-analyst`,viewer:`${marker}-viewer`,outsider:`${marker}-outsider`,
 ownerMembership:`${marker}-owner-membership`,analystMembership:`${marker}-analyst-membership`,viewerMembership:`${marker}-viewer-membership`,outsiderMembership:`${marker}-outsider-membership`,
 workspaceA:`${marker}-workspace-a`,workspaceA2:`${marker}-workspace-a2`,workspaceB:`${marker}-workspace-b`,
 analystGrant:`${marker}-analyst-grant`,viewerGrant:`${marker}-viewer-grant`,
 profileA:`${marker}-profile-a`,auditA:`${marker}-audit-a`,
 runtimeWorkspace:`${marker}-runtime-workspace`,runtimeGrant:`${marker}-runtime-grant`,runtimeAudit:`${marker}-runtime-audit`
};

async function asUser(userId,work){
 return runtime.$transaction(async tx=>{
  await tx.$executeRaw`SELECT set_config('app.user_id', ${userId}, true)`;
  await tx.$executeRaw`SELECT set_config('app.organization_id', '', true)`;
  await tx.$executeRaw`SELECT set_config('app.workspace_id', '', true)`;
  return work(tx);
 });
}

async function seed(){
 await admin.user.createMany({data:[
  {id:ids.owner,email:`${ids.owner}@example.invalid`},
  {id:ids.analyst,email:`${ids.analyst}@example.invalid`},
  {id:ids.viewer,email:`${ids.viewer}@example.invalid`},
  {id:ids.outsider,email:`${ids.outsider}@example.invalid`}
 ]});
 await admin.organization.createMany({data:[
  {id:ids.orgA,name:"RLS Test Organization A",slug:ids.orgA},
  {id:ids.orgB,name:"RLS Test Organization B",slug:ids.orgB}
 ]});
 await admin.membership.createMany({data:[
  {id:ids.ownerMembership,organizationId:ids.orgA,userId:ids.owner,role:"OWNER"},
  {id:ids.analystMembership,organizationId:ids.orgA,userId:ids.analyst,role:"ANALYST"},
  {id:ids.viewerMembership,organizationId:ids.orgA,userId:ids.viewer,role:"VIEWER"},
  {id:ids.outsiderMembership,organizationId:ids.orgB,userId:ids.outsider,role:"OWNER"}
 ]});
 await admin.workspace.createMany({data:[
  {id:ids.workspaceA,organizationId:ids.orgA,name:"RLS Workspace A",slug:"workspace-a"},
  {id:ids.workspaceA2,organizationId:ids.orgA,name:"RLS Workspace A2",slug:"workspace-a2"},
  {id:ids.workspaceB,organizationId:ids.orgB,name:"RLS Workspace B",slug:"workspace-b"}
 ]});
 await admin.workspaceGrant.createMany({data:[
  {id:ids.analystGrant,membershipId:ids.analystMembership,userId:ids.analyst,workspaceId:ids.workspaceA},
  {id:ids.viewerGrant,membershipId:ids.viewerMembership,userId:ids.viewer,workspaceId:ids.workspaceA}
 ]});
 await admin.businessProfile.create({data:{id:ids.profileA,workspaceId:ids.workspaceA,canonicalName:"RLS Fixture",aliases:[],locale:"en-US"}});
 await admin.auditEvent.create({data:{id:ids.auditA,organizationId:ids.orgA,workspaceId:ids.workspaceA,actorUserId:ids.owner,action:"rls.fixture",aggregateType:"Workspace",aggregateId:ids.workspaceA}});
}

async function cleanup(){
 await admin.organization.deleteMany({where:{id:{in:[ids.orgA,ids.orgB]}}});
 await admin.user.deleteMany({where:{id:{in:[ids.owner,ids.analyst,ids.viewer,ids.outsider]}}});
 const [organizationCount,userCount]=await Promise.all([
  admin.organization.count({where:{id:{in:[ids.orgA,ids.orgB]}}}),
  admin.user.count({where:{id:{in:[ids.owner,ids.analyst,ids.viewer,ids.outsider]}}})
 ]);
 assert.equal(organizationCount,0,"synthetic organizations must be removed");
 assert.equal(userCount,0,"synthetic users must be removed");
}

async function run(){
 const roleRows=await runtime.$queryRawUnsafe('SELECT current_user AS "roleName", rolbypassrls AS "bypassesRls" FROM pg_roles WHERE rolname = current_user');
 assert.equal(roleRows.length,1);
 assert.equal(roleRows[0].roleName,"meridian_runtime");
 assert.equal(roleRows[0].bypassesRls,false);

 const protectedTables=['Organization','Membership','Workspace','WorkspaceGrant','BusinessProfile','Competitor','Topic','SearchQuery','AuditEvent'];
 const protectedList=protectedTables.map(name=>`'${name}'`).join(',');
 const [rlsRows,policyRows,apiGrantRows]=await Promise.all([
  admin.$queryRawUnsafe(`SELECT COUNT(*)::int AS count FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN (${protectedList}) AND c.relrowsecurity AND c.relforcerowsecurity`),
  admin.$queryRawUnsafe(`SELECT COUNT(*)::int AS count FROM pg_policies WHERE schemaname='public' AND tablename IN (${protectedList})`),
  admin.$queryRawUnsafe(`SELECT COUNT(*)::int AS count FROM information_schema.role_table_grants WHERE table_schema='public' AND table_name IN ('User','Account','Session','VerificationToken',${protectedList}) AND grantee IN ('anon','authenticated','service_role')`)
 ]);
 assert.equal(rlsRows[0].count,9,"all tenant tables must force RLS");
 assert.equal(policyRows[0].count,20,"the reviewed tenant policy set must be installed");
 assert.equal(apiGrantRows[0].count,0,"Supabase Data API roles must have no Meridian table grants");

 await seed();

 const withoutContext=await runtime.workspace.findMany({where:{id:{in:[ids.workspaceA,ids.workspaceA2,ids.workspaceB]}}});
 assert.equal(withoutContext.length,0,"missing tenant context must expose zero workspaces");

 const ownerWorkspaces=await asUser(ids.owner,tx=>tx.workspace.findMany({where:{organizationId:ids.orgA},select:{id:true}}));
 assert.deepEqual(ownerWorkspaces.map(row=>row.id).sort(),[ids.workspaceA,ids.workspaceA2].sort());

 const analystWorkspaces=await asUser(ids.analyst,tx=>tx.workspace.findMany({where:{id:{in:[ids.workspaceA,ids.workspaceA2,ids.workspaceB]}},select:{id:true}}));
 assert.deepEqual(analystWorkspaces.map(row=>row.id),[ids.workspaceA]);

 const viewerProfile=await asUser(ids.viewer,tx=>tx.businessProfile.findUnique({where:{workspaceId:ids.workspaceA}}));
 assert.equal(viewerProfile?.canonicalName,"RLS Fixture");

 const outsiderWorkspaces=await asUser(ids.outsider,tx=>tx.workspace.findMany({where:{id:{in:[ids.workspaceA,ids.workspaceB]}},select:{id:true}}));
 assert.deepEqual(outsiderWorkspaces.map(row=>row.id),[ids.workspaceB]);

 await asUser(ids.owner,async tx=>{
  const management=await tx.$queryRaw`SELECT current_setting('app.user_id', true) AS "userId", meridian_private.can_manage_org(${ids.orgA}) AS "canManage", (SELECT count(*)::int FROM "Membership" WHERE "organizationId" = ${ids.orgA} AND "userId" = ${ids.owner}) AS "visibleMemberships"`;
  assert.deepEqual(management,[{userId:ids.owner,canManage:true,visibleMemberships:1}],"owner management policy helper must resolve inside the runtime transaction");
  const created=await tx.workspace.create({data:{id:ids.runtimeWorkspace,organizationId:ids.orgA,name:"Runtime Created Workspace",slug:ids.runtimeWorkspace}});
  await tx.workspaceGrant.create({data:{id:ids.runtimeGrant,membershipId:ids.ownerMembership,userId:ids.owner,workspaceId:created.id}});
  await tx.auditEvent.create({data:{id:ids.runtimeAudit,organizationId:ids.orgA,workspaceId:created.id,actorUserId:ids.owner,action:"workspace.created",aggregateType:"Workspace",aggregateId:created.id}});
 });
 const runtimeCreated=await asUser(ids.owner,tx=>tx.workspace.findUnique({where:{id:ids.runtimeWorkspace},select:{id:true}}));
 assert.equal(runtimeCreated?.id,ids.runtimeWorkspace,"owners must be able to create a workspace, grant, and audit event through the runtime role");

 await asUser(ids.analyst,tx=>tx.competitor.create({data:{workspaceId:ids.workspaceA,name:"Allowed Analyst Competitor"}}));
 await assert.rejects(()=>asUser(ids.analyst,tx=>tx.competitor.create({data:{workspaceId:ids.workspaceB,name:"Blocked Cross-Tenant Competitor"}})));
 await assert.rejects(()=>asUser(ids.viewer,tx=>tx.topic.create({data:{workspaceId:ids.workspaceA,name:"Blocked Viewer Topic"}})));

 const auditUpdate=await asUser(ids.owner,tx=>tx.auditEvent.updateMany({where:{id:ids.auditA},data:{action:"blocked.update"}}));
 assert.equal(auditUpdate.count,0,"audit events must be immutable through the runtime role");

 console.log("RLS integration checks passed: runtime role, 9 forced-RLS tables, 20 policies, no Data API grants, tenant isolation, runtime workspace creation, role enforcement, audit immutability, fixture cleanup");
}

try{
 await run();
}finally{
 try{await cleanup();}finally{await Promise.all([runtime.$disconnect(),admin.$disconnect()]);}
}
