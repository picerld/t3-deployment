import GuardedLayout from "@/components/layout/GuardedLayout";
import { buttonVariants } from "@/components/ui/button";
import { DetailItemContainer } from "@/features/item/detail/DetailItemContainer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PrintLabelContainer } from "@/features/item/detail/label-section/PrintLabelContainer";
import { PrintSerahTerimaContainer } from "@/features/item/detail/serah-terima-section/PrintSerahTerimaContainer";

export default function Page() {
  const router = useRouter();

  const id = router.query.id as string;

  if (!id) return null;

  return (
    <GuardedLayout>
      <div className="flex justify-between">
        <Link
          href="/dashboard"
          className={buttonVariants({
            variant: "default",
            className: "mb-6 gap-2 hover:bg-gray-50",
          })}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          Kembali ke Dashboard
        </Link>

        <div className="flex gap-3">
          <PrintLabelContainer id={id} />

          <PrintSerahTerimaContainer itemId={id} />
        </div>
      </div>

      <DetailItemContainer id={id} />
    </GuardedLayout>
  );
}
