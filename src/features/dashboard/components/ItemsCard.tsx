import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ItemCardProps {
  title: string;
  username: string;
  total: number;
  detailHref: string;
}

export function ItemCard({
  title,
  username,
  total,
  detailHref,
}: ItemCardProps) {
  return (
    <Card className="shadow-shadow overflow-hidden">
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="space-y-4">
          <div className="flex justify-between">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <Badge className="h-6">Segaris</Badge>
          </div>
          <div className="flex justify-between">
            <p className="text-lg font-medium">Total Barang: {total} unit</p>
            <p className="text-base font-semibold">{username}</p>
          </div>
        </div>
        <Button asChild className="mt-7 w-full">
          <Link href={detailHref}>Lihat selengkapnya!!</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
