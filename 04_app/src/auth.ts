import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
const configured=Boolean(process.env.AUTH_GITHUB_ID&&process.env.AUTH_GITHUB_SECRET);
export const {handlers,auth,signIn,signOut}=NextAuth({adapter:PrismaAdapter(db),session:{strategy:"database"},pages:{signIn:"/login"},providers:configured?[GitHub({clientId:process.env.AUTH_GITHUB_ID!,clientSecret:process.env.AUTH_GITHUB_SECRET!})]:[]});
