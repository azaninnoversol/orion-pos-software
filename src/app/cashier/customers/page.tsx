import React from "react";

//next
import type { Metadata } from "next";

//page
import Customers from "@/container/dashboard-pages/Customers";

export const metadata: Metadata = {
  title: "Cashier Customers",
  description: "Hi This is my Customer Page",
};

function page() {
  return <Customers />;
}

export default React.memo(page);
