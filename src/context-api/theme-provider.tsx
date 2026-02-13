"use client";

import { RootState } from "@/redux/store";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useSelector((state: RootState) => state.themeSlice);
  const TOKEN = getCookie("TOKEN");
  const pathname = usePathname();

  const getSystemTheme = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  useEffect(() => {
    const isLoggedIn = Boolean(TOKEN);
    const isPublicPage = !isLoggedIn || ["/", "/login", "/signup"].includes(pathname);

    if (isPublicPage) {
      document.documentElement.classList.remove("dark");
      return;
    }

    const finalTheme = theme === "system" ? getSystemTheme() : theme;
    if (finalTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, pathname, TOKEN]);

  return <>{children}</>;
}
