import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { Header } from "@/components/container/Header";
import { LocationFormOuter } from "./components/LocationFormOuter";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function CreateLocationPage() {
  return (
    <GuardedLayout>
      <Link
        href="/locations"
        className={buttonVariants({ variant: "default", className: "mb-5" })}
      >
        <ChevronLeft className="!size-5" strokeWidth={2.5} /> Kembali
      </Link>
      <HeadMetaData title="Catat Kategori" />
      <div className="flex w-full flex-col gap-6">
        <Header
          title="Tambah Ruangan"
          subtitle="Isi form di bawah ini untuk menambahkan ruangan!"
        />

        <LocationFormOuter />
      </div>
    </GuardedLayout>
  );
}
