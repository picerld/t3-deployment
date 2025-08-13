"use client";

import { trpc } from "@/utils/trpc";
import { ItemCard } from "./ItemsCard";

export const ItemsCardContainer = () => {
  const { data: items, isLoading } = trpc.items.getPaginated.useQuery({
    perPage: 5,
  });

  if (isLoading) return <div>Mohon tunggu sebentar ya...</div>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {items?.data.map((item) => (
        <ItemCard
          key={item.id}
          title={item.name}
          total={item.quantity}
          username={item.user.name ?? "Unknown"}
          detailHref={`/items/${item.id}`}
        />
      ))}
    </div>
  );
};
