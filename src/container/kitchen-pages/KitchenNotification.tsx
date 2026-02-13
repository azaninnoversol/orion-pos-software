"use client";
import React, { useEffect, useState } from "react";
import NotificationDropdown, { Notification } from "@/components/CustomDropDown";
import CustomTooltip from "@/components/CustomTooltip";
import { Badge } from "@/components/ui/badge";
import { db } from "@/utils/config";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Bell } from "lucide-react";
import { toast } from "sonner";

function KitchenNotification({ staffDocId }: { staffDocId: string | null }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!staffDocId) return;

    const q = collection(db, "staff_manage", staffDocId, "notifications");

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifList: Notification[] = [];
      let previousCount = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const dateObj = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);

        notifList.push({
          id: doc.id,
          read: data.read || false,
          title: data.title || "No title",
          description: data.body || "No description",
          time: dateObj.toLocaleTimeString(),
          date: dateObj.toLocaleDateString(),
          link: "/kitchen/dashboard",
        });
      });

      notifList.sort((a, b) => {
        return new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime();
      });

      if (previousCount && notifList.length > previousCount) {
        toast.success("You have a new notification!");
      }

      previousCount = notifList.length;
      setNotifications(notifList);
      setUnreadCount(notifList.filter((itm) => !itm.read).length);
    });

    return () => unsubscribe();
  }, [staffDocId]);

  async function markAllAsRead(staffDocId: string, notifications: Notification[]) {
    const unread = notifications.filter((n) => !n.read);
    for (const n of unread) {
      const ref = doc(db, "staff_manage", staffDocId, "notifications", n.id);
      await updateDoc(ref, { read: true });
    }
  }
  const caller = async () => {
    await markAllAsRead(staffDocId as string, notifications);
  };

  return (
    <NotificationDropdown
      notifications={notifications}
      caller={caller}
      btn={
        <div className="relative">
          <CustomTooltip title="Notification">
            <Bell size={18} color="black" className="cursor-pointer dark:text-white dark:stroke-white" />
          </CustomTooltip>

          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 rounded-full w-4 h-4 p-1 flex items-center justify-center text-[12px] text-black bg-green-400">
              {unreadCount}
            </Badge>
          )}
        </div>
      }
    />
  );
}

export default React.memo(KitchenNotification);
