import React from "react";

//next
import { Metadata } from "next";

//page
import StaffManage from "@/container/dashboard-pages/StaffManage";

export const metadata: Metadata = {
  title: "Staff Manage",
  description: "Hi This is my Staff Page",
};

function page() {
  return <StaffManage />;
}

export default React.memo(page);
