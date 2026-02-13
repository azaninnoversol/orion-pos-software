import React from "react";

//components
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

//icons
import { Plus, X } from "lucide-react";

const SizeAndOns = ({
  formData,
  setFormData,
  handlePriceChange,
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handlePriceChange?: (val: number) => void;
}) => {
  const updateArray = (type: "sizes" | "ons" | "combo", index: number, field: string, value: string) => {
    const updated = [...formData[type]];
    updated[index][field] = field === "price" ? Number(value) || 0 : value;
    setFormData({ ...formData, [type]: updated });
  };

  const addRow = (type: "sizes" | "ons") => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { label: "", price: "" }],
    });
  };

  const removeRow = (type: "sizes" | "ons" | "combo", index: number) => {
    const updated = [...formData[type]];
    updated.splice(index, 1);
    setFormData({ ...formData, [type]: updated });
  };

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <label className="text-gray-800 dark:text-gray-200 font-semibold">Add Sizes</label>
        <Switch checked={formData.hasSizes ?? false} onCheckedChange={(val) => setFormData({ ...formData, hasSizes: val })} />
      </div>

      {formData.hasSizes &&
        formData.sizes.map((size: any, index: number) => (
          <div key={index} className="flex items-end gap-2 w-full relative">
            <div className="flex flex-col gap-1 w-[40%]">
              <label className="text-gray-600 dark:text-gray-200 font-medium">Label {index + 1}</label>
              <Input
                type="text"
                placeholder="Enter Label"
                value={size.label ?? ""}
                onChange={(e) => updateArray("sizes", index, "label", e.target.value)}
                className="border-gray-300 focus-visible:ring-[#3238a1]"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-gray-600 dark:text-gray-200 font-medium">Price</label>
              <Input
                type="number"
                placeholder="Enter Price"
                value={size.price ?? 0}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updateArray("sizes", index, "price", e.target.value);

                  if (index === 0) handlePriceChange?.(val);
                }}
                className="border-gray-300 focus-visible:ring-[#3238a1]"
              />
            </div>

            {formData.sizes.length > 3 && (
              <X
                size={18}
                className="text-gray-500 cursor-pointer hover:text-red-500 transition absolute right-0 top-1"
                onClick={() => removeRow("sizes", index)}
              />
            )}
          </div>
        ))}

      {formData.hasSizes && (
        <div
          className="self-start cursor-pointer flex items-center gap-1 text-sm text-gray-600 dark:text-gray-200 font-medium mt-1"
          onClick={() => addRow("sizes")}
        >
          <Plus size={18} /> Add Custom Size
        </div>
      )}

      <div className="flex items-center justify-between w-full mt-4">
        <label className="text-gray-800 dark:text-gray-200 font-semibold">Add Combo</label>
        <Switch checked={formData.hasCombo ?? false} onCheckedChange={(val) => setFormData({ ...formData, hasCombo: val })} />
      </div>

      {formData?.hasCombo &&
        formData.combo.map((on: any, index: number) => (
          <div key={index} className="flex items-end gap-2 w-full relative">
            <div className="flex flex-col gap-1 w-[40%]">
              <label className="text-gray-600 dark:text-gray-200 font-medium">Label {index + 1}</label>
              <Input
                type="text"
                placeholder="Enter Label"
                value={on.label ?? ""}
                onChange={(e) => updateArray("combo", index, "label", e.target.value)}
                className="border-gray-300 focus-visible:ring-[#3238a1]"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-gray-600 dark:text-gray-200 font-medium">Price</label>
              <Input
                type="number"
                placeholder="Enter Price"
                value={on.price ?? 0}
                onChange={(e) => updateArray("combo", index, "price", e.target.value)}
                className="border-gray-300 focus-visible:ring-[#3238a1]"
              />
            </div>

            {formData.combo.length > 1 && (
              <X
                size={18}
                className="text-gray-500 dark:text-gray-200 cursor-pointer hover:text-red-500 transition absolute right-0 top-1"
                onClick={() => removeRow("combo", index)}
              />
            )}
          </div>
        ))}

      {formData.hasOns && (
        <div
          className="self-start cursor-pointer flex items-center gap-1 text-sm text-gray-600 dark:text-gray-200 font-medium mt-1"
          onClick={() => addRow("ons")}
        >
          <Plus size={18} /> Add Custom On
        </div>
      )}

      <div className="flex items-center justify-between w-full mt-4">
        <label className="text-gray-800 dark:text-gray-200 font-semibold">Add Ons</label>
        <Switch checked={formData.hasOns ?? false} onCheckedChange={(val) => setFormData({ ...formData, hasOns: val })} />
      </div>

      {formData.hasOns &&
        formData.ons.map((on: any, index: number) => (
          <div key={index} className="flex items-end gap-2 w-full relative">
            <div className="flex flex-col gap-1 w-[40%]">
              <label className="text-gray-600 dark:text-gray-200 font-medium">Label {index + 1}</label>
              <Input
                type="text"
                placeholder="Enter Label"
                value={on.label ?? ""}
                onChange={(e) => updateArray("ons", index, "label", e.target.value)}
                className="border-gray-300 focus-visible:ring-[#3238a1]"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-gray-600 dark:text-gray-200 font-medium">Price</label>
              <Input
                type="number"
                placeholder="Enter Price"
                value={on.price ?? 0}
                onChange={(e) => updateArray("ons", index, "price", e.target.value)}
                className="border-gray-300 focus-visible:ring-[#3238a1]"
              />
            </div>

            {formData.ons.length > 1 && (
              <X
                size={18}
                className="text-gray-500 dark:text-gray-200 cursor-pointer hover:text-red-500 transition absolute right-0 top-1"
                onClick={() => removeRow("ons", index)}
              />
            )}
          </div>
        ))}

      {formData.hasOns && (
        <div
          className="self-start cursor-pointer flex items-center gap-1 text-sm text-gray-600 dark:text-gray-200 font-medium mt-1"
          onClick={() => addRow("ons")}
        >
          <Plus size={18} /> Add Custom On
        </div>
      )}
    </>
  );
};

export default React.memo(SizeAndOns);
