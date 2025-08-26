"use client";

import { Form } from "@/components/ui/form";
import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { itemFormSchema, type ItemFormSchema } from "../../create/forms/item";
import { ItemUpdateFormInner } from "./ItemUpdateFormInner";
import supabase from "@/config/supabase";

type Props = {
  id: string;
};

export const ItemFormOuterUpdate: React.FC<Props> = ({ id }) => {
  const router = useRouter();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: itemData, isLoading: isItemLoading } =
    trpc.items.getById.useQuery({ id });

  const { mutate: updateItem, isPending: updateItemIsPending } =
    trpc.items.update.useMutation({
      onSuccess: () => {
        toast.success("Berhasil!!", {
          description: "Barang berhasil diperbarui!",
        });
        router.push("/items");
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("Anda tidak memiliki akses!!", {
            description: "Silahkan login terlebih dahulu",
          });
        } else {
          toast.error("Barang gagal diperbarui!!", {
            description: "Coba periksa kembali form anda!",
          });
        }
      },
    });

  const form = useForm<ItemFormSchema>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      merk: "",
      quantity: 0,
      color: "",
      ownerType: "SEGARIS",
      serialNumber: "",
      condition: "BAIK",
      history: "",
      detail: "",
    },
    disabled: updateItemIsPending || isItemLoading,
  });

  useEffect(() => {
    if (itemData) {
      form.reset({
        name: itemData.name,
        merk: itemData.merk ?? "",
        quantity: itemData.quantity ?? 0,
        color: itemData.color ?? "",
        ownerType: itemData.ownerType ?? "SEGARIS",
        serialNumber: itemData.serialNumber ?? "",
        condition: itemData.condition ?? "BAIK",
        history: itemData.history ?? "",
        detail: itemData.detail ?? "",
        categoryId: itemData.categoryId,
        locationId: itemData.locationId,
        userId: itemData.userId?.toString(),
      });

      setPreviewImage(itemData.photo ?? null);
    }
  }, [itemData, form]);

  async function handleItemSubmit(value: ItemFormSchema) {
    try {
      let photoUrl = itemData?.photo ?? null;

      if (value.photo instanceof File) {
        await supabase.storage
          .from("segaris-image")
          .remove([
            photoUrl?.split("storage/v1/object/public/segaris-image/")[1] ?? "",
          ]);

        const filename = `${Date.now()}-${value.photo.name}`;

        const uploadResult = await supabase.storage
          .from("segaris-image")
          .upload(filename, value.photo);

        if (uploadResult.error) {
          toast.error("Oops! Gagal mengunggah foto", {
            description: uploadResult.error.message,
          });
          return;
        }

        const publicUrlResult = supabase.storage
          .from("segaris-image")
          .getPublicUrl(filename);

        photoUrl = publicUrlResult.data.publicUrl;
      }

      updateItem({ id, ...value, photo: photoUrl });
    } catch (error) {
      toast.error("Terjadi kesalahan tak terduga. Coba lagi nanti.");
      console.error(error);
    } finally {
      form.reset();
      setPreviewImage(null);
    }
  }

  return (
    <Form {...form}>
      <ItemUpdateFormInner
        previewImage={previewImage}
        onItemSubmit={handleItemSubmit}
        isPending={updateItemIsPending || isItemLoading}
      />
    </Form>
  );
};
