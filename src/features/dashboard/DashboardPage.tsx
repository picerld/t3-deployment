import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <GuardedLayout>
      <HeadMetaData title="Dashboard" />
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col pb-5 gap-2">
          <h1 className="text-4xl font-bold">Dashboard Kamu</h1>
          <p className="text-lg truncate">Overview barang!</p>
        </div>

        <div className="flex sm:flex-row flex-col justify-between w-full">
          <Card className="sm:w-[350px] w-full">
            <CardTitle className="px-5 text-xl">Total Barang</CardTitle>
            <CardContent className="text-lg">200</CardContent>
          </Card>

          <div className="flex gap-3 sm:pt-0 pt-5">
            <Card className="sm:w-[250px] w-1/2">
              <CardTitle className="px-5 text-xl">Total User</CardTitle>
              <CardContent className="text-lg">30</CardContent>
            </Card>
            <Card className="sm:w-[250px] w-1/2">
              <CardTitle className="px-5 text-xl">Total User</CardTitle>
              <CardContent className="text-lg">30</CardContent>
            </Card>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col justify-between pt-10">
          <div className="flex flex-col gap-2">
            <h1 className="sm:text-4xl text-2xl font-bold">
              Catatan Barang Terbaru
            </h1>
            <p className="text-lg truncate">Jangan lupa cek kondisi barang!</p>
          </div>
          <Link
            href={"/items/create"}
            className={buttonVariants({
              variant: "default",
              className: "sm:my-0 my-3",
            })}
          >
            Catat Barang
            <Plus className="size-14" strokeWidth={3} />
          </Link>
        </div>
      </div>
    </GuardedLayout>
  );
}
