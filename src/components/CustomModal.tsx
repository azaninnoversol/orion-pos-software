import React from "react";

//components
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

//helper-function
import { cn } from "@/lib/utils";

interface CustomModalProps {
  className?: string;
  classNameHeader?: string;
  open?: boolean | null | string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

function CustomModal({ open, setOpen, header, children, footer, className, classNameHeader }: CustomModalProps) {
  return (
    <Dialog open={!!open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "sm:max-w-md rounded-2xl border-none shadow-xl bg-white dark:bg-[#1D1D27]  px-4 sm:px-6 py-6 transition-all duration-200 max-h-[85vh] overflow-y-auto",
          className,
        )}
      >
        {header && (
          <DialogHeader className="flex flex-col items-center text-center space-y-3">
            <DialogTitle className={classNameHeader}>{header}</DialogTitle>
          </DialogHeader>
        )}

        {children}

        {footer && <DialogFooter className="flex justify-center gap-4 mt-6">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(CustomModal);
