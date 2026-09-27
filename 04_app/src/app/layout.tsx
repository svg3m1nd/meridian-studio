import type { Metadata } from "next"; import "./globals.css";
export const metadata:Metadata={title:"Meridian Studio",description:"Multi-graph retrieval intelligence with evidence."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
