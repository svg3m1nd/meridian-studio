import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
export type DatabaseTenant={userId:string;organizationId?:string;workspaceId?:string};
export async function withTenantTransaction<T>(tenant:DatabaseTenant,work:(tx:Prisma.TransactionClient)=>Promise<T>):Promise<T>{
 return db.$transaction(async tx=>{
  await tx.$executeRaw`SELECT set_config('app.user_id', ${tenant.userId}, true)`;
  await tx.$executeRaw`SELECT set_config('app.organization_id', ${tenant.organizationId??""}, true)`;
  await tx.$executeRaw`SELECT set_config('app.workspace_id', ${tenant.workspaceId??""}, true)`;
  return work(tx);
 });
}
