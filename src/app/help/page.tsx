import React from "react";

//page
import Help from "@/container/Help";

//next
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Management | Orion POS",
};

function page() {
  return <Help />;
}

export default React.memo(page);
