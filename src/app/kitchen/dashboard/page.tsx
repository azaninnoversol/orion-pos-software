import React, { memo } from "react";

// page
import KitchenPage from "@/container/kitchen-pages/KitchenPage";

// next
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ORION POS | Kitchen Dashboard",
  description: "This Page Created by next.js",
};

function page() {
  return <KitchenPage />;
}

export default memo(page);
