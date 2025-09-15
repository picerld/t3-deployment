import { trpc } from "@/utils/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Cpu, BarChart3 } from "lucide-react";

export const DatabaseStatsData = () => {
  const { data: statsData, isLoading } =
    trpc.databases.getDatabaseStats.useQuery();

  if (isLoading) {
    return (
      <div className="rounded-lg border-2 bg-white p-6 shadow">
        <p className="text-center">Menunggu informasi database...</p>
      </div>
    );
  }

  if (!statsData) return null;

  const totalOperations =
    statsData.rows.inserts + statsData.rows.updates + statsData.rows.deletes;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Database className="h-7 w-7" strokeWidth={2.5} />
          Informasi Database
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-base">Database Name</p>
            <p className="text-lg font-semibold">{statsData.database.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-base">Version</p>
            <p className="text-lg font-semibold">
              {statsData.database.version.split(" ")[0]}{" "}
              {statsData.database.version.split(" ")[1]}
            </p>
          </div>

          <div className="space-y-1">
            <p className="flex items-center gap-1 text-base">
              <Cpu className="h-5 w-5" strokeWidth={2} />
              Active Connections
            </p>
            <p className="text-lg font-semibold">
              {statsData.connections.active}
            </p>
          </div>

          <div className="space-y-1">
            <p className="flex items-center gap-1 text-base">
              <BarChart3 className="h-5 w-5" strokeWidth={2} />
              Total Operations
            </p>
            <p className="text-lg font-semibold">
              {totalOperations.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
