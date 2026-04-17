"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/Admin");

  return (
    <>
      {!isAdminPath && <Header />}
      <div className={`${!isAdminPath ? "pt-20" : ""} flex-1`}>
        {children}
      </div>
      {!isAdminPath && <Footer />}
    </>
  );
}
