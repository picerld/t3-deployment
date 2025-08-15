"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  MapPin,
  Calendar,
  Eye,
  Grid3X3,
  List,
  SortAsc,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Header } from "@/components/container/Header";
import { trpc } from "@/utils/trpc";

const conditionMap = {
  BAIK: { label: "Baik", variant: "neutral" },
  RUSAK: { label: "Rusak", variant: "destructive" },
  PERBAIKAN: { label: "Perbaikan", variant: "neutral" },
} as const;

const ownerTypeMap = {
  SEGARIS: "SEGARIS",
  IMN: "IMN",
} as const;

export const ItemPageContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedOwnerType, setSelectedOwnerType] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");

  const { data: items = [] } = trpc.items.getAll.useQuery();
  const { data: categories = [] } = trpc.categories.getAll.useQuery();

  const ownerTypes = ["all", "SEGARIS", "IMN"];
  const conditions = ["all", "BAIK", "RUSAK", "PERBAIKAN"];

  const categoryOptions = useMemo(() => {
    return [
      "all",
      ...categories.map((cat) => (typeof cat === "string" ? cat : cat.name)),
    ];
  }, [categories]);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryName =
        typeof item.category === "string" ? item.category : item.category?.name;
      const matchesCategory =
        selectedCategory === "all" || categoryName === selectedCategory;

      const matchesOwnerType =
        selectedOwnerType === "all" || item.ownerType === selectedOwnerType;

      const matchesCondition =
        selectedCondition === "all" || item.condition === selectedCondition;

      return (
        matchesSearch && matchesCategory && matchesOwnerType && matchesCondition
      );
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "updatedAt":
          return (
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
          );
        case "condition":
          return a.condition.localeCompare(b.condition);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    items,
    searchTerm,
    selectedCategory,
    selectedOwnerType,
    selectedCondition,
    sortBy,
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getConditionBadgeVariant = (condition: string) => {
    return (
      conditionMap[condition as keyof typeof conditionMap]?.variant || "neutral"
    );
  };

  const getConditionLabel = (condition: string) => {
    return (
      conditionMap[condition as keyof typeof conditionMap]?.label || condition
    );
  };

  return (
    <div className="mt-24 px-4 py-8 lg:mx-28 md:mx-8">
      <Header
        title="Barang Tercatat"
        subtitle="Daftar barang yang tercatat di inventory."
      />

      <div className="dark:bg-main mb-6 rounded-lg border-2 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Input
              placeholder="Cari nama, merek, atau serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "Semua Kategori" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedOwnerType}
            onValueChange={setSelectedOwnerType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kepemilikan" />
            </SelectTrigger>
            <SelectContent>
              {ownerTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all"
                    ? "Semua Tipe"
                    : ownerTypeMap[type as keyof typeof ownerTypeMap] || type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedCondition}
            onValueChange={setSelectedCondition}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kondisi" />
            </SelectTrigger>
            <SelectContent>
              {conditions.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition === "all"
                    ? "Semua Kondisi"
                    : getConditionLabel(condition)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "neutral"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex-1"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "neutral"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="flex-1"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm font-semibold">
          <span>
            Menampilkan {filteredAndSortedItems.length} dari {items.length}{" "}
            barang
          </span>
          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nama</SelectItem>
                <SelectItem value="createdAt">Terbaru</SelectItem>
                <SelectItem value="updatedAt">Diperbarui</SelectItem>
                <SelectItem value="condition">Kondisi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-4"
        }
      >
        {filteredAndSortedItems.map((item) => {
          const categoryName =
            typeof item.category === "string"
              ? item.category
              : item.category?.name;
          const locationName =
            typeof item.location === "string"
              ? item.location
              : item.location?.name;

          return (
            <Card
              key={item.id}
              className={`bg-main ${viewMode === "list" ? "flex flex-row overflow-hidden" : ""}`}
            >
              {viewMode === "grid" ? (
                <>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate text-2xl font-semibold">
                          {item.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm">
                          {item.merk} • {categoryName}
                        </CardDescription>
                      </div>
                      <Package
                        className="ml-2 !size-6 flex-shrink-0"
                        strokeWidth={2.5}
                      />
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Badge variant={getConditionBadgeVariant(item.condition)}>
                        {getConditionLabel(item.condition)}
                      </Badge>
                      <Badge variant={"neutral"}>{item.ownerType}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Kuantitas:</span>
                        <span>{item.quantity} unit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Warna:</span>
                        <span>{item.color}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" strokeWidth={2.5} />
                        <span className="font-semibold">{locationName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" strokeWidth={2.5} />
                        <span className="font-semibold">
                          Ditambahkan {formatDate(item.createdAt.toString())}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-2">
                      <p className="text-xs">
                        SN: {item.serialNumber}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button variant={"neutral"} className="w-full" asChild>
                      <Link href={`/guest/items/${item.id}`}>
                        <Eye className="mr-2 h-4 w-4" strokeWidth={2.5} />
                        Lihat Detail
                      </Link>
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <>
                  <div className="flex-1 p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-3xl font-semibold">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm font-semibold">
                          {item.merk} • {categoryName} • SN: {item.serialNumber}
                        </p>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <Badge
                          variant={getConditionBadgeVariant(item.condition)}
                        >
                          {getConditionLabel(item.condition)}
                        </Badge>
                        <Badge variant={"neutral"}>{item.ownerType}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <span className="font-semibold">Kuantitas:</span>{" "}
                        {item.quantity} unit
                      </div>
                      <div>
                        <span className="font-semibold">Warna:</span> {item.color}
                      </div>
                      <div className="flex items-center gap-1 font-semibold">
                        <MapPin className="!size-5" strokeWidth={2.5} />
                        {locationName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="!size-5" strokeWidth={2.5} />
                        {formatDate(item.createdAt.toString())}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-6 pl-0">
                    <Button variant={"neutral"} asChild>
                      <Link href={`/items/${item.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>

      {filteredAndSortedItems.length === 0 && (
        <div className="py-16 text-center">
          <Package className="mx-auto mb-4 h-16 w-16" strokeWidth={2.5} />
          <h3 className="mb-2 text-xl font-semibold">
            Tidak ada barang ditemukan
          </h3>
          <p className="mb-6">Coba ubah kriteria pencarian atau filter Anda</p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedOwnerType("all");
              setSelectedCondition("all");
            }}
          >
            Reset Filter
          </Button>
        </div>
      )}
    </div>
  );
};
