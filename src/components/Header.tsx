"use client";
import React, { useEffect, useState } from "react";

// components
import Logo from "./Logo";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "./ui/button";

// helper-functions
import { cn } from "@/lib/utils";

// animations
import { motion, AnimatePresence } from "framer-motion";

// next
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface DashboardItem {
  name: string;
  targetId?: string;
  link?: string;
}

function Header() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const Items: DashboardItem[] =
    pathname === "/"
      ? [
          { name: "Hero", targetId: "hero", link: "/" },
          { name: "Overview", targetId: "overview", link: "/" },
          { name: "Problem", targetId: "problem", link: "/" },
          { name: "Analysis", targetId: "analysis", link: "/" },
          { name: "Empthy", targetId: "map", link: "/" },
          { name: "User", targetId: "user", link: "/" },
          { name: "Journey", targetId: "journey", link: "/" },
          { name: "Design", targetId: "design", link: "/" },
          { name: "Wireframe", targetId: "frame", link: "/" },
          { name: "Design UI", targetId: "ui", link: "/" },
          { name: "Contact Us", targetId: "contact", link: "/" },
        ]
      : [{ name: "Home", targetId: "contact", link: "/" }];

  const handleScroll = (id?: string, link?: string) => {
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(id);
        setIsDrawerOpen(false); // ✅ Close drawer on item click
        return;
      }
    }

    if (link) {
      router.push(link);
      setIsDrawerOpen(false); // ✅ Close drawer when navigating to another page
    }
  };

  const navigationHandler = () => {
    router.push("/login");
    setIsDrawerOpen(false); // ✅ Close drawer on login
  };

  // ✅ Close drawer automatically when pathname changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScrollEvent = () => {
      let currentSection = activeSection;
      Items.forEach((item) => {
        const section = document.getElementById(item?.targetId || "");
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = item.targetId || "";
          }
        }
      });
      setActiveSection(currentSection);
    };

    if (pathname === "/") {
      window.addEventListener("scroll", handleScrollEvent);
      return () => window.removeEventListener("scroll", handleScrollEvent);
    }
  }, [activeSection, pathname]);

  return (
    <motion.header className="w-full flex justify-center pt-2 py-2 fixed top-0 z-20 drop-shadow-2xl">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        layout
        className="bg-white min-h-[60px] w-[98%] rounded-3xl px-6 flex justify-between items-center"
      >
        <Logo isSideBarOpen={true} />

        <AnimatePresence mode="wait">
          <motion.ul
            key={pathname}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex gap-6 items-center max-[1155px]:hidden"
          >
            {Items.map((single) => (
              <motion.li
                key={single.name}
                whileHover={{ scale: 1.1, color: "#3238a1" }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "cursor-pointer hover:text-[#3238a1] font-medium transition-colors",
                  activeSection === single.targetId ? "!text-purple-600 underline underline-offset-4" : "text-gray-700",
                )}
                onClick={() => handleScroll(single.targetId, single?.link)}
              >
                {single.name}
              </motion.li>
            ))}

            <Button
              className="bg-transparent text-purple-600 border border-purple-600 hover:bg-purple-600 hover:text-white"
              onClick={navigationHandler}
            >
              Login / Signup
            </Button>
          </motion.ul>
        </AnimatePresence>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
          <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>

          <DrawerTrigger asChild>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="hidden max-[1155px]:flex flex-col gap-[4px] w-8 h-8 justify-center items-center z-50 cursor-pointer"
            >
              <span className="w-6 h-[3px] bg-[#3238a1] rounded" />
              <span className="w-6 h-[3px] bg-[#3238a1] rounded" />
              <span className="w-6 h-[3px] bg-[#3238a1] rounded" />
            </motion.button>
          </DrawerTrigger>

          <DrawerContent className="bg-white min-h-screen w-[75%] sm:w-[50%] shadow-2xl p-6">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between w-full mb-6"
            >
              <Logo isSideBarOpen={true} />
              <DrawerClose asChild>
                <button className="flex flex-col gap-[4px] w-8 h-8 justify-center items-center cursor-pointer">
                  <span className="w-6 h-[3px] bg-[#3238a1] rounded rotate-45 translate-y-[6px]" />
                  <span className="w-6 h-[3px] opacity-0 bg-[#3238a1] rounded" />
                  <span className="w-6 h-[3px] bg-[#3238a1] rounded -rotate-45 -translate-y-[6px]" />
                </button>
              </DrawerClose>
            </motion.div>

            <motion.ul
              key={pathname}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6 overflow-y-auto px-2"
            >
              {Items.map((single) => (
                <DrawerClose asChild key={single.name}>
                  <motion.li
                    whileHover={{ scale: 1.03, color: "#3238a1" }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "cursor-pointer text-gray-700 text-lg font-medium transition-colors hover:text-[#3238a1]",
                      activeSection === single.targetId ? "text-purple-600 underline underline-offset-4" : "",
                    )}
                    onClick={() => handleScroll(single.targetId, single?.link)}
                  >
                    {single.name}
                  </motion.li>
                </DrawerClose>
              ))}
              <Button
                className="bg-transparent text-purple-600 border border-purple-600 hover:bg-purple-600 hover:text-white"
                onClick={navigationHandler}
              >
                Login / Signup
              </Button>
            </motion.ul>
          </DrawerContent>
        </Drawer>
      </motion.div>
    </motion.header>
  );
}

export default React.memo(Header);
