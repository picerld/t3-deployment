"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { OnDeleteLoadingDialog } from "@/components/dialog/onDeleteConfirmationDialog";
import { type Item } from "@/types/item";
import Link from "next/link";
import { trpc } from "@/utils/trpc";

type ActionsCellProps = {
  item: Item;
};

export const ActionsCell: React.FC<ActionsCellProps> = ({ item }) => {
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const deleteItem = trpc.items.delete.useMutation();

  const handleDeleteCourse = async (itemId: string) => {
    try {
      setDeleteStatus("loading");

      await deleteItem.mutateAsync({ id: itemId });

      setDeleteStatus("success");

      toast.success("Berhasil!!", {
        description: "Item berhasil dihapus!",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error("Oops! Terjadi kesalahan", {
        description: (error as Error).message,
      });

      setDeleteStatus("error");
    } finally {
      setTimeout(() => setDeleteStatus("idle"), 2000);
    }
  };

  return (
    <div className="flex justify-center gap-3">
      <Link
        href={`/items/edit/${item.id}`}
        className={buttonVariants({ variant: "noShadow" })}
      >
        <Info className="!size-4" strokeWidth={2.5} />
      </Link>

      <OnDeleteLoadingDialog
        status={deleteStatus}
        handleSubmit={() => handleDeleteCourse(item.id.toString())}
      />
    </div>
  );
};
