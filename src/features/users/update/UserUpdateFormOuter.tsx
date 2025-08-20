"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { userFormSchema, type UserFormSchema } from "../create/forms/user";
import { UserUpdateFormInner } from "./UserUpdateFormInner";

type UserUpdateFormOuterProps = {
  userId: string;
  open: boolean;
  onClose: () => void;
};

export const UserUpdateFormOuter = ({
  userId,
  open,
  onClose,
}: UserUpdateFormOuterProps) => {
  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      id: userId,
      name: "",
      username: "",
      password: "",
    },
  });

  const { refetch } = trpc.users.getById.useQuery(
    { id: userId },
    { enabled: false },
  );

  const updateUserMutation = trpc.users.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil!!", {
        description: "User berhasil diperbarui!",
      });

      form.reset();
      onClose();

      setTimeout(() => window.location.reload(), 1000);
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Anda tidak memiliki akses!!", {
          description: "Silahkan login terlebih dahulu",
        });
      } else {
        toast.error("Kategori gagal diubah!!", {
          description: "Coba periksa kembali form anda!",
        });
      }
    },
  });

  useEffect(() => {
    if (open) {
      refetch().then((res) => {
        if (res.data) {
          form.reset({
            id: res.data.id,
            name: res.data.name || "",
            username: res.data.username || "",
            roleId: res.data.roleId,
          });
        }
      });
    }
  }, [open, userId, refetch, form]);

  function handleUpdateLocation(data: UserFormSchema) {
    toast.info("Oops!! Mohon tunggu...", {
      description: "Fitur ini sedang dalam maintenance",
    });
    // NOTE: CANNOT UPDATE FOR NOW
    // updateUserMutation.mutate({
    //   id: data.id,
    //   name: data.name,
    //   username: data.username,
    //   roleId: data.roleId,
    // });
  }

  return (
    <Form {...form}>
      <UserUpdateFormInner
        open={open}
        onOpenChange={(state) => !state && onClose()}
        isPending={updateUserMutation.isPending}
        onLocationUpdateSubmit={handleUpdateLocation}
      />
    </Form>
  );
};
