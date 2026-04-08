import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

import DirWrapper from "@/components/DirWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "AI Video Factory | Premium Content Generation",
  description: "Professional Personal AI Production Studio with Offices & Engines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-inter bg-[#050505] text-white`}>
        <DirWrapper>
          <Sidebar />
          <main className="flex-1 min-w-0 h-screen overflow-y-auto no-scrollbar relative overflow-x-hidden p-0">
            {children}
          </main>
        </DirWrapper>
      </body>
    </html>
  );
}

