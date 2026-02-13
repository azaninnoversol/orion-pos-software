import React, { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import itemService, { orderAddToDrawer } from "@/services/api_service";
import { Status } from "@/container/dashboard-pages/customers/data";

interface OrderModalProps {
  items?: any | null;
  setSelectedSubCate?: React.Dispatch<React.SetStateAction<any | null>>;
  isDrawerOpen?: boolean;
  setIsDrawerOpen?: () => void;
  refetch?: () => void;
  refetchItems?: () => void;
}

const OrderModal = ({ items, setSelectedSubCate, setIsDrawerOpen, refetch, refetchItems }: OrderModalProps) => {
  const chooseSize = items?.sizes ?? [];
  const chooseCombo = items?.combo ?? [];
  const addOns = items?.ons ?? [];

  const matchedSize = chooseSize.find((x: any) => Number(x.price) === Number(items?.itemLength));

  const [qty, setQty] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(matchedSize ? matchedSize.label : chooseSize[0]?.label || "");
  const [selectedCombos, setSelectedCombos] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [status, setStatus] = useState<Status>(Status.IDLE);
  const [availableQty, setAvailableQty] = useState(items?.quantity ?? 0);

  const getPrice = (group: any[], selected: string | string[]) => {
    if (Array.isArray(selected)) {
      return selected.reduce((sum, label) => {
        const found = group.find((x) => x.label === label);
        const price = parseFloat(found?.price ?? 0);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);
    } else {
      const found = group.find((x) => x.label === selected);
      const price = parseFloat(found?.price ?? 0);
      return !isNaN(price) && price > 0 ? price : 0;
    }
  };

  const basePrice = 0;

  const total = useMemo(() => {
    const sizePrice = getPrice(chooseSize, selectedSize);
    const comboPrice = getPrice(chooseCombo, selectedCombos);
    const addonPrice = getPrice(addOns, selectedAddons);
    const itemPrice = basePrice + sizePrice + comboPrice + addonPrice;
    return itemPrice * qty;
  }, [qty, selectedSize, selectedCombos, selectedAddons, items]);

  const toggleArrayValue = (arr: string[], value: string) => {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  };

  const increase = async () => {
    if (availableQty > 0) {
      const newQty = qty + 1;
      const newAvailable = availableQty - 1;

      setQty(newQty);
      setAvailableQty(newAvailable);

      try {
        await itemService.update(items?.id, { quantity: newAvailable });
      } catch {
        toast.error("Failed to update stock on increase!");
      }
    } else {
      toast.error("No more items available!");
    }
  };

  const decrease = async () => {
    if (qty > 0) {
      const newQty = qty - 1;
      const newAvailable = availableQty + 1;

      setQty(newQty);
      setAvailableQty(newAvailable);

      try {
        await itemService.update(items?.id, { quantity: newAvailable });
      } catch {
        toast.error("Failed to update stock on decrease!");
      }
    } else {
      toast.warning("Minimum 0 quantity required!");
    }
  };

  const handleQtyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const totalStock = items?.quantity ?? 0;
    const prevQty = qty;
    let newAvailable = availableQty;

    if (value >= 0 && value <= totalStock) {
      // Adjust availableQty based on difference
      const diff = value - prevQty;
      newAvailable = availableQty - diff;

      setQty(value);
      setAvailableQty(newAvailable);

      try {
        await itemService.update(items?.id, { quantity: newAvailable });
      } catch {
        toast.error("Failed to update stock on input change!");
      }
    } else if (value > totalStock) {
      toast.error(`Only ${totalStock} items available`);
    }
  };

  const handleSubmitToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(Status.SAVING);

    if (qty <= 0) {
      toast.error("Please select at least 1 quantity!");
      return;
    }

    try {
      const sizePrice = getPrice(chooseSize, selectedSize);
      const comboPrice = getPrice(chooseCombo, selectedCombos);
      const addonPrice = getPrice(addOns, selectedAddons);

      const finalPrice = basePrice + sizePrice + comboPrice + addonPrice;
      const itemTotal = finalPrice * qty;

      const newItem = {
        icon: items?.icon,
        itemId: items?.id,
        name: items?.title,
        price: sizePrice,
        availableQty: availableQty,
        selectedSize,
        selectedCombos,
        selectedAddons,
        notes,
        qty,
        total: itemTotal,
      };

      const allItems = await orderAddToDrawer.getAll();
      const existingItem = allItems.find((x: any) => x.itemId === newItem.itemId && x.selectedSize === selectedSize);

      if (existingItem) {
        const updatedQty = existingItem.qty + qty;
        const updatedTotal = finalPrice * updatedQty;
        const updatedAvailableQty = availableQty;

        await orderAddToDrawer.update(existingItem.id, {
          qty: updatedQty,
          price: sizePrice,
          total: updatedTotal,
          notes: notes || existingItem.notes,
          availableQty: updatedAvailableQty,
        });

        await itemService.update(items?.id, { quantity: updatedAvailableQty });

        toast.success("Item quantity updated in cart!");
      } else {
        await orderAddToDrawer.add({
          ...newItem,
          notes: notes || "",
        });

        toast.success("Item added to cart!");
      }

      refetchItems?.();
      refetch?.();
      setSelectedSubCate?.(null);
      setIsDrawerOpen?.();
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : error}`);
    } finally {
      setStatus(Status.IDLE);
    }
  };

  return (
    <form onSubmit={handleSubmitToCart}>
      <div className="w-full">
        <Label className="font-semibold text-md">Choose Size</Label>
        <div className="mt-2 flex flex-wrap gap-3 justify-between pr-8">
          {chooseSize?.map((single: any, idx: number) => (
            <label key={idx} className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="size" checked={selectedSize === single?.label} onChange={() => setSelectedSize(single?.label)} />
              <span>
                {single?.label} <span className="text-sm text-gray-500">+({single?.price} EGP)</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {chooseCombo?.length > 0 && (
        <div className="mt-6">
          <Label className="font-semibold text-md">Choose Combo</Label>
          <div className="mt-2 flex flex-wrap gap-3 justify-between pr-8">
            {chooseCombo?.map((single: any, idx: number) => (
              <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={selectedCombos.includes(single?.label)}
                  onCheckedChange={() => setSelectedCombos((prev) => toggleArrayValue(prev, single?.label))}
                />
                <span>
                  {single?.label} <span className="text-sm text-gray-500">+({single?.price} EGP)</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <Label className="font-semibold text-md">Add Ons</Label>
        <div className="mt-2 flex flex-wrap gap-3 justify-between pr-8">
          {addOns?.map((single: any, idx: number) => (
            <label key={idx} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={selectedAddons.includes(single?.label)}
                onCheckedChange={() => setSelectedAddons((prev) => toggleArrayValue(prev, single?.label))}
              />
              <span>
                {single?.label} <span className="text-sm text-gray-500">+({single?.price} EGP)</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6 mb-4">
        <Label className="font-semibold text-md mb-2">Notes</Label>
        <Textarea
          name="notes"
          placeholder="e.g No Onions"
          className="border-gray-300 focus-visible:ring-[#3238a1] min-h-[50px] resize-none"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500">Available: {availableQty}</div>
      <div className="flex items-center gap-4 mt-4">
        <Label className="font-semibold text-md">Quantity</Label>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={decrease}>
            <Minus size={16} />
          </Button>
          <Input type="number" className="w-16 text-center !h-8" value={qty} onChange={handleQtyChange} />
          <Button type="button" variant="outline" size="sm" onClick={increase}>
            <Plus size={16} />
          </Button>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 justify-between mt-6">
        <div>
          <h5>Total:</h5>
          <h4 className="font-semibold">{total} EGP</h4>
        </div>
        <Button
          className="bg-[#3238a1] dark:bg-[#3238a1] dark:text-white w-fit px-8"
          type="submit"
          disabled={items?.quantity === 0 || status === Status.SAVING}
        >
          {status === Status.SAVING ? "Adding..." : "Add To Order"}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(OrderModal);
