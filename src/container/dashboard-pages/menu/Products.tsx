import React, { ChangeEvent, useRef } from "react";

//icons
import { Plus } from "lucide-react";

//components
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BranchValue } from "../StaffManage";

const Products = ({
  formData,
  setFormData,
  setIsAnotherField,
  handlePriceChange,
  branches,
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setIsAnotherField: React.Dispatch<React.SetStateAction<boolean>>;
  handlePriceChange?: (val: number) => void;
  branches: BranchValue[];
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setFormData({ ...formData, imageUrl: file, itemPreview: previewUrl });
  };

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: null, itemPreview: undefined });
    if (inputRef.current) inputRef.current.value = "";
  };

  const updateArray = (type: "sizes" | "ons" | "combo", index: number, field: string, value: string) => {
    const updated = [...formData[type]];
    updated[index][field] = field === "price" ? Number(value) || 0 : value;
    setFormData({ ...formData, [type]: updated });
  };

  return (
    <>
      {/* // TODO this is the image upload */}
      {/* <div className="border border-gray-400 rounded-full p-3 relative">
        {formData.itemPreview ? (
          <>
            <NextImage
              width={50}
              height={50}
              src={formData.itemPreview}
              alt="Preview"
              className="w-[50px] h-[50px] object-cover rounded-full"
            />
            <div
              className="bg-purple-500 p-1.5 rounded-full flex items-center justify-center absolute -top-1 -right-2 cursor-pointer"
              onClick={removeImage}
            >
              <X size={15} className="text-white" />
            </div>
          </>
        ) : (
          <>
            <ImageIcon className="text-gray-400" size={28} />
            <div
              className="bg-purple-500 p-1.5 rounded-full flex items-center justify-center absolute -top-1 -right-2 cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              <Plus className="text-white" size={10} />
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div> */}

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Image URL</label>
        <Input
          type="url"
          placeholder="Paste image URL here"
          value={formData.itemPreview ?? ""}
          onChange={(e) => setFormData({ ...formData, itemPreview: e.target.value })}
          className="border-gray-300 focus-visible:ring-[#3238a1]"
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Item Name</label>
        <Input
          type="text"
          placeholder="Enter Item Name"
          value={formData.itemName ?? ""}
          onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
          className="border-gray-300 focus-visible:ring-[#3238a1]"
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Category</label>
        <Select value={formData.category ?? ""} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger className="border border-gray-300 dark:text-gray-100 focus-visible:ring-[#3238a1] text-gray-700 w-full">
            <SelectValue placeholder="Choose Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fast food">Fast Food</SelectItem>
            <SelectItem value="drinks">Drinks</SelectItem>
            <SelectItem value="dessert">Dessert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Sub Category</label>
        <Select value={formData.subCategory ?? ""} onValueChange={(value) => setFormData({ ...formData, subCategory: value })}>
          <SelectTrigger className="border border-gray-300 dark:text-gray-100 focus-visible:ring-[#3238a1] text-gray-700 w-full">
            <SelectValue placeholder="Choose Sub Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="burger">Burger</SelectItem>
            <SelectItem value="pizza">Pizza</SelectItem>
            <SelectItem value="shake">Shake</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Select Branch</label>
        <Select
          value={formData.branch ? JSON.stringify(formData.branch) : ""}
          onValueChange={(value) => {
            const parsed = value ? JSON.parse(value) : null;
            setFormData({ ...formData, branch: parsed });
          }}
        >
          <SelectTrigger className="border border-gray-300 dark:text-gray-100 focus-visible:ring-[#3238a1] text-gray-700 w-full">
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>

          <SelectContent>
            {branches?.map((branch) => (
              <SelectItem key={branch.id} value={JSON.stringify({ id: branch.id, name: branch.name })}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Price</label>
        <Input
          type="number"
          placeholder="Enter Price"
          value={formData.price ?? ""}
          onChange={(e) => handlePriceChange?.(Number(e.target.value))}
          className="border-gray-300 focus-visible:ring-[#3238a1]"
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Quantity</label>
        <Input
          type="number"
          placeholder="Enter Quantity"
          value={formData.quantity ?? ""}
          onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
          className="border-gray-300 focus-visible:ring-[#3238a1]"
        />
      </div>
      <div className="self-start">
        <label
          className="text-sm text-gray-600 dark:text-gray-200 font-medium flex items-center gap-1 cursor-pointer"
          onClick={() => setIsAnotherField(true)}
        >
          <Plus size={18} />
          Add Sizes & Add Ons
        </label>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-gray-600 dark:text-gray-200 font-medium">Description</label>
        <Textarea
          placeholder="Enter Description..."
          value={formData.description ?? ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border-gray-300 focus-visible:ring-[#3238a1] resize-none"
        />
      </div>
      <div className="flex items-center justify-between w-full">
        <label htmlFor="available" className="text-gray-600 dark:text-gray-200 font-medium">
          Available
        </label>
        <Switch id="available" checked={formData.available ?? false} onCheckedChange={(val) => setFormData({ ...formData, available: val })} />
      </div>
    </>
  );
};

export default React.memo(Products);
