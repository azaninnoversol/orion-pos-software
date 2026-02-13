import React from "react";

//next
import { Metadata } from "next";

//page
import ShiftManage from "@/container/cashier-pages/ShiftManage";

export const metadata: Metadata = {
  title: "Shift Manage",
  description: "Hi This is my Shift Manage Page",
};

function page() {
  return <ShiftManage />;
}

export default React.memo(page);
