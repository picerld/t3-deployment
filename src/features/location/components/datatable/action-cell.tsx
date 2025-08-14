"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";
import { OnDeleteLoadingDialog } from "@/components/dialog/onDeleteConfirmationDialog";
import { type Location } from "@/types/location";
import { trpc } from "@/utils/trpc";

type ActionsCellProps = {
  location: Location;
  onEdit: (location: Location) => void;
};

export const ActionsCell: React.FC<ActionsCellProps> = ({
  location,
  onEdit,
}) => {
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const deleteLocation = trpc.locations.delete.useMutation();

  const handleDeleteCourse = async (locationId: number) => {
    try {
      setDeleteStatus("loading");

      await deleteLocation.mutateAsync({ id: locationId });

      setDeleteStatus("success");
      toast.success("Berhasil!!", {
        description: "Ruangan berhasil dihapus!",
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
      <Button variant="noShadow" onClick={() => onEdit(location)}>
        <SquarePen className="size-4" />
      </Button>

      <OnDeleteLoadingDialog
        status={deleteStatus}
        handleSubmit={() => handleDeleteCourse(location.id)}
      />
    </div>
  );
};
