import { Header } from "@/components/container/Header";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { LocationDatatable } from "./components/datatable/location-datatable";
import { LocationStatsCard } from "./components/LocationStatsCard";

export default function LocationPage() {
  return (
    <GuardedLayout>
      <HeadMetaData title="Data Ruangan" />
      <Header
        title="Data Ruangan"
        subtitle="Ruangan yang digunakan dalam pencatatan barang."
      >
        <Link
          href={"/locations/create"}
          className={buttonVariants({ variant: "default" })}
        >
          Tambah Ruangan <Plus className="size-14" strokeWidth={3} />
        </Link>
      </Header>

      <LocationStatsCard />

      <div className="w-full">
        <LocationDatatable />
      </div>
    </GuardedLayout>
  );
}
