import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
export const metadata: Metadata = { title: "OneAtlas — AI model intelligence", description: "Discover, compare and rank AI models and providers." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-line py-6 text-center text-xs text-slate-500">OneAtlas · Seed data is for demonstration only and is not verified.</footer>
    </body></html>
  );
}
