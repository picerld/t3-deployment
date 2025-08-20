import { Header } from "@/components/container/Header";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { UserDatatable } from "./components/datatable/user-datatable";

export default function UserPage() {
  return (
    <GuardedLayout>
      <HeadMetaData title="Data User" />
      <Header
        title="Data User"
        subtitle="Orang yang terdaftar dalam pencatatan barang."
      >
        <Link
          href={"/users/create"}
          className={buttonVariants({ variant: "default" })}
        >
          Tambah User <Plus className="size-14" strokeWidth={3} />
        </Link>
      </Header>

      <div className="w-full">
        <UserDatatable />
      </div>
    </GuardedLayout>
  );
}
