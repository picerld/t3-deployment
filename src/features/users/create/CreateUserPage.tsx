import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { Header } from "@/components/container/Header";
import { UserFormOuter } from "./components/UserFormOuter";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function CreateUserPage() {
  return (
    <GuardedLayout>
      <Link
        href="/users"
        className={buttonVariants({ variant: "default", className: "mb-5" })}
      >
        <ChevronLeft className="!size-5" strokeWidth={2.5} /> Kembali
      </Link>
      <HeadMetaData title="Bikin User" />
      <div className="flex w-full flex-col gap-6">
        <Header
          title="Bikin User Baru"
          subtitle="Isi form di bawah ini untuk menambahkan data user baru!"
        />
        <UserFormOuter />
      </div>
    </GuardedLayout>
  );
}
