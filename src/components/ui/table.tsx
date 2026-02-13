"use client";

import * as React from "react";

// helper
import { cn } from "@/lib/utils";

// components
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "./pagination";
import { Button } from "./button";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr data-slot="table-row" className={cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className)} {...props} />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("text-muted-foreground mt-4 text-sm", className)} {...props} />;
}

function TablePagination({ table, className }: any) {
  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <Button
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            className={!table.getCanPreviousPage() ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ChevronLeft />
          </Button>
        </PaginationItem>

        {Array.from({ length: table.getPageCount() }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink onClick={() => table.setPageIndex(i)} isActive={table.getState().pagination.pageIndex === i}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            className={cn(!table.getCanNextPage() ? "opacity-50 cursor-not-allowed" : "")}
          >
            <ChevronRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, TablePagination };
