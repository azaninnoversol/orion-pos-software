"use client";
import React, { useEffect } from "react";

// components
import { Input } from "@/components/ui/input";

interface SearchableDropdownProps<T> {
  label: string;
  placeholder: string;
  value: string;
  setValue: (val: string) => void;
  data: T[];
  displayKey?: string;
  loading?: boolean;
  showDropdown: boolean;
  setShowDropdown: (val: boolean) => void;
  onSelect: (item: T) => void;
  disabled?: boolean;
  parentRef: React.RefObject<HTMLDivElement | null>;
  filterLimit?: number;
}

function SearchableDropdown<T>({
  label,
  placeholder,
  value,
  setValue,
  data,
  displayKey,
  loading,
  showDropdown,
  setShowDropdown,
  onSelect,
  disabled,
  parentRef,
  filterLimit = 10,
}: SearchableDropdownProps<T>) {
  const getDisplayText = (item: any): string => {
    if (!displayKey) return String(item ?? "");
    const parts = displayKey.split(".");
    let text = item;
    for (const part of parts) {
      text = text?.[part];
      if (text === undefined) break;
    }
    return String(text ?? "");
  };

  const filteredData = value
    ? data.filter((item: any) => getDisplayText(item).toLowerCase().includes(value.toLowerCase())).slice(0, filterLimit)
    : data.slice(0, filterLimit);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (parentRef.current && !parentRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [parentRef, setShowDropdown]);

  return (
    <div className="w-full flex flex-col gap-2 relative" ref={parentRef}>
      <label className="text-gray-600 dark:text-gray-200 font-medium">{label}</label>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => {
          if (filteredData.length > 0) setShowDropdown(true);
        }}
        disabled={disabled}
        className="border-gray-300 focus-visible:ring-[#3238a1]"
      />

      {loading && <p className="text-sm text-gray-400 mt-1">Loading {label.toLowerCase()}...</p>}

      {showDropdown && filteredData.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-card border border-gray-200 rounded-md shadow-md max-h-48 overflow-y-auto z-10">
          {filteredData.map((item: any, index) => {
            const text = getDisplayText(item);
            return (
              <div
                key={index}
                onClick={() => {
                  onSelect(item);
                  setValue(text);
                  setShowDropdown(false);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-800  dark:border-b dark:border-b-gray-200"
              >
                {text}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default React.memo(SearchableDropdown);
