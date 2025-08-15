import GuardedLayout from "@/components/layout/GuardedLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { DetailItemContainer } from "@/features/item/detail/DetailItemContainer";
import { ChevronLeft, Printer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

export default function Page() {
  const router = useRouter();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

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

        <Button
          onClick={() => {
            toast.success("Sukses!!", {
              description: "Data barang berhasil di print.",
            });
            reactToPrintFn();
          }}
        >
          <Printer className="mr-2 h-5 w-5" strokeWidth={2.5} />
          Klik untuk print!
        </Button>
      </div>

      {/* <div
        ref={contentRef}
        className="flex h-20 w-20 items-center justify-center"
      >
        <h1>test</h1>
      </div> */}

      <DetailItemContainer id={id} />
    </GuardedLayout>
  );
}
