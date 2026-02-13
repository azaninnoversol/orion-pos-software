import React from "react";

//pgae
import Register from "@/container/Register";

//next
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - My App",
  description: "Welcome to the Register page of My App!",
};

function page() {
  return <Register />;
}

export default React.memo(page);
