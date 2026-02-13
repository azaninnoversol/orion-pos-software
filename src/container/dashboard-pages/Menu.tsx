"use client";
import React, { useEffect, useState } from "react";

//components
import { Button } from "@/components/ui/button";
import TableSection from "@/components/TableSection";
import CustomModal from "@/components/CustomModal";
import { MenuCard } from "./menu/MenuCard";
import Products from "./menu/Products";
import SizeAndOns from "./menu/SizeAndOns";
import DatePicker from "@/components/DatePicker";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { CellHeader, CellRow } from "./menu/TableCell";
import { ActionButton } from "./menu/ActionButtons";
import Loading from "@/app/loading";

//toast
import { toast } from "sonner";

//types + helper-function
import { convertFirebaseDataToPayment, generateMenuItems, Payment } from "./menu/data";

//api-service
import itemService, { branchManageService, discountService } from "@/services/api_service";

//react-table
import { ColumnDef } from "@tanstack/react-table";

//icons
import { ChevronLeft, Plus, SquarePen } from "lucide-react";
import { UserProfile } from "../cashier-pages/inbox/data";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/utils/config";
import { doc, getDoc } from "firebase/firestore";
import { BranchValue } from "./StaffManage";
interface SizeOption {
  label: string;
  price: number;
}

interface DefaultFormState {
  imageUrl: string;
  itemPreview: string;
  itemName: string;
  category: string;
  subCategory: string;
  price: number;
  quantity: number;
  description: string;
  available: boolean;
  sizes: SizeOption[];
  ons: SizeOption[];
  combo: SizeOption[];
  hasSizes: boolean;
  hasOns: boolean;
  hasCombo: boolean;
  managerId?: string;
  branch?: { id: string; name: string };
}

export interface DiscountState {
  id: string | null;
  value: number;
  startDate: Date | null;
  endDate: Date | null;
}

const defaultForm: DefaultFormState = {
  imageUrl: "",
  itemPreview: "",
  itemName: "",
  category: "",
  subCategory: "",
  price: 0,
  quantity: 0,
  description: "",
  available: true,
  sizes: [
    { label: "Small", price: 0 },
    { label: "Medium", price: 0 },
    { label: "Large", price: 0 },
  ],
  ons: [{ label: "Bacon", price: 20 }],
  combo: [
    { label: "Sandwich Only", price: 0 },
    { label: "Combo", price: 20 },
  ],
  hasSizes: false,
  hasOns: false,
  hasCombo: false,
  branch: {
    id: "",
    name: "",
  },
  managerId: "",
};

function Menu() {
  const [openItemModal, setOpenItemModal] = useState(false);
  const [priceModal, setPriceModal] = useState<string | null>(null);
  const [editOpenItemModal, setEditOpenItemModal] = useState<null | string>(null);
  const [isAnotherField, setIsAnotherField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [formData, setFormData] = useState(defaultForm);
  const [discountStatus, setDiscountStatus] = useState<"idle" | "saving" | "saved" | "error" | "fetching" | "fetched">("idle");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [branches, setBranches] = useState<BranchValue[]>([]);
  const [discount, setDiscount] = useState<DiscountState>({
    id: null,
    value: 0,
    startDate: null,
    endDate: null,
  });

  const DeleteRowHandler = async (data: Payment) => {
    setIsLoading(true);
    const res = await itemService.deleteById(data?.id);
    if (res) {
      toast.success("Deleted item successfully!");
      fetchData();
    } else {
      toast.error("Something went wrong!");
    }
    setIsLoading(false);
  };

  const openItemModalHandler = () => {
    setOpenItemModal(true);
    setEditOpenItemModal(null);
    setFormData(defaultForm);
  };

  const handlePriceChange = (value: number) => {
    setFormData((prev) => {
      const updatedSizes = [...prev.sizes];
      updatedSizes[0].price = value;

      return {
        ...prev,
        price: value,
        sizes: updatedSizes,
      };
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { imageUrl, itemPreview, ...rest } = formData;

    if (!currentUser) return;

    const formatted = {
      ...rest,
      price: Number(rest.price) || 0,
      sizes: rest.sizes.map((s: any) => ({
        ...s,
        price: Number(s.price) || 0,
      })),
      ons: rest.ons.map((o: any) => ({ ...o, price: Number(o.price) || 0 })),
      managerId: currentUser?.id ?? "",
    };

    setIsLoading(true);
    try {
      if (!editOpenItemModal) {
        await itemService.add({ itemPreview, ...formatted });
        toast.success("Item added successfully!");
      } else {
        await itemService.update(editOpenItemModal, {
          itemPreview,
          ...formatted,
        });
        toast.success("Item updated successfully!");
      }
      setFormData(defaultForm);
      setEditOpenItemModal(null);
      setOpenItemModal(false);
      setTimeout(fetchData, 600);
    } catch (error) {
      toast.error("Failed to submit!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBranches = async () => {
    const userId = localStorage.getItem("USER_ID");
    const res = await branchManageService.getAll();
    const filtered = res.filter((branch: any) => branch.managerId === userId);
    const uniqueBranches = Array.from(
      new Map(filtered?.map((single: any) => [single.branchName, { id: single.id, name: single.branchName }])).values(),
    );
    setBranches(uniqueBranches);
  };

  async function fetchData() {
    setIsLoading(true);
    try {
      const managerId = localStorage.getItem("USER_ID");
      const items = await itemService.getAll();
      const filteredItems = items.filter((item: any) => item.managerId === managerId);
      setData(filteredItems);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchDataById() {
    if (!editOpenItemModal) return;

    const item = await itemService.getById(editOpenItemModal);

    setFormData({
      ...defaultForm,
      ...item,
      sizes: item?.sizes || defaultForm.sizes,
      ons: item?.ons || defaultForm.ons,
      branch: {
        id: item?.branch?.id || "",
        name: item?.branch?.name || "",
      },
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const branch = localStorage.getItem("BRANCH_ID");
        const managerID = localStorage.getItem("USER_ID");

        if (!userDocSnap.exists()) {
          toast.error("User data not found");
          return;
        }

        const userData = userDocSnap.data();

        if (userData?.id === managerID && userData.branch?.id === branch && userData?.role === "manager") {
          setCurrentUser({
            id: userData.id || "",
            name: userData.name || "",
            email: userData?.email || "",
            role: userData.role || "guest",
            branch: {
              id: userData.branch?.id || "",
              name: userData.branch?.name || "",
            },
          });
        }
      } catch (error) {
        toast.error("Failed to fetch profile: " + (error as Error).message);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setDiscountStatus("fetching");
        const res = await discountService.getAll();
        if (res && res.length > 0) {
          const latest = res[0];
          setDiscount({
            id: latest.id,
            value: latest.discountPercentage || 0,
            startDate: latest.discountStartDate ? new Date(latest.discountStartDate) : null,
            endDate: latest.discountEndDate ? new Date(latest.discountEndDate) : null,
          });
          setDiscountStatus("fetched");
        } else {
          setDiscountStatus("idle");
        }
      } catch (err) {
        setDiscountStatus("error");
        toast.error("Failed to fetch discounts");
      }
    };
    fetchDiscounts();
  }, []);

  useEffect(() => {
    fetchData();
    fetchBranches?.();
  }, []);

  useEffect(() => {
    fetchDataById();
  }, [editOpenItemModal]);

  const columns: ColumnDef<Payment>[] = [
    { accessorKey: "id", header: "#ID" },
    {
      accessorKey: "item_name",
      header: "Item Name",
      cell: ({ row }) => (
        <CellRow className="text-left w-fit">
          <div className="flex gap-2">
            <img src={row?.original?.itemPreview} alt="Img" className="w-[20px] h-[20px] object-cover" />
            {row?.original?.item_name}
          </div>
        </CellRow>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <CellRow className="bg-gray-100 dark:bg-[#1D1D27] px-4 py-2 text-left w-fit">{row?.original?.category}</CellRow>,
    },
    { accessorKey: "sub_category", header: "Sub Category" },
    { accessorKey: "status", header: "Available" },
    { accessorKey: "price", header: "Price" },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => <CellRow className="text-left pl-5">{row?.original?.quantity}</CellRow>,
    },
    {
      accessorKey: "discount",
      header: () => <CellHeader>Discount</CellHeader>,
      cell: ({ row }) => <CellRow className="w-full text-center">{row.original.discount}</CellRow>,
    },
    {
      accessorKey: "actions",
      id: "actions",
      header: () => <CellHeader className="text-right pr-4">Actions</CellHeader>,
      cell: ({ row }) => <ActionButton row={row} onEdit={(data) => setEditOpenItemModal(data?.id)} onDelete={DeleteRowHandler} />,
    },
  ];

  const payment = convertFirebaseDataToPayment(data, discount);
  const menuItems = generateMenuItems(data);

  return (
    <section id="menu" className="text-white text-4xl">
      <main className="w-[96%] mx-auto pt-1">
        <div className="flex items-center justify-between flex-wrap max-[583px]:justify-center max-[583px]:gap-4">
          <h3 className="font-semibold text-lg sm:text-xl md:text-3xl whitespace-nowrap text-black dark:text-gray-200">Manage Your Menu</h3>

          <div className="flex gap-4 items-center">
            <Button
              className="rounded-sm !bg-transparent border dark:border-gray-200 dark:text-gray-200 border-[#3238a1] text-[#3238a1]"
              onClick={() => setPriceModal?.("add_price")}
            >
              <SquarePen />
              <span>Price Control</span>
            </Button>

            <Button className="rounded-sm !bg-[#3238a1] !text-white" onClick={openItemModalHandler}>
              <Plus />
              <span>Add New Item</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-8">
          {menuItems.map((item, idx) => (
            <MenuCard {...item} key={idx} />
          ))}
        </div>

        <TableSection title="Items List" columns={columns} data={payment} pageSize={10} placeholder="Search item..." isLoading={isLoading} />
      </main>

      <CustomModal
        className="min-w-[30%]"
        open={openItemModal || editOpenItemModal}
        setOpen={(value) => {
          if (!value) {
            setTimeout(() => {
              setIsAnotherField(false);
            }, 200);
          }
          setEditOpenItemModal(null);
          setOpenItemModal(value);
        }}
        header={<span className="text-xl font-semibold">{editOpenItemModal ? "Edit Item" : "Add New Item"}</span>}
      >
        <form onSubmit={onSubmit} className="flex items-center justify-start flex-col w-full gap-4 relative">
          {isAnotherField && (
            <ChevronLeft className="absolute -top-13 left-0 text-gray-400 cursor-pointer" size={20} onClick={() => setIsAnotherField(false)} />
          )}

          {!isAnotherField ? (
            <Products
              formData={formData}
              setFormData={setFormData}
              setIsAnotherField={setIsAnotherField}
              branches={branches}
              handlePriceChange={handlePriceChange}
            />
          ) : (
            <SizeAndOns formData={formData} setFormData={setFormData} handlePriceChange={handlePriceChange} />
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3238a1] dark:text-gray-200 hover:dark:text-gray-800 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {editOpenItemModal ? "Updating..." : "Submitting..."}
              </>
            ) : (
              <span>{editOpenItemModal ? "Update Item" : "Add New Item"}</span>
            )}
          </Button>
        </form>
      </CustomModal>

      <CustomModal
        open={priceModal !== null}
        setOpen={(val) => !val && setPriceModal(null)}
        header={<span className="text-xl font-semibold">{!discount?.id ? "Add Discount" : "Edit Discount"}</span>}
      >
        <PriceControl
          setPriceModal={setPriceModal}
          discount={discount}
          setDiscount={setDiscount}
          status={discountStatus}
          setStatus={setDiscountStatus}
        />
      </CustomModal>
    </section>
  );
}

export default React.memo(Menu);

interface PriceControlProps {
  setPriceModal: React.Dispatch<React.SetStateAction<string | null>>;
  discount: DiscountState;
  setDiscount: React.Dispatch<React.SetStateAction<DiscountState>>;
  status: "idle" | "saving" | "saved" | "error" | "fetching" | "fetched";
  setStatus: React.Dispatch<React.SetStateAction<"idle" | "saving" | "saved" | "error" | "fetching" | "fetched">>;
}

const PriceControl = ({ setPriceModal, discount, setDiscount, status, setStatus }: PriceControlProps) => {
  const handleSliderChange = (val: number[]) => setDiscount((prev) => ({ ...prev, value: val[0] }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace("%", "");
    const newVal = Number(cleaned);
    if (!isNaN(newVal) && newVal >= 0 && newVal <= 100) setDiscount((prev) => ({ ...prev, value: newVal }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!discount.startDate || !discount.endDate) {
      toast.error("Please select start and end date");
      return;
    }

    const body = {
      discountPercentage: discount.value,
      discountStartDate: discount.startDate.toISOString(),
      discountEndDate: discount.endDate.toISOString(),
    };

    try {
      setStatus("saving");

      if (discount.id) {
        await discountService.update(discount.id, body);
        toast.success("Discount updated successfully!");
      } else {
        const res = await discountService.add(body);
        setDiscount((prev) => ({ ...prev, id: res.id }));
        toast.success("Discount added successfully!");
      }

      setStatus("saved");
      setPriceModal(null);
    } catch (error) {
      setStatus("error");
      toast.error(`Error saving discount: ${error}`);
    }
  };

  const isSubmitDisabled = discount.value <= 0 || !discount.startDate || !discount.endDate;

  return (
    <>
      {status === "fetching" ? (
        <Loading className="!min-h-[200px]" />
      ) : (
        <form onSubmit={onSubmit}>
          <div className="relative w-full flex items-center justify-between pb-1 border-b-2">
            <button type="button" className="relative pb-1 text-lg font-medium text-[#3238a1] dark:text-purple-400 w-full">
              Discount
              <span className="absolute left-0 bottom-[-6px] h-[2px] bg-[#3238a1] dark:bg-purple-400 w-full rounded-full" />
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-3 w-full">
            <DatePicker
              className="w-full"
              placeholder="Select Start Date"
              value={discount.startDate ?? undefined}
              onChange={(date) => setDiscount((prev) => ({ ...prev, startDate: date ?? null }))}
            />
            <DatePicker
              className="w-full"
              placeholder="Select End Date"
              value={discount.endDate ?? undefined}
              onChange={(date) => setDiscount((prev) => ({ ...prev, endDate: date ?? null }))}
            />
            <div className="flex items-center gap-3 mt-4">
              <Input type="text" value={`${discount.value}%`} onChange={handleInputChange} className="w-[15%] px-1 text-center" />
              <Slider value={[discount.value]} max={100} step={1} onValueChange={handleSliderChange} className="w-[82%]" />
            </div>

            {discount.value > 0 && (
              <p className="text-[14px] text-gray-400 mt-1">
                Applying {discount.value}% discount from {discount.startDate?.toLocaleDateString() ?? "—"} to{" "}
                {discount.endDate?.toLocaleDateString() ?? "—"}.
              </p>
            )}
          </div>

          <Button
            disabled={isSubmitDisabled || status === "saving"}
            type="submit"
            className="w-full mt-3 bg-[#3238a1] dark:bg-purple-800 dark:text-purple-200"
          >
            {status === "saving" ? "Saving..." : discount.id ? "Update Discount" : "Apply Discount"}
          </Button>
        </form>
      )}
    </>
  );
};
