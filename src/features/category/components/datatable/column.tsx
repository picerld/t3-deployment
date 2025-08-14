"use client";

import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { type Category } from "@/types/category";
import { type ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./action-cell";

export function columns(
  onEdit: (category: Category) => void,
): ColumnDef<Category>[] {
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
      header: () => <div className="text-left text-base font-semibold">Id</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kategori" />
      ),
    },
    {
      accessorKey: "description",
      header: () => (
        <div className="text-left text-base font-semibold">Keterangan</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-justify text-pretty">
            {row.original.description ?? "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="text-left text-base font-semibold">Dibuat pada</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-justify text-pretty">
            {row.original.createdAt?.toLocaleDateString("id-ID", {
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
        <div className="text-center text-base font-semibold">Actions</div>
      ),
      cell: ({ row }) => {
        const category = row.original;

        return <ActionsCell onEdit={onEdit} category={category} />;
      },
    },
  ];
}
