import React from "react";

// page
import CreatePassword from "@/container/CreatePassword";

// next
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Password - My App",
  description: "Welcome to the Generate new password For Cashier and Kitchen worker",
};

function page() {
  return <CreatePassword />;
}

export default page;
