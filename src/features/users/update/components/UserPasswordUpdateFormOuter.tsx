"use client";

import { Form } from "@/components/ui/form";
import {
  userPasswordFormSchema,
  type UserPasswordFormSchema,
} from "../forms/user-password";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { UserPasswordUpdateFormInner } from "./UserPasswordUpdateFormInner";
import { useEffect } from "react";

type UserPasswordUpdateFormOuterProps = {
  userId: string;
  open: boolean;
  onClose: () => void;
};

export const UserPasswordUpdateFormOuter = ({
  userId,
  open,
  onClose,
}: UserPasswordUpdateFormOuterProps) => {
  const form = useForm<UserPasswordFormSchema>({
    resolver: zodResolver(userPasswordFormSchema),
    defaultValues: {
      id: userId,
      oldPassword: "",
      password: "",
    },
  });

  const { refetch } = trpc.users.getById.useQuery(
    { id: userId },
    { enabled: false },
  );

  const updatePasswordUserMutation = trpc.users.updatePassword.useMutation({
    onSuccess: () => {
      toast.success("Berhasil!!", {
        description: "Password berhasil diperbarui!",
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
        toast.error("Password gagal diperbarui!!", {
          description: error.message,
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
            password: "",
          });
        }
      });
    }
  }, [open, userId, refetch, form]);

  function handleUpdatePassword(data: UserPasswordFormSchema) {
    updatePasswordUserMutation.mutate({
      id: data.id,
      oldPassword: data.oldPassword,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  }

  return (
    <Form {...form}>
      <UserPasswordUpdateFormInner
        open={open}
        onOpenChange={(state) => !state && onClose()}
        isPending={updatePasswordUserMutation.isPending}
        onUserPasswordUpdateSubmit={handleUpdatePassword}
      />
    </Form>
  );
};
