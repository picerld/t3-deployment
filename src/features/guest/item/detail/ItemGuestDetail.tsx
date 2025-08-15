import { Header } from "@/components/container/Header";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailItemCard } from "@/features/item/detail/DetailItemCard";
import { trpc } from "@/utils/trpc";
import {
  Calendar,
  User,
  Palette,
  Hash,
  MapPin,
  Package,
  FileText,
  Info,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const ItemGuestDetail = ({ id }: { id: string }) => {
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
            <Image
              src={
                item?.photo?.startsWith("/uploads")
                  ? item.photo
                  : `/uploads/${item?.photo}`
              }
              alt={`Foto ${item?.name ?? "Barang"}`}
              width={800}
              height={600}
              className="h-64 w-full rounded-lg border-2 object-cover md:h-80 lg:h-96 xl:h-[28rem]"
            />
          </div>

          {item?.history && (
            <Card className="bg-main">
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
          <Card className="bg-main">
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

          <Card className="bg-main">
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

          <Card className="bg-main">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {/* <Link
                    href={`/guest/items/${id}`}
                    className={buttonVariants({
                      variant: "neutral",
                      className: "w-full",
                    })}
                  >
                    Update Riwayat!
                  </Link> */}
                  <Button variant={"neutral"} className="w-full">
                    Update Riwayat!
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader className="flex items-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white">
                      <Info className="text-main size-8" strokeWidth={2.5} />
                    </div>
                    <AlertDialogTitle className="text-xl">
                      Oops! Permintaan kamu tidak bisa dilakukan
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-base">
                      Mohon maaf, permintaan kamu tidak bisa dilakukan. <br />{" "}
                      Silahkan hubungi admin.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="pt-5">
                    <AlertDialogCancel className="w-full">
                      Oke, Mengerti!
                    </AlertDialogCancel>
                    {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
