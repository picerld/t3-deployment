// components/items/ItemFormOuter.tsx
import { Form } from "@/components/ui/form";
import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { itemFormSchema, type ItemFormSchema } from "../forms/item";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ItemFormInner } from "./ItemFormInner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ItemFormOuter = () => {
  const router = useRouter();

  const form = useForm<ItemFormSchema>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      merk: "",
      categoryId: undefined,
      quantity: 0,
      userId: "",
      color: "",
      ownerType: "SEGARIS",
      locationId: undefined,
      serialNumber: "",
      condition: "BAIK",
      history: "",
      photo: undefined,
    },
  });

  const { mutate: createItem, isPending: createItemIsPending } =
    trpc.items.create.useMutation({
      onSuccess: () => {
        toast.success("Berhasil!!", {
          description: "Barang berhasil dicatatkan!",
        });
        form.reset();
        router.push("/items");
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("Anda tidak memiliki akses!!", {
            description: "Silahkan login terlebih dahulu",
          });
        } else {
          toast.error("Barang gagal ditambahkan!!", {
            description: "Coba periksa kembali form anda!",
          });
        }
      },
    });

  async function handleItemSubmit(values: ItemFormSchema) {
    let photoUrl: string | null = null;

    if (values.photo instanceof File) {
      const formData = new FormData();
      formData.append("file", values.photo);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        toast.error("Gagal mengunggah foto");
        return;
      }

      const data = await uploadRes.json();
      photoUrl = data.url;
    } else if (typeof values.photo === "string") {
      photoUrl = values.photo;
    }

    createItem({
      ...values,
      photo: photoUrl,
    });
  }

  return (
    <Form {...form}>
      <ItemFormInner
        onItemSubmit={handleItemSubmit}
        isPending={createItemIsPending}
      />
    </Form>
  );
};
