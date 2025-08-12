"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";
import { OnDeleteLoadingDialog } from "@/components/dialog/onDeleteConfirmationDialog";
import { Location } from "@/types/location";

type ActionsCellProps = {
  location: Location;
};

export const ActionsCell: React.FC<ActionsCellProps> = ({ location }) => {
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleDeleteCourse = async (locationId: string) => {
    console.log(locationId);
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
        handleSubmit={() => handleDeleteCourse(location.id.toString())}
      />
    </div>
  );
};
