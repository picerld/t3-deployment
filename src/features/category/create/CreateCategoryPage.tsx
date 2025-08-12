import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { CategoryFormOuter } from "./components/CategoryFormOuter";
import { Header } from "@/components/container/Header";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function CreateCategoryPage() {
  return (
    <GuardedLayout>
      <Link
        href="/categories"
        className={buttonVariants({ variant: "default", className: "mb-5" })}
      >
        <ChevronLeft className="!size-5" strokeWidth={2.5} /> Kembali
      </Link>
      <HeadMetaData title="Tambah Kategori" />
      <div className="flex flex-col gap-6 w-full">
        <Header
          title="Tambah Kategori"
          subtitle="Isi form di bawah ini untuk menambahkan kategori!"
        />

        <CategoryFormOuter />
      </div>
    </GuardedLayout>
  );
}
