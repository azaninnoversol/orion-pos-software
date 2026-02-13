import React from "react";

//pages
import Dashboard from "@/container/dashboard-pages/Dashboard";

//next
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Hi This is my Dashboard",
};

function page() {
  return <Dashboard />;
}

export default React.memo(page);
