import { cn } from "@/lib/utils";

export interface CellHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const CellHeader = ({ children, className }: CellHeaderProps) => {
  return <div className={cn("text-center", className)}>{children}</div>;
};

const CellRow = ({ children, className }: CellHeaderProps) => {
  return <div className={cn("text-center", className)}>{children}</div>;
};

export { CellHeader, CellRow };
