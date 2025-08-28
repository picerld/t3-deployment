"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
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
import React from "react";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/datatable/data-table-view-option";
import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/utils/trpc";
import { ExportOption } from "./export-option";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search: string;
  pic: string;
  category: string;
  condition: string;
  owner: string;
  isLoading: boolean;
  handleSearchPic: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCategoryChange: (category: string) => void;
  handleOwnerChange: (owner: string) => void;
  handleConditionChange: (condition: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  search,
  pic,
  category,
  condition,
  owner,
  isLoading,
  handleSearch,
  handleSearchPic,
  handleOwnerChange,
  handleCategoryChange,
  handleConditionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const { data: categories, isLoading: isLoadingCategories } =
    trpc.categories.getAll.useQuery(undefined, {});

  return (
    <>
      <div className="flex flex-col items-center justify-between gap-4 pb-5 sm:flex-row">
        <div className="flex gap-3">
          <Input
            placeholder="Cari barang kamu..."
            value={search}
            onChange={handleSearch}
            className="w-full sm:max-w-xs"
          />
          <Input
            placeholder="Cari nama pic..."
            value={pic}
            onChange={handleSearchPic}
            className="w-full sm:max-w-xs bg-main placeholder:text-black"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Select value={condition} onValueChange={handleConditionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Kondisi" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem key={"BAIK"} value={"BAIK"}>
                  Baik
                </SelectItem>
                <SelectItem key={"RUSAK"} value={"RUSAK"}>
                  Rusak
                </SelectItem>
                <SelectItem key={"PERBAIKAN"} value={"PERBAIKAN"}>
                  Perbaikan
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={owner} onValueChange={handleOwnerChange}>
            <SelectTrigger>
              <SelectValue placeholder="Kepemilikan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem key={"SEGARIS"} value={"SEGARIS"}>
                  Segaris
                </SelectItem>
                <SelectItem key={"IMN"} value={"IMN"}>
                  IMN
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Semua</SelectItem>
                {isLoadingCategories ? (
                  <Loader className="animate-spin" />
                ) : (
                  categories?.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <ExportOption table={table} />
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="even:bg-main/10"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="py-3" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Oops, kayanya tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
              <Loader className="size-6 animate-spin" />
              <p className="ml-2 text-base font-normal">Loading ...</p>
            </div>
          )}
        </Table>
      </div>
    </>
  );
}
