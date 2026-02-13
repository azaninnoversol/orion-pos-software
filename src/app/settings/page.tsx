import React from "react";

//page
import Settings from "@/container/Settings";

//next
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orion POS | Settings",
};

function page() {
  return <Settings />;
}

export default React.memo(page);
