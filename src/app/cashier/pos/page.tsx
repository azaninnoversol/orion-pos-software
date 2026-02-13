import React from "react";

//next
import { Metadata } from "next";

//page
import Pos from "@/container/cashier-pages/Pos";

export const metadata: Metadata = {
  title: "Cashier POS",
  description: "Hi This is my Cashier POS",
};

function page() {
  return <Pos />;
}

export default React.memo(page);
