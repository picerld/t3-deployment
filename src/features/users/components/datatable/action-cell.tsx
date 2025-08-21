"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, SquarePen } from "lucide-react";
import { toast } from "sonner";
import { OnDeleteLoadingDialog } from "@/components/dialog/onDeleteConfirmationDialog";
import { trpc } from "@/utils/trpc";
import type { User } from "@/types/user";

type ActionsCellProps = {
  user: User;
  onEdit: (user: User) => void;
  onPassword: (user: User) => void;
};

export const ActionsCell: React.FC<ActionsCellProps> = ({
  user,
  onEdit,
  onPassword,
}) => {
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const deleteLocation = trpc.users.delete.useMutation();

  const handleDeleteUser = async (userId: string) => {
    try {
      setDeleteStatus("loading");

      await deleteLocation.mutateAsync({ id: userId });

      setDeleteStatus("success");
      toast.success("Berhasil!!", {
        description: "User berhasil dihapus!",
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
      <Button variant={"noShadow"} onClick={() => onPassword(user)}>
        <ShieldAlert className="size-4" />
      </Button>
      <Button variant="noShadow" onClick={() => onEdit(user)}>
        <SquarePen className="size-4" />
      </Button>

      <OnDeleteLoadingDialog
        status={deleteStatus}
        handleSubmit={() => handleDeleteUser(user.id)}
      />
    </div>
  );
};
