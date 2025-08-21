"use client";

import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./action-cell";
import type { User } from "@/types/user";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function columns(
  onEdit: (user: User) => void,
  onPassword: (user: User) => void,
): ColumnDef<User>[] {
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
        <DataTableColumnHeader column={column} title="Nama" />
      ),
    },
    {
      accessorKey: "username",
      header: () => (
        <div className="text-left text-base font-semibold">Username</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-justify text-pretty">
            {row.original.username}
          </div>
        );
      },
    },
    {
      accessorKey: "role.name",
      header: () => (
        <div className="text-left text-base font-semibold">Role</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-justify text-pretty">
            <Badge
              variant={
                row.original.role?.name == "admin" ? "default" : "neutral"
              }
            >
              {row.original.role?.name}
            </Badge>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "password",
    //   header: () => (
    //     <div className="text-left text-base font-semibold">Password</div>
    //   ),
    //   cell: ({ row }) => {
    //     const [show, setShow] = useState(false);

    //     const realPassword = decodeURIComponent(row.original.password || "");

    //     return (
          // <div className="flex items-center gap-2">
          //   <span className="font-mono">
          //     {show
          //       ? realPassword
          //       : "•".repeat(row.original?.password?.length ?? 0)}
          //   </span>
          //   <button
          //     type="button"
          //     onClick={() => setShow(!show)}
          //     className="text-gray-500 hover:text-black"
          //   >
          //     {show ? <EyeOff size={16} /> : <Eye size={16} />}
          //   </button>
          // </div>
    //     );
    //   },
    // },
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
        const user = row.original;

        return (
          <ActionsCell user={user} onEdit={onEdit} onPassword={onPassword} />
        );
      },
    },
  ];
}
