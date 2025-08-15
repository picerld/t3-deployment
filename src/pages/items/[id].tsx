import GuardedLayout from "@/components/layout/GuardedLayout";
import { buttonVariants } from "@/components/ui/button";
import { DetailItemContainer } from "@/features/item/detail/DetailItemContainer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  if (!id) return null;

  return (
    <GuardedLayout>
      <Link
        href="/dashboard"
        className={buttonVariants({
          variant: "default",
          className: "mb-6 gap-2 hover:bg-gray-50",
        })}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        Kembali ke Dashboard
      </Link>

      <DetailItemContainer id={id} />
    </GuardedLayout>
  );
}
