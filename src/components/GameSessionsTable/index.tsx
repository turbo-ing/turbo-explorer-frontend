"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

import { Button } from "../ui/button"

interface GameSessionTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function GameSessionsTable<TData, TValue>({
  columns,
  data,
}: GameSessionTableProps<TData, TValue>) {
  // State to manage sorting
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "created_at", desc: true }])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      // pagination: {
      //   pageIndex: 0, 
      //   pageSize: 10,
      // },
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="lg:rounded-lg bg-white h-full max-w-[1200px] mx-auto lg:mb-4">
      <Table className="overflow-x-visible">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // Sorting helpers:
                const canSort = header.column.getCanSort()
                const isSorted = header.column.getIsSorted()
                const sortHandler = header.column.getToggleSortingHandler()

                return (
                  <TableHead
                    key={header.id}
                    className={`px-3 md:px-5 py-3  whitespace-nowrap 
                      ${
                      canSort ? "cursor-pointer select-none" : ""
                    }`}
                    onClick={canSort ? sortHandler : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : (
                          <div className="flex items-center space-x-1">
                            {/* The actual header label */}
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                            {/* Sort indicator */}
                            {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
                            {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
                          </div>
                        )
                    }
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-3 md:px-5 py-3 whitespace-nowrap"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Page Controls */}
      <div className="flex flex-row border-t justify-between px-2">
        {/* Pagination Controls */}
        <div className="flex items-center justify-center space-x-2 p-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center justify-center p-2 space-x-2 text-sm">
          <span>Page Size:</span>
          <select
            className="border rounded px-2 py-1"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[5, 10, 20, 30].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}