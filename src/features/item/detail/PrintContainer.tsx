"use client";

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
import { Button } from "@/components/ui/button";
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Printer className="mr-2 h-5 w-5" strokeWidth={2.5} />
          Klik untuk print!
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Preview Hasil Print
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            Cek ulang informasi barang sebelum print!
          </AlertDialogDescription>
          <div className="flex items-center justify-center py-5">
            <div
              ref={contentRef}
              className="flex h-[180px] w-full rounded-lg border-2 bg-white p-4"
            >
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="text-lg font-bold">Nama Barang</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg">{item?.name}</td>
                  </tr>
                  <tr>
                    <td className="text-lg font-bold">Merk</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg">{item?.merk}</td>
                  </tr>
                  <tr>
                    <td className="text-lg font-bold">Kondisi</td>
                    <td className="text-lg font-bold">:</td>
                    <td className="text-lg">{item?.condition}</td>
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
        </AlertDialogHeader>
        <AlertDialogFooter className="flex">
          <AlertDialogCancel className="w-1/2">
            Tidak, kembali
          </AlertDialogCancel>
          <AlertDialogAction
            className="w-1/2"
            onClick={() => {
              toast.success("Sukses!!", {
                description: "Data barang berhasil di print.",
              });
              reactToPrintFn();
            }}
          >
            Ya, print sekarang!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

PrintContainer.displayName = "PrintContainer";
