import React from "react";

//next
import type { Metadata } from "next";

//reports
import Reports from "@/container/dashboard-pages/Reports";

export const metadata: Metadata = {
  title: "Orion POS | Reports & Analytics Dashboard",
  description: "View detailed sales reports, customer insights, and performance analytics for your Orion POS system.",
};

function page() {
  return <Reports />;
}

export default React.memo(page);
