"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { OnDeleteLoadingDialog } from "@/components/dialog/onDeleteConfirmationDialog";
import { Item } from "@/types/item";

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
    <div className="flex gap-3 justify-center">
      <Button
        variant={"noShadow"}
      >
        <Info className="!size-4" strokeWidth={2.5} />
      </Button>

      {/* <OnDeleteLoadingDialog
        status={deleteStatus}
        handleSubmit={() => handleDeleteCourse(item.id.toString())}
      /> */}
    </div>
  );
};
