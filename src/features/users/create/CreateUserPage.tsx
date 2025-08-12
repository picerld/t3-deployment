import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { Header } from "@/components/container/Header";
import { UserFormOuter } from "./components/UserFormOuter";

export default function CreateUserPage() {
  return (
    <GuardedLayout>
      <HeadMetaData title="Bikin User" />
      <div className="flex flex-col gap-6 w-full">
        <Header
          title="Bikin User Baru"
          subtitle="Isi form di bawah ini untuk menambahkan data user baru!"
        />
        <UserFormOuter />
      </div>
    </GuardedLayout>
  );
}
