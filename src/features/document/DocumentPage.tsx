"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { Search, Filter, Package } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { MultiPrintItemCard } from "./components/MultiPrintItemCard";
import { PrintMultiSerahTerimaContainer } from "./print/PrintMultiSerahTerimaContainer";
import { Header } from "@/components/container/Header";

export default function DocumentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPenanggungJawab, setSelectedPenanggungJawab] =
    useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: itemsData, isLoading: isItemsLoading } =
    trpc.items.getPaginated.useQuery({
      search: searchTerm,
      page: currentPage,
      perPage: itemsPerPage,
      userId:
        selectedPenanggungJawab === "all" ? undefined : selectedPenanggungJawab,
    });

  const { data: penanggungJawabList } = trpc.users.getAll.useQuery();

  const { data: selectedItemsData } = trpc.items.getByIds.useQuery({
    ids: selectedItems,
  });

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleSelectAll = () => {
    if (!itemsData?.data) return;
    const allItemIds = itemsData.data.map((item) => item.id);
    setSelectedItems((prev) => {
      const newSelected = new Set([...prev, ...allItemIds]);
      return Array.from(newSelected);
    });
  };

  const handleDeselectAll = () => {
    setSelectedItems([]);
  };

  const totalPages = Math.ceil(
    (itemsData?.meta.totalItems || 0) / itemsPerPage,
  );

  return (
    <GuardedLayout>
      <HeadMetaData title="Dokumen" />

      <div className="space-y-6">
        <Header
          title="Dokumen Serah Terima"
          subtitle="Kelola dan cetak dokumen serah terima barang di sini!"
        >
          <PrintMultiSerahTerimaContainer
            selectedItems={selectedItemsData || []}
          />
        </Header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="search">Cari Barang</Label>
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    id="search"
                    placeholder="Cari nama barang..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="penanggungJawab">Penanggung Jawab</Label>
                <Select
                  value={selectedPenanggungJawab}
                  onValueChange={setSelectedPenanggungJawab}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih penanggung jawab" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Penanggung Jawab</SelectItem>
                    {penanggungJawabList?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4">
                <Badge variant="default">
                  {selectedItems.length} item dipilih
                </Badge>
                {itemsData && (
                  <span className="text-sm">
                    Menampilkan {itemsData.data.length} dari{" "}
                    {itemsData.meta.totalItems} barang
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={!itemsData?.meta.totalItems}
                >
                  Pilih Semua di Halaman
                </Button>
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={handleDeselectAll}
                  disabled={selectedItems.length === 0}
                >
                  Hapus Pilihan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isItemsLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="h-64 animate-pulse"></Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {itemsData?.data.map((item) => (
                <MultiPrintItemCard
                  key={item.id}
                  item={{
                    ...item,
                    photo: item.photo ?? undefined,
                    detail: item.detail ?? undefined,
                    user: {
                      ...item.user,
                      username: item.user.username ?? undefined,
                    },
                  }}
                  selectedItems={selectedItems}
                  handleItemSelect={handleItemSelect}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-10">
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "neutral"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ),
                  )}
                </div>

                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </>
        )}

        {!isItemsLoading && !itemsData?.data.length && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-semibold">
                Oops! Tidak ada barang ditemukan
              </h3>
              <p className="mb-4">
                Coba ubah filter pencarian atau penanggung jawab
              </p>
              <Button
                variant="neutral"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedPenanggungJawab("all");
                }}
              >
                Reset Filter
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </GuardedLayout>
  );
}
