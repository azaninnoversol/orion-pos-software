import React from "react";

//page
import Login from "@/container/Login";

// next
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - My App",
  description: "Welcome to the Login page of My App!",
};

function page() {
  return <Login />;
}

export default React.memo(page);
