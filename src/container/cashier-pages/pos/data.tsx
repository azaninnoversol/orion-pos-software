import { formatText } from "@/lib/utils";
import { Category } from "../Pos";
import { DiscountState } from "@/container/dashboard-pages/Menu";
import { UserProfile } from "../inbox/data";

export interface PosForm {}

export interface Profile {
  branchId: string;
  branchName: string;
}

export interface PosCategoriesProps {
  id?: string;
  icon?: string;
  title: string;
  type: string;
  itemLength: number | string;
}

export const generateCategories = (data: OrdersItemsProps[], currentUser?: any, loggedInUser?: any) => {
  const branchId = loggedInUser?.branch?.id || null;
  data = data.filter((item) => item.managerId === currentUser?.id && item?.branch?.id === branchId);

  return [
    {
      icon: "🍔",
      title: "Food",
      type: "fast food",
      itemLength: `${data.filter((item) => item.category?.toLowerCase() === "fast food").length} Items`,
    },
    {
      icon: "🍰",
      title: "Dessert",
      type: "dessert",
      itemLength: `${data.filter((item) => item.category?.toLowerCase() === "dessert").length} Items`,
    },
    {
      icon: "🍶",
      title: "Drinks",
      type: "drinks",
      itemLength: `${data.filter((item) => item.category?.toLowerCase() === "drinks").length} Items`,
    },
  ];
};

export const posCategories: PosCategoriesProps[] = [
  {
    icon: "🍔",
    title: "Food",
    type: "fast food",
    itemLength: "80 items",
  },
  {
    icon: "🍰",
    title: "Dessert",
    type: "dessert",
    itemLength: "34 items",
  },
  {
    icon: "🍶",
    title: "Drinks",
    type: "drinks",
    itemLength: "14 items",
  },
];

export interface OrderItem {
  price: number;
  label: string;
}

export interface OrdersItemsProps {
  id?: string;
  itemName?: string;
  itemPreview?: string;
  available?: boolean;
  category?: string;
  subCategory?: string;
  description?: string;
  price?: number;
  quantity?: number | `${string}`;
  combo?: OrderItem[];
  ons?: OrderItem[];
  sizes?: OrderItem[];
  discount?: any;
  managerId?: string;
  branch?: { id: string; name: string };
}

export const generateOrderItems = (
  data: OrdersItemsProps[],
  category?: Category,
  discount?: DiscountState,
  currentUser?: any,
  loggedInUser?: any,
) => {
  const today = new Date();
  const startDate = discount?.startDate ? new Date(discount.startDate) : null;
  const endDate = discount?.endDate ? new Date(discount.endDate) : null;
  const managerId = currentUser?.id || null;

  const isDiscountActive =
    !!discount?.value && !!startDate && !!endDate && startDate.getTime() <= today.getTime() && today.getTime() <= endDate.getTime();

  return data
    .filter((item) => {
      console.log(item, "itm in dia");
      const matchesCategory = category ? item.category?.toLowerCase() === category.toLowerCase() : true;
      const matchesManager = item.managerId === managerId;
      const matchesBranch = item?.branch?.id === loggedInUser?.branch?.id;
      return matchesCategory && matchesManager && matchesBranch;
    })

    .map((item) => {
      const originalPrice = Number(item.price) || 0;
      const finalPrice = isDiscountActive && discount?.value ? originalPrice - (originalPrice * discount.value) / 100 : originalPrice;
      const updatedSizes =
        item.sizes?.map((size) => {
          const basePrice = Number(size.price) || 0;
          const discountedSizePrice = isDiscountActive && discount?.value ? basePrice - (basePrice * discount.value) / 100 : basePrice;
          return {
            ...size,
            price: Number(discountedSizePrice.toFixed(2)),
          };
        }) ?? [];

      return {
        ...item,
        sub_category: formatText(item.subCategory) || "",
        status: item.available ? "YES" : "NO",
        price: Number(finalPrice.toFixed(2)),
        quantity: item.quantity,
        sizes: updatedSizes,
        discount: isDiscountActive
          ? {
              value: discount.value,
              startDate,
              endDate,
            }
          : {
              value: 0,
              startDate,
              endDate,
            },
      };
    });
};

export const posSubCategories: Record<string, PosCategoriesProps[]> = {
  "fast food": [
    {
      id: "001",
      icon: "🍔",
      title: "Shiitake Mushroom Burger",
      type: "beef",
      itemLength: "120 EGP",
    },
    {
      id: "002",
      icon: "🍗",
      title: "Grilled Chicken",
      type: "chicken",
      itemLength: "150 EGP",
    },
  ],
  dessert: [
    {
      id: "003",
      icon: "🍰",
      title: "Chocolate Cake",
      type: "cake",
      itemLength: "90 EGP",
    },
    {
      id: "004",
      icon: "🍩",
      title: "Donut",
      type: "donut",
      itemLength: "45 EGP",
    },
  ],
  drinks: [
    {
      id: "005",
      icon: "🥤",
      title: "Coca Cola",
      type: "cola",
      itemLength: "25 EGP",
    },
    {
      id: "006",
      icon: "☕",
      title: "Coffee",
      type: "coffee",
      itemLength: "40 EGP",
    },
  ],
};

const chooseSize = [
  {
    size: "size-one",
    gram: "120g",
    price: "120(EGP)",
  },
  {
    size: "size-two",
    gram: "150g",
    price: "150(EGP)",
  },
  {
    size: "size-three",
    gram: "200g",
    price: "180(EGP)",
  },
];

const chooseCombo = [
  {
    size: "combo-one",
    gram: "Sandwich Only",
  },
  {
    size: "combo-two",
    gram: "Combo",
    price: "+30(EGP)",
  },
];

const addOns = [
  {
    size: "ons-one",
    gram: "Bacon",
    price: "+20(EGP)",
  },
  {
    size: "ons-two",
    gram: "Replace With Brown Bread",
    price: "+20(EGP)",
  },
  {
    size: "ons-three",
    gram: "Extra Cheese",
    price: "+20(EGP)",
  },
  {
    size: "ons-four",
    gram: "BBQ Source",
    price: "+20(EGP)",
  },
  {
    size: "ons-five",
    gram: "Mushrooms",
    price: "+20(EGP)",
  },
  {
    size: "ons-six",
    gram: "Ranch Source",
    price: "+20(EGP)",
  },
];

export interface OrderTypeBtn {
  text?: string;
  type?: string;
}

const orderTypeBtn: OrderTypeBtn[] = [
  {
    text: "Dine-in",
    type: "drive",
  },
  {
    text: "Takeaway",
    type: "takeaway",
  },
  {
    text: "Delivery",
    type: "delivery",
  },
];

export interface TablePeople {
  title?: string;
  available?: string;
}

const tablePeople: TablePeople[] = [
  {
    title: "TA-1A",
    available: "🟩",
  },
  {
    title: "TA-2A",
    available: "🟩",
  },
  {
    title: "TA-3A",
    available: "🟩",
  },
  {
    title: "TA-4A",
    available: "🟥",
  },
  {
    title: "TA-5A",
    available: "🟩",
  },
  {
    title: "TA-6A",
    available: "🟥",
  },
  {
    title: "TA-7A",
    available: "🟩",
  },
  {
    title: "TA-8A",
    available: "🟥",
  },
  {
    title: "TA-9A",
    available: "🟥",
  },
  {
    title: "TA-10A",
    available: "🟩",
  },
  {
    title: "TA-11A",
    available: "🟥",
  },
];

export { addOns, chooseCombo, chooseSize, orderTypeBtn, tablePeople };
