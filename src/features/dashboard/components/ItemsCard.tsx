import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Item } from "@/types/item";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const ownerVariant = item.ownerType == "SEGARIS" ? "default" : "neutral";
  let conditionVariant: "default" | "destructive" | "neutral" = "default";

  switch (item.condition) {
    case "BAIK":
      conditionVariant = "default";
      break;
    case "RUSAK":
      conditionVariant = "destructive";
      break;
    case "PERBAIKAN":
      conditionVariant = "neutral";
      break;
  }

  return (
    <Card className="shadow-shadow overflow-hidden">
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="space-y-4">
          <p className="flex justify-end text-sm font-semibold">
            {item.updatedAt.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="flex justify-between">
            <h1 className="text-3xl font-semibold">
              {item.name} {item.merk}
            </h1>
            <div className="flex gap-2">
              <Badge variant={conditionVariant} className="h-6">
                {item.condition}
              </Badge>
              <Badge variant={ownerVariant} className="h-6">
                {item.ownerType}
              </Badge>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="text-base font-medium">
                Serial Number: {item.serialNumber}
              </p>
              <p className="text-lg font-medium">
                Total Barang: {item.quantity} unit
              </p>
            </div>
            <p className="text-base font-semibold">{item.user?.name}</p>
          </div>
        </div>
        <Button asChild className="mt-7 w-full">
          <Link href={`/items/${item.id}`}>Lihat selengkapnya!!</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
