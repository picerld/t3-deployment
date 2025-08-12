"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";

export const CategoryStatsCard = () => {
  const { data: categories, isLoading } = trpc.categories.getCount.useQuery(
    undefined,
    {}
  );
  const { data: items, isLoading: isLoadingItems } =
    trpc.items.getCount.useQuery(undefined, {});

  return (
    <div className="flex sm:flex-row flex-col justify-between w-full py-5 gap-5">
      <Card className="sm:w-[350px] w-full">
        <CardTitle className="px-5 text-xl">Total Kategori</CardTitle>
        <CardContent className="text-lg">
          {isLoading ? "Loading..." : categories}
        </CardContent>
      </Card>

      <div className="flex gap-3 sm:pt-0">
        <Card className="sm:w-[250px] w-full">
          <CardTitle className="px-5 text-xl">Barang Dicatat</CardTitle>
          <CardContent className="text-lg">
            {isLoadingItems ? "Loading..." : items}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
