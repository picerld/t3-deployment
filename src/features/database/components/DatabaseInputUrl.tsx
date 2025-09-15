"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Eye, EyeOff, Check, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const DatabaseInputUrl = () => {
  const [showDbUrl, setShowDbUrl] = useState<boolean>(false);
  const [dbUrl, setDbUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/config/db")
      .then((res) => res.json())
      .then((data) => {
        setDbUrl(data.url);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("Gagal memuat konfigurasi database");
      });
  }, []);

  const handleCopyToClipboard = async () => {
    if (!dbUrl) return;

    try {
      await navigator.clipboard.writeText(dbUrl);
      setIsCopied(true);
      toast.success("Berhasil disalin!", {
        description: "Database URL telah disalin ke clipboard.",
      });

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.log(err);
      toast.error("Gagal menyalin", {
        description: "Tidak dapat menyalin ke clipboard.",
      });
    }
  };

  const toggleVisibility = () => {
    setShowDbUrl((prev) => !prev);
  };

  const getDisplayValue = () => {
    if (isLoading) return "";
    if (!dbUrl) return "URL database tidak ditemukan";
    return showDbUrl ? dbUrl : "•".repeat(Math.min(dbUrl.length, 50));
  };

  const getInputClassName = () => {
    const baseClasses =
      "w-full px-3 py-2 font-mono text-sm transition-all duration-200";

    if (isLoading) {
      return `${baseClasses} animate-pulse bg-gray-100 dark:bg-gray-800`;
    }

    if (!dbUrl) {
      return `${baseClasses} text-red-500 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800`;
    }

    if (!showDbUrl) {
      return `${baseClasses} tracking-wider`;
    }

    return baseClasses;
  };

  return (
    <Card>
      <CardContent>
        <div className="mb-2 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" strokeWidth={2.5} />
          <h2 className="text-lg font-semibold">Database URL</h2>
        </div>

        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          Alamat koneksi database saat ini (berasal dari .env). Secara default
          URL disamarkan untuk keamanan. Klik tombol mata untuk menampilkan atau
          menyembunyikan URL lengkap.
        </p>

        <div className="space-y-3">
          <div className="relative">
            <Input
              type="text"
              value={getDisplayValue()}
              readOnly
              disabled={isLoading}
              className={getInputClassName()}
              placeholder={isLoading ? "Memuat..." : "Database URL"}
            />

            {isLoading && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                <div className="border-t-primary h-4 w-4 animate-spin rounded-full border-2 border-gray-300"></div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={toggleVisibility}
              disabled={isLoading || !dbUrl}
              className="flex items-center gap-2 transition-all duration-200"
            >
              {showDbUrl ? (
                <EyeOff className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={2.5} />
              )}
              {showDbUrl ? "Sembunyikan" : "Tampilkan"}
            </Button>

            <Button
              size="sm"
              onClick={handleCopyToClipboard}
              disabled={isLoading || !dbUrl || isCopied}
              className="flex items-center gap-2 transition-all duration-200"
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" strokeWidth={2.5} />
                  Salin
                </>
              )}
            </Button>
          </div>

          {!isLoading && (
            <div className="flex items-center gap-2 text-xs">
              <div
                className={`h-2 w-2 rounded-full ${dbUrl ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span className="text-muted-foreground">
                {dbUrl
                  ? "Konfigurasi database terdeteksi"
                  : "Tidak ada konfigurasi database"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
