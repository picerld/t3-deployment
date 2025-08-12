"use client";

import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./action-cell";
import { type Location } from "@/types/location";

export const columns: ColumnDef<Location>[] = [
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
    header: () => <div className="text-left font-semibold text-base">Id</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ruangan" />
    ),
  },
  {
    accessorKey: "description",
    header: () => (
      <div className="text-left font-semibold text-base">Keterangan</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="text-justify text-pretty">
          {row.original.description}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="text-left font-semibold text-base">Dibuat pada</div>
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
    header: () => <div className="text-center font-semibold text-base">Actions</div>,
    cell: ({ row }) => {
      const location = row.original;

      return <ActionsCell location={location} />;
    },
  },
];
