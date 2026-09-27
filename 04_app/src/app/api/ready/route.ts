import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic="force-dynamic";

export async function GET(){
 const timestamp=new Date().toISOString();
 const revision=process.env.VERCEL_GIT_COMMIT_SHA?.slice(0,7)??"local";
 try{
  await db.$queryRaw`SELECT 1`;
  return NextResponse.json({status:"ready",service:"meridian-studio-web",database:"reachable",revision,timestamp},{headers:{"Cache-Control":"no-store"}});
 }catch{
  return NextResponse.json({status:"not-ready",service:"meridian-studio-web",database:"unreachable",revision,timestamp},{status:503,headers:{"Cache-Control":"no-store"}});
 }
}
