import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { Header } from "@/components/container/Header";
import { LocationFormOuter } from "./components/LocationFormOuter";

export default function CreateLocationPage() {
  return (
    <GuardedLayout>
      <HeadMetaData title="Catat Kategori" />
      <div className="flex flex-col gap-6 w-full">
        <Header
          title="Tambah Ruangan"
          subtitle="Isi form di bawah ini untuk menambahkan ruangan!"
        />

        <LocationFormOuter />
      </div>
    </GuardedLayout>
  );
}
