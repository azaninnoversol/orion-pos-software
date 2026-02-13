import React from "react";

// page
import ProfileCard from "@/container/ProfileCard";

// next
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orion POS | Profile Card",
  description: "porfile card created by next js",
};

function page() {
  return <ProfileCard />;
}

export default page;
