import { trpc } from "@/utils/trpc";
import type { TableInfo } from "@/server/api/routers/database";
import { useState } from "react";
import { CheckSquare, Download, Loader, Square } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const DatabaseTable = ({
  selectedTables,
  setSelectedTables,
}: {
  selectedTables: string[];
  setSelectedTables: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [exportFormat, setExportFormat] = useState("csv");
  const [filterType, setFilterType] = useState<"main" | "all">("main");

  const {
    data: tablesData,
    isLoading: tablesLoading,
    refetch: refetchTables,
  } = trpc.databases.getTables.useQuery({ filterType });

  const exportMutation = trpc.databases.exportTables.useMutation({
    onSuccess: (data: any) => {
      const blob = new Blob([data.data], {
        type: exportFormat === "csv" ? "text/csv" : "application/sql",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Yeay! Tabel berhasil diekspor", {
        description: "Silahkan periksa folder download anda!",
      });
    },
    onError: (error: any) => {
      toast.error("Oops, terjadi kesalahan!", {
        description: error.message,
      });
    },
  });

  const tables: TableInfo[] = tablesData?.tables || [];

  const handleTableSelection = (tableName: string) => {
    setSelectedTables((prev) =>
      prev.includes(tableName)
        ? prev.filter((name) => name !== tableName)
        : [...prev, tableName],
    );
  };

  const handleSelectAll = () => {
    setSelectedTables(
      selectedTables.length === tables.length ? [] : tables.map((t) => t.name),
    );
  };

  const handleExport = () => {
    if (selectedTables.length === 0) {
      alert("Silakan pilih minimal satu tabel untuk diekspor");
      return;
    }

    exportMutation.mutate({
      tables: selectedTables,
      format: exportFormat as "csv" | "sql",
      limit: 10000,
    });
  };

  return (
    <div className="shadow-shadow rounded-lg border-2 bg-white px-10 py-6">
      <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-3xl font-bold">Tabel Database</h2>
        <div className="flex items-center gap-2">
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleExport}
            disabled={selectedTables.length === 0 || exportMutation.isPending}
            className="inline-flex items-center disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exportMutation.isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {exportMutation.isPending
              ? "Mengekspor..."
              : `Ekspor ${exportFormat.toUpperCase()}`}
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Button
          size={"sm"}
          variant={"noShadow"}
          onClick={handleSelectAll}
          className="inline-flex items-center"
        >
          {selectedTables.length === tables.length ? (
            <CheckSquare className="mr-1 h-4 w-4" strokeWidth={2.5} />
          ) : (
            <Square className="mr-1 h-4 w-4" strokeWidth={2.5} />
          )}
          {selectedTables.length === tables.length
            ? "Batalkan Semua"
            : "Pilih Semua"}
        </Button>

        <div className="flex items-center gap-2">
          <label htmlFor="filterType" className="text-base font-semibold">
            Filter:
          </label>
          <Select
            value={filterType}
            onValueChange={(value) => {
              setFilterType(value as "main" | "all");
              refetchTables();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Tabel Utama</SelectItem>
              <SelectItem value="all">Tabel Postgres</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {tablesLoading ? (
        <div className="flex justify-center py-8">
          <p className="text-muted-foreground text-sm">
            Mohon tunggu sebentar ya...
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base font-semibold">Pilih</TableHead>
                <TableHead className="text-base font-semibold">
                  Nama Tabel
                </TableHead>
                <TableHead className="text-base font-semibold">
                  Schema
                </TableHead>
                <TableHead className="text-base font-semibold">
                  Jumlah Baris
                </TableHead>
                <TableHead className="text-base font-semibold">Kolom</TableHead>
                <TableHead className="text-base font-semibold">
                  Terakhir Diperbarui
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.name}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTables.includes(table.name)}
                      onCheckedChange={() => handleTableSelection(table.name)}
                      className="h-4 w-4"
                    />
                  </TableCell>
                  <TableCell className="text-base">{table.name}</TableCell>
                  <TableCell>{table.schema}</TableCell>
                  <TableCell>{table.rows.toLocaleString()}</TableCell>
                  <TableCell>{table.columns.length}</TableCell>
                  <TableCell>{table.lastUpdated}</TableCell>
                </TableRow>
              ))}
              {tables.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <p className="text-muted-foreground text-sm">
                      Tidak ada data
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
