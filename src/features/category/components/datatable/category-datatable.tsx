"use client";

import { type Category } from "@/types/category";
import { columns } from "./column";
import { DataTable } from "./data-table";
import { trpc } from "@/utils/trpc";
import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTablePagination } from "@/components/datatable/data-table-pagination";
import useDebounce from "@/hooks/use-debounce";
import { CategoryUpdateFormOuter } from "../../update/CategoryUpdateFormOuter";

export function CategoryDatatable() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("perPage")) || 5;
  const searchFromUrl = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(searchFromUrl);
  const debouncedSearch = useDebounce(search, 1000);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const { data, isLoading } = trpc.categories.getPaginated.useQuery(
    { page, perPage, search: debouncedSearch },
    {
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    },
  );

  if (isLoading) {
    return <div className="py-4">Mohon tunggu sebentar ya...</div>;
  }

  if (!data) return <div>No data</div>;

  const tableData: Category[] = data.data.map((item) => ({
    ...item,
    description: item.description ?? undefined,
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
        columns={columns(setSelectedCategory)}
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

      {selectedCategory && (
        <CategoryUpdateFormOuter
          categoryId={selectedCategory.id}
          open={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}
