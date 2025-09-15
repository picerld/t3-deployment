import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export type Column = {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
};

export type TableInfo = {
  name: string;
  schema: string;
  rows: number;
  size: string;
  sizeBytes: number;
  columns: Column[];
  lastUpdated: string;
  totalChanges: number;
  error?: string;
};

export type DatabaseStats = {
  database: {
    name: string;
    size: string;
    sizeBytes: number;
    version: string;
  };
  tables: {
    count: number;
  };
  rows: {
    total: number;
    inserts: number;
    updates: number;
    deletes: number;
  };
  connections: {
    active: number;
  };
};

export type TableData = {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}

function getLastUpdated(tableStats: any): string {
  if (!tableStats) return "Unknown";

  const dates = [
    tableStats.last_vacuum,
    tableStats.last_autovacuum,
    tableStats.last_analyze,
    tableStats.last_autoanalyze,
  ].filter(Boolean);

  if (dates.length === 0) return "Unknown";

  const latestDate = new Date(Math.max(...dates.map((d: Date) => new Date(d).getTime())));
  return latestDate.toISOString().split("T")[0] ?? "Unknown";
}

function generateCSV(tableName: string, rows: Record<string, any>[], columns: Column[]): string {
  if (rows.length === 0) return `# Table: ${tableName} (empty)\n\n`;

  const headers = columns.map((col) => col.column_name).join(",");
  const csvRows = rows.map((row) =>
    columns
      .map((col) => {
        const value = row[col.column_name];
        if (value === null) return "";
        if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(","),
  );

  return `# Table: ${tableName}\n${headers}\n${csvRows.join("\n")}\n\n`;
}

async function generateSQL(
  tableName: string,
  rows: Record<string, any>[],
  columns: Column[],
  ctx: { db: any }
): Promise<string> {
  if (rows.length === 0) return `-- Table: ${tableName} (empty)\n\n`;

  let sql = `-- Table: ${tableName}\n-- Generated on ${new Date().toISOString()}\n\n`;

  sql += `DROP TABLE IF EXISTS "${tableName}";\n`;
  sql += `CREATE TABLE "${tableName}" (\n`;

  const columnDefs = columns.map((col) => {
    let def = `  "${col.column_name}" ${col.data_type}`;
    if (col.character_maximum_length) def += `(${col.character_maximum_length})`;
    if (col.is_nullable === "NO") def += " NOT NULL";
    if (col.column_default) def += ` DEFAULT ${col.column_default}`;
    return def;
  });

  sql += columnDefs.join(",\n") + "\n);\n\n";

  if (rows.length > 0) {
    const columnNames = columns.map((col) => `"${col.column_name}"`).join(", ");
    sql += `INSERT INTO "${tableName}" (${columnNames}) VALUES\n`;

    const valueRows = rows.map((row) => {
      const values = columns.map((col) => {
        const value = row[col.column_name];
        if (value === null) return "NULL";
        if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
        if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
        if (value instanceof Date) return `'${value.toISOString()}'`;
        return value;
      });
      return `  (${values.join(", ")})`;
    });

    sql += valueRows.join(",\n") + ";\n\n";
  }

  return sql;
}

export const databaseRouter = createTRPCRouter({
  getTables: protectedProcedure
    .input(
      z
        .object({
          filterType: z.enum(["all", "main"]).default("main"),
        })
        .optional(),
    )
    .query(async ({ ctx, input }): Promise<{ tables: TableInfo[]; filterType: string; totalFound: number }> => {
      const filterType = input?.filterType ?? "main";

      try {
        let tablesQuery = `
          SELECT 
            t.table_name,
            t.table_schema,
            COALESCE(s.n_tup_ins + s.n_tup_upd + s.n_tup_del, 0) as total_changes,
            s.last_vacuum,
            s.last_autovacuum,
            s.last_analyze,
            s.last_autoanalyze
          FROM information_schema.tables t
          LEFT JOIN pg_stat_user_tables s ON s.relname = t.table_name 
            AND s.schemaname = t.table_schema
          WHERE t.table_schema NOT IN ('information_schema', 'pg_catalog')
            AND t.table_type = 'BASE TABLE'
        `;

        if (filterType === "main") {
          tablesQuery += ` AND t.table_name ~ '^[A-Z]' `;
        }

        tablesQuery += ` ORDER BY t.table_name;`;

        const tablesResult = await ctx.db.$queryRawUnsafe<any[]>(tablesQuery);

        const tablesWithInfo: TableInfo[] = await Promise.all(
          tablesResult.map(async (table) => {
            try {
              const countQuery = `SELECT COUNT(*) as count FROM "${table.table_schema}"."${table.table_name}"`;
              const countResult = await ctx.db.$queryRawUnsafe<{ count: number }[]>(countQuery);

              const sizeQuery = `
                SELECT 
                  pg_size_pretty(pg_total_relation_size($1::regclass)) as size,
                  pg_total_relation_size($1::regclass) as size_bytes
              `;
              const sizeResult = await ctx.db.$queryRawUnsafe<{ size: string; size_bytes: number }[]>(
                sizeQuery,
                `"${table.table_schema}"."${table.table_name}"`,
              );

              const columnsQuery = `
                SELECT 
                  column_name,
                  data_type,
                  is_nullable,
                  column_default,
                  character_maximum_length
                FROM information_schema.columns 
                WHERE table_schema = $1 AND table_name = $2
                ORDER BY ordinal_position;
              `;
              const columnsResult = await ctx.db.$queryRawUnsafe<Column[]>(
                columnsQuery,
                table.table_schema,
                table.table_name,
              );

              return {
                name: table.table_name,
                schema: table.table_schema,
                rows: Number(countResult[0]?.count ?? 0),
                size: sizeResult[0]?.size ?? "Unknown",
                sizeBytes: Number(sizeResult[0]?.size_bytes ?? 0),
                columns: columnsResult,
                lastUpdated: getLastUpdated(table),
                totalChanges: Number(table.total_changes ?? 0),
              };
            } catch (error) {
              console.error(`Error getting info for table ${table.table_name}:`, error);
              return {
                name: table.table_name,
                schema: table.table_schema,
                rows: 0,
                size: "Unknown",
                sizeBytes: 0,
                columns: [],
                lastUpdated: "Unknown",
                totalChanges: 0,
                error: "Failed to load table info",
              };
            }
          }),
        );

        return { tables: tablesWithInfo, filterType, totalFound: tablesWithInfo.length };
      } catch (error) {
        console.error("Database tables query error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch database tables",
        });
      }
    }),
    
      exportTables: protectedProcedure
        .input(z.object({
          tables: z.array(z.string()).min(1, "At least one table must be selected"),
          format: z.enum(['csv', 'sql']),
          limit: z.number().min(1).max(50000).default(10000),
        }))
        .mutation(async ({ input, ctx }) => {
          const { tables, format, limit } = input;
    
          try {
            let exportData = '';
            const exportedTables = [];
    
            for (const tableName of tables) {
              try {
                const dataQuery = `SELECT * FROM "${tableName}" LIMIT $1`;
                const tableData: TableData[] = await ctx.db.$queryRawUnsafe(dataQuery, limit);

                const columnsQuery = `
                  SELECT 
                    column_name,
                    data_type,
                    is_nullable,
                    column_default,
                    character_maximum_length
                  FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = $1
                  ORDER BY ordinal_position;
                `;
                const columns: Column[] = await ctx.db.$queryRawUnsafe(columnsQuery, tableName);
    
                if (format === 'csv') {
                  exportData += generateCSV(tableName, tableData, columns);
                } else if (format === 'sql') {
                  exportData += await generateSQL(tableName, tableData, columns, ctx);
                }
    
                exportedTables.push({
                  name: tableName,
                  rows: tableData.length,
                  columns: columns.length
                });
    
              } catch (tableError: any) {
                console.error(`Error exporting table ${tableName}:`, tableError);
                exportedTables.push({
                  name: tableName,
                  error: `Failed to export: ${tableError.message}`
                });
              }
            }
    
            const filename = `database_export_${new Date().toISOString().split('T')[0]}.${format}`;
    
            return {
              data: exportData,
              filename,
              exportedTables,
              timestamp: new Date().toISOString()
            };
    
          } catch (error) {
            console.error('Export error:', error);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to export database tables",
            });
          }
        }),

      getDatabaseStats: protectedProcedure
        .query(async ({ ctx }) => {
          try {
            const dbSizeQuery = `
              SELECT pg_size_pretty(pg_database_size(current_database())) as size,
                     pg_database_size(current_database()) as size_bytes
            `;
            const dbSizeResult: { size: number; size_bytes: number }[] = await ctx.db.$queryRawUnsafe(dbSizeQuery);
    
            // Get table count
            const tableCountQuery = `
              SELECT COUNT(*) as count 
              FROM information_schema.tables 
              WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
                AND table_type = 'BASE TABLE'
            `;
            const tableCountResult: { count: number }[] = await ctx.db.$queryRawUnsafe(tableCountQuery);
    
            const totalRowsQuery = `
              SELECT 
                SUM(n_tup_ins + n_tup_upd - n_tup_del) as total_rows,
                SUM(n_tup_ins) as total_inserts,
                SUM(n_tup_upd) as total_updates,
                SUM(n_tup_del) as total_deletes
              FROM pg_stat_user_tables
            `;
            const totalRowsResult: { total_rows: number; total_inserts: number; total_updates: number; total_deletes: number }[] = await ctx.db.$queryRawUnsafe(totalRowsQuery);
    
            const connectionQuery = `
              SELECT 
                count(*) as active_connections,
                current_database() as database_name,
                version() as postgresql_version
              FROM pg_stat_activity 
              WHERE state = 'active'
            `;
            const connectionResult: { active_connections: number; database_name: string; postgresql_version: string }[] = await ctx.db.$queryRawUnsafe(connectionQuery);
    
            return {
              database: {
                name: connectionResult[0]?.database_name,
                size: dbSizeResult[0]?.size,
                sizeBytes: parseInt(dbSizeResult[0]?.size_bytes.toString() ?? '0'),
                version: connectionResult[0]?.postgresql_version ?? 'Unknown',
              },
              tables: {
                count: parseInt(tableCountResult[0]?.count.toString() ?? '0'),
              },
              rows: {
                total: parseInt(totalRowsResult[0]?.total_rows?.toString() ?? '0'),
                inserts: parseInt(totalRowsResult[0]?.total_inserts?.toString() ?? '0'),
                updates: parseInt(totalRowsResult[0]?.total_updates?.toString() ?? '0'),
                deletes: parseInt(totalRowsResult[0]?.total_deletes?.toString() ?? '0'),
              },
              connections: {
                active: parseInt(connectionResult[0]?.active_connections.toString() ?? '0'),
              }
            };
          } catch (error) {
            console.error('Database stats error:', error);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to fetch database statistics",
            });
          }
        }),
      
    createDatabase: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          await ctx.db.$executeRawUnsafe(`CREATE DATABASE "${input.name}"`);

          const baseUrl = process.env.DATABASE_URL;

          if (!baseUrl) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Database URL not found",
            });
          }

          const url = new URL(baseUrl);
          url.pathname = `/${input.name}`;

          return { 
            success: true, 
            message: `Database ${input.name} created`, 
            url: url.toString() 
          };
        } catch (err) {
          console.error("Create database error:", err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create database",
          });
        }
      }),
});
