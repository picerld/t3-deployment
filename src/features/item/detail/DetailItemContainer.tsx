import { Header } from "@/components/container/Header";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import {
  Calendar,
  User,
  Palette,
  Hash,
  MapPin,
  Package,
  FileText,
} from "lucide-react";
import { DetailItemCard } from "./DetailItemCard";
import Link from "next/link";

export const DetailItemContainer = ({ id }: { id: string }) => {
  const { data: item, isLoading: isItemLoading } =
    trpc.items.getByIdWithRelation.useQuery({
      id,
    });

  if (isItemLoading) {
    return (
      <>
        <HeadMetaData title={"Detail Barang"} />
        <p className="text-lg">Mohon tunggu sebentar ya...</p>
      </>
    );
  }

  return (
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
              className="h-64 w-full rounded-lg border-2 object-cover md:h-80 lg:h-96 xl:h-[28rem]"
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
              <DetailItemCard
                icon={Palette}
                label="Warna"
                value={item?.color}
              />
              <DetailItemCard
                icon={Hash}
                label="Jumlah"
                value={`${item?.quantity || 0} unit`}
              />
              <DetailItemCard
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
              <DetailItemCard
                icon={Calendar}
                label="Tanggal Terupdate"
                value={item?.updatedAt.toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <DetailItemCard
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
  );
};
