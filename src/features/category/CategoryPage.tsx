import { Header } from "@/components/container/Header";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CategoryDatatable } from "./components/datatable/category-datatable";
import { CategoryStatsCard } from "./components/CategoryStatsCard";

export default function CategoryPage() {
  return (
    <GuardedLayout>
      <HeadMetaData title="Data Kategori" />
      <Header
        title="Data Kategori"
        subtitle="Kategori barang yang digunakan dalam pencatatan barang."
      >
        <Link
          href={"/categories/create"}
          className={buttonVariants({ variant: "default" })}
        >
          Tambah Kategori <Plus className="size-14" strokeWidth={3} />
        </Link>
      </Header>

      <CategoryStatsCard />

      <div className="w-full">
        <CategoryDatatable />
      </div>
    </GuardedLayout>
  );
}
