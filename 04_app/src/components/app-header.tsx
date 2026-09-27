import Link from "next/link";
import {signOut} from "@/auth";

export function AppHeader({email,context,workspaceId}:{email:string;context:string;workspaceId?:string}){
 return <header className="app-header">
  <Link className="brand" href="/portfolio">MERIDIAN STUDIO</Link>
  <nav className="primary-nav" aria-label="Primary navigation">
   <Link href="/portfolio">Portfolio</Link>
   {workspaceId&&<Link aria-current="page" href={`/workspaces/${workspaceId}/setup`}>Baseline</Link>}
  </nav>
  <div className="account-menu">
   <span className="header-context">{context}</span>
   <span>{email}</span>
   <form action={async()=>{"use server";await signOut({redirectTo:"/"})}}><button type="submit">Sign out</button></form>
  </div>
 </header>;
}
