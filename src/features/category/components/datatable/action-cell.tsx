"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { type Category } from "@/types/category";
import { OnDeleteLoadingDialog } from "@/components/dialog/onDeleteConfirmationDialog";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

type ActionsCellProps = {
  category: Category;
  onEdit: (category: Category) => void;
};

export const ActionsCell: React.FC<ActionsCellProps> = ({
  category,
  onEdit,
}) => {
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const deleteCategory = trpc.categories.delete.useMutation();

  const handleDeleteCourse = async (categoryId: number) => {
    try {
      setDeleteStatus("loading");

      await deleteCategory.mutateAsync({ id: categoryId });

      setDeleteStatus("success");
      toast.success("Berhasil!!", {
        description: "Kategori berhasil dihapus!",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      toast.error("Oops! Terjadi kesalahan", {
        description: error.message,
      });
      setDeleteStatus("error");
    } finally {
      setTimeout(() => setDeleteStatus("idle"), 2000);
    }
  };

  return (
    <div className="flex justify-center gap-3">
      <Button variant="noShadow" onClick={() => onEdit(category)}>
        <SquarePen className="size-4" />
      </Button>

      <OnDeleteLoadingDialog
        status={deleteStatus}
        handleSubmit={() => handleDeleteCourse(category.id)}
      />
    </div>
  );
};
