"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/utils/trpc";
import { Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

export const PrintContainer = ({ id }: { id: string }) => {
  const { data: item, isLoading: isItemLoading } =
    trpc.items.getByIdWithRelation.useQuery({
      id,
    });

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Printer className="mr-2 h-5 w-5" strokeWidth={2.5} />
          Print label barang!
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Preview Hasil Print</DialogTitle>
          <DialogDescription className="text-lg">
            Cek ulang informasi barang sebelum print!
          </DialogDescription>
          <div className="flex items-center justify-center py-5">
            <div
              ref={contentRef}
              className="flex w-full rounded-lg border-2 bg-white p-4"
            >
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="text-lg font-bold">Nama Barang</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg">{item?.name}</td>
                  </tr>
                  <tr>
                    <td className="text-lg font-bold">Serial Number</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg">{item?.serialNumber}</td>
                  </tr>
                  <tr>
                    <td className="text-lg font-bold">Merk</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg">{item?.merk}</td>
                  </tr>
                  <tr>
                    <td className="text-lg font-bold">Kategori</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg">{item?.category.name}</td>
                  </tr>
                  <tr>
                    <td className="text-lg font-bold">Warna</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg">{item?.color}</td>
                  </tr>
                  <tr>
                    <td className="text-lg font-bold">Kuantiti</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg">{item?.quantity} unit</td>
                  </tr>
                  <tr>
                    <td className="text-lg font-bold">Kondisi</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg">{item?.condition}</td>
                  </tr>
                  <tr>
                    <td className="text-lg font-bold">Ruangan</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg">{item?.location.name}</td>
                  </tr>
                  <tr>
                    <td className="text-lg font-bold">Kepemilikan</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg">{item?.ownerType}</td>
                  </tr>
                  <tr>
                    <td className="text-lg font-bold">Keterangan</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex">
          <DialogClose className="w-1/2" asChild>
            <Button variant={"neutral"}>Tidak, kembali</Button>
          </DialogClose>
          <Button
            className="w-1/2"
            onClick={() => {
              toast.success("Sukses!!", {
                description: "Data barang berhasil di print.",
              });
              reactToPrintFn();
            }}
          >
            Ya, print sekarang!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

PrintContainer.displayName = "PrintContainer";
