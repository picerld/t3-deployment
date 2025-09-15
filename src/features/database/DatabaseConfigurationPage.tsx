"use client";

import React, { useState } from "react";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import Banner from "@/components/ui/banner";
import { Header } from "@/components/container/Header";
import { AlertTriangle } from "lucide-react";
import { DatabaseStatsCard } from "./components/DatabaseStatsCard";
import { DatabaseTable } from "./components/DatabaseTable";
import { DatabaseStatsData } from "./components/DatabaseStatsData";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import { DatabaseInputUrl } from "./components/DatabaseInputUrl";
import { DatabaseCreateNew } from "./components/create/DatabaseCreateNew";

export default function DatabaseConfigurationPage() {
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(true);

  return (
    <GuardedLayout>
      <HeadMetaData title="Dashboard" />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogOverlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />

        <AlertDialogContent>
          <AlertDialogHeader className="flex items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white">
              <AlertTriangle className="text-main size-8" strokeWidth={2.5} />
            </div>
            <AlertDialogTitle className="text-xl">
              Oops! Mohon Diperhatikan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              Halaman ini berisi konfigurasi database yang sangat sensitif.
              Pastikan Anda memiliki otorisasi yang tepat sebelum melakukan
              ekspor atau modifikasi data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="mt-4 w-full"
              onClick={() => setOpen(false)}
            >
              Ya, Saya Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex w-full flex-col gap-8">
        <Header
          title="Konfigurasi Database"
          subtitle="Halaman ini berisi konfigurasi database."
        />

        <Banner
          variant="error"
          icon={AlertTriangle}
          title="Peringatan: Halaman Database Sensitif"
          subtitle="Halaman ini berisi konfigurasi database yang sangat sensitif.
            Pastikan Anda memiliki otorisasi yang tepat sebelum melakukan ekspor
            atau modifikasi data. Ekspor dalam jumlah besar dapat mempengaruhi
            performa sistem dan keamanan data."
        />

        <DatabaseStatsData />

        <DatabaseStatsCard selectedTables={selectedTables} />

        <DatabaseTable
          selectedTables={selectedTables}
          setSelectedTables={setSelectedTables}
        />
      </div>
    </GuardedLayout>
  );
}
