"use client";
import React from "react";

// components
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default React.memo(PublicLayout);
