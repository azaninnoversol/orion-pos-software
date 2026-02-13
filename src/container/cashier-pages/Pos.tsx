"use client";
import React, { useEffect, useState } from "react";

// components + types
import PosCategoryCard, { PosSubCategoryCard } from "./pos/PosCategoryCard";
import OrderDrawer from "./pos/OrderDrawer";
import Loading from "@/app/loading";

// mock-data + types
import { OrdersItemsProps, PosCategoriesProps, generateCategories, generateOrderItems } from "./pos/data";
import { DiscountState } from "../dashboard-pages/Menu";
import { Status } from "../dashboard-pages/customers/data";

// services
import itemService, { discountService, orderAddToDrawer, userService } from "@/services/api_service";

// toast
import { toast } from "sonner";

// redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { closeDrawer } from "@/redux/OrderDrawerSlice/OrderDrawerSlice";
import { UserProfile } from "./inbox/data";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/utils/config";
import { doc, getDoc } from "firebase/firestore";

export type Category = "fast food" | "drinks" | "desert";

function Pos() {
  const [seletecdCate, setSelectedCate] = useState<Category>("fast food");
  const [seletecdSubCate, setSelectedSubCate] = useState<OrdersItemsProps | null>(null);
  const [formData, setFormData] = useState<any[]>([]);
  const [ordersItem, setOrdersItem] = useState<any[]>([]);
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [orders, setOrder] = useState<any>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const [discount, setDiscount] = useState<DiscountState>({
    id: null,
    value: 0,
    startDate: null,
    endDate: null,
  });

  const isOpen = useSelector((state: RootState) => state?.orderDrawer.isOpen);
  const dispatch = useDispatch();

  const SelectCategoryhandler = (item: string | OrdersItemsProps) => {
    if (typeof item === "string") {
      setSelectedCate(item as Category);
    } else {
      if (item?.quantity === 0) {
        return toast.warning("This item is out of stock!");
      }
      setSelectedSubCate(item);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setStatus(Status.FETCHING);
      const res = await itemService.getAll();
      setOrdersItem(res);
      setStatus(Status.FETCHED);
    } catch (err) {
      toast.error(`Error: ${err instanceof Error ? err.message : err}`);
      setStatus(Status.FETCHED);
    } finally {
      setStatus(Status.IDLE);
    }
  };

  const fetchCustomerOrder = async () => {
    try {
      setStatus(Status.FETCHING);
      const data = await orderAddToDrawer.getAll();
      setOrder(data);
      setStatus(Status.FETCHED);
    } catch (error) {
      toast.error(`Error : ${error instanceof Error}`);
    } finally {
      setStatus(Status.IDLE);
    }
  };

  const fetchDiscounts = async () => {
    try {
      setStatus(Status.FETCHING);
      const res = await discountService.getAll();
      if (res && res.length > 0) {
        const latest = res[0];
        setDiscount({
          id: latest.id,
          value: latest.discountPercentage || 0,
          startDate: latest.discountStartDate ? new Date(latest.discountStartDate) : null,
          endDate: latest.discountEndDate ? new Date(latest.discountEndDate) : null,
        });
        setStatus(Status.FETCHED);
      } else {
        setStatus(Status.IDLE);
      }
    } catch (err) {
      setStatus(Status.ERROR);
      toast.error("Failed to fetch discounts");
    }
  };

  const fetchShopManager = async () => {
    try {
      const users = await userService.getAll();
      const manager = users.find((user: any) => user.role === "manager");
      if (!manager) setCurrentUser(null);
      setCurrentUser(manager as any);
    } catch (error) {
      console.error("Failed to fetch shop manager:", error);
      setCurrentUser(null);
    }
  };

  const fetchCurrentLoggedInUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          if (!user) {
            unsubscribe();
            return setLoggedInUser(null);
          }

          try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
              unsubscribe();
              return resolve(null);
            }

            const userData = userDocSnap.data();
            unsubscribe();
            setLoggedInUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              branch: userData.branch || { id: "", name: "" },
            });
          } catch (err) {
            unsubscribe();
            reject(err);
          }
        },
        (error) => {
          unsubscribe();
          reject(error);
        },
      );
    });
  };

  useEffect(() => {
    fetchShopManager();
    fetchDiscounts();
    fetchMenuItems();
    fetchCurrentLoggedInUser();
    fetchCustomerOrder();
  }, []);

  if (status === Status.FETCHING) {
    return <Loading className="!min-h-[80vh]" />;
  }

  const menuItems = generateOrderItems(ordersItem, seletecdCate, discount, currentUser, loggedInUser);
  const posCategories = generateCategories(ordersItem, currentUser, loggedInUser);

  return (
    <section id="pos">
      <main className="w-[96%] mx-auto pt-1">
        <h3 className="font-semibold pb-1 text-lg sm:text-xl">Welcome! Time to do your best and shine.✨ </h3>
        <p className="font-normal text-sm">{new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>

        <h3 className="font-semibold pb-1 mt-6">Categories</h3>
        <div className="mt-1 flex items-center flex-wrap gap-3 max-[363px]:justify-center">
          {posCategories?.map((single: PosCategoriesProps, index: number) => (
            <PosCategoryCard seletecdCate={seletecdCate} key={index} onClick={SelectCategoryhandler} {...single} />
          ))}
        </div>

        <h3 className="font-semibold pb-1 mt-6 ">Sub Categories</h3>
        <div className="mt-1 flex items-center flex-wrap gap-3 max-[363px]:justify-center">
          {menuItems?.map((single: OrdersItemsProps, index: number) => (
            <PosSubCategoryCard
              key={index}
              {...single}
              seletecdCate={seletecdSubCate?.id}
              onClick={SelectCategoryhandler}
              setSelectedSubCate={setSelectedSubCate}
              formData={formData}
              setFormData={setFormData}
              refetch={fetchCustomerOrder}
              refetchItems={fetchMenuItems}
            />
          ))}
        </div>

        <OrderDrawer
          loading={status === (Status.FETCHING as Status)}
          orders={orders}
          open={isOpen}
          onClose={() => dispatch(closeDrawer())}
          refetchItems={fetchMenuItems}
          refetch={fetchCustomerOrder}
          currentUser={currentUser}
          loggedInUser={loggedInUser}
        />
      </main>
    </section>
  );
}

export default React.memo(Pos);
