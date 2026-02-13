import React from "react";

//next
import { Metadata } from "next";

//page
import Order from "@/container/cashier-pages/Order";

export const metadata: Metadata = {
  title: "Cashier Orders",
  description: "Hi This is my Cashier Orders Page",
};

function page() {
  return <Order />;
}

export default React.memo(page);
