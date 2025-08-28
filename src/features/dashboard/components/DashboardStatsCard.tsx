"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";

export const DashboardStatsCard = () => {
  const { data: items, isLoading: isLoadingItems } =
    trpc.items.getCount.useQuery(undefined, {});

  const { data: users, isLoading: isLoadingUsers } =
    trpc.users.getUserWithAccount.useQuery(undefined, {});

  const { data: guest, isLoading: isLoadingGuest } =
    trpc.users.getUserWithoutAccount.useQuery(undefined, {});

  return (
    <div className="flex w-full flex-col justify-between sm:flex-row">
      <Card className="w-full sm:w-[350px]">
        <CardTitle className="px-5 text-xl">Pencatatan Barang</CardTitle>
        <CardContent className="text-lg">
          {isLoadingItems ? "Loading..." : items}
        </CardContent>
      </Card>

      <div className="flex gap-3 pt-5 sm:pt-0">
        <Card className="w-1/2 sm:w-[250px]">
          <CardTitle className="px-5 text-xl">User dengan Akun</CardTitle>
          <CardContent className="text-lg">
            {isLoadingUsers ? "Loading..." : users}
          </CardContent>
        </Card>
        <Card className="w-1/2 sm:w-[250px]">
          <CardTitle className="px-5 text-xl">Pegawai</CardTitle>
          <CardContent className="text-lg">
            {isLoadingGuest ? "Loading..." : guest}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
