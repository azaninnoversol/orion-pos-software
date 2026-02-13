import React from "react";

//page
import SingleBranch from "@/container/dashboard-pages/branches-manage/SingleBranch";

//next
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branches Manage Details",
  description: "Hi This is my Branches Manage Details Page",
};

function page() {
  return <SingleBranch />;
}

export default React.memo(page);
