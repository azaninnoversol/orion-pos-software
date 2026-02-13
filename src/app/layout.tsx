"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/layout/Layout";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import ThemeProvider from "@/context-api/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "400", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} cz-shortcut-listen="true" about="Landing Page, Saas Project UI, Sale UI">
        <Provider store={store}>
          <ThemeProvider>
            <Layout>{children}</Layout>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
