"use client";
import React from "react";

// table-lib
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";

// components
import { Table, TableBody, TableCell, TableHead, TableHeader, TablePagination, TableRow } from "@/components/ui/table";

// helper
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  pageSize?: number;
  classNameArea?: string;
}

function DataTable<TData extends object>({ columns, data, pageSize = 8, classNameArea }: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize, pageIndex: 0 } },
  });

  const page = table.getRowModel().rows;

  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
  const start = pageIndex * currentPageSize + 1;
  const end = Math.min((pageIndex + 1) * currentPageSize, data.length);

  return (
    <div className="mx-6 overflow-hidden">
      <div className={cn(classNameArea, "h-[445px] overflow-x-auto")}>
        <div className="min-w-max">
          <Table>
            <TableHeader className="bg-[#f3f5f7] dark:bg-[#1D1D27] sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-gray-500 dark:text-gray-100 py-2 text-sm whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {page.length ? (
                page.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-black dark:text-gray-400 py-3 font-medium text-sm capitalize">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-wrap max-[481px]:justify-center max-[481px]:gap-2 justify-between items-center py-2 px-4 bg-gray-100 dark:bg-[#1D1D27] border-t">
        <span className="text-gray-700 dark:text-gray-300 text-sm">
          Showing {start}-{end} of {data.length} items
        </span>
        {data.length > 0 && <TablePagination table={table} className="justify-end w-fit mx-0" />}
      </div>
    </div>
  );
}

export default React.memo(DataTable);
