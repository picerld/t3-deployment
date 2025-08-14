import { Header } from "@/components/container/Header";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";
import {
  ChevronLeft,
  Calendar,
  User,
  Palette,
  Hash,
  MapPin,
  Package,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-center gap-3 py-3 last:border-b-0">
      <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={2.5} />
      <div className="flex-1">
        <p className="text-base font-bold">{label}</p>
        <p className="text-lg font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  if (!id) return null;

  const { data: item, isLoading: isItemLoading } =
    trpc.items.getByIdWithRelation.useQuery({
      id,
    });

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

      {isItemLoading ? (
        <>
          <HeadMetaData title={"Detail Barang"} />
          <p className="text-lg">Mohon tunggu sebentar ya...</p>
        </>
      ) : (
        <>
          <HeadMetaData title={`${item?.name}`} />

          <div className="mb-3">
            <div className="mb-4 flex flex-wrap gap-3">
              <Badge variant="default">{item?.ownerType}</Badge>
              <Badge variant="default">{item?.condition}</Badge>
              <Badge variant="neutral">{item?.category.name}</Badge>
            </div>

            <Header
              title={`${item?.name} ${item?.merk || ""}`}
              subtitle="Detail lengkap barang yang tercatat dalam sistem"
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <img
                  src="https://placehold.co/800x600/f3f4f6/9ca3af?text=Foto+Barang"
                  alt={`Foto ${item?.name}`}
                  className="h-64 w-full rounded-lg border object-cover md:h-80 lg:h-96 xl:h-[28rem]"
                />
              </div>

              {item?.history && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <FileText className="h-5 w-5" strokeWidth={2.5} />
                      Riwayat & Deskripsi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-justify text-base leading-relaxed">
                      {item.history}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Package className="h-5 w-5" strokeWidth={2.5} />
                    Informasi Barang
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DetailItem
                    icon={Palette}
                    label="Warna"
                    value={item?.color}
                  />
                  <DetailItem
                    icon={Hash}
                    label="Jumlah"
                    value={`${item?.quantity || 0} unit`}
                  />
                  <DetailItem
                    icon={MapPin}
                    label="Lokasi"
                    value={item?.location.name}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Calendar className="h-5 w-5" strokeWidth={2.5} />
                    Informasi Pencatatan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DetailItem
                    icon={Calendar}
                    label="Tanggal Terupdate"
                    value={item?.updatedAt.toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  />
                  <DetailItem
                    icon={User}
                    label="Penanggung Jawab"
                    value={item?.user?.name}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link
                    href={`/items/edit/${id}`}
                    className={buttonVariants({
                      variant: "default",
                      className: "w-full",
                    })}
                  >
                    Edit Barang
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </GuardedLayout>
  );
}
