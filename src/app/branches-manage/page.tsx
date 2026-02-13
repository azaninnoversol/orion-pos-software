import React from "react";

//next
import type { Metadata } from "next";

//page
import Branches from "@/container/dashboard-pages/Branches";

export const metadata: Metadata = {
  title: "Branches Manage",
  description: "Hi This is my Branches Manage Page",
};

function page() {
  return <Branches />;
}

export default React.memo(page);
