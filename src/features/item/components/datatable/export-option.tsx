import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import type { Table } from "@tanstack/react-table";
import React from "react";
import { DatePickerInput } from "@/components/DatePickerInput";
import { Download, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

export function ExportOption<TData>({
  table,
}: {
  readonly table: Table<TData>;
}) {
  const now = new Date();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(now);

  const exportPDF = trpc.items.exportPDF.useMutation();
  const exportCSV = trpc.items.exportCsv.useMutation();

  const handleDownloadPDF = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await exportPDF.mutateAsync({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString() ?? new Date().toISOString(),
      });

      if (!res.fileData || !res.fileName) {
        throw new Error("Response missing file data or file name");
      }

      let base64 = res.fileData.replace(/[\r\n\s]+/g, "");
      base64 = base64.replace(/-/g, "+").replace(/_/g, "/");

      while (base64.length % 4 !== 0) {
        base64 += "=";
      }

      const response = await fetch(`data:application/pdf;base64,${base64}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Yeay, laporan berhasil dibuat!", {
        description: "Cek kembali file laporan",
      });
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Oops, terjadi kesalahan!", {
        description: "Harap coba lagi!",
      });
    } finally {
      setIsLoading(false);
      setStartDate(undefined);
      setEndDate(now);
    }
  };

  const handleDownloadCSV = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const csvData = await exportCSV.mutateAsync({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString() ?? new Date().toISOString(),
      });

      const blob = new Blob([csvData.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", csvData.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download CSV:", error);
      toast.error("Oops, terjadi kesalahan!", {
        description: "Harap coba lagi!",
      });
    } finally {
      setIsLoading(false);
      setStartDate(undefined);
      setEndDate(now);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"default"}>
          Laporan
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Catatan Barang</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="noShadow"
                className="hover:border-border w-full justify-start border-transparent px-2.5 shadow-none"
              >
                PDF
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <form onSubmit={handleDownloadPDF}>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Unduh Laporan Dalam PDF
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Pilih periode laporan yang ingin diunduh!
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-5 space-y-5">
                  <Label htmlFor="date">Tanggal Awal</Label>
                  <DatePickerInput
                    disabled={isLoading}
                    value={startDate}
                    onChange={setStartDate}
                  />
                  <Label htmlFor="date">Tanggal Akhir</Label>
                  <DatePickerInput
                    disabled={isLoading}
                    value={endDate}
                    onChange={setEndDate}
                  />
                </div>
                <DialogFooter className="mt-10">
                  <DialogClose asChild>
                    <Button
                      disabled={isLoading}
                      variant="neutral"
                      className="py-5"
                    >
                      Batal
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5"
                  >
                    {isLoading ? (
                      <Loader
                        className="!size-5 animate-spin"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <Download className="!size-5" strokeWidth={2.5} />
                    )}
                    {isLoading ? "Mengunduh Laporan ..." : "Unduh Laporan!"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="noShadow"
                className="hover:border-border w-full justify-start border-transparent px-2.5 shadow-none"
              >
                CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <form onSubmit={handleDownloadCSV}>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Unduh Laporan Dalam CSV
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Pilih periode laporan yang ingin diunduh!
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-5 space-y-5">
                  <Label htmlFor="date">Tanggal Awal</Label>
                  <DatePickerInput
                    disabled={isLoading}
                    value={startDate}
                    onChange={setStartDate}
                  />
                  <Label htmlFor="date">Tanggal Akhir</Label>
                  <DatePickerInput
                    disabled={isLoading}
                    value={endDate}
                    onChange={setEndDate}
                  />
                </div>
                <DialogFooter className="mt-10">
                  <DialogClose asChild>
                    <Button
                      disabled={isLoading}
                      variant="neutral"
                      className="py-5"
                    >
                      Batal
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5"
                  >
                    {isLoading ? (
                      <Loader
                        className="!size-5 animate-spin"
                        strokeWidth={2.5}
                      />
                    ) : (
                      <Download className="!size-5" strokeWidth={2.5} />
                    )}
                    {isLoading ? "Mengunduh Laporan ..." : "Unduh Laporan!"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
