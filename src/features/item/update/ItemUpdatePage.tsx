import { Header } from "@/components/container/Header";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { ItemFormOuterUpdate } from "./components/ItemUpdateFormOuter";
import Link from "next/link";
import { ChevronLeft, PanelsTopLeft, Printer } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";

export default function ItemDetailPage({
  params,
}: {
  readonly params: { id: string };
}) {
  return (
    <GuardedLayout>
      <div className="flex justify-between gap-3">
        <Link
          href="/items"
          className={buttonVariants({ variant: "default", className: "mb-5" })}
        >
          <ChevronLeft className="!size-5" strokeWidth={2.5} /> Kembali
        </Link>
        <div className="flex gap-3">
          <Link
            href={`/items/${params.id}`}
            className={buttonVariants({
              variant: "neutral",
              className: "mb-5",
            })}
          >
            <PanelsTopLeft className="!size-5" strokeWidth={2.5} /> Lihat dalam
            card
          </Link>
          <Button
            onClick={() => {
              toast.success("Sukses!!", {
                description: "Data barang berhasil di print.",
              });
            }}
          >
            <Printer className="!size-5" strokeWidth={2.5} />
            Print
          </Button>
        </div>
      </div>
      <HeadMetaData title="Edit Data Barang" />
      <Header
        title="Edit Data Barang"
        subtitle="Ubah data barang yang sudah tercatat."
      />
      <ItemFormOuterUpdate id={params.id} />
    </GuardedLayout>
  );
}
