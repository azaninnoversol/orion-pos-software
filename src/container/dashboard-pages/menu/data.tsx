import { ShoppingBag, WalletMinimal } from "lucide-react";
import { formatText } from "@/lib/utils";
import { DiscountState } from "../Menu";

export interface MenuItems {
  title?: string;
  numbers?: number;
  subCat?: string;
  color?: string;
  icon?: React.ReactNode;
}
interface Item {
  available: boolean;
  category: string;
}

export const generateMenuItems = (items: Item[]) => {
  const totalItems = items?.length;
  const totalCategory = new Set(items?.map((i) => i.category)).size;
  const activeItems = items.filter((i) => i.available).length;
  const inactiveItems = items.filter((i) => !i.available).length;

  return [
    {
      title: "Total Items",
      numbers: totalItems,
      subCat: "Items",
      icon: <ShoppingBag size={40} />,
      color: "bg-blue-500",
    },
    {
      title: "Total Category",
      numbers: totalCategory,
      subCat: "Categories",
      icon: <WalletMinimal size={40} />,
      color: "bg-orange-500",
    },
    {
      title: "Active Items",
      numbers: activeItems,
      subCat: "Items",
      icon: <ShoppingBag size={40} />,
      color: "bg-green-500",
    },
    {
      title: "Inactive Items",
      numbers: inactiveItems,
      subCat: "Items",
      icon: <ShoppingBag size={40} />,
      color: "bg-red-500",
    },
  ];
};

export type Payment = {
  id: string;
  item_name: string;
  itemPreview: string;
  category: string;
  sub_category?: string;
  status: string;
  price: string;
  quantity: string;
  discount: string;
};

export function convertFirebaseDataToPayment(data: any[], discount: DiscountState): Payment[] {
  return data.map((item) => {
    const basePrice = Number(item.price) || 0;
    const discountPercentage = Number(item.discount ?? discount?.value ?? 0);
    const discountedPrice = Math.round(basePrice * (1 - discountPercentage / 100));

    return {
      id: item.id || "",
      item_name: item.itemName || "",
      itemPreview: item.itemPreview || "",
      category: formatText(item.category) || "N/A",
      sub_category: formatText(item.subCategory) || "",
      status: item.available ? "YES" : "NO",
      price: `${discountedPrice} EGP`,
      quantity: item.quantity ? `${item.quantity}` : "0",
      discount: `${discountPercentage}%`,
    };
  });
}

export interface BranchesData {
  rank: string | number;
  name: string;
  city?: string;
  price?: string;
  currency?: string;
  createdAt?: Date | string;
}
