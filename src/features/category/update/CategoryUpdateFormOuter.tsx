"use client";

import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import {
  categoryFormSchema,
  type CategoryFormSchema,
} from "../create/forms/category";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryUpdateFormInner } from "./CategoryUpdateFormInner";

type CategoryFormOuterProps = {
  categoryId: number;
  open: boolean;
  onClose: () => void;
};

export const CategoryUpdateFormOuter = ({
  categoryId,
  open,
  onClose,
}: CategoryFormOuterProps) => {
  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      id: categoryId,
      name: "",
      description: "",
    },
  });

  const { refetch } = trpc.categories.getById.useQuery(
    { id: categoryId },
    { enabled: false },
  );

  const updateCategoryMutation = trpc.categories.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil!!", { description: "Kategori berhasil diperbarui!" });
      
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
            id: categoryId,
            name: res.data.name ?? "",
            description: res.data.description ?? "",
          });
        }
      });
    }
  }, [open, categoryId, refetch, form]);

  function handleUpdateCategory(value: CategoryFormSchema) {
    updateCategoryMutation.mutate(value);
  }

  return (
    <Form {...form}>
      <CategoryUpdateFormInner
        open={open}
        onOpenChange={(state) => !state && onClose()}
        onCategoryUpdateSubmit={handleUpdateCategory}
        isPending={updateCategoryMutation.isPending}
      />
    </Form>
  );
};
