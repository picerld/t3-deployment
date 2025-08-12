"use client";

import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./action-cell";
import { type Item } from "@/types/item";
import { Badge } from "@/components/ui/badge";

export const columns = (meta: {
  page: number;
  perPage: number;
  search: string;
}): ColumnDef<Item>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="mr-2"
        />
      ),
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: () => <div className="text-left font-semibold text-base">#</div>,
      cell: ({ row }) => (
        <p className="text-center">
          {meta
            ? (meta.page - 1) * meta.perPage + row.index + 1
            : row.index + 1}
        </p>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Barang" />
      ),
    },
    {
      accessorKey: "quantity",
      header: () => (
        <div className="text-left font-semibold text-base">Kuantiti</div>
      ),
    },
    {
      accessorKey: "merk",
      header: () => (
        <div className="text-left font-semibold text-base">Merk</div>
      ),
    },
    {
      accessorKey: "condition",
      header: () => (
        <div className="text-left font-semibold text-base">Kondisi</div>
      ),
      cell: ({ row }) => {
        switch (row.original.condition) {
          case "BAIK":
            return <Badge variant="default">{row.original.condition}</Badge>;
          case "PERBAIKAN":
            return <Badge variant="neutral">{row.original.condition}</Badge>;
          case "RUSAK":
            return (
              <Badge variant="destructive">{row.original.condition}</Badge>
            );
        }
      },
    },
    {
      accessorKey: "category.name",
      header: () => (
        <div className="text-left font-semibold text-base">Kategori</div>
      ),
      cell: ({ row }) => {
        return <Badge>{row.original.category?.name}</Badge>;
      },
    },
    {
      accessorKey: "user.name",
      header: () => (
        <div className="text-left font-semibold text-base">PIC</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-justify text-pretty font-semibold">
            {row.original?.user?.name ?? row.original?.user?.username}
          </div>
        );
      },
    },
    {
      accessorKey: "ownerType",
      header: () => (
        <div className="text-left font-semibold text-base">Kepemilikan</div>
      ),
      cell: ({ row }) => {
        const ownerVariant =
          row.original.ownerType == "SEGARIS" ? "default" : "neutral";
        return <Badge variant={ownerVariant}>{row.original.ownerType}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="text-left font-semibold text-base">Tercatat pada</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-justify text-pretty">
            {row.original.createdAt.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => (
        <div className="text-center font-semibold text-base">Actions</div>
      ),

      cell: ({ row }) => {
        const item = row.original;

        return <ActionsCell item={item} />;
      },
    },
  ];
};
