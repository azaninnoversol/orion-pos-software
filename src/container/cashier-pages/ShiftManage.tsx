"use client";
import React, { useCallback, useState, useEffect, useMemo } from "react";

// components
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/CustomModal";
import { ModalInput } from "../dashboard-pages/customers/AddCustomerModal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SimpleOrderCard from "./cashier/SimpleOrderCard";
import Loading from "@/app/loading";

// icons
import { CircleDollarSign } from "lucide-react";

// mock-data + types + helper
import { generateOrderOverviewAmount, ShiftManageData } from "./shift-manage/data";
import { orderOverviewAmountType } from "./cashier/data";
import { Status } from "../dashboard-pages/customers/data";
import { DiscountState } from "../dashboard-pages/Menu";
import { ProceedOrdersData } from "./order/data";

// api-service
import {
  branchManageService,
  cancelledOrder,
  customerManageServiceForReports,
  discountService,
  proceedOrder,
  shiftManage,
  staffManageService,
} from "@/services/api_service";

// toast
import { toast } from "sonner";

// firebase
import { doc, getDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/utils/config";

const defaultForm = {
  balance: "",
  cashIn: "",
  cashOut: "",
  tillAmount: "",
  todayOrder: "",
};

function ShiftManage() {
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [customersData, setCustomersData] = useState<any[]>([]);
  const [orderData, setOrderData] = useState<ProceedOrdersData[]>([]);
  const [cancelledOrders, setCancelledOrders] = useState<any[]>([]);
  const [branchesData, setBranchesData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<orderOverviewAmountType | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [isShiftOpen, setIsShiftOpen] = useState<"start" | "end" | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [discount, setDiscount] = useState<DiscountState>({
    id: null,
    value: 0,
    startDate: null,
    endDate: null,
  });

  const safeAsync = useCallback(async (fn: () => Promise<any>, onSuccess?: () => void) => {
    try {
      setStatus(Status.FETCHING);
      await fn();
      setStatus(Status.FETCHED);
      onSuccess?.();
    } catch (err) {
      toast.error("Something went wrong");
      setStatus(Status.ERROR);
    }
  }, []);

  const fetchSalesData = useCallback(() => {
    safeAsync(async () => {
      const data = await customerManageServiceForReports.getAll();
      setCustomersData(data);
    });
  }, [safeAsync]);

  const fetchDiscounts = useCallback(() => {
    safeAsync(async () => {
      const data = await discountService.getAll();
      const latest = data[0];
      setDiscount({
        id: latest.id,
        value: latest.discountPercentage || 0,
        startDate: latest.discountStartDate ? new Date(latest.discountStartDate) : null,
        endDate: latest.discountEndDate ? new Date(latest.discountEndDate) : null,
      });
    });
  }, [safeAsync]);

  const fetchOrders = useCallback(() => {
    safeAsync(async () => {
      const data = await proceedOrder.getAll();
      const cancelled = await cancelledOrder.getAll();
      setCancelledOrders(cancelled);
      setOrderData(data);
    });
  }, [safeAsync]);

  const fetchSummaryCards = useCallback(() => {
    safeAsync(async () => {
      const res = await shiftManage.getAll();
      if (res?.length) {
        const latestShift = res[0];

        setFormData?.({
          balance: latestShift.balance || "",
          cashIn: latestShift.cashIn || "",
          cashOut: latestShift.cashOut || "",
          tillAmount: latestShift.tillAmount || "",
          todayOrder: "",
        });
      }
    });
  }, [safeAsync]);

  const fetchBranches = useCallback(() => {
    safeAsync(async () => {
      const data = await branchManageService.getAll();
      setBranchesData(data);
    });
  }, [safeAsync]);

  const handleModal = (type: orderOverviewAmountType) => setIsModalOpen(type);
  const handleCloseModal = () => setIsModalOpen(null);

  const modalSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isModalOpen) return;

    const value = formData[isModalOpen];
    if (!value) {
      toast.error("Please enter a value before submitting.");
      return;
    }

    const payload = {
      [isModalOpen]: Number(value),
    };

    try {
      setStatus(Status.SAVING);

      const data = await shiftManage.getAll();
      const existingShift = data?.[0];

      let res;
      if (!existingShift?.id) {
        res = await shiftManage.add(payload);
        toast.success(`${modalTitles[isModalOpen]} created successfully!`);
      } else {
        res = await shiftManage.update(existingShift.id, {
          ...existingShift,
          ...payload,
        });
        toast.success(`${modalTitles[isModalOpen]} updated successfully!`);
      }
    } catch (err) {
      toast.error("Failed to update shift data.");
    } finally {
      setFormData((prev) => ({ ...prev, [isModalOpen]: "" }));
      fetchSummaryCards();
      handleCloseModal();
      setStatus(Status.FETCHED);
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
        const staffData = await (await staffManageService.getAll()).find((single) => single?.email === userData?.email);

        setProfile({
          name: userData.name || "",
          email: user.email || "",
          role: userData.role || "guest",
          cashierId: userData.id || "guest_01",
          shiftId: staffData?.branch?.id,
          branch: staffData?.branch?.name,
        });
        setStatus(Status.FETCHED);
      } catch (error) {
        toast.error("Failed to fetch profile: " + (error as Error).message);
      }
    });
  };

  const shiftHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const branches = branchesData?.find((single) => single?.id === profile?.shiftId);

    const body = {
      ...formData,
      shiftId: profile?.shiftId,
      branch: profile?.branch,
      cashierId: profile?.cashierId,
      startedAt: serverTimestamp(),
      isActive: true,
      endedAt: null,
    };
  };

  useEffect(() => {
    fetchSalesData();
    fetchDiscounts();
    fetchOrders();
    fetchSummaryCards();
    fetchCashierData();
    fetchBranches();
  }, []);

  if (status === Status.FETCHING) {
    return <Loading className="!min-h-[80vh]" />;
  }

  const summaryData = ShiftManageData({
    customersData,
    discount,
    orderData,
    cancelledOrders,
    profile,
  });

  const modalTitles: Record<orderOverviewAmountType, string> = {
    balance: "Add Opening Balance",
    cashIn: "Add Cash In",
    cashOut: "Add Cash Out",
    tillAmount: "Add Till Amount",
  };

  const orderOverviewAmount = generateOrderOverviewAmount(formData, orderData);

  return (
    <section id="shift-manage">
      <main className="w-[96%] mx-auto pt-2">
        <div className="flex items-center justify-between flex-wrap max-sm:justify-center max-sm:gap-2">
          <h3 className="font-semibold text-xl sm:text-2xl md:text-3xl">Manage Your Shift</h3>

          <div className="flex gap-4 items-center">
            <Button className="rounded-sm !bg-purple-600 !text-white" onClick={() => setIsShiftOpen?.("start")}>
              Start Shift
            </Button>

            {/* <TimeButton /> */}
            <Button className="rounded-sm !bg-red-600 !text-white">End Shift</Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4 justify-between max-sm:justify-center">
          {orderOverviewAmount?.map((single, index) => (
            <SimpleOrderCard key={index} {...single} onClick={handleModal} />
          ))}
        </div>

        <div className="flex gap-4 items-center justify-end pt-6 max-sm:justify-center">
          <Button onClick={() => handleModal("cashOut")} className="rounded-sm !bg-white border border-purple-600 !text-purple-600">
            <CircleDollarSign />
            <span>Cash Out</span>
          </Button>
          <Button onClick={() => handleModal("cashIn")} className="rounded-sm !bg-purple-600 !text-white">
            <CircleDollarSign />
            <span>Cash In</span>
          </Button>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <h6 className="font-semibold text-xl">Summary</h6>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-x-6">
            {summaryData?.map((branchData, branchIdx) => (
              <div key={branchIdx} className={`flex flex-col gap-3 ${branchIdx === 0 ? "pr-6" : "pl-6"}`}>
                <h3 className="text-2xl font-semibold mb-2">{branchData.branch}</h3>

                {branchData.summary.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h5 className="text-base font-medium">{item.label}</h5>
                    <p className="text-base font-semibold">{item.price}</p>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>

        {isModalOpen && (
          <CustomModal open={!!isModalOpen} setOpen={(val) => (val ? null : handleCloseModal())} header={<span>{modalTitles[isModalOpen]}</span>}>
            <form onSubmit={modalSubmitHandler} className="flex flex-col gap-4 py-2">
              <ModalInput
                formData={formData}
                setFormData={setFormData}
                label={modalTitles[isModalOpen]}
                type="string"
                placeholder={modalTitles[isModalOpen]}
                name={isModalOpen}
              />

              <Button type="submit" className="bg-purple-600 text-white">
                {status === Status.SAVING ? "Adding..." : modalTitles[isModalOpen]}
              </Button>
            </form>
          </CustomModal>
        )}
        <CustomModal
          open={isShiftOpen !== null}
          setOpen={(val) => (val ? null : setIsShiftOpen?.(null))}
          header={<span>{isShiftOpen === "start" ? "Start Shift" : "End Shift"}</span>}
        >
          <form onSubmit={shiftHandler} className="flex flex-col gap-4 py-2">
            <ModalInput
              formData={formData}
              setFormData={setFormData}
              label={"Opening Balance"}
              type="number"
              placeholder={"Enter Opening Balance Amount"}
              name={"balance"}
            />

            <ModalInput
              formData={formData}
              setFormData={setFormData}
              label={"Cash In"}
              type="number"
              placeholder={"Enter Cash In Amount"}
              name={"cashIn"}
            />

            <ModalInput
              formData={formData}
              setFormData={setFormData}
              label={"Cash Out"}
              type="number"
              placeholder={"Enter Cash Out Amount"}
              name={"cashOut"}
            />

            <ModalInput
              formData={formData}
              setFormData={setFormData}
              label={"Till Amount"}
              type="number"
              placeholder={"Enter Till Amount"}
              name={"tillAmount"}
            />

            <ModalInput
              formData={formData}
              setFormData={setFormData}
              label={"Today's Order"}
              type="number"
              placeholder={"Orders"}
              name={"todayOrder"}
            />

            <Button type="submit" className="bg-purple-600 text-white">
              Start Shift Now
              {/* {status === Status.SAVING ? "Adding..." : modalTitles[isModalOpen]} */}
            </Button>
          </form>
        </CustomModal>
      </main>
    </section>
  );
}

export default React.memo(ShiftManage);
