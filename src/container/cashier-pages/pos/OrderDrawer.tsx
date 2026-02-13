"use client";

import React, { useEffect, useMemo, useState } from "react";

// components
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import CustomModal from "@/components/CustomModal";
import { Card, CardContent } from "@/components/ui/card";
import DeleteModal from "@/components/DeleteModal";
import SearchCustomer, { defaultFormData, FormData } from "./SearchCustomer";
import { GradientScan, QRCode } from "@/components/shared-assets/qr-code";
import CustomTooltip from "@/components/CustomTooltip";
import Loading from "@/app/loading";

// helpers
import { cn, formatNumber } from "@/lib/utils";

// toast
import { toast } from "sonner";

// types + data
import { OrderTypeBtn, orderTypeBtn, Profile, TablePeople, tablePeople } from "./data";
import { Status } from "@/container/dashboard-pages/customers/data";
import { ProceedOrdersData } from "../order/data";

// api services
import itemService, { customerManageService, orderAddToDrawer, proceedOrder, staffManageService } from "@/services/api_service";

// icons
import { Armchair, Coins, CreditCard, Download, Minus, Plus, Trash, User, X } from "lucide-react";

// firebase
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/utils/config";

// pdf Library
import jsPDF from "jspdf";
import { UserProfile } from "../inbox/data";

interface OrderDrawerProps {
  loading?: boolean;
  open?: boolean;
  onClose?: () => void;
  orders?: any[];
  refetchItems?: () => void;
  refetch?: () => void;
  currentUser?: UserProfile | null;
  loggedInUser?: any | null;
}

type OrderType = "drive" | "takeaway" | "delivery";
type PaymentMethod = "cash" | "card";

interface CheckoutData {
  orderType?: OrderType;
  branchDetail?: {
    branchId: string;
    branchName: string;
  };
  orders: any[];
  tableName?: string;
  status?: string;
  totalAmount: number;
  customerDetail?: FormData;
  paymentMethod: PaymentMethod;
  managerId?: string;
}

const buttonPayment = [
  { text: "Cash", type: "cash", icon: <Coins size={20} /> },
  { text: "Card", type: "card", icon: <CreditCard size={20} /> },
];

function OrderDrawer({ open, onClose, orders = [], loading, refetchItems, refetch, currentUser, loggedInUser }: OrderDrawerProps) {
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>("drive");
  const [selectedTable, setSelectedTable] = useState(false);
  const [tableSelect, setTableSelect] = useState<TablePeople>({});
  const [tableFilter, setTableFilter] = useState<string | null>(null);
  const [selectTableName, setSelectTableName] = useState<TablePeople>({});
  const [isCustomerModal, setIsCustomerModal] = useState(false);
  const [customerDetail, setCustomerDetail] = useState<FormData>(defaultFormData);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [deleteCartId, setDeleteCartId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(Status?.IDLE);
  const [profile, setProfile] = useState<Profile>({ branchId: "", branchName: "" });

  const totalAmount = useMemo(() => orders.reduce((sum, item) => sum + item.price * item.qty, 0), [orders]);

  const filterTableList = useMemo(() => {
    if (!tableFilter) return tablePeople;
    return tablePeople.filter((single) => single.available === tableFilter);
  }, [tableFilter]);

  const handleFilterClick = (status: string) => {
    setTableFilter((prev) => (prev === status ? null : status));
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
        const staffData = await (await staffManageService.getAll()).find((single) => single?.email === userData?.email);

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

  const handleSelectTable = () => {
    setSelectTableName(tableSelect);
    setSelectedTable(false);
  };

  const handleDeleteCart = (id: string, qty: number) => {
    setDeleteCartId?.(id);
  };

  const confirmDelete = async () => {
    setStatus(Status.FETCHING);
    try {
      const allItems = await orderAddToDrawer.getAll();
      const targetItem = allItems.find((item: any) => item.id === deleteCartId);

      if (!targetItem) {
        toast.error("Item not found in drawer!");
        return;
      }

      await orderAddToDrawer.deleteById(deleteCartId as string);

      const { itemId, qty } = targetItem;
      const currentItem = await itemService.getById(itemId);
      const updatedStock = (currentItem?.quantity ?? 0) + qty;
      await itemService.update(itemId, { quantity: updatedStock });

      const updatedDrawerItems = await orderAddToDrawer.getAll();
      for (const drawerItem of updatedDrawerItems) {
        if (drawerItem.itemId === itemId) {
          await orderAddToDrawer.update(drawerItem.id, {
            availableQty: updatedStock,
          });
        }
      }

      toast.success(`${targetItem.name} removed & stock updated!`);

      await refetch?.();
      await refetchItems?.();
      setStatus(Status.FETCHED);
    } catch (error) {
      setStatus(Status.FETCHED);
      toast.error("Failed to delete or update stock!");
    } finally {
      setStatus(Status.IDLE);
      setDeleteCartId(null);
    }
  };

  function buildNotificationBody(checkoutData: CheckoutData) {
    let bodyParts: string[] = [];

    if (checkoutData.tableName) {
      bodyParts.push(`Table: ${checkoutData.tableName}`);
    }

    const customerName = checkoutData.customerDetail?.customerName;

    if (customerName) {
      bodyParts.push(`Customer Name: ${customerName}`);
    }

    if (checkoutData.orderType === "takeaway") {
      bodyParts.push(`Order Type: TAKE AWAY`);
    }

    bodyParts.push(`Orders Length: ${checkoutData.orders?.length || 0}`);
    return bodyParts.join(" | ");
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(Status.SAVING);

    const checkoutData: CheckoutData = {
      orders,
      totalAmount,
      paymentMethod,
      tableName: selectedOrderType === "drive" ? selectTableName?.title : "",
      customerDetail: selectedOrderType === "delivery" ? customerDetail : ({} as any),
      status: "pending",
      managerId: currentUser?.id || "",
      branchDetail: { branchId: profile?.branchId || loggedInUser?.branch?.id, branchName: profile?.branchName || loggedInUser?.branch?.name },
    };

    try {
      const allOrders = await proceedOrder.getAll();
      let existingOrder: ProceedOrdersData | undefined;

      if (checkoutData.orderType === "delivery") {
        existingOrder = allOrders.find(
          (o) => o.orderType === "delivery" && o.customerDetail?.customerId === checkoutData.customerDetail?.customerId && o.status === "pending",
        );
      } else if (checkoutData.orderType === "drive") {
        existingOrder = allOrders.find((o) => o.orderType === "drive" && o.tableName === checkoutData.tableName && o.status === "pending");
      } else if (checkoutData.orderType === "takeaway") {
        existingOrder = undefined;
      }

      if (existingOrder) {
        const updatedOrders = [...(existingOrder.orders || []), ...checkoutData.orders];
        const updatedTotal = (existingOrder.totalAmount ?? 0) + (checkoutData.totalAmount ?? 0);

        await proceedOrder.update(existingOrder.id, {
          orders: updatedOrders,
          totalAmount: updatedTotal,
          updatedAt: Date.now(),
        });

        toast.success("Existing order updated successfully!");
        setSelectTableName({ title: "", available: "" });
      } else {
        await proceedOrder.add(checkoutData);
        toast.success("New order added successfully!");
      }

      if (profile?.branchId) {
        const kitchenQuery = query(collection(db, "staff_manage"), where("role", "==", "kitchen"), where("branch.id", "==", profile.branchId));
        const kitchenSnap = await getDocs(kitchenQuery);
        for (const docSnap of kitchenSnap.docs) {
          const staffId = docSnap.id;

          await setDoc(
            doc(db, "staff_manage", staffId, "notifications", `${Date.now()}`),
            {
              title: "New Order Received",
              body: buildNotificationBody(checkoutData),
              read: false,
              createdAt: Date.now(),
            },
            { merge: true },
          );
        }
      }

      if (checkoutData.orderType === "delivery" && checkoutData.customerDetail?.customerId) {
        const customerId = checkoutData.customerDetail.customerId;
        const customer = await customerManageService.getById(customerId);

        if (customer) {
          const updatedNumOrders = (Number(customer.ordersNumber) ?? 0) + 1;
          const updatedTotalSpends = (Number(customer.totalSpend) ?? 0) + (checkoutData.totalAmount ?? 0);

          await customerManageService.update(customerId, {
            ordersNumber: updatedNumOrders,
            totalSpend: updatedTotalSpends,
            lastVisit: new Date().toISOString().split("T")[0],
          });
        }
      }

      const drawerItems = await orderAddToDrawer.getAll();
      for (const order of orders) {
        const target = drawerItems.find((i) => i.itemId === order.itemId);
        if (target) await orderAddToDrawer.deleteById(target.id);
      }

      await refetch?.();
      await refetchItems?.();
      setStatus(Status.FETCHED);
    } catch (error: any) {
      toast.error("Please Check Your All Fields before Submitting somthing missing or somthing went wrong!");
      setStatus(Status.FETCHED);
    } finally {
      setStatus(Status.IDLE);
    }
  };

  const handleQRCodeScan = (scannedData: string) => {
    const order = JSON.parse(scannedData);

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Order Details", 14, 22);
    let yPos = 32;
    order.forEach((item: any, index: number) => {
      doc.setFontSize(12);

      doc.text(`${index + 1}. ${item.name} (${item.selectedSize})`, 14, yPos);
      yPos += 8;

      if (item.selectedCombos?.length) {
        const combosText = `Combos: ${item.selectedCombos.join(", ")}`;
        doc.text(combosText, 18, yPos);
        yPos += 6;
      }

      if (item.selectedAddons?.length) {
        const addonsText = `Addons: ${item.selectedAddons.join(", ")}`;
        doc.text(addonsText, 18, yPos);
        yPos += 6;
      }

      doc.text(`Qty: ${item.qty} x Price: ${item.price} = ${item.total} EGP`, 18, yPos);
      yPos += 10;
    });

    doc.setFontSize(14);
    doc.text(`Total Amount: ${formatNumber(order.reduce((sum: number, i: any) => sum + i.total, 0))} EGP`, 14, yPos + 10);

    doc.save(`order_${new Date().getTime()}.pdf`);
  };

  useEffect(() => {
    fetchCashierData();
  }, []);

  console.log(orders, "orders");

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent className="overflow-x-hidden overflow-y-auto p-4 space-y-4 w-full sm:w-[80%] sm:!min-w-[80%] sm:!max-w-[80%] md:w-[60%] md:!min-w-[60%] md:!max-w-[60%] lg:w-[40%] lg:!min-w-[40%] lg:!max-w-[40%]">
        <DrawerHeader className="flex flex-row items-center justify-between pb-0 mb-2 px-0">
          <DrawerTitle className="text-xl sm:text-3xl font-semibold">Order Details</DrawerTitle>
          <div className="flex items-start gap-2">
            <CustomTooltip title="Download PDF">
              <Download size={30} onClick={() => handleQRCodeScan(JSON.stringify(orders))} className="cursor-pointer" />
            </CustomTooltip>

            <CustomTooltip title="Close Drawer">
              <X size={30} onClick={onClose} className="cursor-pointer" />
            </CustomTooltip>
          </div>
        </DrawerHeader>

        {loading || status === Status.FETCHING ? (
          <Loading />
        ) : (
          <form onSubmit={handleCheckout}>
            <div className="border-b border-gray-200 pb-4 flex items-start justify-between">
              <div className="">
                <div className="flex items-baseline flex-wrap gap-2 pb-4">
                  <p>Order Type:</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {orderTypeBtn.map((btn: OrderTypeBtn) => (
                      <Button
                        key={btn.type}
                        type="button"
                        className={cn(
                          "bg-transparent border rounded-2xl hover:bg-purple-300",
                          selectedOrderType === btn.type
                            ? "border-purple-600 text-purple-600 dark:bg-white"
                            : "border-gray-400 text-black dark:text-white",
                        )}
                        onClick={() => setSelectedOrderType(btn.type as OrderType)}
                      >
                        {btn.text}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedOrderType === "drive" && (
                  <div className="flex items-center flex-wrap gap-2 ">
                    <p>Select Table:</p>
                    <div className="relative w-full sm:w-[40%]" onClick={() => setSelectedTable(true)}>
                      <Armchair className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input type="text" readOnly placeholder="Select Table" value={selectTableName?.title || ""} className="pl-2 cursor-pointer" />
                    </div>
                  </div>
                )}

                {selectedOrderType === "delivery" && (
                  <div className="flex items-center flex-wrap gap-2">
                    <p>Customer:</p>
                    <div className="relative w-full sm:w-[40%]" onClick={() => setIsCustomerModal(true)}>
                      <User className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        type="text"
                        readOnly
                        placeholder="Select Customer"
                        value={customerDetail?.customerName || ""}
                        className="pl-6 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {orders.length > 0 && (
                <div className="relative flex items-center justify-center">
                  <QRCode
                    value={`http://192.168.100.36:3000/download-order?id=${encodeURIComponent(
                      JSON.stringify({
                        i: orders.map((o) => ({ id: o.itemId, n: o.name, q: o.qty, p: o.price })),
                        t: totalAmount,
                      }),
                    )}`}
                    options={{ width: 180, margin: 0, height: 180 }}
                    size="md"
                  />

                  <GradientScan />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 py-2">
              <h4>Order Items:</h4> <strong>{orders.length} Items</strong>
            </div>

            <div className="flex flex-col w-full max-h-[440px] overflow-y-auto gap-3">
              {orders.length ? (
                orders.map((item, idx) => (
                  <ProductCard
                    key={idx}
                    {...item}
                    availableQty={item.availableQty ?? item?.quantity ?? 0}
                    deleteCartHandler={handleDeleteCart}
                    refetchItems={refetchItems}
                    refetch={refetch}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm">No items in cart</p>
              )}
            </div>

            <DrawerFooter className="flex flex-col gap-4 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2 text-lg border-t px-4 py-3 bg-blue-100 dark:bg-blue-500 rounded-lg">
                <span>Total Amount:</span>
                <span>{formatNumber(totalAmount)} EGP</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full">
                {buttonPayment.map((method, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    className={cn(
                      method.type === paymentMethod
                        ? "border-purple-600 text-purple-600 dark:text-white"
                        : "border-gray-600 text-gray-600 dark:text-white dark:border-white",
                      "border !bg-transparent flex-1 rounded-full",
                    )}
                    onClick={() => setPaymentMethod(method.type as PaymentMethod)}
                  >
                    {method.icon}
                    {method.text}
                  </Button>
                ))}
              </div>

              <Button className="w-full sm:w-auto bg-[#3238a1]! text-white">{status === Status.SAVING ? "Proceeding..." : "Proceed Order"}</Button>
            </DrawerFooter>
          </form>
        )}

        <DeleteModal
          open={deleteCartId !== null}
          setOpen={(val) => {
            if (val) {
              setDeleteCartId(val as any);
            } else {
              setDeleteCartId(null);
            }
          }}
          title="Confirm Delete Cart"
          description="Are you sure you want to delete cart?"
          confirmText="Delete Now"
          cancelText="Stay! Not Deleted"
          onConfirm={confirmDelete}
        />

        <CustomModal
          open={isCustomerModal}
          setOpen={setIsCustomerModal}
          className="min-w-[600px]"
          header={<p className="text-center">Select Customer</p>}
        >
          <SearchCustomer setCustomerName={setCustomerDetail} setIsTakeAway={setIsCustomerModal} initialData={customerDetail} />
        </CustomModal>

        <CustomModal
          open={selectedTable}
          setOpen={setSelectedTable}
          className="min-w-[600px]"
          header={
            <div className="flex items-center gap-6 w-full">
              <p>Select Table</p>
              <div onClick={() => handleFilterClick("🟩")} className="cursor-pointer">
                <span>🟩</span> <span className="text-sm">Available</span>
              </div>
              <div onClick={() => handleFilterClick("🟥")} className="cursor-pointer">
                <span>🟥</span> <span className="text-sm">Unavailable</span>
              </div>
            </div>
          }
        >
          <main className="flex flex-wrap gap-2">
            {filterTableList.map((single, index) => (
              <div
                key={index}
                className={cn(
                  "bg-gray-200 dark:bg-black py-2 px-3 rounded-sm flex-1 basis-[30%] cursor-pointer",
                  single.available === "🟥" && "cursor-not-allowed",
                )}
                onClick={() => setTableSelect(single.available === "🟥" ? {} : single)}
              >
                {single.available} {single.title}
              </div>
            ))}
          </main>

          <main className="flex items-center justify-between gap-2 mt-4">
            <div className="flex items-center gap-2 w-full">
              <h6>Selected:</h6>
              {tableSelect.title && (
                <div className="bg-gray-200 dark:bg-black py-2 px-3 rounded-sm relative">
                  {tableSelect.available} {tableSelect.title}
                  <X className="bg-red-600 text-white p-1 rounded-full absolute -top-1 -right-2 cursor-pointer" onClick={() => setTableSelect({})} />
                </div>
              )}
            </div>
            <Button type="button" className="bg-purple-800 dark:bg-black dark:text-purple-300 w-fit px-6" onClick={handleSelectTable}>
              Select
            </Button>
          </main>
        </CustomModal>
      </DrawerContent>
    </Drawer>
  );
}

export default React.memo(OrderDrawer);

interface ProductCardProps {
  itemId?: string;
  id?: string;
  icon?: string;
  price?: number;
  name?: string;
  selectedSize?: string;
  qty?: number;
  availableQty?: number;
  deleteCartHandler?: (id: string, qty: number) => void;
  onQuantityChange?: (newQty: number) => void;
  refetchItems?: () => void;
  refetch?: () => void;
}

const ProductCard = ({
  itemId,
  id,
  icon,
  name,
  price,
  qty = 1,
  availableQty = 0,
  selectedSize,
  deleteCartHandler,
  refetchItems,
  refetch,
}: ProductCardProps) => {
  const item = { itemId, id, icon, name, price, qty, selectedSize, availableQty };

  const increase = async () => {
    if (item.qty < item.availableQty) {
      const newQty = item.qty + 1;
      const newAvailable = item.availableQty - 1;

      await orderAddToDrawer.update(item.id as string, {
        qty: newQty,
        availableQty: newAvailable,
      });

      await itemService.update(item.itemId as string, {
        quantity: newAvailable,
      });

      refetch?.();
      refetchItems?.();
    } else {
      toast.error("Out of stock!");
    }
  };

  const decrease = async () => {
    if (item.qty > 1) {
      const newQty = item.qty - 1;
      const newAvailable = item.availableQty + 1;

      await orderAddToDrawer.update(item.id as string, {
        qty: newQty,
        availableQty: newAvailable,
      });

      await itemService.update(item.itemId as string, {
        quantity: newAvailable,
      });

      refetch?.();
      refetchItems?.();
    } else {
      toast.warning("Minimum quantity is 1");
    }
  };

  return (
    <Card className="border border-gray-300 py-2 hover:shadow-md transition-all duration-300 w-full lg:w-full flex-1">
      <CardContent className="flex flex-col sm:flex-row items-center sm:items-start py-4 gap-3">
        {/* Image */}
        <div className="w-full sm:w-[90px] h-[60px] flex-shrink-0">
          <img src={icon} alt={name} className="w-full h-full object-cover rounded-md" />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm truncate">
              {name} <strong>({selectedSize})</strong>
            </h4>
            <Trash
              size={24}
              className="bg-red-500 rounded-full p-1 text-white cursor-pointer hover:bg-red-600"
              onClick={() => deleteCartHandler?.(id as string, qty as number)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="px-3" onClick={decrease}>
                <Minus size={14} />
              </Button>

              <Input type="number" className="w-14 text-center !h-8 font-medium" value={qty} readOnly />

              <Button type="button" variant="outline" size="sm" className="px-3" onClick={increase}>
                <Plus size={14} />
              </Button>
            </div>

            <strong className="text-sm whitespace-nowrap">{formatNumber((price ?? 0) * qty)} EGP</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
