"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { PaginationResult } from "@/types";
import api from "@/util/api";
import { useEffect } from "react";
import { AxiosResponse } from "axios";
import PaginationControls from "../PaginationControls";
interface GameSessionTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initialData: TData[];
  apiUrl: string;
}

export default function GameSessionsTable<TData, TValue>({
  columns,
  initialData,
  apiUrl,
}: GameSessionTableProps<TData, TValue>) {
  const [data, setData] = React.useState<TData[]>(initialData);
  const [pageCount, setPageCount] = React.useState(0);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "recent_blob_pull", desc: true },
  ]);
  const [loading, setLoading] = React.useState(false);

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
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),


    // getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("page", (pagination.pageIndex + 1).toString());
        queryParams.set("limit", pagination.pageSize.toString());
        if (sorting.length > 0) {
          // Only using the first sort criterion for now
          queryParams.set("sortBy", sorting[0].id);
          queryParams.set("sortOrder", sorting[0].desc ? "DESC" : "ASC");
        }

        const res: AxiosResponse<PaginationResult<TData>> = await api().get(apiUrl, {
          params: queryParams,
        });
        setData(res.data.data);
        setPageCount(res.data.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally, set an error state to display a message in the UI
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination, sorting]);

  return (
    <div className="lg:rounded-lg bg-white h-full max-w-[1200px] mx-auto lg:mb-4">
      <Table className="overflow-x-visible">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // Sorting helpers:
                const canSort = header.column.getCanSort();
                const isSorted = header.column.getIsSorted();
                const sortHandler = header.column.getToggleSortingHandler();

                return (
                  <TableHead
                    key={header.id}
                    className={`px-3 md:px-5 py-3  whitespace-nowrap 
                      ${canSort ? "cursor-pointer select-none" : ""}`}
                    onClick={canSort ? sortHandler : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center space-x-1">
                        {/* The actual header label */}
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {/* Sort indicator */}
                        {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
                        {isSorted === "desc" && (
                          <ArrowDown className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-3 md:px-5 py-3 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
      {
        pageCount > 1 && (
          <PaginationControls pageCount={pageCount} setPageIndex={table.setPageIndex} setPageSize={(num) => table.setPageSize(num)} nextPage={table.nextPage} previousPage={table.previousPage} pageIndex={pagination.pageIndex + 1} pageSize={pagination.pageSize} />
        )
      }
    </div>
  );
}
