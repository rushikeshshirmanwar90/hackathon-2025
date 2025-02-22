import type { Metadata } from "next";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import SideBarItems from "@/components/sidebar/SideBarItem";
import SideBar from "@/components/sidebar/SideBarContainer";
import { Building2, Stethoscope, User, UserPen } from "lucide-react";

import AccordingComponent from "@/components/AccordingComponent";
import SideBarContainer from "@/components/sidebar/SideBarContainer";
import Sidebar from "@/components/sidebar/SideBar";

export const metadata: Metadata = {
  title: "EduOrbit",
  description:
    "This is the Admin Page of the EduOrbit Application where you can manage all the data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main className="flex gap-2 w-full" >
          <Sidebar />
          <div className="w-[79vw] max-h-screen overflow-y-scroll" >
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}