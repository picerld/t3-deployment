"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";

export const LocationStatsCard = () => {
  const { data: categories, isLoading } = trpc.locations.getCount.useQuery(
    undefined,
    {}
  );

  return (
    <div className="flex sm:flex-row flex-col justify-between w-full py-5 gap-5">
      <Card className="sm:w-[350px] w-full">
        <CardTitle className="px-5 text-xl">Total Ruangan</CardTitle>
        <CardContent className="text-lg">
          {isLoading ? "Loading..." : categories}
        </CardContent>
      </Card>
    </div>
  );
};
