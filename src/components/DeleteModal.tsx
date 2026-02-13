"use client";
import React from "react";

// components
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

// icons
import { AlertTriangle } from "lucide-react";

// helper
import { cn } from "@/lib/utils";

interface DeleteModalProps {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ElementType;
}

function DeleteModal({
  open,
  setOpen,
  title = "Confirm Logout!",
  description = "Are you sure you want to logout? You’ll need to log in again to access your dashboard.",
  onConfirm,
  onCancel,
  confirmText = "Yes, Logout",
  cancelText = "Cancel",
  icon: Icon,
}: DeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn("sm:max-w-md rounded-2xl border-none shadow-xl bg-white dark:bg-[#1D1D27] px-6 py-6 transition-all duration-200")}>
        <DialogHeader className="flex flex-col items-center text-center space-y-3">
          <div className="bg-red-100 p-3 rounded-full">
            {Icon ? <Icon className="text-red-500" size={28} /> : <AlertTriangle className="text-red-500" size={28} />}
          </div>
          <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{title}</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-100 text-base leading-relaxed">{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-4 mt-6">
          <Button
            className="rounded-full px-6 py-4!  text-white dark:bg-black hover:dark:bg-red-950"
            onClick={() => {
              setOpen?.(false);
              onCancel?.();
            }}
          >
            {cancelText}
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6"
            onClick={() => {
              onConfirm?.();
              setOpen?.(false);
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(DeleteModal);
