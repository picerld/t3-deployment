"use client";

import React, { useState } from "react";
import {
  Database,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Check,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { Input } from "@/components/ui/input"; // make sure you import your Input
import { Button } from "@/components/ui/button"; // and Button
import { Card, CardContent } from "@/components/ui/card";

type DatabaseResult = {
  success: boolean;
  code?: string;
  message: string;
  url?: string;
  error?: string;
};

export const DatabaseCreateNew = ({
  onCreateDatabase,
}: {
  onCreateDatabase?: (result: DatabaseResult) => void;
}) => {
  const [databaseName, setDatabaseName] = useState("");
  const [createResult, setCreateResult] = useState<DatabaseResult | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const createDatabase = trpc.databases.createDatabase.useMutation({
    onSuccess: (data) => {
      setCreateResult(data);
      toast.success("Database berhasil dibuat!", {
        description: `Database "${databaseName}" telah dibuat dengan sukses.`,
      });

      if (onCreateDatabase) {
        onCreateDatabase(data);
      }
    },
    onError: (error) => {
      setCreateResult({
        success: false,
        message: "Gagal membuat database. Silakan coba lagi.",
        error: error.message,
      });
      toast.error("Gagal membuat database", {
        description: "Terjadi kesalahan saat membuat database.",
      });
    },
  });

  const handleCreateDatabase = () => {
    if (!databaseName.trim()) {
      toast.error("Nama database tidak boleh kosong");
      return;
    }

    setCreateResult(null);
    createDatabase.mutate({ name: databaseName.trim() });
  };

  const handleCopyUrl = async () => {
    if (!createResult?.url) return;

    try {
      await navigator.clipboard.writeText(createResult.url);
      setIsCopied(true);
      toast.success("URL berhasil disalin!", {
        description: "Database URL telah disalin ke clipboard.",
      });

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.log(err);
      toast.error("Gagal menyalin URL", {
        description: "Tidak dapat menyalin ke clipboard.",
      });
    }
  };

  const toggleUrlVisibility = () => {
    setShowUrl((prev) => !prev);
  };

  const getDisplayUrl = () => {
    if (!createResult?.url) return "";
    return showUrl
      ? createResult.url
      : "•".repeat(Math.min(createResult.url.length, 50));
  };

  const resetForm = () => {
    setDatabaseName("");
    setCreateResult(null);
    setShowUrl(false);
    setIsCopied(false);
  };

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-blue-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Database className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Buat Database Baru</h3>
            <p className="text-sm font-medium">
              Buat instance database baru dengan nama yang unik
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="database-name"
              className="block text-sm font-bold"
            >
              Nama Database
            </label>
            <Input
              id="database-name"
              type="text"
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
              placeholder="contoh: my_new_database"
              disabled={createDatabase.isPending || createResult?.success}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !createDatabase.isPending &&
                  databaseName.trim() &&
                  !createResult?.success
                ) {
                  handleCreateDatabase();
                }
              }}
            />
            <p className="text-xs font-medium text-gray-500">
              Gunakan huruf kecil, angka, dan underscore saja
            </p>
          </div>

          {createResult && (
            <div
              className={`rounded-lg border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                createResult.success ? "bg-green-400" : "bg-red-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {createResult.success ? (
                  <CheckCircle
                    className="h-5 w-5"
                    strokeWidth={2.5}
                  />
                ) : (
                  <AlertCircle
                    className="h-5 w-5"
                    strokeWidth={2.5}
                  />
                )}
                <span className="font-bold">
                  {createResult.message}
                </span>
              </div>
            </div>
          )}

          {createResult?.success && createResult?.url && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" strokeWidth={2.5} />
                <h4 className="font-bold">Database URL</h4>
              </div>

              <p className="text-xs font-medium text-gray-600">
                URL koneksi database yang baru dibuat. Simpan URL ini dengan
                aman untuk konfigurasi aplikasi Anda.
              </p>

              <div className="space-y-2">
                <Input
                  type="text"
                  value={getDisplayUrl()}
                  readOnly
                  className="font-mono text-xs"
                  placeholder="Database URL"
                />

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={toggleUrlVisibility}
                    className="bg-yellow-400 hover:bg-yellow-300"
                  >
                    {showUrl ? (
                      <>
                        <EyeOff className="h-4 w-4" strokeWidth={2.5} />
                        Sembunyikan
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" strokeWidth={2.5} />
                        Tampilkan
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleCopyUrl}
                    disabled={isCopied}
                    className={
                      isCopied
                        ? "bg-green-400 hover:bg-green-300"
                        : "bg-purple-400 hover:bg-purple-300"
                    }
                  >
                    {isCopied ? (
                      <>
                        <Check
                          className="h-4 w-4 text-green-800"
                          strokeWidth={2.5}
                        />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" strokeWidth={2.5} />
                        Salin URL
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {!createResult?.success ? (
              <Button
                onClick={handleCreateDatabase}
                disabled={!databaseName.trim() || createDatabase.isPending}
                className="flex-1 bg-blue-400 hover:bg-blue-300"
              >
                {createDatabase.isPending ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      strokeWidth={2.5}
                    />
                    Membuat Database...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Buat Database
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={resetForm}
                className="flex-1 bg-gray-400 hover:bg-gray-300"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Buat Database Lain
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
