import React from "react";

//page
import Inbox from "@/container/cashier-pages/inbox/inbox";

//next
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kitchen Worker Inbox",
  description: "Hi This is my Kitchen Worker Inbox Page",
};

function page() {
  return <Inbox />;
}

export default React.memo(page);
