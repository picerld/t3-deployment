"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { OnDeleteLoadingDialog } from "@/components/dialog/onDeleteConfirmationDialog";
import { type Item } from "@/types/item";
import Link from "next/link";

type ActionsCellProps = {
  item: Item;
};

export const ActionsCell: React.FC<ActionsCellProps> = ({ item }) => {
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleDeleteCourse = async (itemId: string) => {
    console.log(itemId);
  };

  return (
    <div className="flex justify-center gap-3">
      <Link
        href={`/items/edit/${item.id}`}
        className={buttonVariants({ variant: "noShadow" })}
      >
        <Info className="!size-4" strokeWidth={2.5} />
      </Link>

      {/* <OnDeleteLoadingDialog
        status={deleteStatus}
        handleSubmit={() => handleDeleteCourse(item.id.toString())}
      /> */}
    </div>
  );
};
