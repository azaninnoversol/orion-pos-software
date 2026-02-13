import React from "react";

//next
import { Metadata } from "next";

//page
import CashierDashboard from "@/container/cashier-pages/CashierDashboard";

export const metadata: Metadata = {
  title: "Cashier Dashboard",
  description: "Hi This is my Cashier Dashboard",
};

function page() {
  return <CashierDashboard />;
}

export default React.memo(page);
