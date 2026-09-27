import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic="force-dynamic";

export async function GET(){
 const timestamp=new Date().toISOString();
 try{
  await db.$queryRaw`SELECT 1`;
  return NextResponse.json({status:"ready",service:"meridian-studio-web",database:"reachable",timestamp},{headers:{"Cache-Control":"no-store"}});
 }catch{
  return NextResponse.json({status:"not-ready",service:"meridian-studio-web",database:"unreachable",timestamp},{status:503,headers:{"Cache-Control":"no-store"}});
 }
}
