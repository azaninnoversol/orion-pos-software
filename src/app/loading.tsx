//icons
import { Loader2 } from "lucide-react";

//helper-function
import { cn } from "@/lib/utils";

export default function Loading({ className = "" }) {
  return (
    <div className={cn(className, "flex min-h-screen items-center justify-center")}>
      <Loader2 className="animate-spin text-purple-300" size={80} />
    </div>
  );
}
