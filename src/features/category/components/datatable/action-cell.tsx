"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { type Category } from "@/types/category";
import { OnDeleteLoadingDialog } from "@/components/dialog/onDeleteConfirmationDialog";

type ActionsCellProps = {
  category: Category;
};

export const ActionsCell: React.FC<ActionsCellProps> = ({ category }) => {
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleDeleteCourse = async (categoryId: string) => {
    console.log(categoryId);
  };

  return (
    <div className="flex gap-3 justify-center">
      <Button
        variant={"noShadow"}
      >
        <SquarePen className="size-4" />
      </Button>

      <OnDeleteLoadingDialog
        status={deleteStatus}
        handleSubmit={() => handleDeleteCourse(category.id.toString())}
      />
    </div>
  );
};
