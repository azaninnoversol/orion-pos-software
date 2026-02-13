"use client";

import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

// components
import { Button } from "@/components/ui/button";
import OrderCard from "@/components/dashboard-components/OrderCard";
import Loading from "@/app/loading";

// types + mock-data
import { buttonsType, KitchenButtonType } from "./kitchen/data";
import { Status } from "../dashboard-pages/customers/data";
import { Profile } from "../cashier-pages/pos/data";

// helper-function
import { cn } from "@/lib/utils";

// toast
import { toast } from "sonner";

// api-service
import { cancelledOrder, proceedOrder, staffManageService } from "@/services/api_service";

// firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/utils/config";
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";

function KitchenPage() {
  const [type, setType] = useState<KitchenButtonType>("all");
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [profile, setProfile] = useState<Profile>({ branchId: "", branchName: "" });

  const fetchSalesData = useCallback(() => {
    setStatus(Status.FETCHING);

    const ordersCollectionRef = collection(db, "orders");

    const unsubscribe = onSnapshot(
      ordersCollectionRef,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrdersData(list);
        setStatus(Status.FETCHED);
      },
      (error) => {
        toast.error("Failed to fetch orders: " + error.message);
        setStatus(Status.ERROR);
      },
    );

    return unsubscribe;
  }, []);

  const deleteOrderWithNotifications = async (orderId: string) => {
    try {
      const notificationsRef = collection(db, "orders", orderId, "notifications");
      const notifSnap = await getDocs(notificationsRef);
      const deletePromises = notifSnap.docs.map((d) => deleteDoc(doc(db, "orders", orderId, "notifications", d.id)));
      await Promise.all(deletePromises);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const fetchCashierData = async () => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error("User not logged in");
        return;
      }
      try {
        setStatus(Status.FETCHING);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          toast.error("User data not found");
          return;
        }

        const userData = userDocSnap.data();
        const staffData = (await staffManageService.getAll()).find((single) => single?.email === userData?.email);

        setProfile({
          branchId: staffData?.branch?.id ?? "",
          branchName: staffData?.branch?.name ?? "",
        });

        setStatus(Status.FETCHED);
      } catch (error) {
        toast.error("Failed to fetch profile: " + (error as Error).message);
      }
    });
  };

  const orderDeleteHandler = async (single: any) => {
    setStatus(Status.FETCHING);
    try {
      await cancelledOrder.add({
        ...single,
        cancelledOrderTime: Date.now(),
        customerName:
          single.orderType === "delivery" ? single?.customerDetail?.customerName : single.orderType === "takeaway" ? "Takeaway" : single?.tableName,
      });

      await proceedOrder.deleteById(single?.id);

      const kitchenQueryDelete = query(
        collection(db, "staff_manage"),
        where("role", "==", "cashier"),
        where("branch.id", "==", single?.branchDetail?.branchId),
      );

      const kitchenSnap = await getDocs(kitchenQueryDelete);
      for (const docSnap of kitchenSnap.docs) {
        const staffId = docSnap.id;

        await setDoc(
          doc(db, "staff_manage", staffId, "notifications", `${Date.now()}`),
          {
            title: "Order Cancelled!",
            body: `Order Id : ${single?.id}`,
            type: "cancelled",
            createdAt: Date.now(),
          },
          { merge: true },
        );
      }

      await deleteOrderWithNotifications?.(single?.id);
      await fetchSalesData();
      single?.status === "completed" ? toast.success("Order Delivered Successfully!") : toast.success("Order Cancelled Successfully!");
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setStatus(Status.IDLE);
    }
  };

  const filterOrdersData = useMemo(() => {
    return ordersData?.filter((item) => {
      const isSameBranch = item?.branchDetail?.branchId === profile?.branchId && item?.branchDetail?.branchName === profile?.branchName;
      const isStatusMatch = type === "all" ? true : item.status === type;
      return isSameBranch && isStatusMatch;
    });
  }, [ordersData, type, profile]);

  useEffect(() => {
    fetchSalesData();
    fetchCashierData();
  }, []);

  const isLoading = status === Status.FETCHING;

  return (
    <section id="kitchen">
      {isLoading ? (
        <Loading className="!min-h-[80vh]" />
      ) : (
        <main className="w-full mx-auto px-2 sm:px-4 md:px-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <h3 className="font-semibold text-xl sm:text-2xl md:text-3xl whitespace-nowrap text-black dark:text-gray-100 text-center">Orders</h3>

            <div className="flex flex-wrap gap-2 sm:gap-4">
              {buttonsType.map((single) => (
                <Button
                  key={single.status}
                  className={cn(
                    single.status !== type ? "rounded-sm !bg-white !text-[#3238a1]" : "rounded-sm !bg-[#3238a1] !text-white",
                    "text-sm sm:text-base",
                  )}
                  onClick={() => setType(single.status as any)}
                >
                  {single.text}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filterOrdersData.length > 0 ? (
              filterOrdersData.map((single, idx) => (
                <OrderCard key={idx} refetch={fetchSalesData} orderDeleteHandler={() => orderDeleteHandler(single)} {...single} />
              ))
            ) : (
              <div className="w-full text-center mt-12 col-span-full">
                <p className="text-gray-400 text-xl sm:text-2xl">No Orders Found</p>
              </div>
            )}
          </div>
        </main>
      )}
    </section>
  );
}

export default memo(KitchenPage);
