//components
import { Card, CardContent, CardHeader } from "@/components/ui/card";

//helper-function
import { cn } from "@/lib/utils";

export interface MenuCardProps {
  title?: string;
  color?: string;
  subCat?: string;
  className?: string;
  numbers?: number;
  icon?: React.ReactNode;
}

const MenuCard = ({ title, color, numbers, icon, subCat, className }: MenuCardProps) => {
  return (
    <Card className={cn(className, "basis-[30%] mt-4 flex-1 items-start flex-row justify-between px-8")}>
      <div className="flex flex-col w-full gap-6">
        <CardHeader className="pl-0">
          <h4 className="text-xl text-gray-800 dark:text-gray-200 font-bold whitespace-nowrap text-ellipsis overflow-hidden">{title}</h4>
        </CardHeader>

        <CardContent className="pl-0">
          <main className="flex items-center justify-between">
            <div className="flex items-end gap-1">
              <p className="text-xl text-zinc-800 dark:text-gray-200 font-semibold">{numbers}</p>
              <span className="text-gray-400  text-sm font-semibold">{subCat}</span>
            </div>
          </main>
        </CardContent>
      </div>

      {icon && <div className={cn(color, "rounded-full text-white flex items-center justify-center p-5")}>{icon}</div>}
    </Card>
  );
};

export { MenuCard };
