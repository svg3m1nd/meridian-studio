import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

if(!process.argv.includes("--confirm-development-database"))throw new Error("Refusing to run without --confirm-development-database");
const emailArgument=process.argv.find(value=>value.startsWith("--email="));
const email=emailArgument?.slice("--email=".length).trim().toLowerCase();
if(!email||!email.includes("@"))throw new Error("Pass the signed-in account as --email=user@example.com");

for(const line of readFileSync(resolve(process.cwd(),".env"),"utf8").split(/\r?\n/)){
 const match=line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*"(.*)"\s*$/);
 if(match&&!process.env[match[1]])process.env[match[1]]=match[2];
}
if(!process.env.DIRECT_URL)throw new Error("DIRECT_URL is required");

const db=new PrismaClient({datasources:{db:{url:process.env.DIRECT_URL}}});
try{
 const result=await db.$transaction(async tx=>{
  const user=await tx.user.findFirst({where:{email:{equals:email,mode:"insensitive"}}});
  if(!user)throw new Error("No Auth.js user exists for that email. Sign in once before bootstrapping the owner.");
  const organization=await tx.organization.upsert({where:{slug:"fusion-vine"},create:{name:"Fusion Vine",slug:"fusion-vine"},update:{name:"Fusion Vine"}});
  const existing=await tx.membership.findUnique({where:{organizationId_userId:{organizationId:organization.id,userId:user.id}}});
  const membership=existing?await tx.membership.update({where:{id:existing.id},data:{role:"OWNER"}}):await tx.membership.create({data:{organizationId:organization.id,userId:user.id,role:"OWNER"}});
  if(!existing)await tx.auditEvent.create({data:{organizationId:organization.id,actorUserId:user.id,action:"organization.owner.bootstrapped",aggregateType:"Organization",aggregateId:organization.id}});
  return membership;
 });
 console.log(`Owner bootstrap complete for ${email}; role ${result.role} in Fusion Vine`);
}finally{
 await db.$disconnect();
}
