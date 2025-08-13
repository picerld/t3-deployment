import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { DashboardStatsCard } from "./components/DashboardStatsCard";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ItemsCardContainer } from "./components/ItemsCardContainer";

export default function DashboardPage() {
  return (
    <GuardedLayout>
      <HeadMetaData title="Dashboard" />
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2 pb-5">
          <h1 className="text-4xl font-bold">Dashboard Kamu</h1>
          <p className="truncate text-lg">Overview barang!</p>
        </div>

        <DashboardStatsCard />

        <div className="flex flex-col justify-between pt-10 sm:flex-row">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold sm:text-4xl">
              Catatan Barang Terbaru
            </h1>
            <p className="truncate text-lg">Jangan lupa cek kondisi barang!</p>
          </div>
          <Link
            href={"/items/create"}
            className={buttonVariants({
              variant: "default",
              className: "my-3 sm:my-0 font-semibold",
            })}
          >
            Catat Barang
            <Plus className="size-14" strokeWidth={3} />
          </Link>
        </div>

        <ItemsCardContainer />
      </div>
    </GuardedLayout>
  );
}
