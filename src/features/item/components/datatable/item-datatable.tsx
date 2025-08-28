"use client";

import { columns } from "./column";
import { DataTable } from "./data-table";
import { DataTablePagination } from "@/components/datatable/data-table-pagination";
import { trpc } from "@/utils/trpc";
import useDebounce from "@/hooks/use-debounce";
import { type Item } from "@/types/item";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ItemDatatable() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(5);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [pic, setPic] = useState<string>("");

  useEffect(() => {
    setPage(Number(searchParams.get("page")) || 1);
    setPerPage(Number(searchParams.get("perPage")) || 5);
    setSearch(searchParams.get("search") ?? "");
    setCategory(searchParams.get("category") ?? "");
    setOwner(searchParams.get("owner") ?? "");
    setCondition(searchParams.get("condition") ?? "");
    setPic(searchParams.get("pic") ?? "");
  }, [searchParams]);

  const debouncedSearch = useDebounce(search, 800);

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    setPage(1);

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (owner) {
      params.set("owner", owner);
    } else {
      params.delete("owner");
    }

    if (condition) {
      params.set("condition", condition);
    } else {
      params.delete("condition");
    }

    if (pic) {
      params.set("pic", pic);
    } else {
      params.delete("pic");
    }

    params.set("perPage", String(perPage));

    router.replace(`${pathName}?${params.toString()}`);
  }, [debouncedSearch, category, perPage, owner, condition]);

  const { data, isLoading } = trpc.items.getPaginated.useQuery(
    {
      page,
      perPage,
      search: debouncedSearch,
      category,
      owner,
      condition,
      user: pic,
    },
    {
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
    },
  );

  if (isLoading) {
    return <div className="py-4">Mohon tunggu sebentar ya...</div>;
  }

  if (!data) return <div>No data</div>;

  const tableData: Item[] = data.data.map((item) => ({
    ...item,
    photo: item.photo ?? undefined,
    detail: item.detail ?? undefined,
    user: {
      ...item.user,
      username: item.user.username ?? undefined,
    },
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  }));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchPic = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPic(e.target.value);

    const params = new URLSearchParams(searchParams.toString());

    if (e.target.value) {
      params.set("pic", e.target.value);
    } else {
      params.delete("pic");
    }

    router.replace(`${pathName}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    params.set("perPage", String(perPage));
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    router.push(`${pathName}?${params.toString()}`);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    params.set("perPage", String(newPerPage));
    params.set("page", "1");
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory === "all" ? "" : newCategory);
  };

  const handleOwnerChange = (newOwner: string) => {
    setOwner(newOwner === "all" ? "" : newOwner);
  };

  const handleConditionChange = (newCondition: string) => {
    setCondition(newCondition === "all" ? "" : newCondition);
  };

  return (
    <div className="w-sm overflow-x-auto py-10 sm:w-full">
      <DataTable
        data={tableData}
        search={search}
        pic={pic}
        category={category}
        condition={condition}
        owner={owner}
        isLoading={isLoading}
        handleSearchPic={handleSearchPic}
        handleSearch={handleSearchChange}
        handleOwnerChange={handleOwnerChange}
        handleCategoryChange={handleCategoryChange}
        handleConditionChange={handleConditionChange}
        columns={columns({ page, perPage, search })}
      />

      <DataTablePagination
        currentPage={data.meta.currentPage}
        lastPage={data.meta.lastPage}
        perPage={data.meta.perPage}
        totalItems={data.meta.totalItems}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </div>
  );
}
