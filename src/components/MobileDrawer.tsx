"use client";
import React, { useEffect, useState } from "react";

// components
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { SideBarButtons } from "./Sidebar";
import Logo from "./Logo";
import { ScrollArea } from "./ui/scroll-area";
import CustomTooltip from "./CustomTooltip";
import { Button } from "./ui/button";

// icons
import { LogOut, X } from "lucide-react";

// next
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

// toast
import { toast } from "sonner";

// types
import { DashboardItem } from "@/layout/DashboardLayout";

// helper
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  isSideBarOpen: boolean;
  setIsSideBarOpen: (open: boolean) => void;
  items?: any;
}

function MobileDrawer({ isSideBarOpen, setIsSideBarOpen, items }: MobileDrawerProps) {
  const [active, setActive] = useState<string>("/");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 425 && isSideBarOpen) {
        setIsSideBarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSideBarOpen, setIsSideBarOpen]);

  useEffect(() => {
    setIsSideBarOpen?.(false);
  }, [pathname]);

  const logoutHandler = () => setOpenModal(true);

  const confirmLogout = () => {
    deleteCookie("TOKEN");
    toast.success("You logged out successfully!");
    window.location.href = "/login";
  };

  const selectRouteHandler = (single: DashboardItem) => {
    setActive(single.path);
    router.push(single.path);
  };

  const sidebarCollapsed = !isSideBarOpen;

  return (
    <div className="max-[425px]:block hidden">
      <Drawer open={isSideBarOpen} onOpenChange={setIsSideBarOpen} direction="left">
        <DrawerContent className="w-[210px]">
          <DrawerHeader className="flex flex-row items-start justify-between">
            <DrawerTitle>
              <Logo isSideBarOpen />
            </DrawerTitle>
            <X color="black" className="cursor-pointer" onClick={() => setIsSideBarOpen(false)} />
          </DrawerHeader>
          <hr className="mt-0 h-[2px] w-full" />

          <ScrollArea className="min-h-[100px] px-3 pb-1">
            <SideBarButtons
              active={active}
              sidebarCollapsed={sidebarCollapsed}
              selectRouteHandler={selectRouteHandler}
              logoutHandler={logoutHandler}
              openModal={openModal}
              setOpenModal={setOpenModal}
              confirmLogout={confirmLogout}
              className="mt-4"
              items={items}
            />

            <div className="mt-6 flex items-center justify-start">
              <CustomTooltip title="Logout">
                <Button
                  className={cn(
                    "text-white bg-[#3238a1] rounded-full min-h-[45px] cursor-pointer transition-all duration-200",
                    sidebarCollapsed ? "w-[60px] justify-center rounded-xl" : "w-[170px] justify-start",
                  )}
                  onClick={logoutHandler}
                >
                  <LogOut className={cn("mr-2", sidebarCollapsed && "mr-0")} />
                  {!sidebarCollapsed && "Logout"}
                </Button>
              </CustomTooltip>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default React.memo(MobileDrawer);
