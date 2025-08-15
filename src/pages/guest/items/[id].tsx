import { PageContainer } from "@/components/container/PageContainer";
import { buttonVariants } from "@/components/ui/button";
import { ItemGuestDetail } from "@/features/guest/item/detail/ItemGuestDetail";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  if (!id) return null;

  return (
    <PageContainer isGuarded={false}>
      <div className="mx-5 mt-32 md:mx-10 lg:mx-32">
        <Link
          href="/guest/items"
          className={buttonVariants({ variant: "default", className: "mb-5" })}
        >
          <ChevronLeft className="!size-5" strokeWidth={2.5} /> Kembali lihat
          barang
        </Link>

        <ItemGuestDetail id={id} />
      </div>
    </PageContainer>
  );
}
