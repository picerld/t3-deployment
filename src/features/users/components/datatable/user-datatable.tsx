"use client";

import { columns } from "./column";
import { DataTable } from "./data-table";
import { trpc } from "@/utils/trpc";
import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTablePagination } from "@/components/datatable/data-table-pagination";
import useDebounce from "@/hooks/use-debounce";
import type { User } from "@/types/user";
import { UserUpdateFormOuter } from "../../update/components/UserUpdateFormOuter";
import { UserPasswordUpdateFormOuter } from "../../update/components/UserPasswordUpdateFormOuter";
import { handleTrpcErroruNauthorized } from "@/utils/handleTRPCErrorUnauthorized";

export function UserDatatable() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(5);
  const [search, setSearch] = useState<string>("");

  React.useEffect(() => {
    setPage(Number(searchParams.get("page")) || 1);
    setPerPage(Number(searchParams.get("perPage")) || 5);
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  const debouncedSearch = useDebounce(search, 1000);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPasswordUser, setSelectedPasswordUser] = useState<User | null>(
    null,
  );

  const handleEdit = (user: User) => {
    setSelectedUser(user);
  };

  const handlePassword = (user: User) => {
    setSelectedPasswordUser(user);
  };

  const { data, isLoading, error } = trpc.users.getPaginated.useQuery(
    { page, perPage, search: debouncedSearch },
    {
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    },
  );

  if (isLoading) {
    return <div className="py-4">Mohon tunggu sebentar ya...</div>;
  }

  if (error) handleTrpcErroruNauthorized(error);

  if (!data) return <div>No data</div>;

  const tableData: User[] = data.data.map((item) => ({
    ...item,
    password: item.password ?? undefined,
    username: item.username ?? undefined,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  }));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const params = new URLSearchParams(searchParams);
    params.set("search", e.target.value);
    params.set("page", "1");
    router.push(`${pathName}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    params.set("perPage", String(perPage));
    if (search) params.set("search", search);
    router.push(`${pathName}?${params.toString()}`);
  };

  const handlePerPageChange = (newPerPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("perPage", String(newPerPage));
    params.set("page", "1");
    if (search) params.set("search", search);
    router.push(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="w-sm overflow-x-auto py-10 sm:w-full">
      <DataTable
        search={search}
        columns={columns(handleEdit, handlePassword)}
        data={tableData}
        isLoading={isLoading}
        handleSearch={handleSearchChange}
      />

      <DataTablePagination
        currentPage={data.meta.currentPage}
        lastPage={data.meta.lastPage}
        perPage={data.meta.perPage}
        totalItems={data.meta.totalItems}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />

      {selectedUser && (
        <UserUpdateFormOuter
          userId={selectedUser.id}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {selectedPasswordUser && (
        <UserPasswordUpdateFormOuter
          userId={selectedPasswordUser.id}
          open={!!selectedPasswordUser}
          onClose={() => setSelectedPasswordUser(null)}
        />
      )}
    </div>
  );
}
