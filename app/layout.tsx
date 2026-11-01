import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "MektA Studio", description: "A focused production workspace for MektA projects and integrations." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
