import { Header } from "@/components/container/Header";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ItemDatatable } from "./components/datatable/item-datatable";
import { ItemStatsCard } from "./components/ItemStatsCard";

export default function ItemPage() {
  return (
    <GuardedLayout>
      <HeadMetaData title="Data Barang" />
      <Header
        title="Data Barang"
        subtitle="Barang yang sudah tercatat dalam sistem."
      >
        <Link
          href={"/items/create"}
          className={buttonVariants({ variant: "default" })}
        >
          Catat Barang <Plus className="size-14" strokeWidth={3} />
        </Link>
      </Header>

      <ItemStatsCard />

      <div className="w-full">
        <ItemDatatable />
      </div>
    </GuardedLayout>
  );
}
