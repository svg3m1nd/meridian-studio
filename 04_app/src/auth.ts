import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { isAllowedGitHubLogin } from "@/lib/auth/access";
const configured=Boolean(process.env.AUTH_GITHUB_ID&&process.env.AUTH_GITHUB_SECRET);
export const {handlers,auth,signIn,signOut}=NextAuth({adapter:PrismaAdapter(db),session:{strategy:"database"},pages:{signIn:"/login"},callbacks:{signIn({account,profile}){if(account?.provider!=="github")return false;const login=(profile as {login?:unknown}|undefined)?.login;return isAllowedGitHubLogin(login,process.env.AUTH_ALLOWED_GITHUB_LOGINS,process.env.NODE_ENV==="production")}},providers:configured?[GitHub({clientId:process.env.AUTH_GITHUB_ID!,clientSecret:process.env.AUTH_GITHUB_SECRET!})]:[]});
