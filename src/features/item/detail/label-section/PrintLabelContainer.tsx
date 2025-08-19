"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Printer, Settings } from "lucide-react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

interface PrintField {
  key: string;
  label: string;
  getValue: (item: any) => string | number;
}

const printFields: PrintField[] = [
  { key: "name", label: "Nama Barang", getValue: (item) => item?.name || "" },
  {
    key: "serialNumber",
    label: "Serial Number",
    getValue: (item) => item?.serialNumber || "",
  },
  { key: "merk", label: "Merk", getValue: (item) => item?.merk || "" },
  {
    key: "category",
    label: "Kategori",
    getValue: (item) => item?.category?.name || "",
  },
  { key: "color", label: "Warna", getValue: (item) => item?.color || "" },
  {
    key: "quantity",
    label: "Kuantiti",
    getValue: (item) => (item?.quantity ? `${item.quantity} unit` : ""),
  },
  {
    key: "condition",
    label: "Kondisi",
    getValue: (item) => item?.condition || "",
  },
  {
    key: "location",
    label: "Ruangan",
    getValue: (item) => item?.location?.name || "",
  },
  {
    key: "ownerType",
    label: "Kepemilikan",
    getValue: (item) => item?.ownerType || "",
  },
  {
    key: "user",
    label: "Penanggung Jawab",
    getValue: (item) => item?.user?.name || "",
  },
  {
    key: "description",
    label: "Keterangan",
    getValue: (item) => item?.description || "",
  },
];

export const PrintLabelContainer = ({ id }: { id: string }) => {
  const { data: item, isLoading: isItemLoading } =
    trpc.items.getByIdWithRelation.useQuery({
      id,
    });

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
  });

  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(
      printFields.map((field) => field.key).filter((key) => key !== "user"),
    ),
  );

  const handleFieldToggle = (fieldKey: string) => {
    const newSelectedFields = new Set(selectedFields);
    if (newSelectedFields.has(fieldKey)) {
      newSelectedFields.delete(fieldKey);
    } else {
      newSelectedFields.add(fieldKey);
    }
    setSelectedFields(newSelectedFields);
  };

  const handleSelectAll = () => {
    setSelectedFields(new Set(printFields.map((field) => field.key)));
  };

  const handleDeselectAll = () => {
    setSelectedFields(new Set());
  };

  const filteredFields = printFields.filter((field) =>
    selectedFields.has(field.key),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Printer className="mr-2 h-5 w-5" strokeWidth={2.5} />
          Print label barang!
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto md:min-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Print Label Barang</DialogTitle>
          <DialogDescription className="text-lg">
            Pilih field yang ingin ditampilkan pada label, lalu cek preview
            sebelum print!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Settings className="h-5 w-5" />
                Pilih Field untuk Print
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  Pilih Semua
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDeselectAll}
                  className="text-xs"
                >
                  Kosongkan
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg border-2 bg-gray-50 p-4 md:grid-cols-3">
              {printFields.map((field) => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.key}
                    checked={selectedFields.has(field.key)}
                    onCheckedChange={() => handleFieldToggle(field.key)}
                  />
                  <label
                    htmlFor={field.key}
                    className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {field.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview Label</h3>

            {selectedFields.size === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-base">
                  Harus pilih minimal satu field buat lihat preview, ya!
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center py-5">
                <div
                  ref={contentRef}
                  className="flex w-full max-w-2xl rounded-lg bg-white p-6 shadow-sm"
                >
                  {isItemLoading ? (
                    <div className="w-full py-8 text-center">
                      <p>Loading data...</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <tbody>
                        {filteredFields.map((field) => {
                          const value = field.getValue(item);
                          return (
                            <tr
                              key={field.key}
                              className="border-b border-gray-100 last:border-b-0"
                            >
                              <td className="py-2 pr-4 align-top text-sm font-semibold">
                                {field.label}
                              </td>
                              <td className="px-2 py-2 align-top text-sm font-semibold">
                                :
                              </td>
                              <td className="py-2 align-top text-sm text-gray-900">
                                {value || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="neutral" className="flex-1">
              Tidak, kembali!
            </Button>
          </DialogClose>
          <Button
            className="flex-1"
            disabled={selectedFields.size === 0 || isItemLoading}
            onClick={() => {
              toast.success("Sukses!", {
                description: `Label dengan ${selectedFields.size} field berhasil diprint.`,
              });
              reactToPrintFn();
            }}
          >
            <Printer className="mr-2 h-4 w-4" strokeWidth={2.5} />
            Ya, Print sekarang!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

PrintLabelContainer.displayName = "PrintLabelContainer";
