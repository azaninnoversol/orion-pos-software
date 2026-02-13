"use client";

import * as React from "react";

// components
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CustomTooltip from "./CustomTooltip";

// next
import { useRouter } from "next/navigation";

export interface Notification {
  id: string;
  title: string;
  description?: string;
  time?: string;
  link?: string;
  read?: boolean;
  date?: string | Number | Date;
}

interface NotificationDropdownProps {
  notifications?: Notification[];
  btn?: React.JSX.Element;
  caller: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications = [], btn, caller = () => {} }) => {
  const router = useRouter();

  const navigateToNotificationHandler = async (item: Notification) => {
    await caller?.();
    router.push(item.link as string);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">{btn}</div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto p-0">
        <h3 className="px-2 py-2 sticky top-0 font-semibold text-sm bg-gray-800 z-10">Notifications</h3>

        {notifications.length === 0 ? (
          <DropdownMenuItem className="w-full text-center text-gray-400 cursor-default items-start justify-center">No notifications</DropdownMenuItem>
        ) : (
          notifications.map((notif, idx) => (
            <DropdownMenuItem
              key={notif.id}
              className={`p-2 flex items-end justify-between gap-1 cursor-pointer ${idx === notifications.length - 1 ? "mb-0" : "mb-1 mt-1"}  ${
                !notif.read ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
              onClick={() => navigateToNotificationHandler(notif)}
            >
              <CustomTooltip title={notif.read ? "Order Seen" : "Check Order In Kitchen Dashboard!"}>
                <div className="flex flex-col items-start gap-1">
                  <span className="font-semibold text-sm truncate max-w-[220px]" title={notif.title}>
                    {notif.title}
                  </span>

                  {notif.description && (
                    <span className="text-xs text-gray-500 truncate max-w-[220px]" title={notif.description}>
                      {notif.description}
                    </span>
                  )}
                </div>
              </CustomTooltip>
              <div>{notif.time && <span className="text-xs text-gray-400">{notif.time}</span>}</div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
