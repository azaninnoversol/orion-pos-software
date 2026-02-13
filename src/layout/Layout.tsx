"use client";
import React, { useEffect, useState } from "react";

// next
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";

// toast
import { Toaster } from "sonner";

// layouts
import DashboardLayout from "./DashboardLayout";
import PublicLayout from "./PublicLayout";

function Layout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const cookie = getCookie("TOKEN");

  useEffect(() => {
    if (cookie) setToken(cookie as string);
  }, [cookie]);

  return (
    <>
      {token ? <DashboardLayout>{children}</DashboardLayout> : <PublicLayout>{children}</PublicLayout>}
      <Toaster position="top-center" duration={1000} />
    </>
  );
}

export default dynamic(() => Promise.resolve(Layout), { ssr: false });
