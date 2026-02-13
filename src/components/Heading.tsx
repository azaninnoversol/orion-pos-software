import React, { ReactNode } from "react";

// helper
import { cn } from "@/lib/utils";

interface HeadingProps {
  className?: string;
  classNameLine?: string;
  children: ReactNode;
  isLineShow?: boolean;
}

function Heading({ className = "", classNameLine = "", isLineShow, children }: HeadingProps) {
  return (
    <div className="flex items-center gap-4 max-md:flex max-md:items-center max-md:justify-center">
      {!isLineShow && <div className={cn(`bg-red-500 w-[10px] h-[70px] max-sm:w-[8px] max-sm:h-[55px]`, classNameLine)}></div>}

      <h1 className={cn(`text-black font-bold`, className, !isLineShow ? `text-3xl ${className}` : `text-5xl ${className}`)}>{children}</h1>
    </div>
  );
}

export default React.memo(Heading);
