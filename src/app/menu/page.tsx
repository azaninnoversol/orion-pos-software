import React from "react";

//page
import Menu from "@/container/dashboard-pages/Menu";

//types
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description: "Hi This is my Menu Page",
};

function page() {
  return <Menu />;
}

export default React.memo(page);
