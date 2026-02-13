import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { OrdersItemsProps, PosCategoriesProps } from "./data";
import { cn, formatDiscountEndDate } from "@/lib/utils";
import CustomModal from "@/components/CustomModal";
import OrderModal from "../cashier/OrderModal";
import { useDispatch } from "react-redux";
import { openDrawer } from "@/redux/OrderDrawerSlice/OrderDrawerSlice";

interface PosCategoryCardProps extends OrdersItemsProps {
  onClick?: (item: string | OrdersItemsProps) => void;
  seletecdCate?: string | null;
  setSelectedSubCate?: React.Dispatch<React.SetStateAction<OrdersItemsProps | null>>;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  formData?: any | null;
  refetch?: () => void;
  refetchItems?: () => void;
}

function PosCategoryCard({ title, icon, type, itemLength, onClick, seletecdCate }: any) {
  return (
    <Card
      className={cn("basis-[15%] min-w-[150px] py-4 cursor-pointer", seletecdCate === type && "border-2 border-purple-500")}
      onClick={() => onClick?.(type)}
    >
      <CardContent className="px-0">
        <div className="flex items-center sm:flex-row flex-col gap-2">
          <div className="text-5xl">{icon as string}</div>
          <div>
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-sm">{itemLength}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(PosCategoryCard);

export function PosSubCategoryCard({
  itemName,
  itemPreview,
  subCategory,
  price,
  sizes,
  ons,
  combo,
  quantity,
  id,
  seletecdCate,
  onClick,
  setSelectedSubCate,
  refetch,
  refetchItems,
  discount,
}: PosCategoryCardProps) {
  const item = { title: itemName, icon: itemPreview, type: subCategory, itemLength: price, id, sizes, ons, combo, quantity };
  const dispatch = useDispatch();

  return (
    <>
      <Card
        className={cn(
          "relative group basis-[15%] min-w-[180px] h-[200px] min-h-[200px] px-1 cursor-pointer rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
          seletecdCate === id && "border-2 border-purple-500",
          quantity === 0 && "cursor-not-allowed opacity-60 border-2 border-red-400",
        )}
        onClick={() => quantity !== 0 && onClick?.(item)}
      >
        <CardContent className="relative flex flex-col items-center justify-between px-3 py-4">
          {quantity === 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white  text-[11px] font-semibold px-2 py-[2px] rounded-md shadow-md">SOLD OUT</div>
          )}

          {discount.value !== 0 && quantity !== 0 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-[11px] font-bold px-2 py-[2px] rounded-md shadow-md">
              {discount?.value}% OFF
            </div>
          )}

          {discount?.value !== 0 && quantity !== 0 && (
            <div className="w-full absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-orange-400 text-white text-[10px] font-medium px-3 py-[3px] rounded-full shadow-md animate-pulse">
              ⏰ Ends {formatDiscountEndDate(discount?.endDate)}
            </div>
          )}

          <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-gray-100 mt-2">
            <img src={itemPreview} alt={itemName} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          </div>

          <div className="text-center mt-3">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{itemName}</h4>
            <div className="text-xs text-gray-500 capitalize dark:text-gray-200">{subCategory}</div>
            <p className="text-sm font-bold text-gray-800 mt-1 dark:text-gray-300">
              {price} <span className="text-[11px] text-gray-500">EGP</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <CustomModal
        className="min-w-[34%]"
        open={seletecdCate === id}
        setOpen={(value) => {
          if (!value) setSelectedSubCate?.(null);
        }}
        header={<ModalHeader item={item} />}
      >
        <OrderModal
          items={item}
          setSelectedSubCate={setSelectedSubCate}
          setIsDrawerOpen={() => dispatch(openDrawer())}
          refetch={refetch}
          refetchItems={refetchItems}
        />
      </CustomModal>
    </>
  );
}

const ModalHeader = ({ item }: { item: PosCategoriesProps | any }) => {
  return (
    <header className="flex items-center justify-center flex-col gap-3">
      <img src={item?.icon} alt={item?.title} className="w-[40px] h-[40px]" />
      <h3 className="text-center">{item?.title}</h3>
    </header>
  );
};
