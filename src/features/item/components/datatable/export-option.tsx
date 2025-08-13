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
import { Download } from "lucide-react";
import { Label } from "@/components/ui/label";

export function ExportOption<TData>({
  table,
}: {
  readonly table: Table<TData>;
}) {
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);

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
            <form>
              <DialogTrigger asChild>
                <Button
                  variant="noShadow"
                  className="hover:border-border w-full justify-start border-transparent px-2.5 shadow-none"
                >
                  PDF
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Unduh Laporan</DialogTitle>
                  <DialogDescription className="text-base">
                    Pilih periode laporan yang ingin diunduh!
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-5 mt-2">
                  <Label htmlFor="date">Tanggal Awal</Label>
                  <DatePickerInput value={startDate} onChange={setStartDate} />
                  <Label htmlFor="date">Tanggal Akhir</Label>
                  <DatePickerInput value={endDate} onChange={setEndDate} />
                </div>
                <DialogFooter>
                  <Button className="mt-5 w-full font-bold py-5 text-base" type="submit">
                    <Download className="!size-5" strokeWidth={2.5} />
                    Unduh Laporan!
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem>CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
