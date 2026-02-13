import React from "react";

//page
import Inbox from "@/container/cashier-pages/inbox/inbox";

//next
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cashier Inbox",
  description: "Hi This is my Cashier Inbox Page",
};

function page() {
  return <Inbox />;
}

export default React.memo(page);
