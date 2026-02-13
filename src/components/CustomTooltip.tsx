"use client";

// components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CustomTooltipProps {
  title: string;
  children: React.ReactNode;
}

const CustomTooltip = ({ title, children }: CustomTooltipProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default CustomTooltip;
