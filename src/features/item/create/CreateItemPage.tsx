import { Header } from "@/components/container/Header";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { ItemFormOuter } from "./components/ItemFormOuter";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function CreateItemPage() {
  return (
    <GuardedLayout>
      <HeadMetaData title="Catat Barang" />
      <Link
        href="/items"
        className={buttonVariants({ variant: "default", className: "mb-5" })}
      >
        <ChevronLeft className="!size-5" strokeWidth={2.5} /> Kembali
      </Link>

      <Header
        title="Pencatatan Barang"
        subtitle="Isi form di bawah ini untuk melakukan pencatatan barang!"
      />

      <ItemFormOuter />
    </GuardedLayout>
  );
}
