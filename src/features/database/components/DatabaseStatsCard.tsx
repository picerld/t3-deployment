import { Download, Database, FileText, Table2, Loader } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";

export const DatabaseStatsCard = ({
  selectedTables,
}: {
  selectedTables: string[];
}) => {
  const { data: statsData, isLoading: statsLoading } =
    trpc.databases.getDatabaseStats.useQuery();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-5 text-xl">
            <Database className="h-7 w-7" strokeWidth={2.5} />
            <div className="flex flex-col">
              Total Tabel
              <p className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  statsData?.tables.count || 0
                )}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-5 text-xl">
            <Table2 className="h-7 w-7" strokeWidth={2.5} />
            <div className="flex flex-col">
              Total Baris
              <p className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  statsData?.rows.total.toLocaleString() || "0"
                )}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-5 text-xl">
            <FileText className="h-7 w-7" strokeWidth={2.5} />
            <div className="flex flex-col">
              Database Size
              <p className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  statsData?.database.size || "N/A"
                )}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-5 text-xl">
            <Download className="h-7 w-7" strokeWidth={2.5} />
            <div className="flex flex-col">
              Tabel Dipilih
              <p className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader className="h-6 w-6 animate-spin" />
                ) : (
                  selectedTables.length
                )}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};
