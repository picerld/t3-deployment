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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FileText, Settings, Printer } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

interface SerahTerimaField {
  key: string;
  label: string;
  getValue: (item: any) => string | number;
  showInTable?: boolean;
}

const serahTerimaFields: SerahTerimaField[] = [
  {
    key: "name",
    label: "Nama Barang",
    getValue: (item) => item?.name || "",
    showInTable: true,
  },
  {
    key: "serialNumber",
    label: "Serial Number",
    getValue: (item) => item?.serialNumber || "",
    showInTable: false,
  },
  {
    key: "merk",
    label: "Merk",
    getValue: (item) => item?.merk || "",
    showInTable: false,
  },
  {
    key: "category",
    label: "Kategori",
    getValue: (item) => item?.category?.name || "",
    showInTable: false,
  },
  {
    key: "color",
    label: "Warna",
    getValue: (item) => item?.color || "",
    showInTable: false,
  },
  {
    key: "quantity",
    label: "Kuantiti",
    getValue: (item) => item?.quantity || "",
    showInTable: true,
  },
  {
    key: "unit",
    label: "Unit",
    getValue: (item) => "Set",
    showInTable: true,
  },
  {
    key: "condition",
    label: "Kondisi",
    getValue: (item) => item?.condition || "",
    showInTable: true,
  },
  {
    key: "location",
    label: "Ruangan",
    getValue: (item) => item?.location?.name || "",
    showInTable: false,
  },
  {
    key: "detail",
    label: "Detail Speksifikasi",
    getValue: (item) => item?.detail || "",
    showInTable: false,
  },
];

export const PrintMultiSerahTerimaContainer = ({
  selectedItems,
  documentNumber,
}: {
  selectedItems: any[];
  documentNumber?: string;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(
      serahTerimaFields
        .filter((field) => field.showInTable)
        .map((field) => field.key),
    ),
  );

  const [documentInfo, setDocumentInfo] = useState({
    number: documentNumber || `000/XX/SGRS/XXXX/${new Date().getFullYear()}`,
    submitter: "Syarif Hidayat",
    reviewer: "Tanty Chris Tanty",
    receiver: "",
  });

  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate();
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const month = months[today.getMonth()];
    const year = today.getFullYear();
    return `Bandung, ${day} ${month} ${year}`;
  };

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
    setSelectedFields(new Set(serahTerimaFields.map((field) => field.key)));
  };

  const handleDeselectAll = () => {
    setSelectedFields(new Set());
  };

  const filteredFields = serahTerimaFields.filter((field) =>
    selectedFields.has(field.key),
  );

  const tableFields = filteredFields.filter((field) =>
    ["name", "quantity", "unit", "condition"].includes(field.key),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={selectedItems.length === 0}>
          <FileText className="mr-2 h-4 w-4" strokeWidth={2.5} />
          Buat Serah Terima ({selectedItems.length} items)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto md:min-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Serah Terima Barang</DialogTitle>
          <DialogDescription className="text-lg">
            Membuat dokumen serah terima untuk {selectedItems.length} barang
            yang dipilih
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informasi Dokumen</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="docNumber">Nomor Dokumen</Label>
                <Input
                  id="docNumber"
                  value={documentInfo.number}
                  onChange={(e) =>
                    setDocumentInfo((prev) => ({
                      ...prev,
                      number: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="submitter">Yang Menyerahkan</Label>
                <Input
                  id="submitter"
                  value={documentInfo.submitter}
                  onChange={(e) =>
                    setDocumentInfo((prev) => ({
                      ...prev,
                      submitter: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="receiver">Yang Menerima</Label>
                <Input
                  id="receiver"
                  value={documentInfo.receiver}
                  onChange={(e) =>
                    setDocumentInfo((prev) => ({
                      ...prev,
                      receiver: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Settings className="h-5 w-5" />
                Pilih Field untuk Tabel
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
              {serahTerimaFields.map((field) => (
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
            <h3 className="text-lg font-semibold">Preview Dokumen</h3>

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
                  className="print-container w-full rounded-lg bg-white p-8"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-xl font-bold text-blue-600">
                          SEGARIS MEDIA TEKNOLOGI
                        </h1>
                        <p className="text-sm font-semibold text-gray-600">
                          TANDA TERIMA BARANG
                        </p>
                      </div>
                      <Image
                        src="/assets/logo-print.jpeg"
                        alt="logo"
                        width={100}
                        height={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Nomor: </span>
                        {documentInfo.number}
                      </p>
                      <p className="text-sm font-medium">
                        Telah serah terima barang berupa:
                      </p>
                    </div>

                    <div className="border border-gray-300">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-blue-500 text-white">
                            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                              No
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                              Description
                            </th>
                            {tableFields.some((f) => f.key === "quantity") && (
                              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                                Qty
                              </th>
                            )}
                            {tableFields.some((f) => f.key === "unit") && (
                              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                                Unit
                              </th>
                            )}
                            {tableFields.some((f) => f.key === "condition") && (
                              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                                Kondisi
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedItems.map((item, index) => (
                            <tr key={item.id} className="bg-white">
                              <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                                {index + 1}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 text-sm">
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {serahTerimaFields
                                      .find((f) => f.key === "name")
                                      ?.getValue(item)}
                                  </div>
                                  {filteredFields
                                    .filter(
                                      (field) =>
                                        field.key !== "name" &&
                                        field.key !== "quantity" &&
                                        field.key !== "unit" &&
                                        field.key !== "condition" &&
                                        field.getValue(item),
                                    )
                                    .map((field) => (
                                      <div
                                        key={field.key}
                                        className="text-xs text-gray-600"
                                      >
                                        {field.label}: {field.getValue(item)}
                                      </div>
                                    ))}
                                </div>
                              </td>
                              {tableFields.some(
                                (f) => f.key === "quantity",
                              ) && (
                                <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                                  {serahTerimaFields
                                    .find((f) => f.key === "quantity")
                                    ?.getValue(item)}
                                </td>
                              )}
                              {tableFields.some((f) => f.key === "unit") && (
                                <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                                  {serahTerimaFields
                                    .find((f) => f.key === "unit")
                                    ?.getValue(item)}
                                </td>
                              )}
                              {tableFields.some(
                                (f) => f.key === "condition",
                              ) && (
                                <td className="border border-gray-300 px-3 py-2 text-center text-sm">
                                  {serahTerimaFields
                                    .find((f) => f.key === "condition")
                                    ?.getValue(item)}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="space-y-6">
                      <p className="text-sm">{getCurrentDate()}</p>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-16 text-center">
                          <p className="text-sm font-medium">
                            Yang Menyerahkan,
                          </p>
                          <div className="space-y-2">
                            <div className="h-12 border-b border-gray-400"></div>
                            <p className="text-sm font-medium">
                              {documentInfo.submitter}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-16 text-center">
                          <p className="text-sm font-medium">Yang Menerima,</p>
                          <div className="space-y-2">
                            <div className="h-12 border-b border-gray-400"></div>
                            <p className="text-sm font-medium">
                              {documentInfo.receiver}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-4">
                      <div className="space-y-1 text-xs text-gray-500">
                        <p className="font-semibold">
                          PT Segaris Media Teknologi
                        </p>
                        <p>Virtual Simulation Software Developer</p>
                        <p>www.segarismedia.co.id | mail@segarismedia.co.id</p>
                      </div>
                    </div>
                  </div>
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
            disabled={selectedFields.size === 0}
            onClick={() => {
              toast.success("Sukses!", {
                description: `Dokumen serah terima dengan ${selectedItems.length} barang berhasil diprint.`,
              });
              reactToPrintFn();
            }}
          >
            <Printer className="mr-2 h-4 w-4" strokeWidth={2.5} />
            Ya, Print serah terima!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
