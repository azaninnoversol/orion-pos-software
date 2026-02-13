import React, { useEffect, useState } from "react";

// helper
import { cn } from "@/lib/utils";

// next
import Link from "next/link";

// components
import CustomTooltip from "./CustomTooltip";

// icons
import { Handbag } from "lucide-react";

interface LogoProps {
  isSideBarOpen?: boolean;
}

function Logo({ isSideBarOpen }: LogoProps) {
  const [showText, setShowText] = useState<boolean>(isSideBarOpen!);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isSideBarOpen) {
      timer = setTimeout(() => setShowText(true), 100);
    } else {
      timer = setTimeout(() => setShowText(false), 40);
    }

    return () => clearTimeout(timer);
  }, [isSideBarOpen]);

  return (
    <CustomTooltip title="ORION POS">
      <Link href={"/"} className="flex items-center gap-1.5 justify-center">
        <Handbag className="text-[#3238a1] dark:text-purple-400 stroke-2" />

        {showText && (
          <h1
            className={cn("text-black text-xl font-bold transition-opacity duration-300 dark:text-white", showText ? "opacity-100" : "opacity-0")}
            style={{ whiteSpace: "nowrap" }}
          >
            ORION <span className="text-[#3238a1] dark:text-purple-400">POS</span>
          </h1>
        )}
      </Link>
    </CustomTooltip>
  );
}

export default React.memo(Logo);
